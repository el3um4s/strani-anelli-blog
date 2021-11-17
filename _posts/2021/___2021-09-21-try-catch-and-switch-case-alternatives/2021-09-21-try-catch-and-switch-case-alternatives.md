---
title: "Tailwind CSS & Svelte"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Marek Piwnicki**](https://unsplash.com/@marekpiwnicki)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-09-18 19:00"
categories:
  - Svelte
  - Tailwind CSS
tags:
  - Svelte
  - Tailwind
  - CSS
  - TailwindCSS
---


https://medium.com/weekly-webtips/functional-try-catch-in-javascript-8b9923c3e395

  devo unire questo:
    - https://github.com/coderaiser/try-to-catch  - per async functions
    - https://github.com/coderaiser/try-catch - per funzioni normali
  da guardare anche:
    - https://github.com/riophae/better-try-catch


Come dicevo già qualche giorno fa ho deciso di concentrarmi su alcuni progetti più complessi. Il primo è "GEST - Dashboard". Nome abbastanza brutto, lo ammetto, ma farò in tempo a cambiarlo più avanti. Mi serve uno strumento per aprire su pc offline delle applicazioni web. Nella mia testa ogni applicazione web sarà una cartella contenente tutti i file (oppure un file compresso, non ho ancora deciso) e verrà visualizzata in una finestra. Userò Electron in combinazione con Svelte e Tailwind. Ci sono alcuni problemi interessanti che sto incontrando. Uno di questi riguarda proprio come integrare TailwindCSS con Svelte.

In rete ho trovato alcuni tutorial ma non tutti sono aggiornati. Ce n'è però uno ben fatto, di [sarioglu](https://dev.to/sarioglu): [Using Svelte with Tailwindcss - A better approach](https://dev.to/sarioglu/using-svelte-with-tailwindcss-a-better-approach-47ph). Inoltre vale anche la pena di dare un'occhiata al repository [dionysiusmarquis/svelte-tailwind-template](https://github.com/dionysiusmarquis/svelte-tailwind-template) Mi sono ispirato molto a questo pezzo, riporto qui i passaggi che ho fatto io e che paiono funzionare.

Parto dal mio repository [MEMENTO - Svelte Electron Typescript](https://github.com/el3um4s/memento-svelte-electron-typescript). Per prima cosa controllo quali pacchetti vanno aggiornati dall'ultima volta che ci ho lavorato:

```bash
npm outdated
```

{% include picture img="npm-outdated.webp" ext="jpg" alt="" %}

Quindi aggiorno tutto:

```bash
npm update
```

Voglio aggiornare tutto all'ultima versione (è un po' rischioso, potrei rompere qualcosa in maniera accidentale, anche perché non ho ancora implementato un sistema di test affidabili), quindi uso `npm install <packagename>@latest`

```bash
npm install @rollup/plugin-commonjs@latest @rollup/plugin-node-resolve@latest electron@latest electron-reload@latest
```

Questo genera alcuni errori e warning:

```
src/electron/mainWindow.ts:38:9 - error TS2322: Type '{ enableRemoteModule: true; }' is not assignable to type 'WebPreferences'.
Object literal may only specify known properties, and 'enableRemoteModule' does not exist in type 'WebPreferences'.
```

```
(node:15840) electron: The default of nativeWindowOpen is deprecated and will be changing from false to true in Electron 15
```

Correggo cambiando il modulo `mainWindow.ts`:

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

Adesso è il momento di passare a Tailwind. Mi servono alcuni pacchetti. Per cominciare [TailwindCSS](https://tailwindcss.com/):

```bash
npm i -D tailwindcss
```

Poi qualcosa per gestire [PostCSS](https://github.com/postcss/postcss):

```bash
npm i -D postcss postcss-load-config autoprefixer rollup-plugin-postcss
```

Fatto ciò comincio a configurare il progetto per poter usare Tailwind in combinazione con Svelte e con Electron. Mi servono 2 file aggiuntivi: `tailwind.config.js` e `postcss.config.js`. Li creo:

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

Devo poi configurare **rollup** per poter gestire i file PostCSS. Modifico quindi `rollup.config.js` aggiungendo:

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

Questo mi permette di generare un file `base.css` dedicato a Tailwind. Devo però dire al file `index.html` dove trovarlo. Aggiungo quindi al file html principale questa riga:

```html
<link rel='stylesheet' href='build/base.css'>
```

Manca ancora una cosa da aggiungere nel progetto: qualche stile di TailwindCSS. Comincio con il creare un file `css/tailwind.pcss`. Uso un file separato per velocizzare i test in fase di scrittura delle componenti grafiche.

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

Importo quindi il file in `App.svelte`:

```html
<script>
  import './css/tailwind.pcss'
</script>
```

Adesso posso usare Tailwind, per esempio aggiungendo la classe `btn-orange` ai link:

```html
<p>
  Visit the <a href="https://svelte.dev/tutorial" class="btn-orange">Svelte tutorial</a> to learn how to build Svelte apps.
</p>
```

Per finire, il link al repository è [el3um4s/memento-svelte-electron-typescript](https://github.com/el3um4s/memento-svelte-electron-typescript). Invece su [patreon.com/el3um4s](https://patreon.com/el3um4s) c'è il mio profilo Patreon.