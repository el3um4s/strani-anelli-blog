---
title: "Svelte, Electron & TypeScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-06-24 19:00"
categories:
  - JavaScript
  - Svelte
  - TypeScript
  - Template
tags:
  - JavaScript
  - Svelte
  - TypeScript
  - Template
---


Sto continuando a esplorare il mondo di [Svelte](https://svelte.dev/). Ogni giorno sto aggiungendo un pezzettino alla mia conoscenza, e ogni giorno mi scontro con i miei limiti. Se da un lato sono contento di essere riuscito a trovare un modo per creare pagine statiche su GitHub, dall'altro il mio obiettivo è semplificarmi lo sviluppo di alcuni strumenti offline. A differenza di altri framework, la comunità di Svelte è abbastanza piccola e non esiste, o per lo meno non sono riuscito a trovare, un template adatto alle mie esigenze. Per questo ho deciso di creare il mio template per integrare Svelte, Electron e TypeScript.

Comincio con le "_regole di ingaggio_". Mi serve uno strumento che:

- possa funzionare completamente offline
- non richieda connessione internet per essere installato
- possa essere aggiornato sia offline che online
- possa essere sviluppato usando [TypeScript](https://www.typescriptlang.org/)
- sia relativamente semplice da sviluppare e ampliare

Ho già realizzato un primo template, senza TypeScript: [MEMENTO - Svelte & Electron](https://github.com/el3um4s/memento-svelte-electron). Partendo da questo ho cominciato a implementare la seconda versione, che penso chiamerò [MEMENTO - Svelte, Electron & TypeScript](https://github.com/el3um4s/memento-svelte-electron-typescript) (ho molta fantasia con i nomi, eh?).

Questo post serve a me, e sopratutto al me futuro, per ricordare i passaggi che ho e sto svolgendo. E sopratutto per ricordarmi di alcune scelte di progettazione che sto compiendo. Anche perché credo che dovrò probabilmente sviluppare un terzo template (quello definitivo? forse) in cui integrare anche [SvelteKit](https://kit.svelte.dev/). Ma meglio affrontare un passo alla volta.

Allora, la prima cosa da fare è creare un progetto nuovo partendo da Svelte:

```bash
npx degit sveltejs/template my-svelte-project
cd my-svelte-project
node scripts/setupTypeScript.js
npm install
```

E fin qui tutto bene. Passo poi a installare tutto quello che sarà legato a Electron:

```bash
npm i -D electron@latest
npm i -D typescript
npm i -D electron-builder
npm i electron-updater
npm i electron-reload
```

In altre parole installo:
- l'ultima versione di [ElectronJS](https://www.electronjs.org/)
- TypeScript, per usarlo con Electron
- [electron-builder](https://www.electron.build/) per creare i file eseguibili da pubblicare (sia per Windows che per Linux e macOS)
- [electron-updater](https://www.electron.build/auto-update) per aggiornare facilmente i programmi alla versione più recente
- [electron-reload](https://www.npmjs.com/package/electron-reload) per aggiornare il contenuto delle "_Browser Window_" di Electron durante lo sviluppo dell'applicazione

Poi installo [nodemon](https://nodemon.io/) per riavviare automaticamente Electron a ogni modifica del codice sorgente. Anche questo penso sia utile durante lo sviluppo di un'applicazione

```bash
npm i -D nodemon
```

Dopo aver installato tutto quello che serve è il momento di andare a sistemare la struttura del progetto. Al momento ci sono 2 cartelle

- `public`, dove ci sono i file compilati di Svelte
- `src`, dove ci sono i file sorgente di Svelte

Ovviamente le cose così non vanno bene. Non solo perché mancano i file di Electron ma anche perché con questa struttura incontreremo dei problemi più avanti. Sistemo quindi le cose in un'altra maniera:

{% include picture img="image.webp" ext="jpg" alt="" %}

Innanzi tutto creo una cartella `dist`: servirà per contenere i file compilati di Svelte e di Electron. I file di Svelte (quelli creati automaticamente) li sposto in `dist\www`.

Poi comincio a modificare la cartella `src`. Creo 2 ulteriori cartelle al suo interno: `electron` e `frontend`. Nella prima inserisco i file necessari per far funzionare Electron (per il momento solamente `index.ts` e `preload.ts`). Uso `frontend` invece per tutto quello che riguarda Svelte. Aggiungo però il file `tsconfig.json`.

Aggiungo anche alcuni file alla radice del progetto: `icon.ico`, `license.txt`, `nodemon.json`. Il file icona e quello della licenza serviranno in fase di installazione dell'app su PC. Il file di configurazione di nodemon lo userò invece durante lo sviluppo del programma.

Fino ad ora non ho ancora scritto una riga di codice. È però giunto il momento di mettere mano alla tastiera e di cominciare a sistemare un po' di file. Il primo file da toccare è `dist\www\index.html`. Devo fare una modifica molto semplice, correggere i riferimenti dei file importati. Quindi da così:

```html
<link rel='icon' type='image/png' href='/favicon.png'>
<link rel='stylesheet' href='/global.css'>
<link rel='stylesheet' href='/build/bundle.css'>

<script defer src='/build/bundle.js'></script>
```

a così:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self';">
<meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'">

<link rel='icon' type='image/png' href='favicon.png'>
<link rel='stylesheet' href='global.css'>
<link rel='stylesheet' href='build/bundle.css'>

<script defer src='build/bundle.js'></script>
```

In pratica ho tolto la prima barra da tutti gli url e aggiunto alcune impostazioni [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).

Passo adesso al sezione dedicata ai file sorgenti del frontend. Qui ho creato un file `src\frontend\tsconfig.json`: il suo scopo è permetter di compilare i file TypeScript di Svelte in maniera diversa da come vengono compilati quelli di Electron (vedi [stackoverflow: How to use multiple tsconfig files in vs-code?](https://stackoverflow.com/questions/37579969/how-to-use-multiple-tsconfig-files-in-vs-code)). Inserisco questo codice:

```json
{
    "extends": "@tsconfig/svelte/tsconfig.json",
    "compilerOptions": {
      "target": "es2020",
    },
    "lib": ["es2020", "dom"]
}
```

Su `src\electron` ci torno dopo. Adesso modifico l'altro file legato alla configurazione di TypeScript: il file `tsconfig.json` che si trova alla radice del progetto. Scrivo:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src/electron",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["es2020"]
  },
  "exclude": [
    "node_modules",
    "dist/www",
    "out/**",
    "src/frontend/**"
  ],
  "include": ["src/electron/**/*"]
}
```

Configuro poi `nodemon.json` inserendo nel file:

```json
{
  "watch": ["src/electron/"],
  "exec": "npm run dev",
  "ext": "js, json, ts, proto, css, png, jpeg, jpg, ico"
}
```

in modo da intercettare tutte le modifiche fatte ai file di Electron e poter così riavviare automaticamente Electron stesso.

Un altro file da correggere è `rollup.config.js`. In genere il file creato automaticamente va bene ma in questo caso ho modificato la struttura dei files: devo assicurarmi che i vari comandi rimandino alle cartelle corrette. Quindi:

```js
export default {
	input: 'src/frontend/main.ts',  // check!
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'dist/www/build/bundle.js' // check!
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				dev: !production
			}
		}),
		css({ output: 'bundle.css' }),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			tsconfig: "src/frontend/tsconfig.json", // add and check!
			sourceMap: !production,
			inlineSources: !production
		}),
		!production && serve(),
		!production && livereload('dist'), // check!
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
```

Resta un ultimo file da configurare, `package.json`. Comincio con le informazioni di carattere generale:

```json
{
  "name": "memento-svelte-electron-typescript",
  "productName": "memento-svelte-electron-typescript",
  "description": "Memento: how to use Svelte with Electron and TypeScript",
  "author": "Samuele de Tomasi <samuele@stranianelli.com>",
  "license": "MIT",
  "version": "0.0.1",
}
```

Definisco poi il punto di ingresso del programma. Ho deciso di mettere tutti i file compilati in `dist`, conseguentemente aggiungo a `package.json` la riga:

```json
{
  "main": "dist/index.js",
}
```

Ovviamente tralascio di riportare le varie dipendenze, quelle si aggiungono da sole quando importo le librerie da `npm`. Passo invece alla parte dedicata agli `scripts`. Di sicuro mi serve qualcosa per lanciare `nodemon`.

```json
{
  "scripts": {
    "nodemon": "nodemon",
    "dev": "rollup -c -w",
  }
}
```

Ovviamente devo anche assicurarmi di poter lanciare Electron con i file typescript compilati:

```json
{
  "scripts": {
    "start": "npm run compile && electron .",
    "compile": "tsc"
  }
}
```

Poi mi serve qualcosa per costruire i file eseguibili e per pubblicarli direttamente su GitHub:

```json
{
  "scripts": {
    "out:win": "rollup -c && tsc && electron-builder build --win --publish never",
    "publish:win": "rollup -c && tsc && electron-builder build --win --publish always"
  }
}
```

Infine devo configurare la parte dedicata alla creazione dei file da distribuire:

```json
{
  "build": {
    "appId": "memento-set",
    "directories": {
      "output": "out"
    },
    "publish": [
      {
        "provider": "github",
        "owner": "el3um4s",
        "repo": "memento-svelte-electron-typescript"
      }
    ],
    "win": {
      "target": [
        "nsis"
      ],
      "icon": "icon.ico"
    },
    "nsis": {
      "installerIcon": "icon.ico",
      "uninstallerIcon": "icon.ico",
      "uninstallDisplayName": "Memento TES (Svelte+Electron+TypeScript)",
      "license": "license.txt",
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

Finita la configurazione posso, finalmente, passare al codice vero e proprio. Comincio con qualcosa di semplice: uso `src\electron\index.ts` per creare una semplice finestra in cui mostrare un file HTML semplice (creato però da Svelte). Quindi, comincio con il codice base:

```js
import { app, BrowserWindow } from 'electron';
import path from "path";

require('electron-reload')(__dirname);

let mainWindow = null;

const createWindow  = () => { 
    mainWindow = new BrowserWindow({
        width: 854,
        height: 480,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true
        }
    });
    mainWindow.loadURL(path.join(__dirname, 'www', 'index.html'));
}

app.on('ready', () => {
    app.name = 'Svelte Template';
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
});
```

È il momento del primo test: da riga di comando digito:

```bash
npm run nodemon
```

Se ho fatto tutto bene apparirà una finestra di Electron con un semplice "Hello World":

{% include picture img="test-nodemon.webp" ext="jpg" alt="" %}

Il test successivo consiste nel modificare le dimensioni della finestra in `index.ts`, salvare il file e stare a vedere che succede

```js
//...
mainWindow = new BrowserWindow({
  width: 400,
  height: 600,
//...
});
```

![test-nodemon.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-24-svelte-et-electron-et-typescript/test-nodemon.gif)

Nodemon riavvia Electron e applica le modifiche alla finestra. Però se modifico solamente la parte Svelte allora Nodemon non interviene. Di questo si occupa `electron-reload`:

![test-electron-reload.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-24-svelte-et-electron-et-typescript/test-electron-reload.gif)

Se non mi interessa lavorare sul lato electron posso semplicemente usare

```bash
npm run dev
```

In questo modo monitoro solamente le modifiche dei file compilati con Svelte.

Il prossimo test riguarda la possibilità di creare un file eseguibile. Quindi eseguo da riga di comando:

```bash
npm run out:win
```

{% include picture img="create-exe.webp" ext="jpg" alt="" %}

Come risultato ottengo il file `memento-svelte-electron-typescript Setup 0.0.1.exe` nella cartella `out`.

Per pubblicare l'app su GitHub posso usare il comando

```bash
npm run publish:win
```

Adesso è il momento di cominciare a lavorare su come integrare in maniera più stretta Electron con Svelte. Ed è il momento di andare a modificare il file `src\preload.ts`. Mi serve un meccanismo per comunicare con Electron a partire da Svelte, e il meccanismo consiste nell'abilitare alcuni canali di comunicazione in entrata e in uscita.

```ts
import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel: string, data: any) => {
            // whitelist channels
            let validChannels = ["toMain", "requestSystemInfo"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel: string, func: (arg0: any) => void) => {
            let validChannels = ["fromMain", "getSystemInfo"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                // @ts-ignore
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);
```

Come prova richiedo ad Electron il numero di versione di Chrome, Node ed Electron. Poi uso queste informazioni in un componente personalizzato. Aggiungo una funzione su `src\electron\index.ts`:

```ts
ipcMain.on('requestSystemInfo', async (event, message) => {
    const versionChrome = process.versions.chrome;
    const versionNode = process.versions.node;
    const versionElectron = process.versions.electron;
    const result = {
        chrome: versionChrome,
        node: versionNode,
        electron: versionElectron
    }
    mainWindow.webContents.send("getSystemInfo", result);
  });
```

In questo modo quando dal componente richiedo `requestSystemInfo` Electron ricaverà le informazioni che mi servono e le rispedirà indietro con un messaggio sul canale `getSystemInfo`.

Creo quindi il componente `src\frontend\Components\InfoElectron.svelte`:

```html
<script lang="ts">
    let chrome = "-";
    let node = "-";
    let electron = "-";

    globalThis.api.send("requestSystemInfo", null);
    globalThis.api.receive("getSystemInfo", (data) => {
        chrome = data.chrome;
        node = data.node;
        electron = data.electron;
    });
</script>

<div>
    We are using Node.js <span class="version">{node}</span>,
    Chromium <span class="version">{chrome}</span>,
    and Electron <span class="version">{electron}</span>.
</div>

<style>
    .version {
        color: #ff3e00;
    }
</style>
```

In questo modo ottengo come risultato

{% include picture img="test-ipcMain.webp" ext="jpg" alt="" %}

Ammetto però di non aver ancora approfondito bene questo pattern (e in generale come usare bene TypeScript per creare il file di ingresso per Electron): consiglio di leggere anche [Electron IPC Response/Request architecture with TypeScript](https://blog.logrocket.com/electron-ipc-response-request-architecture-with-typescript/) di [LogRocket](https://blog.logrocket.com/).

L'ultimo aspetto da sistemare è l'aggiornamento automatico. Per gestirlo importo `Notification` da Electron e `autoUpdater` da `electron-updater`

```ts
import { Notification } from 'electron';
import { autoUpdater } from "electron-updater";
```

Per controllare la presenza di aggiornamenti è sufficiente usare

```ts
autoUpdater.checkForUpdates();
```

Questo comando genera alcuni eventi che posso intercettare. Per il momento me ne servono 2:

```ts
autoUpdater.on("update-available", () => {
    notification = new Notification({
        title: "Svelte App",
        body: "Updates are available. Click to download.",
        silent: true,

    });
    notification.show();
    notification.on("click", () => {
            autoUpdater.downloadUpdate();
    });
});
  
autoUpdater.on("update-downloaded", () => {
    notification = new Notification({
        title: "Svelte App",
        body: "The updates are ready. Click to quit and install.",
        silent: true,
    });
    notification.show();
    notification.on("click", () => {
        autoUpdater.quitAndInstall();
    });
});
```

Questo mi permette di far apparire una notifica di sistema quando c'è un aggiornamento disponibile. In caso decidessi di installarlo è sufficiente cliccare sulla notifica per avviare il download. Dopo di ché, quando il download è finito cliccando sulla notifica si avvia la procedura di installazione.

![test-electron-reload.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-24-svelte-et-electron-et-typescript/test-update.gif)

Creo poi il file `dev-app-update.yml`. Questo file serve per testare gli aggiornamenti automatici in fase di sviluppo. Inserisco i riferimenti al repository GitHub dove ospito il progetto:

```yml
provider: github
owner: el3um4s
repo: memento-svelte-electron-typescript
```

Direi che per oggi è tutto. Ricordo il link del repository e quello del mio Patron:

- [MEMENTO - Svelte, Electron & TypeScript](https://github.com/el3um4s/memento-svelte-electron-typescript)
- [Patreon](https://www.patreon.com/el3um4s)