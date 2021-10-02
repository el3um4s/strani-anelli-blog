---
title: "Come creare una finestra Electron senza titlebar"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-09-30 13:00"
categories:
  - Svelte
  - Tailwind
  - GitHub
  - TypeScript
tags:
  - NPM
  - GitHub
  - TypeScript
  - Svelte
  - Tailwind
---

Andando avanti con il mio progetto personale mi sono accorto di mal sopportare la finestra generata automaticamente da Electron. Ho deciso quindi di personalizzala togliendo la titlebar di default e creandone una mia personale. In rete ci sono vari tutorial e guide. Quella di [Ronnie Dutta](https://github.com/binaryfunt/electron-seamless-titlebar-tutorial) è particolarmente ben fatta: l'ho seguita e aggiornata alle ultime versioni di Electron.

### Aggiorno le dependencies

Ma prima di cominciare una piccola precisazione. Non parto da zero ma continuo a usare il mio template [el3um4s/memento-svelte-electron-typescript](https://github.com/el3um4s/memento-svelte-electron-typescript). E come al solito per prima cosa mi assicuro di avere tutte le dependencies aggiornate all'ultima versione:

```bash
npm run check-updates
```

### Creo una finestra senza titlebar

Dopo aver aggiornato è il momento di modificare la finestra creata da Electron. Mi assicuro di creare la finestra impostando come proprietà `frame = false`:

```js
const settings = {
//...
  frame: false,
  backgroundColor: '#FFF'
//...
}
let window = new BrowserWindow({...settings})
```

### Aggiungo gli stili base

Per questioni estetiche aggiungo alcuni stili base al file `tailwind.pcss`: 

```pcss
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

/** Modify your Tailwind layers etc. here **/
@layer base {
  * {
    @apply m-0 p-0 border-0 align-baseline;
  }
  html,
  body {
    @apply flex relative w-full h-full m-0 box-border text-gray-900;
  }
  body {
    @apply overflow-y-hidden;
  }
}
```

L'unica classe un po' criptica potrebbe essere `overflow-y-hidden`. Serve per nascondere la scrollbar dalla finestra Electron. Userò, tra poco, una scrollbar personalizzata attaccata alla sezione principale della pagina.

Se adesso provo ad avviare l'app con `npm run dev` ottengo una finestra così:

{% include picture img="first-test.webp" ext="jpg" alt="" %}

Qual è il problema? Che una finestra senza titlebar non ha i pulsanti di chiusura e non può essere spostata. È il momento di aggiungere una titlebar personalizzata.

### Creo una titlebar personalizzata

Facendo un po' di prove il modo migliore pare essere di creare un componente `src/frontend/Componentes/MainWithTitlebar.svelte` in cui inserire sia la titlebar che la sezione main della pagina.

Inizio con lo creare la struttura base:

```html
<header />

<main>
  <slot />
</main>
```

Aggiungo quindi il componente a `App.svelte`:

```html
<script lang="ts">
  import "./css/tailwind.pcss";
  import MainWithTitlebar from "./Components/MainWithTitlebar.svelte";
</script>

<MainWithTitlebar>
  <p>
    Visit the <a
      href="https://github.com/el3um4s/memento-svelte-electron-typescript"
      class="btn-orange hover:no-underline">Repository</a
    > to view the source code.
  </p>
</MainWithTitlebar>
```

Ovviamente questo non provoca nessun cambiamento tangibile alla finestra. Devo aggiungere alcuni stili al mio componente:

<style lang="postcss">
  header {
    @apply block fixed w-full h-8 p-1 bg-gray-50 text-red-900 font-bold;
  }

  main {
    @apply mt-8 p-5 overflow-y-auto w-full border border-red-900;
    height: calc(100% - theme("spacing.8"));
  }
</style>

Fisso l'altezza dell'header a 32px usando la classe `h-8` di Tailwind e imposto di conseguenza l'altezza della pagina sottostante:

```css
main {
  height: calc(100% - theme("spacing.8"));
}
```

{% include picture img="first-test.webp" ext="jpg" alt="" %}

Non basta impostare una titlebar per poter spostare una finestra. Fortunatamente Electron permette di abilitare questa possibilità abbastanza agevolmente. Basta aggiungere lo stile CSS `-webkit-app-region: drag`:

```html
<header>
  <div class="drag-region"></div>
</header>
<style lang="postcss">
  .drag-region {
    @apply w-full h-full;
    grid-template-columns: auto 138px;
    -webkit-app-region: drag;
  }
</style>
```

### Aggiungo i pulsanti di controllo della finestra

Adesso la finestra si può muovere. Ma mi interessa anche poterla chiudere, ridurre a icone e ingrandire. Per farlo mi servono alcuni pulsanti. Imposto la struttura dentro cui inserirli:

```html
<div class="window-controls">
  <div class="button">Minimize</div>
  <div class="button">Maximize</div>
  <div class="button">Close</div>
</div>

<style lang="postcss">
.window-controls {
  @apply grid grid-cols-3 absolute top-0 right-2 h-full gap-2 select-none;
  -webkit-app-region: no-drag;
}
.button {
  @apply row-span-1 flex justify-center items-center w-full h-full;
}
.button:hover {
  @apply bg-red-600;
}
</style>
```

Imposto l'area dei pulsanti come `no-drag` per rendere più semplice cliccare sui pulsanti stessi. E a proposito di pulsanti, nel codice sopra ho usato delle scritte ma forse è meglio usare delle icone. Tailwind permette di usare facilmente le icone di [heroicons](https://heroicons.com/). Ne approfitto e creo alcuni componenti Svelte per visualizzare le icone. Questo, per esempio, è il componente `IconClose.svelte`:

```html
<script lang="ts">
  let customClass: string = "h-5 w-5";
  export { customClass as class };
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  class={customClass}
  viewBox="0 0 20 20"
  fill="currentColor"
>
  <path
    fill-rule="evenodd"
    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
    clip-rule="evenodd"
  />
</svg>
```

Gli altri componenti sono simili. La cosa bella è che è molto semplice inserire le icone nella finestra:

```html
<script lang="ts">
  import IconMinimize from "./Icons/IconMinimize.svelte";
  import IconMaximize from "./Icons/IconMaximize.svelte";
  import IconClose from "./Icons/IconClose.svelte";
</script>

<header>
  <div class="drag-region">
    <div class="window-controls">
      <div class="button">
        <IconMinimize />
      </div>
      <div class="button">
        <IconMaximize />
      </div>
      <div class="button">
        <IconClose />
      </div>
    </div>
  </div>
</header>
```

### Aggiungo il titolo alla finestra

Ci possono essere diversi modi per aggiungere il titolo a una finestra. Per il mio repository ho deciso di fare una cosa semplice:

```html
<script lang="ts">
  export let title: string = "Title";
</script>

<header>
  <div class="drag-region">
    <div class="window-title">
      <span>{title}</span>
    </div>
</header>

<style lang="postcss">
.window-title {
  @apply flex items-center left-2 overflow-hidden font-sans text-base;
}

.window-title span {
  @apply overflow-hidden overflow-ellipsis whitespace-nowrap leading-6;
}
</style>
```

{% include picture img="3-test.webp" ext="jpg" alt="" %}

### Personalizzare la scroollbar

Electron mostra di default la scrollbar di Chrome. Però già che ci sono, che sto personalizzando la finestra, modifico anche i colori della scrollbar verticale. Basta aggiungere una manciata di CSS:

```pcss
main::-webkit-scrollbar {
  @apply w-4;
}

main::-webkit-scrollbar-track {
  @apply bg-red-900;
}

main::-webkit-scrollbar-thumb {
  @apply bg-red-500 border-2 border-red-900 border-solid;
}

main::-webkit-scrollbar-thumb:hover {
  @apply bg-red-300;
}
```

Questo è il risultato:

{% include picture img="4-test.webp" ext="jpg" alt="" %}

### Abilitare i pulsanti

Se clicco sui pulsanti non succede nulla. Anche perché non ho aggiunta nessuna funzione. Risolvo subito:

```html
<script lang="ts">
  function minimize() {}
  function maximize() {}
  function close() {}
</script>

<div class="window-controls">
  <div class="button" on:click={minimize}>
    <IconMinimize />
  </div>
  <div class="button" on:click={maximize}>
    <IconMaximize />
  </div>
  <div class="button" on:click={close}>
    <IconClose />
  </div>
</div>
```

Ovviamente le funzioni vanno riempite di codice. Cosa posso usare? Devo usare una api specifica da inserire nella parte di codice di competenza di Electron. Creo il file `src/electron/IPC/windowControl.ts`:

```ts
import { SendChannels } from "./General/channelsInterface";
import IPC from "./General/IPC";
import { BrowserWindow } from "electron";

const nameAPI = "windowControls";

const validSendChannel: SendChannels = {
  "minimize": minimize,
  "maximize": maximize,
  "unmaximize": unmaximize,
  "close": close
};

const validReceiveChannel: string[] = [];

const windowControls = new IPC ({
  nameAPI,
  validSendChannel,
  validReceiveChannel
});

export default windowControls;

function minimize(customWindow: BrowserWindow, event: Electron.IpcMainEvent, message: string) {
  customWindow.minimize();
}

function maximize(customWindow: BrowserWindow, event: Electron.IpcMainEvent, message: string) {
  customWindow.maximize();
}

function close(customWindow: BrowserWindow, event: Electron.IpcMainEvent, message: string) {
  customWindow.destroy();
}

function unmaximize(customWindow: BrowserWindow, event: Electron.IpcMainEvent, message: string) {
  customWindow.unmaximize()
}
```

Registro quindi la mia nuova API su `src/electron/preload.ts`:

```ts
import { generateContextBridge } from "./IPC/General/contextBridge"

import systemInfo from "./IPC/systemInfo";
import updaterInfo from './IPC/updaterInfo';
import windowControls from './IPC/windowControls'

generateContextBridge([systemInfo, updaterInfo, windowControls]);
```

Infine abilito la finestra principale di Electron ad accedervi modificando il file `src/electron/index.ts`:

```ts
//...
import windowControls from './IPC/windowControls';

async function createMainWindow() {
  mainWindow = new CustomWindow();
  const urlPage = path.join(__dirname, 'www', 'index.html');
  mainWindow.createWindow(urlPage);
  await mainWindow.setIpcMain([systemInfo, updaterInfo, windowControls]);
}
```

Bene, questo mi permette di tornare sul componente su cui sto lavorando (`MainWithTitlebar.svelte`) e aggiungere le funzioni mancanti:

```js
function minimize() {
  globalThis.api.windowControls.send("minimize", null);
}
function maximize() {
  globalThis.api.windowControls.send("maximize", null);
}
function close() {
  globalThis.api.windowControls.send("close", null);
}
```

Adesso posso usare i vari pulsanti per ridurre a icona, ingrandire e chiudere la finestra.

### Ripristinare le dimensioni della finestra

C'è però un comportamento anomalo. Quando ingrandisco la finestra mi piacerebbe sostituire l'icona `maximize` con un'altra. E magari poter ripristinare la dimensione originale della finestra quando clicco su quest'ultima.

Per ottenere questo risultato posso approfittare dell'elemento [`<svelte:window>`](https://svelte.dev/docs#svelte_window). Inserendolo nel mio componente Svelte posso intercettare alcuni eventi legati alla finestra senza lasciare il componente.

Perché devo fare questo? Perché non ho trovato un modo più semplice per capire quando la finestra è effettivamente a tutto schermo. Allora mi tocca ricorrere a un trucchetto: controllo la dimensione della finestra. Se la finestra è grande almeno quanto lo schermo allora ipotizzo che sia massimizzata. In caso contrario no.

Scrivendolo in codice:

```html
<script>
let outerW = globalThis.outerWidth - 8;
let isMaximized = outerW >= globalThis.screen.availWidth;

$: {
  isMaximized = outerW >= globalThis.screen.availWidth;
}
</script>

<svelte:window bind:outerWidth={outerW} />
```

In Svelte, [`$:` marks a statement as reactive](https://svelte.dev/docs#3_$_marks_a_statement_as_reactive): questo semplifica di molto il codice necessario.

Adesso non mi resta che aggiungere una funzione

```js
function unmaximize() {
  globalThis.api.windowControls.send("unmaximize", null);
}
```

e completare il componente:

```html
<header>
  <div class="drag-region">
    <div class="window-title">
      <span>{title}</span>
    </div>
    <div class="window-controls">
      <div class="button" on:click={minimize}>
        <IconMinimize />
      </div>
      {#if isMaximized}
        <div class="button" on:click={unmaximize}>
          <IconUnmaximize />
        </div>
      {:else}
        <div class="button" on:click={maximize}>
          <IconMaximize />
        </div>
      {/if}
      <div class="button" on:click={close}>
        <IconClose />
      </div>
    </div>
  </div>
</header>

<main>
  <slot />
</main>
```

### Link

Questo è tutto. Per finire un po' di link utili:

- il progetto su GitHub: [el3um4s/memento-svelte-electron-typescript](https://github.com/el3um4s/memento-svelte-electron-typescript)
- il mio Patreon: [patreon.com/el3um4s](https://patreon.com/el3um4s)
- [Svelte](https://svelte.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [ElectronJS](https://www.electronjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
