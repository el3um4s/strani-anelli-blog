---
title: "SvelteKit & Electron (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Fabio**](https://unsplash.com/@fabioha)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-07-18 23:00"
categories:
  - TypeScript
  - Svelte
  - Electron
tags:
  - TypeScript
  - Svelte
  - Electron
---

I have almost completed my idea of creating 3 templates for Svelte & Electron. There are still some details to fix but the main aspects are ok. The third and final template concerns [SvelteKit](https://kit.svelte.dev/), Electron and TypeScript. Unlike the other two, this template has a more specific use. Why?

Because it is not necessary to use SvelteKit with Electron. I can get the same results with Svelte, and with fewer complications. My intention is slightly different. I'd like to make my blog a little more engaging, especially the [c3demo.stranianelli.com](https://c3demo.stranianelli.com/) section. I'd like to use the same code to create an offline application to publish on itchio. I think SvelteKit is suitable for this purpose.

![showcase-c3-projects.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-07-18-sveltekit-and-electron/showcase-c3-projects.gif)

But this is about the future. Today I want to write down some things on how to integrate SvelteKit with Electron and TypeScript. I start from the file structure, which is different from the other template:

```
root
├──electron
│   ├──IPC
│   │   └──...
│   ├──index.ts
│   ├──mainWindow.ts
│   ├──preload.ts
│   └──configureDev.ts
├──svelte
│   ├──src
│   │   ├──lib
│   │   │   ├──components
│   │   │   │   └──...
│   │   │   ├──header
│   │   │   │   └──...
│   │   │   └──...
│   │   ├──routes
│   │   │   ├──help
│   │   │   │   └──...
│   │   │   ├──todos
│   │   │   │   └──...
│   │   │   ├──__layout.svelte
│   │   │   ├──about.svelte
│   │   │   └──index.svelte
│   │   ├──app.css
│   │   ├──app.html
│   │   └──global.d.ts
│   ├──static
│   │   ├──favicon.png
│   │   └──loading.html
│   ├──svelte.config.js
│   └──tsconfig.json
├──package.json
├──tsconfig.json
├──nodemon.json
├──icon.ico
└──dev-app-update.yml
```

The main difference is Svelte related, of course. The quickest and easiest way I found is to create a "SvelteKit project" inside a separate folder. I create the `Svelte` folder and from the shell:

```bash
npm init svelte@next
npm install
```

This way I keep the frontend development separate from Electron. Electron, on the other hand, is virtually identical to the previous design. The only difference is in the addition of the ability to have a splash screen at boot time:

![splashscreen.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-07-18-sveltekit-and-electron/svelte-kit-04-splashscreen.gif)

Another change is the addition of the `configureDev.ts` class to simplify application development. I can add the following code to the `index.ts` file:

```ts
const developerOptions = {
  isInProduction: true,    // true if is in production
  serveSvelteDev: false,    // true when you want to watch svelte 
  buildSvelteDev: false,     // true when you want to build svelte
  watchSvelteBuild: false,   // true when you want to watch build svelte 
};

const windowSettings = {
  title:  "MEMENTO - SvelteKit, Electron, TypeScript",
  width: 854,
  height: 854
}

let main = new Main(windowSettings, developerOptions);
```

By modifying the various options I can use the command

```bash
nodemon
```

to use the template in various scenarios.

In order to use files generated with SvelteKit I have to use a trick. Instead of using `win.loadURL('file://…')` I decided to use [electron-serve](https://www.npmjs.com/package/electron-serve):

```ts
const loadURL = serve({ directory: "dist/www" });
loadURL(mainWindow)
```

![splashscreen.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-07-18-sveltekit-and-electron/svelte-kit-05-sveltekit.gif)

I can directly call the various HTML pages generated by SvelteKit. Or I can also use some kind of custom mini-router. Just [`<svelte:component>`](https://svelte.dev/docs#svelte_component):

```ts
import PageA from "./pageA.svelte";
import PageB from "./pageB.svelte";
import PageC from "../others/pageC.svelte";

let page = PageA;
```

and in HTML

```html
<button on:click="{() => page=PageB}">Go to PageB</button>
<svelte:component this={page} />
```

![rendere.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-07-18-sveltekit-and-electron/svelte-kit-07-renderer.gif)

Finally, I added the possibility to save the items of the "To Do" section directly to disk. It is not a fundamental aspect but I need to remember how to use the [NodeJs fs API]((https://nodejs.org/api/fs.html)).

![to do](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-07-18-sveltekit-and-electron/svelte-kit-08-todos.gif)

I know this post is less technical than the last ones but all the code is available on GitHub:

- [MEMENTO - Svelte, Electron & TypeScript](https://github.com/el3um4s/memento-sveltekit-electron-typescript)

And this is Patron's address

- [Patreon](https://www.patreon.com/el3um4s)