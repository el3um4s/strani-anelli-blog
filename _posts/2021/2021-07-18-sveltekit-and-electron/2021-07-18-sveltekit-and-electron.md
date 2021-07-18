---
title: "SvelteKit & Electron"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Fabio**](https://unsplash.com/@fabioha)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-07-18 12:00"
categories:
  - TypeScript
  - Svelte
  - Electron
tags:
  - TypeScript
  - Svelte
  - Electron
---

Il mio progetto di creare 3 template per Svelte è quasi giunto alla conclusione. Mancano ancora alcuni dettagli da sistemare ma posso dire di esserci, grosso modo. Il terzo e ultimo template riguarda [SvelteKit](https://kit.svelte.dev/), Electron e TypeScript. A differenza degli altri due, questo template ha un utilizzo un po' più specifico. Perché?

Perché non è necessario usare SvelteKit con Electron. Si possono ottenere gli stessi risultati con Svelte, e con meno complicazioni. Ma la mia intenzione è leggermente diversa. Mi piacerebbe rendere un po' più accattivante il sito con i miei esperimenti ([c3demo.stranianelli.com](https://c3demo.stranianelli.com/)) e nel contempo usare lo stesso codice per creare un'app offline, magari da pubblicare su Itch.io. Non voglio però perdere tutti i link e i collegamenti che ho già creato. Penso di poter fare questo usando SvelteKit.

![showcase-c3-projects.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-07-18-sveltekit-and-electron/showcase-c3-projects.gif)

Ma questo riguarda il (spero prossimo) futuro. Oggi voglio appuntarmi alcune cose su come integrare SvelteKit con Electron e TypeScript. Parto dalla struttura dei file, che è leggermente diversa dall'altro template:

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

La differenza principale è legata Svelte, ovviamente. Il modo più rapido e semplice che ho trovato è di creare un "progetto SvelteKit" dentro una cartella a parte. In pratica si tratta di creare la cartella `Svelte` e dalla shell usare il comando

```bash
npm init svelte@next
npm install
```

In questo modo tengo lo sviluppo del frontend separato da Electron. Electron, d'altro canto, è praticamente identico al progetto precedente. L'unica differenza è nell'aggiunta della possibilità di avere uno splash screen al momento dell'avvio:

![splashscreen.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-07-18-sveltekit-and-electron/svelte-kit-04-splashscreen.gif)

Un'altra modifica è l'aggiunta della classe `configureDev.ts` in modo da semplificare lo sviluppo dell'applicazione. In pratica posso aggiungere sul file `index.ts` il codice seguente:

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

Modificando le varie opzioni è possibile usare il comando

```bash
nodemon
```

per usare il template in vari scenari.

Per poter usare i file generati con SvelteKit ho dovuto ricorrere a un trucco. Invece di usare `win.loadURL('file://…')` ho deciso di usare [electron-serve](https://www.npmjs.com/package/electron-serve):

```ts
const loadURL = serve({ directory: "dist/www" });
loadURL(mainWindow)
```

![splashscreen.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-07-18-sveltekit-and-electron/svelte-kit-05-sveltekit.gif)

Oltre a richiamare direttamente le varie pagine HTML generate da SvelteKit posso anche usare una specie di mini-router personalizzato. È sufficiente [`<svelte:component>`](https://svelte.dev/docs#svelte_component):

```ts
import PageA from "./pageA.svelte";
import PageB from "./pageB.svelte";
import PageC from "../others/pageC.svelte";

let page = PageA;
```

```html
<button on:click="{() => page=PageB}">Go to PageB</button>
<svelte:component this={page} />
```

![rendere.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-07-18-sveltekit-and-electron/svelte-kit-07-renderer.gif)

Infine, nel template ho aggiunto la possibilità di salvare gli item della sezione "To Do" direttamente su disco. Non è un aspetto fondamentale ma serve a me per ricordarmi come usare l'[API fs di NodeJs](https://nodejs.org/api/fs.html)

![to do](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-07-18-sveltekit-and-electron/svelte-kit-08-todos.gif)

Per oggi è tutto. Lo so che questo post è meno tecnico rispetto gli ultimi ma tutto il codice è disponibile su GitHub:

- [MEMENTO - Svelte, Electron & TypeScript](https://github.com/el3um4s/memento-svelte-electron-typescript)

Ricordo inoltre l'indirizzo del mio Patreon:

- [Patreon](https://www.patreon.com/el3um4s)