---
title: "Electron and TypeScript: how to use ipcMain and ipcRenderer (English)"
published: true
date: 2021-07-09 22:30
categories:
  - TypeScript
  - Svelte
  - Electron
tags:
  - TypeScript
  - Svelte
  - Electron
  - electron-ipcmain-ipcrenderer-typescript
cover: cover.webp
lang: en
description: While playing with Electron, TypeScript and Electron I ran into some problems. In the first version of my template (el3um4s/memento-svelte-electron-typescript) I settled for a working result. But it wasn't the best result. Then I modified the code by making some improvements. I don't know if my proposal is the optimal solution but for sure I like it more than the first version.
---

While playing with Electron, TypeScript and Electron I ran into some problems. In the first version of my template ([el3um4s/memento-svelte-electron-typescript](https://github.com/el3um4s/memento-svelte-electron-typescript)) I settled for a working result. But it wasn't the best result. Then I modified the code by making some improvements. I don't know if my proposal is the optimal solution but for sure I like it more than the first version.

In the first version there were some major problems. One on the Svelte side (I talk about it at the end of this article), two on the Electron side. In a nutshell, all of Electron's logic was condensed into just two large files, `index.ts` and `preload.ts`. What's more, the logic was mixed. I was using `preload.ts` to ensure an interface between Svelte and Electron but the functions were on another file. index.ts on the other hand found itself having to manage both the creation of the graphical interface and all the communications to and from Svelte.

### The folder structure

In a small project, such as the repository I uploaded, it's not a big deal. But it doesn't take long to add to the overall complexity and create a nice tangle of _spaghetti code_. So I decided to take a step back and make everything more modular. Instead of just two files, I created a few more, each with a single task to perform:

```text
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

If at first glance it seems an unjustified increase in the complexity of the project, I think it is worth it:

- `index.ts` continues to be the main file but only takes care of calling the necessary functions, not defining them
- `preload.ts` continues to allow secure communication between `BrowserWindow` and Electron but only contains the list of available channels
- `mainWindow.ts` contains a `Main` class to build a `BrowserWindow` in Electron

### The `Main` Class

Keeping the `Main` class separate allows me to keep the code inside `index.ts` cleaner

First I need some default values for the basic settings and a constructor

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

Then I need a method to create the main program window

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

And then some additional methods:

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

Now I put it all together in the constructor:

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

If I want I can stop here. But I need one more thing to intercept the moment when the window is created. I can use an `app.on("browser-window-created", funct )` event inside `index.ts` or within the `Main` class itself. Instead I preferred to use a custom `EventEmitter` ([link](https://nodejs.org/api/events.html#events_class_eventemitter)):

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

Finally I export the `Main` class so that I can use it:

```ts
export default Main;
```

Before moving on to the `IPC` folder, I use the `Main` class inside `index.ts`

```ts
import Main from "./mainWindow";

let main = new Main();

main.onEvent.on("window-created", ()=> {
    //...
});
```

I already insert the `main.onEvent.on("window-created", funct)`: I will use it to define the actions to perform at startup. That is the code linked to `ipcMain`, `webContents` and `autoUpdater`. I placed the code in two different files, `systemInfo.ts` and `updateInfo.ts`. These are just two examples of how to use the template and can be replaced, deleted or modified at will. And of course you can use them as a basis to add other functions and channels.

### channelsInterface, contextBridge and IPC

The files inside the General folder serve to keep clean the previous files.

`channelsInterface.ts` contains the definition of some interfaces:

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

The main file is `IPC.ts`. The `IPC` class is the basis for the inter-process communication between Electron and the HTML pages:

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

`IPC` has three properties. `nameAPI` is used to define the name to use to call the API from within the frontend. Then there is the list of valid channels.

Compared to the first version, the channels to Electron are not just a list of names but an object. To each key I assign a function to be called (I'll explain that in a moment). There are only two methods, `get channels` and `initIpcMain` - I'll use them in a moment.

The third _general_ file contains the definition of the `generateContextBridge()` function. It takes as an argument an array of objects of the type `IPC` and uses them to generate the list of safe channels for communications between Electron and Svelte.

My explanation is probably quite confusing but luckily these files should not be changed.

### systemInfo.ts

Moreover, it is more interesting to understand how to use them. That's why I included two examples. I'll start with the simplest, `systemInfo.ts`. This module has a single open channel out and in and uses it to ask and get some information about Electron, Node and Chrome.

First I import the files I just talked about:

```ts
import { SendChannels } from "./General/channelsInterface";
import IPC from "./General/IPC";
```

So I start creating some supporting variables:

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

Then I create a `requestSystemInfo()` function to call. The name does not need to be the same as the open channel name:

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

Finally I create a constant to export:

```ts
const systemInfo = new IPC ({
    nameAPI,
    validSendChannel,
    validReceiveChannel
});

export default systemInfo;
```

After this, I need to register the channels in `preload.ts`. I just have to write:

```ts
import { generateContextBridge } from "./IPC/General/contextBridge"
import systemInfo from "./IPC/systemInfo";

generateContextBridge([systemInfo]);
```

Then I put the necessary functions in `index.ts`

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

Now things become a little more complicated. I rebuild the functions to automatically update the application while keeping all the code inside the `updaterInfo.ts` file.

So I start by creating some supporting constants:

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

Before creating an object of class `IPC` I stop for a moment and decide to extend the base class. Why? Because I have to declare separately the operations related to the `autoUpdater`. 

```ts
class UpdaterInfo extends IPC {
    initAutoUpdater() {
        // ...
    }
}
```

In a moment I'll show what to insert in this method, but in the meantime I can create the constant to export:

```ts
const updaterInfo = new UpdaterInfo ({
    nameAPI,
    validSendChannel,
    validReceiveChannel
});

export default updaterInfo;
```

Now I define functions called by registered channels via `validSendChannel`

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

These functions call the `autoUpdater` which generates events. So I create a function to intercept and manage these events:

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

With this function, then, I complete the method inside the `UpdaterInfo` class:

 ```ts
import { AppUpdater, } from "electron-updater";

class UpdaterInfo extends IPC {
    initAutoUpdater(autoUpdater: AppUpdater, mainWindow: BrowserWindow) {
        initAutoUpdater(autoUpdater, mainWindow);
    }
}
 ```

### index.ts and preload.ts

After finishing with `updaterInfo.ts` I finally complete the `preload.ts` file:

```ts
import { generateContextBridge } from "./IPC/General/contextBridge"

import systemInfo from "./IPC/systemInfo";
import updaterInfo from './IPC/updaterInfo';

generateContextBridge([systemInfo, updaterInfo]);
```

Also, I have all the elements I need to complete `index.ts`:

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

With this I concluded the part dedicated to Electron.

### Svelte

There are just two things left to fix on the Svelte side. In the first version I inserted the `index.html`, `global.css` and `favicon.png` files in the `dist/www` folder. However, it makes more sense to dedicate the dist folder exclusively to files generated by Svelte and TypeScript. I move these three files to the `src/frontend/www` folder:

```text
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

However, the problem is copying these files in `dist/www` at the time of compilation. Fortunately, you can use [rollup-plugin-copy](https://www.npmjs.com/package/rollup-plugin-copy) to automate this.

In the command line:

```shell
npm i rollup-plugin-copy
```

Then I edit the `rollup.config.js` file by adding:

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

Finally, I update the functions called by the Svelte components

`InfoElectron.svelte`

```js
globalThis.api.send("requestSystemInfo", null);
globalThis.api.receive("getSystemInfo", (data) => {
    chrome = data.chrome;
    node = data.node;
    electron = data.electron;
});
```

becomes

```js
globalThis.api.systemInfo.send("requestSystemInfo", null);
globalThis.api.systemInfo.receive("getSystemInfo", (data) => {
    chrome = data.chrome;
    node = data.node;
    electron = data.electron;
});
```

I modify the functions inside `Version.svelte` in a similar way: `globalThis.api.send(...)` and `globalThis.api.receive(...)` become `globalThis.api.updaterInfo.send(...)` and `globalThis.api.updaterInfo.receive(...)`.

That's all for today.

- [MEMENTO - Svelte, Electron & TypeScript](https://github.com/el3um4s/memento-svelte-electron-typescript)
- [Patreon](https://www.patreon.com/el3um4s)