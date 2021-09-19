---
title: "Tailwind CSS & Svelte (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Marek Piwnicki**](https://unsplash.com/@marekpiwnicki)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-09-18 22:00"
categories:
  - Svelte
  - Tailwind CSS
tags:
  - Svelte
  - Tailwind
  - CSS
  - TailwindCSS
---

As I said a few days ago I decided to focus on some more complex projects. The first is "GEST - Dashboard". Bad enough name, but I'll change it later. I need a tool to open web applications on offline pc. In my head each web application will be a folder containing all the files. I'll use Electron in combination with Svelte and Tailwind. There are some interesting problems that I am running into. One of them is how to integrate TailwindCSS with Svelte.

I found some tutorials on the internet but a lot of them are out of date. There is one well done, by [sarioglu](https://dev.to/sarioglu): [Using Svelte with Tailwindcss - A better approach](https://dev.to/sarioglu/using-svelte-with-tailwindcss-a-better-approach-47ph). It is also worth taking a look at the [dionysiusmarquis/svelte-tailwind-template](https://github.com/dionysiusmarquis/svelte-tailwind-template) repository. I was very inspired by these posts. These are the steps I take to integrate Svelte with Tailwind

I start from my [MEMENTO - Svelte Electron Typescript](https://github.com/el3um4s/memento-svelte-electron-typescript). First I check which packages that need to be updated since the last time I worked on it:

```bash
npm outdated
```

{% include picture img="npm-outdated.webp" ext="jpg" alt="" %}

So I update everything:

```bash
npm update
```

I want to update everything to the latest version (it's a bit risky, I could break something accidentally, also because I haven't implemented a reliable test system yet). I use `npm install <packagename>@latest`

```bash
npm install @rollup/plugin-commonjs@latest @rollup/plugin-node-resolve@latest electron@latest electron-reload@latest
```

This generates some errors and warnings:

```
src/electron/mainWindow.ts:38:9 - error TS2322: Type '{ enableRemoteModule: true; }' is not assignable to type 'WebPreferences'.
Object literal may only specify known properties, and 'enableRemoteModule' does not exist in type 'WebPreferences'.
```

```
(node:15840) electron: The default of nativeWindowOpen is deprecated and will change from false to true in Electron 15
```

I fix it by changing the `mainWindow.ts` module:

```ts
//...
let window = new BrowserWindow({
  ...settings,
  show: false,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    nativeWindowOpen: true,
    preload: path.join(__dirname, "preload.js")
  }
});
//...
```

Now it's time to switch to Tailwind. I need some packages. To start [TailwindCSS](https://tailwindcss.com/):

```bash
npm i -D tailwindcss
```

Then something to handle [PostCSS](https://github.com/postcss/postcss):

```bash
npm i -D postcss postcss-load-config autoprefixer rollup-plugin-postcss
```

Once done I begin to configure the project to be able to use Tailwind in combination with Svelte and Electron. I need 2 additional files: `tailwind.config.js` and `postcss.config.js`. I create them:

**tailwind.config.js**:

```js
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```

**postcss.config.js**:

```js
const plugins = [require('tailwindcss')]
module.exports = {
  plugins
}
```

Then I have to configure **rollup** to be able to manage PostCSS files. I modify the `rollup.config.js` by adding:

```js
//...
import postcss from 'rollup-plugin-postcss';

//...

export default {
  //...
  plugins: [
    //...
    // To be able to import css files inside svelte `<script>`
    postcss({ extract: 'base.css' }),
    //...
  ]
  //...
}
```

This allows me to generate a `base.css` file dedicated to Tailwind. I have to tell the `index.html` file where to find it. So I add this line to the main html file:

```html
<link rel='stylesheet' href='build/base.css'>
```

There is still one thing missing in the project: some style of TailwindCSS. I start by creating a `css/tailwind.pcss` file. I use a separate file to speed up testing when writing graphics components.

```pcss
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

/** Modify your Tailwind layers etc. here **/
@layer base {
  h1 {
    @apply text-2xl;
  }
  h2 {
    @apply text-xl;
  }
}

@layer components {
  .btn-orange {
    @apply py-2 px-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75;
  }
}
```

Then I import the file into `App.svelte`:

```html
<script>
  import './css/tailwind.pcss'
</script>
```

Now I can use Tailwind, for example by adding the `btn-orange` class to the links:

```html
<p>
  Visit the <a href="https://svelte.dev/tutorial" class="btn-orange">Svelte tutorial</a> to learn how to build Svelte apps.
</p>
```

Finally, the link to the repository is [el3um4s/memento-svelte-electron-typescript](https://github.com/el3um4s/memento-svelte-electron-typescript).  Instead on [patreon.com/el3um4s](https://patreon.com/el3um4s) there is my Patreon profile.
