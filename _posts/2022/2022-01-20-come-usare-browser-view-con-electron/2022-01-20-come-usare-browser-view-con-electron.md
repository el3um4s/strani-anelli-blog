---
title: "Come usare BrowserView con Electron"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-01-20 18:00"
categories:
  - Electron
  - TailwindCSS
  - Svelte
tags:
  - Electron
  - TailwindCSS
  - Svelte
---

Uno dei problemi che sto affrontando con il mio progetto [gest-dashboard](https://javascript.plainenglish.io/the-journey-of-a-novice-programmer-82366ec7851a) riguarda la gestione di diverse finestre con [Electron](https://www.electronjs.org/). È un problema più complesso di quello che pensavo e mi ha spinto a cercare il modo ottimale, per le mie esigenze. Dopo alcuni test ho scartato `<iframe>` e `<webview>`. Mi sono invece concentrato su come usare [Browser View](https://www.electronjs.org/docs/latest/api/browser-view) con Electron.

Lo scopo? Ottenere qualcosa di simile a questo: poter caricare delle pagine esterne dentro Electron, mantenendo però il controllo della [Browser Window](https://www.electronjs.org/docs/latest/api/browser-window).

![electron-browser-view-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-20-come-usare-browser-view-con-electron/electron-browser-view-01.gif)

Poiché questo post parla di un argomento molto specifico non riporto tutti i passaggi per configurare un nuovo progetto Electron. Io, per semplicità, ho usato il template [el3um4s/memento-svelte-electron-typescript](https://github.com/el3um4s/memento-svelte-electron-typescript) ma non è obbligatorio. Invece è importante capire una cosa, prima di cominciare: come usare ipcMain e ipcRenderer per far comunicare le varie finestre con Electron. In rete ci sono alcune guide anche interessanti. In questo tutorial, però, seguo quello riportato in questa guida di qualche mese fa:

- [Electron And TypeScript: How to Use ipcMain and ipcRenderer](https://javascript.plainenglish.io/electron-and-typescript-how-to-use-ipcmain-and-ipcrenderer-english-4ebd4addf8e5)

### Ma prima: perché usare una browser view?

Ma prima di cominciare occorre rispondere alla domanda: perché usare una browser view invece di un più semplice tag [webview](https://www.electronjs.org/docs/latest/api/webview-tag)?

La prima ragione è che la documentazione stessa di Electron consiglia di farlo. Ormai le `webview` sono in via di dismissione. Per citare [developer.chrome](https://developer.chrome.com/docs/extensions/reference/webviewTag/):

```
chrome.webviewTag: This API is part of the deprecated Chrome Apps platform. Learn more about migrating your app.
```

Ne consegue che è meglio rivolgersi ad altri lidi. Una soluzione interessante è usare gli `iframe`. Sfortunatamente crea più problemi di quanti me ne risolve. Magari in futuro farò dei test più approfonditi.

Per fortuna il problema che mi sono trovato davanti nel mio piccolo è stato già affrontato e sostanzialmente risolto da altri più in gamba di me. Consiglio di leggere queste due storie, sono molto istruttive:

- [Slack Engineering - Growing Pains: Migrating Slack’s Desktop App to BrowserView](https://slack.engineering/growing-pains-migrating-slacks-desktop-app-to-browserview/)
- [Figma - Introducing BrowserView for Electron](https://www.figma.com/blog/introducing-browserview-for-electron/)

Riassumendo, quello che mi serve, che credo le Browser View possano darmi, è un metodo per:

- visualizzare pagine esterne ad Electron
- possibilità di integrare queste pagine dentro l'applicazione
- capacità di usare il sistema ipcMain-ipcRenderer dalle pagine esterne

Detto questo, vai con il codice!

### L'interfaccia grafica

{% include picture img="main-window.webp" ext="jpg" alt="" %}

La prima cosa che mi serve è un pulsante. Anche qui, la scelta è più che libera. Per questioni estetiche ho creato un componente `Card.svelte`:

```svelte
<script lang="ts">
  export let link: string;
  export let title: string;

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  $: detail = {
    title,
    link,
  };

  function openInNewWindow() {
    dispatch("open-in-new-window", detail);
  }
</script>

<div class="card">
  <div class="header">
    <div class="title">
      {title}
    </div>
  </div>
  <div class="content">
    <slot name="description" />
  </div>
  <div class="footer">
    <button title={link} on:click={openInNewWindow}>
      Open in new window
    </button>
  </div>
</div>
```

La parte importante è la funzione da eseguire sul `click`:

```svelte
<script>
  function openInNewWindow(e) {
    globalThis.api.windowManager.send("openInNewWindow", e.detail);
  }
</script>

<Card
  title={title}
  link={link}
  on:open-in-new-window={openInNewWindow}
>
  <div slot="description">{description}</div>
</Card>
```

In pratica invio dal renderer il comando `openInNewWindow` con annessi i dettagli che mi interessano (ovvero il `link` della pagina da aprire). Devo però creare un'API apposita.

### Aggiungo la WindowManager API

Creo il file `src\electron\IPC\windowManager.ts` in cui inserire il codice della API preposta a gestire la creazione di una nuova finestra con una BrowserView incorporata.

Per prima cosa importo le librerie alla base della mia API:

```ts
import { BrowserWindow } from "electron";

import { SendChannels } from "./General/channelsInterface";
import IPC from "./General/IPC";
```

Poi definisco il nome da usare per richiamarla:

```ts
const nameAPI = "windowManager";
```

Quindi i canali aperti in uscita, quelli da usare per inviare i comandi dalla finestra

```ts
const validSendChannel: SendChannels = {
  openInNewWindow: openInNewWindow,
};
```

Poi tocca ai canali in ingresso, quelli che possono essere usati per spedire una risposta al finestra. Per semplicità in questo esempio lascio vuota la lista:

```ts
const validReceiveChannel: string[] = [];
```

Infine inizializzo l'API e la esporto:

```ts
const windowManager = new IPC({
  nameAPI,
  validSendChannel,
  validReceiveChannel,
});

export default windowManager;
```

### Definisco i comandi da eseguire

Ovviamente questo non è sufficiente. Devo definire effettivamente il comando da eseguire. Per farlo creo la funzione `openInNewWindow()`:

```ts
import CustomWindow from "../customWindow";
import * as globals from "../globals";

async function openInNewWindow(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  let win = await createMainWindow();
}

async function createMainWindow() {
  let customWindow: CustomWindow;
  const settings = {
    title: "-",
    x: Math.floor(Math.random() * 64),
    y: Math.floor(Math.random() * 64),
  };

  const urlPage = globals.get.mainUrl();
  customWindow = new CustomWindow(settings);
  customWindow.createWindow(urlPage);

  return customWindow;
}
```

Questo fa sì che cliccando un pulsante dalla finestra principale creo una nuova finestra.

Devo però far notare una cosa. Ho importo il modulo `src\electron\globals.ts` per semplificare il passaggio dell'url della pagina di avvio:

```ts
interface Globals {
  mainURL: string;
}

const globals: Globals = {
  mainURL: "index.html",
};

const get = {
  mainUrl: () => globals.mainURL,
};

const set = {
  mainURL: (v: string) => {
    globals.mainURL = v;
    return v;
  },
};

export { get, set };
```

In questo modo posso richiamare la pagina principale da qualsiasi modulo.

Però non ho ancora finito. Mi conviene creare passare anche alla nuova finestra alcuni "poteri speciali". Per lo meno la possibilità di usare i pulsanti della titlebar:

```ts
import windowControls from "./windowControls";
import CustomWindow from "../customWindow";
import * as globals from "../globals";

async function createMainWindow() {
  let customWindow: CustomWindow;
  const settings = {
    title: "-",
    x: Math.floor(Math.random() * 64),
    y: Math.floor(Math.random() * 64),
  };

  const urlPage = globals.get.mainUrl() + "#browserview";
  customWindow = new CustomWindow(settings);
  customWindow.createWindow(urlPage);

  await customWindow.setIpcMain([windowControls]);
  return customWindow;
}
```

Devo anche creare effettivamente una Browser View nella nuova finestra. Per il momento richiamo i metodi `addBrowserView` e `setIpcMainView`:

```ts
async function openInNewWindow(
  customWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: any
) {
  let win = await createMainWindow();
  await win.addBrowserView(message.link);
  win.setIpcMainView([windowControls]);
}
```

### Creo una BrowserWiew in Electron

Adesso devo definire questi metodi. Per farlo modifico la classe `CustomWindow` in `src\electron\customWindow.ts`.

Per prima cosa aggiungo la proprietà `browserView`:

```ts
class CustomWindow {
  window!: BrowserWindow;
  settings: { [key: string]: any };
  onEvent: EventEmitter = new EventEmitter();

  browserView!: BrowserView;
  // ...
```

Il procedimento generale per creare e aggiungere la Browser View in Electron è questo:

```js
// In the main process.
const { app, BrowserView, BrowserWindow } = require("electron");

app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 800, height: 600 });

  const view = new BrowserView();
  win.setBrowserView(view);
  view.setBounds({ x: 0, y: 0, width: 300, height: 300 });
  view.webContents.loadURL("https://electronjs.org");
});
```

Partendo da questo canovaccio aggiungo un metodo alla mia classe:

```ts
class CustomWindow {
  // ...
  async addBrowserView(link: string) {
    this.browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        nativeWindowOpen: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    this.window.setBrowserView(this.browserView);
    this.browserView.setBounds({
      x: 1,
      y: 32,
      width: 800,
      height: 600,
    });

    this.browserView.webContents.loadURL(link);
  }
  // ...
}
```

Ho impostato la posizione in `x = 1` e `y = 32` perché voglio lasciare lo spazio per la title bar nella finestra principale.

C'è un piccolo dettaglio da risolvere:

![electron-browser-view-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-20-come-usare-browser-view-con-electron/electron-browser-view-02.gif)

Se modifico le dimensioni della finestra le dimensioni della Browser View non cambiano. E, incidentalmente, le dimensioni non sono quelle che voglio.

Per prima cosa mi assicuro che le dimensioni siano corrette all'avvio usando [BrowserWindow.getSize()](https://www.electronjs.org/docs/latest/api/browser-window#wingetsize)

```ts
const [width, height] = this.window.getSize();

this.browserView.setBounds({
  x: 1,
  y: 32,
  width: width - 2,
  height: height - 33,
});
```

Poi uso [BrowserView.setAutoResize(options)](https://www.electronjs.org/docs/latest/api/browser-view) per modificare automaticamente le dimensioni quando la BrowserWindow cambia:

```ts
this.browserView.setAutoResize({
  width: true,
  height: true,
});
```

![electron-browser-view-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-20-come-usare-browser-view-con-electron/electron-browser-view-02.gif)

Per completare il tutto devo permettere alla BrowserView di accedere alle API:

```ts
async setIpcMainView(api: Array<IPC>) {
  api.forEach(async (el) => await el.initIpcMain(ipcMain, this.browserView));
}
```

### Registro WindowManager

Ovviamente non basta definire l'API WindowManager, la devo anche abilitare in `src\electron\preload.ts`:

```ts
import { generateContextBridge } from "./IPC/General/contextBridge";

import systemInfo from "./IPC/systemInfo";
import updaterInfo from "./IPC/updaterInfo";
import windowControls from "./IPC/windowControls";
import windowManager from "./IPC/windowManager";

generateContextBridge([systemInfo, updaterInfo, windowControls, windowManager]);
```

Infine permetto alla sola finestra principale di creare nuove finestre. Per farlo modifico `src\electron\index.ts`:

```ts
// ...
import windowManager from "./IPC/windowManager";
// ...

async function createMainWindow() {
  const settings = {
    title: "MEMENTO - Electron BrowserView",
  };
  mainWindow = new CustomWindow(settings);
  const urlPage = globals.get.mainUrl() + "#main";
  mainWindow.createWindow(urlPage);

  await mainWindow.setIpcMain([
    systemInfo,
    updaterInfo,
    windowControls,
    windowManager, // <---
  ]);

  updaterInfo.initAutoUpdater(autoUpdater, mainWindow.window);
}
```

Bene, dopo aver completato tutti questi passaggi posso aprire una nuova finestra, con incorporata una BrowserView, usando una semplice riga di codice:

```js
globalThis.api.windowManager.send("openInNewWindow", {
  title: "BrowserView",
  link: "https://example.com/",
});
```

Come al solito il codice del progetto è liberamente consultabile su GitHub

- [el3um4s/memento-electron-browser-view](https://github.com/el3um4s/memento-electron-browser-view)

Invece per chi fosse interessato, ho raccolto su Medium una lista con i miei articoli su Electron:

- [Electron Stories](https://el3um4s.medium.com/list/electron-stories-029651cc3a36)
