---
title: "Electron e TypeScript: come usare ipcMain e ipcRenderer"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**JJ Ying**](https://unsplash.com/@jjying)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-07-09 20:00"
categories:
  - TypeScript
  - Svelte
  - Electron
tags:
  - TypeScript
  - Svelte
  - Electron
---

Mentre giocavo con Electron, TypeScript ed Electron sono incappato in alcuni problemi. Nella prima versione del mio template (pubblicata nel repository [el3um4s/memento-svelte-electron-typescript](https://github.com/el3um4s/memento-svelte-electron-typescript)) mi sono accontentato di un risultato funzionante. Ma non era il risultato ottimale. Riparto quindi dal [post di qualche giorno fa](https://blog.stranianelli.com/svelte-et-electron-et-typescript-english/) riportando alcune correzioni al codice. Non so se la mia proposta sia la soluzione ottimale ma di certo mi piace di più della prima versione.

Nella prima versione c'erano due o tre problemi importanti. Uno sul lato Svelte (ne parlo alla fine di questo articolo), due sul lato Electron. In soldoni tutta la logica di Electron era condensata in due soli grandi file, `index.ts` e `preload.ts`. Per di più la logica era mescolata. Usavo `preload.ts` per garantire un'interfaccia tra Svelte ed Electron ma le funzioni da eseguire erano su un altro file. `index.ts` d'altro canto si ritrovava a dover gestire sia la creazione dell'interfaccia grafica che tutte le comunicazioni da e per Svelte.

### La struttura dei file

In un progetto piccolo, come è il repository che ho caricato, non è un grande problema. Ma non ci vuole molto ad aumentare la complessità generale e a creare un bel groviglio di _spaghetti code_. Ho quindi deciso di fare un passo indietro e di rendere più modulare il tutto. E invece di due soli file ne ho creati alcuni in più, ognuno con una sola mansione da svolgere:

```
> src
  > frontend
  > electron
    - index.ts
    - mainWindow.ts
    - preload.ts
    > IPC
      - systemInfo.ts
      - updateInfo.ts
      > General
        - channelsInterface.ts
        - contextBridge.ts
        - IPC.ts
```

Se a prima vista pare un aumento ingiustificato della complessità del progetto, ritengo che ne valga la pena:

- `index.ts` continua a essere il file principale ma si occupa solo di richiamare le funzioni necessarie, non di definirle
- `preload.ts` continua a permettere una comunicazione sicura tra `BrowserWindow` ma contiene solamente l'elenco dei canali disponibili
- `mainWindow.ts` contiene una classe `Main` da usare per costruire una `BrowserWindow` in Electron

### La classe `Main`

Tenere separata la classe `Main` mi permette di mantenere più pulito il codice dentro `index.ts`: in fin dei conti è un processo abbastanza standard.

Mi servono per prima cosa alcuni valori di default per le impostazioni base e un costruttore

```ts
const appName = "MEMENTO - Svelte, Electron, TypeScript";

const defaultSettings = {
  title:  "MEMENTO - Svelte, Electron, TypeScript",
  width: 854,
  height: 480
}

class Main {
    settings: {[key: string]: any};

    constructor(settings: {[key: string]: any} | null = null) {
        this.settings = settings ? {...settings} : {...defaultSettings}
    }
}
```

Poi mi serve un metodo per creare la finestra principale del programma

```ts
import { app, BrowserWindow } from 'electron';
import path from "path"

class Main {
    //...
    createWindow() {
        let settings = {...this.settings}
        app.name = appName;
        let window = new BrowserWindow({
        ...settings,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, "preload.js")
        }
        });

        window.loadURL(path.join(__dirname, 'www', 'index.html'));
        window.once('ready-to-show', () => {
        window.show()
        });

        return window;
    }
    //...
}
```

E poi alcuni metodi aggiuntivi:

```ts
class Main {
    //...
    onWindowAllClosed() {
        if (process.platform !== 'darwin') {
        app.quit();
        }
    }

    onActivate() {
        if (!this.window) {
        this.createWindow();
        }
    }
    //...
}
```

Adesso metto tutto assieme nel costruttore:

```ts
class Main {
    //...
    window!: BrowserWindow;

    constructor(settings: {[key: string]: any} | null = null) {
        this.settings = settings ? {...settings} : {...defaultSettings}

        app.on('ready', () => { 
            this.window = this.createWindow(); 
        });
        app.on('window-all-closed', this.onWindowAllClosed);
        app.on('activate', this.onActivate);
    }
    //...
}
```

Se volessi potrei già fermarmi qui. Ma mi serve un'altra cosa per intercettare il momento in cui la finestra viene creata. Per farlo posso utilizzare un evento `app.on("browser-window-created", funct )` all'interno di `index.ts`. Oppure all'interno della stessa classe `Main`. Invece ho preferito usare un `EventEmitter` ([link](https://nodejs.org/api/events.html#events_class_eventemitter)) personalizzato:

```ts
import EventEmitter from 'events';

class Main {
    //...
    onEvent: EventEmitter = new EventEmitter();
    //...
    constructor() {
        //...
         app.on('ready', () => { 
            this.window = this.createWindow(); 
            this.onEvent.emit("window-created");
        });
        //...
    }
    //...
}
```

Infine per ultima cosa esporto la classe `Main` in modo da poterla utilizzare:

```ts
export default Main;
```

Prima di passare alla cartella `IPC` uso la classe `Main` dentro `index.ts`

```ts
import Main from "./mainWindow";

let main = new Main();

main.onEvent.on("window-created", ()=> {
    //...
});
```

Inserisco già l'evento `main.onEvent.on("window-created", funct)`: al suo interno inserirò un le azioni da svolgere all'avvio, ovvero il codice legato a `ipcMain`, `webContents` e `autoUpdater`. Codice che ho inserito in due file distinti, `systemInfo.ts` e `updateInfo.ts`. Questi due non sono altro che due esempi di come usare il template e possono essere sostituiti, eliminati o modificati a piacere. E ovviamente è possibile usarli come base per aggiungere altre funzioni e canali.

### channelsInterface, contextBridge e IPC

Infine i file dentro la cartella `General` servono per semplificare i file precedenti.

`channelsInterface.ts` contiene la definizione di alcune interfacce:

```ts
export interface APIChannels {
    nameAPI: string,
    validSendChannel: SendChannels,
    validReceiveChannel: string[]
}

export interface SendChannels {
    [key: string]: Function
}
```

Il file principe è `IPC.ts`. In questo file definisco la classe `IPC` da usare come base per il resto:

```ts
import { BrowserWindow, IpcMain } from "electron";
import { APIChannels, SendChannels } from "./channelsInterface";

export default class IPC {
    nameAPI: string = "api";
    validSendChannel: SendChannels = {};
    validReceiveChannel: string[] = [];

    constructor(channels: APIChannels) {
        this.nameAPI = channels.nameAPI;
        this.validSendChannel = channels.validSendChannel;
        this.validReceiveChannel = channels.validReceiveChannel;
    }

    get channels():APIChannels {
        return {
            nameAPI: this.nameAPI,
            validSendChannel: this.validSendChannel,
            validReceiveChannel: this.validReceiveChannel
        }
    }

    initIpcMain(ipcMain:IpcMain, mainWindow: BrowserWindow) {
        if (mainWindow) {
            Object.keys(this.validSendChannel).forEach(key => {
                ipcMain.on(key, async( event, message) => {
                    this.validSendChannel[key](mainWindow, event, message);
                });
            });
        }
    }
}
```

`IPC` ha tre proprietà: `nameAPI`, che servirà per richiamarla dall'interno del frontend. E poi l'elenco dei canali validi.

Rispetto alla prima versione, i canali verso Electron non sono solamente una lista di nomi ma un oggetto. A ogni chiave assegno una funzione da richiamare (lo spiego meglio tra un attimo). Ci sono solo due metodi, `get channels` e `initIpcMain`: li userò tra poco.

Il terzo file _generale_ contiene la definizione della funzione `generateContextBridge()`. Accetta come argomento un array di oggetti del tipo "IPC" e li usa per generare l'elenco dei canali sicuri per le comunicazioni tra Electron e Svelte.

Probabilmente la mia spiegazione è abbastanza confusa ma per fortuna questi file non vanno modificati.

### systemInfo.ts

Quello che invece è più interessante capire è come usarli. Per questo ho inserito due esempio. Parto dal più semplice, `systemInfo.ts`. Questo modulo ha un unico canale aperto in uscita e in entrata e lo usa per chiedere e ottenere alcune informazioni su Electron, Node e Chrome.

Per prima cosa importo i file di cui ho appena parlato:

```ts
import { SendChannels } from "./General/channelsInterface";
import IPC from "./General/IPC";
```

Quindi inizio a crearmi alcune variabili di supporto:

```ts
const nameAPI = "systemInfo";

// to Main
const validSendChannel: SendChannels = {
    "requestSystemInfo": requestSystemInfo
};

// from Main
const validReceiveChannel: string[] = [
    "getSystemInfo",
];
```

Poi mi creo una funzione `requestSystemInfo()` da richiamare. Non è necessario che il nome sia uguale al nome del canale aperto:

```ts
import { BrowserWindow } from "electron";

function requestSystemInfo(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: any) {
    const versionChrome = process.versions.chrome;
    const versionNode = process.versions.node;
    const versionElectron = process.versions.electron;
    const result = {
        chrome: versionChrome,
        node: versionNode,
        electron: versionElectron
    }
    mainWindow.webContents.send("getSystemInfo", result);
}
```

Infine creo una costante da esportare:

```ts
const systemInfo = new IPC ({
    nameAPI,
    validSendChannel,
    validReceiveChannel
});

export default systemInfo;
```

Dopo aver fatto questo devo registrare i canali in `preload.ts`. Mi basta scrivere:

```ts
import { generateContextBridge } from "./IPC/General/contextBridge"
import systemInfo from "./IPC/systemInfo";

generateContextBridge([systemInfo]);
```

E sono a posto.

Il passo successivo è di inserire in `index.ts` le funzioni necessarie per ottenere le informazioni che richiedo:

```ts
import { ipcMain } from 'electron';
import Main from "./mainWindow";

import systemInfo from './IPC/systemInfo';

let main = new Main();

main.onEvent.on("window-created", ()=> {
    systemInfo.initIpcMain(ipcMain, main.window);
});
```

### updaterInfo.ts

Adesso complico un po' le cose. Ricostruisco le funzioni per aggiornare automaticamente l'applicazione mantenendo tutto il codice all'interno del file `updaterInfo.ts`.

Quindi comincio con il creare alcune costanti di supporto:

```ts
import { SendChannels } from "./General/channelsInterface";
import IPC from "./General/IPC";

const nameAPI = "updaterInfo";

// to Main
const validSendChannel: SendChannels = {
    "requestVersionNumber": requestVersionNumber,
    "checkForUpdate": checkForUpdate,
    "startDownloadUpdate": startDownloadUpdate,
    "quitAndInstall": quitAndInstall,
};

// from Main
const validReceiveChannel: string[] = [
    "getVersionNumber",
    "checkingForUpdate",
    "updateAvailable",
    "updateNotAvailable",
    "downloadProgress",
    "updateDownloaded",
];
```

Ma prima di creare un oggetto di classe `IPC` mi fermo un attimo e decido di estendere la classe base. Perché? Perché devo dichiarare a parte le operazioni legate all'`autoUpdater`. Quindi:

```ts
class UpdaterInfo extends IPC {
    initAutoUpdater() {
        // ...
    }
}
```

Tra un attimo mostro cosa inserire in questo metodo, intanto posso però creare la costante da esportare:

```ts
const updaterInfo = new UpdaterInfo ({
    nameAPI,
    validSendChannel,
    validReceiveChannel
});

export default updaterInfo;
```

Bene. Adesso definisco le funzioni chiamate dai canali registrati tramite `validSendChannel`

```ts
import { BrowserWindow, app } from "electron";
import { autoUpdater } from "electron-updater";

function requestVersionNumber(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: any) {
    const version = app.getVersion();
    const result = {version};
    mainWindow.webContents.send("getVersionNumber", result);
}

function checkForUpdate(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: any) {
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdates();
}

function startDownloadUpdate(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: any) {
    autoUpdater.downloadUpdate();
}

function quitAndInstall(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: any) {
    autoUpdater.quitAndInstall();
}
```

Queste funzioni richiamano l'`autoUpdater` il quale a sua volta genera degli eventi. Creo quindi una funzione per intercettare e gestire questi eventi:

```ts
function initAutoUpdater(autoUpdater: AppUpdater, mainWindow: BrowserWindow) {
    autoUpdater.on('checking-for-update', () => {
        mainWindow.webContents.send("checkingForUpdate", null);
    });

    autoUpdater.on('error', (err) => { });

    autoUpdater.on("update-available", (info: any) => {
        mainWindow.webContents.send("updateAvailable", info);
    });

    autoUpdater.on('download-progress', (info: any) => {
        mainWindow.webContents.send("downloadProgress", info);
    });

    autoUpdater.on("update-downloaded", (info: any) => {
        mainWindow.webContents.send("updateDownloaded", info);
    });

    autoUpdater.on("update-not-available", (info: any) => {
        mainWindow.webContents.send("updateNotAvailable", info);
    });
}
```

Con questa funzione in mano posso quindi completare il metodo all'interno della classe `UpdaterInfo`:

 ```ts
import { AppUpdater, } from "electron-updater";

class UpdaterInfo extends IPC {
    initAutoUpdater(autoUpdater: AppUpdater, mainWindow: BrowserWindow) {
        initAutoUpdater(autoUpdater, mainWindow);
    }
}
 ```

### index.ts e preload.ts

Dopo aver finito con `updaterInfo.ts` posso finalmente completare il file `preload.ts`:

```ts
import { generateContextBridge } from "./IPC/General/contextBridge"

import systemInfo from "./IPC/systemInfo";
import updaterInfo from './IPC/updaterInfo';

generateContextBridge([systemInfo, updaterInfo]);
```

Ho anche tutti gli elementi che mi servono per completare `index.ts`:

```ts
import { ipcMain } from 'electron';
import { autoUpdater } from "electron-updater";
import Main from "./mainWindow";

import systemInfo from './IPC/systemInfo';
import updaterInfo from './IPC/updaterInfo';

require('electron-reload')(__dirname);

let main = new Main();

main.onEvent.on("window-created", ()=> {
    systemInfo.initIpcMain(ipcMain, main.window);
    updaterInfo.initIpcMain(ipcMain, main.window);

    updaterInfo.initAutoUpdater(autoUpdater, main.window);
});
```

Con questo ho concluso la parte dedicata ad Electron

### Svelte

Restano giusto due cosette da sistemare lato Svelte. Nella prima versione del template inserivo i file `index.html`, `global.css` e `favicon.png` nella cartella `dist/www`. Ha però più senso dedicare la cartella `dist` esclusivamente ai file generati da Svelte e da TypeScript. Di conseguenza sposto questi tre file nella cartella `src/frontend/www`:

```
> src
    > electron
    > frontend
        - App.svelte
        - global.d.ts
        - main.ts
        - tsconfig.json
        > Components
            - InfoElectron.svelte
            - Version.svelte
        > www
            - favicon.png
            - global.css
            - index.html
```

Resta però il problema di fare arrivare una copia di questi file in `dist/www` al momento della compilazione. Per fortuna è possibile usare [rollup-plugin-copy](https://www.npmjs.com/package/rollup-plugin-copy) per automatizzare questa operazione.

Da riga di comando digito:

```bash
npm i rollup-plugin-copy
```

Poi modifico il file `rollup.config.js` aggiungendo:

```js
import copy from 'rollup-plugin-copy';

export default { 
    plugins: [
        copy({
			targets: [
			  { src: 'src/frontend/www/**/*', dest: 'dist/www' }
			]
		}),
    ]
}
```

Restano infine da aggiornare le funzioni chiamate dai componenti

In `InfoElectron.svelte`

```js
globalThis.api.send("requestSystemInfo", null);
globalThis.api.receive("getSystemInfo", (data) => {
    chrome = data.chrome;
    node = data.node;
    electron = data.electron;
});
```

diventa

```js
globalThis.api.systemInfo.send("requestSystemInfo", null);
globalThis.api.systemInfo.receive("getSystemInfo", (data) => {
    chrome = data.chrome;
    node = data.node;
    electron = data.electron;
});
```

Modifico in maniera simile le funzioni all'interno di `Version.svelte`: `globalThis.api.send(...)` e `globalThis.api.receive(...)` diventano `globalThis.api.updaterInfo.send(...)` `globalThis.api.updaterInfo.receive(...)`.


Direi che per oggi è tutto. Ricordo il link del repository e quello del mio Patron:

- [MEMENTO - Svelte, Electron & TypeScript](https://github.com/el3um4s/memento-svelte-electron-typescript)
- [Patreon](https://www.patreon.com/el3um4s)
