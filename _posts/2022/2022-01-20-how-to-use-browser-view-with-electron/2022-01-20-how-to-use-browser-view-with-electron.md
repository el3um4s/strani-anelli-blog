---
title: "How To Use BrowserView With Electron"
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
  - BrowserView
tags:
  - Electron
  - TailwindCSS
  - Svelte
  - BrowserView
---

One of the problems I'm facing with my [gest-dashboard](https://javascript.plainenglish.io/the-journey-of-a-novice-programmer-82366ec7851a) project is managing several windows with Electron. It is a more complex problem than I thought and it prompted me to study the issue. After some testing I discarded <iframe> and <webview>. Instead, I focused on how to use [Browser View](https://www.electronjs.org/docs/latest/api/browser-view) with Electron.

The target? Get something similar to this: being able to load external pages into Electron, while maintaining control of the [Browser Window](https://www.electronjs.org/docs/latest/api/browser-window).

![electron-browser-view-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-20-come-usare-browser-view-con-electron/electron-browser-view-01.gif)

Since this post is about a very specific topic I don't cover all the steps to set up a new Electron project. For simplicity, I have used the [el3um4s/memento-svelte-electron-typescript](https://github.com/el3um4s/memento-svelte-electron-typescript) template but it is not mandatory. Instead it is important to understand one thing, before starting: how to use ipcMain and ipcRenderer to make the various windows communicate with Electron. There are some interesting guides on the net. In this tutorial I start from this:

- [Electron And TypeScript: How to Use ipcMain and ipcRenderer](https://javascript.plainenglish.io/electron-and-typescript-how-to-use-ipcmain-and-ipcrenderer-english-4ebd4addf8e5)

### But first: why use a browser view?

The question must be answered: why use a browser view instead of a simpler [webview tag](https://www.electronjs.org/docs/latest/api/webview-tag)?

The question must be answered: why use a browser view instead of a simpler [] tag (https://www.electronjs.org/docs/latest/api/webview-tag)?

The first reason is that Electron's own documentation recommends doing this. The web views are now being discontinued. To quote [developer.chrome](https://developer.chrome.com/docs/extensions/reference/webviewTag/):

```
chrome.webviewTag: This API is part of the deprecated Chrome Apps platform. Learn more about migrating your app.
```

It follows that it is better to turn to other shores. An interesting solution is to use `iframes`. Unfortunately it creates more problems than it solves. Maybe in the future I will do more in-depth tests.

Fortunately, the problem has already been solved by others smarter than me. I recommend reading these two stories, they are very informative:

- [Slack Engineering - Growing Pains: Migrating Slack’s Desktop App to BrowserView](https://slack.engineering/growing-pains-migrating-slacks-desktop-app-to-browserview/)
- [Figma - Introducing BrowserView for Electron](https://www.figma.com/blog/introducing-browserview-for-electron/)

Summarizing what I need, and what I believe the Browser Views can give me, is a method for:

- view pages external to Electron
- integrate these pages into the application
- use the ipcMain-ipcRenderer system from external pages

That said, go with the code!

### The graphical interface

{% include picture img="main-window.webp" ext="jpg" alt="" %}

The first thing I need is a button. For aesthetic reasons I created a `Card.svelte` component:

<script src="https://gist.github.com/el3um4s/8f6aaf45f930da93407ed09cdfde8fd1.js"></script>

The important part is the function to call on the `click`:

<script src="https://gist.github.com/el3um4s/013e81b5f9d9bae7ed38189b2d0fb241.js"></script>

I send the `openInNewWindow` command from the renderer with the details that interest me (the `link` of the page to open). But I have to create a special API.

### Add the WindowManager API

I create `src\electron\IPC\windowManager.ts`. First I import the core libraries of my API:

<script src="https://gist.github.com/el3um4s/48a194fd20feed249a52404e9060258a.js"></script>

Then I define the name to use to call it:

<script src="https://gist.github.com/el3um4s/d2e590b0dbdd39912038e049b49e976e.js"></script>

Then I define the open channels in output, the ones to be used to send the commands from the window

<script src="https://gist.github.com/el3um4s/afa6369bbe6a74dd1fbde61f76b7ccae.js"></script>

Then it's up to the incoming channels, the ones that can be used to send a response to the window. For simplicity in this example I leave the list empty:

<script src="https://gist.github.com/el3um4s/22a8152d8ff908d9f9d7ea11ec2d9fa4.js"></script>

Finally I initialize the API and export it:

<script src="https://gist.github.com/el3um4s/170e8cf406b8219b088d74437ec99445.js"></script>

### Define the commands to execute

Obviously this is not enough. I need to actually define the command to run. To do this I create the `openInNewWindow()` function:

<script src="https://gist.github.com/el3um4s/c1d96f781c1bdcb8774c0f7b53e92eca.js"></script>

This way if I click a button from the main window I can create a new window.

I have to point out one thing. I imported the module `src\electron\globals.ts` to make it easier to pass the url of the start page:

<script src="https://gist.github.com/el3um4s/fd4c5063ced9e8544ab5799d4bc6375e.js"></script>

This way I can call the main page from any module.

But I'm not done yet. I'd better give the new window some "special powers". At least the ability to use the titlebar buttons:

<script src="https://gist.github.com/el3um4s/8de9689c7acfb51fc1099593f819a409.js"></script>

All that remains is to add a Browser View to the new window. I call the `addBrowserView` and `setIpcMainView` methods:

<script src="https://gist.github.com/el3um4s/36423bb83a31b12f600c3870be047ace.js"></script>

### Create a BrowserWiew in Electron

Now I have to define these methods. To do I change the `CustomWindow` class (`src\electron\customWindow.ts`).

First I add the `browserView` property:

<script src="https://gist.github.com/el3um4s/27cf38d02eb288408d2667a57737bbd3.js"></script>

The general procedure for creating and adding the Browser View in Electron is this:

<script src="https://gist.github.com/el3um4s/317b3fbaf1c2ef207f5789e07d0eebfe.js"></script>

Starting from this I add a method to my class:

<script src="https://gist.github.com/el3um4s/f4f6211758fe804ff7984d1af3afa514.js"></script>

I have set the position to `x = 1` and `y = 32` because I want to leave space for the title bar in the main window.

There is a small detail to solve:

![electron-browser-view-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-20-come-usare-browser-view-con-electron/electron-browser-view-02.gif)

If I change the size of the window, the size of the Browser View does not change. And the dimensions are not what I want.

First I make sure the size is correct at startup using [BrowserWindow.getSize()](https://www.electronjs.org/docs/latest/api/browser-window#wingetsize)

<script src="https://gist.github.com/el3um4s/21d19d201d9fc8f4b6d19a134be31f1a.js"></script>

Then I use [BrowserView.setAutoResize(options)](https://www.electronjs.org/docs/latest/api/browser-view) to automatically change the size when the BrowserWindow changes:

<script src="https://gist.github.com/el3um4s/5ac8344899641d6af29c86f9757e1a97.js"></script>

![electron-browser-view-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-20-come-usare-browser-view-con-electron/electron-browser-view-02.gif)

To complete everything I have to allow the BrowserView to access the API:

<script src="https://gist.github.com/el3um4s/da636940c8afa19237e6ca5572ba4270.js"></script>

### Register WindowManager API

It is not enough to define the WindowManager API, I also need to enable it in `src\electron\preload.ts`:

<script src="https://gist.github.com/el3um4s/5e30a775bdf99ebef28da3406d5fa6b8.js"></script>

Finally I allow only the main window to create new windows. To do this I edit `src\electron\index.ts`:

<script src="https://gist.github.com/el3um4s/3061954be593525f4726a089038126ab.js"></script>

Well, after completing all these steps I can open a new window, with a BrowserView embedded, using a simple line of code:

<script src="https://gist.github.com/el3um4s/73ef04cefd077c4a6d45cf81bc91a64b.js"></script>

As usual, the project code is freely available on GitHub

- [el3um4s/memento-electron-browser-view](https://github.com/el3um4s/memento-electron-browser-view)

I also created a list with my articles on ElectronJS:

- [Electron Stories](https://el3um4s.medium.com/list/electron-stories-029651cc3a36)
