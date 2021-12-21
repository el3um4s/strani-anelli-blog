---
title: "Svelte, Electron & TypeScript (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-06-26 17:00"
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

I am continuing to explore the world of [Svelte](https://svelte.dev/). Every day I am adding a little bit to my knowledge, and every day I am struggling with my limits. While I'm happy that I was able to find a way to create static pages on GitHub, my goal is to make it easier for me to develop some offline tools. Unlike other frameworks, the Svelte community is quite small and there is no, or at least I could not find, a template suitable for my needs. For this I decided to create my own template to integrate Svelte, Electron and TypeScript.

I start with the "_rules of engagement_". I need a tool that:

- can work completely offline
- does not require internet connection to be installed
- can be updated both offline and online
- can be developed using TypeScript
- is relatively simple to develop and expand

I have already created a first template, without TypeScript: [MEMENTO - Svelte & Electron](https://github.com/el3um4s/memento-svelte-electron). Starting from this I'm implementing the second version, which I'll call [MEMENTO - Svelte, Electron & TypeScript](https://github.com/el3um4s/memento-svelte-electron-typescript) (I have a lot of imagination with the names, huh?).

This post is for me, and above all for the future me, to remember the steps I'm doing. And above all to remind me of some design choices that I'm making. Also because I think I will probably have to develop a third template (the final one? Perhaps) in which to integrate also SvelteKit. But better to take it one step at a time.

So, the first thing to do is to create a new project starting from Svelte:

```bash
npx degit sveltejs/template my-svelte-project
cd my-svelte-project
node scripts/setupTypeScript.js
npm install
```

I install the packages that I will need for Electron

```bash
npm i -D electron@latest
npm i -D typescript
npm i -D electron-builder
npm i electron-updater
npm i electron-reload
```

In this way I get:

- the latest version of [ElectronJS](https://www.electronjs.org/)
- TypeScript, for use with Electron
- [electron-builder](https://www.electron.build/) to create executable files to publish (for both Windows and Linux and macOS)
- [electron-updater](https://www.electron.build/auto-update) to easily update programs to the latest version
- [electron-reload](https://www.npmjs.com/package/electron-reload) to update the contents of Electron's "Browser Windows" during application development

Then I install [nodemon](https://nodemon.io/) to automatically restart Electron on any source code change. I also think this is useful when developing an application

```bash
npm i -D nodemon
```

After installing everything you need, it's time to go and fix the structure of the project. There are currently 2 folders

- `public`, where the compiled files of Svelte are
- `src`, where the Svelte source files are

But this structure doesn't work very well. Not only because the Electron files are missing but also because I will run into problems later. So I rearrange files in another way:

{% include picture img="image.webp" ext="jpg" alt="" %}

First of all I create a `dist` folder: it will be used to contain the compiled files of Svelte and Electron. I move Svelte files (those created automatically) to `dist\www`.

Then I start editing the `src` folder. I create 2 additional folders inside it: `electron` and `frontend`. In the first I insert the files necessary to make Electron work (for the moment only `index.ts` and `preload.ts`). I use `frontend` instead for everything related to Svelte. But I add the `tsconfig.json` file.

I also add some files to the root of the project: `icon.ico`, `license.txt`, `nodemon.json`. The icon file and the license file will be needed when installing the app on a PC. I will use the nodemon configuration file when developing the program.

I haven't written a line of code yet. But the time has come to put my hand to the keyboard and start tidying up some files. The first file to change is `dist\www\index.html`. I have to make a very simple change, fix the references of the imported files. So it goes like this:

<script src="https://gist.github.com/el3um4s/711dea45df12b0de14005b76fc1ea723.js"></script>

to this:

<script src="https://gist.github.com/el3um4s/d05cee75e64b2eab53427a2b93bb829d.js"></script>

Basically I removed the first slash from all the url and added some [CSP settings](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).

Now I pass to the section dedicated to the frontend source files. Here I have created a file `src\frontend\tsconfig.json`: its purpose is to allow you to compile Svelte's TypeScript files in a different way from how Electron's ones are compiled (see [stackoverflow: How to use multiple tsconfig files in vs-code?](https://stackoverflow.com/questions/37579969/how-to-use-multiple-tsconfig-files-in-vs-code)). Inserisco questo codice:

<script src="https://gist.github.com/el3um4s/bc3adcd0367dedb2bb6a33aa9d0b80a5.js"></script>

I'll go back to `src\electron` later. Now I modify the other file related to the TypeScript configuration: the `tsconfig.json` file located at the root of the project. I write:

<script src="https://gist.github.com/el3um4s/268642ccf0376bc305d4a25b98256266.js"></script>

Then I configure `nodemon.json` by entering in the file:

<script src="https://gist.github.com/el3um4s/684f10e6326bd3be85d85edb3847ace3.js"></script>

In this way I intercept all the changes made to Electron files and I can automatically restart Electron.

Another file to fix is `rollup.config.js`. Generally the automatically created file is fine but in this case I changed the file structure: I have to make sure that the various commands refer to the correct folders.

<script src="https://gist.github.com/el3um4s/3521d1df776206550bafef1a824a9874.js"></script>

There is one last file to configure, `package.json`. I begin with the general information:

<script src="https://gist.github.com/el3um4s/7b4b246cac3489fe7984349898c9f575.js"></script>

Then I define the entry point of the program. I decided to put all the compiled files in `dist`, so I add a line to `package.json`:

<script src="https://gist.github.com/el3um4s/6c14d88b6570c98e2e9c13a16a543388.js"></script>

Obviously I omit to report the various dependencies, they add themselves when I import the libraries from `npm`. I pass instead to the part dedicated to `scripts`. I need something to run `nodemon`.

<script src="https://gist.github.com/el3um4s/7e080bfb9f927a7ccf234726716a5425.js"></script>

Of course I also need to make sure I can run Electron with the compiled typescript files:

<script src="https://gist.github.com/el3um4s/ed0e7b25baf84fadd1f5e9f52be02f60.js"></script>

Then I need something to build the executable files and to publish them directly on GitHub:

<script src="https://gist.github.com/el3um4s/3951cbcb7189cd47d77a486f3f1d2f0a.js"></script>

Finally I have to configure the part dedicated to the creation of the files to be distributed:

<script src="https://gist.github.com/el3um4s/eed5ce0045735cb3351e5210a379241d.js"></script>

Once the configuration is finished, I can finally move on to the code. I start with something simple: I use `src\electron\index.ts` to create a simple window in which to display a simple HTML file (created by Svelte). So, I start with:

<script src="https://gist.github.com/el3um4s/5662d5a68d1e1e74785928634c1dc3db.js"></script>

It's time for the first test; from the command line I type:

```bash
npm run nodemon
```

If I have done everything right an Electron window will appear with a simple "Hello World":

{% include picture img="test-nodemon.webp" ext="jpg" alt="" %}

The next test is to change the window size in `index.ts`, save the file and see what happens:

<script src="https://gist.github.com/el3um4s/0b9587cacabeed65b2e7f2768a8c9032.js"></script>

![test-nodemon.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-24-svelte-et-electron-et-typescript/test-nodemon.gif)

Nodemon restarts Electron and applies the changes to the window. But if I only change the Svelte part then Nodemon won't do anything. This is a task for `electron-reload`:

![test-electron-reload.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-24-svelte-et-electron-et-typescript/test-electron-reload.gif)

If I'm not interested in working on the electron side I can just use:

```bash
npm run dev
```

This way I only monitor changes in files compiled with Svelte.

The next test is about the possibility of creating an executable file. So I run from the command line:

```bash
npm run out:win
```

{% include picture img="create-exe.webp" ext="jpg" alt="" %}

I get the `memento-svelte-electron-typescript Setup 0.0.1.exe` file in the `out` directory.

To publish the app on GitHub I can use the command

```bash
npm run publish:win
```

Now is the time to start working on how to more closely integrate Electron with Svelte. And it's time to go edit the `src\preload.ts` file. I need a mechanism to communicate with Electron starting with Svelte: I enable some inbound and outbound communication channels.

<script src="https://gist.github.com/el3um4s/0487cef29582eee17a4c3cfce9e15a57.js"></script>

As a test I ask Electron for the version number of Chrome, Node and Electron. Then I use this information in a custom component. I add a function on `src\electron\index.ts`:

<script src="https://gist.github.com/el3um4s/d5cfde843eb1e768cd0191299cabad35.js"></script>

This way when I request `requestSystemInfo` from the component Electron will get the information I need and send it back with a message on the `getSystemInfo` channel.

So I create the `src\frontend\Components\InfoElectron.svelte` component:

<script src="https://gist.github.com/el3um4s/a5d0bca82d78d4845dbbec88210d945e.js"></script>

I get this:

{% include picture img="test-ipcMain.webp" ext="jpg" alt="" %}

However, I admit that I have not explored yet this pattern well (and in general how to use TypeScript to create the input file for Electron): I recommend also reading [Electron IPC Response/Request architecture with TypeScript](https://blog.logrocket.com/electron-ipc-response-request-architecture-with-typescript/) by [LogRocket](https://blog.logrocket.com/).

The last thing to fix is the automatic update. To manage it, I import `Notification` from Electron and `autoUpdater` from `electron-updater`

<script src="https://gist.github.com/el3um4s/5e933fb3906813ed2ca673e57571b7f4.js"></script>

To check for updates just use

<script src="https://gist.github.com/el3um4s/c415f7fb44bc8ae368c657ea3da2297f.js"></script>

This command generates some events that I can intercept. For the moment I need this 2:

<script src="https://gist.github.com/el3um4s/08bba6ada121f2d8bc888ce8c8e3c378.js"></script>

This allows me to pop up a system notification when there is an update available. In case you decide to install it, just click on the notification to start the download. After that, when the download is finished, clicking on the notification starts the installation procedure.

![test-electron-reload.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-24-svelte-et-electron-et-typescript/test-update.gif)

Then I create the `dev-app-update.yml` file. This file is for testing automatic updates in development. I insert the references to the GitHub repository where I host the project:

<script src="https://gist.github.com/el3um4s/0f6d6199c436e1e4652e8106fde3ee14.js"></script>

That's all for today.

- [MEMENTO - Svelte, Electron & TypeScript](https://github.com/el3um4s/memento-svelte-electron-typescript)
- [Patreon](https://www.patreon.com/el3um4s)
