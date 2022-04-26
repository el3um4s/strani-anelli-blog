---
title: "Usare Mappe SVG con HTML, JavaScript e Svelte"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-04-22 16:00"
categories:
  - Maps
  - JavaScript
  - Svelte
  - TypeScript
  - Svelte
tags:
  - Maps
  - JavaScript
  - Svelte
  - TypeScript
  - Svelte
---

Uno dei vantaggi dei file SVG è la possibilità di modificarli con JavaScript in una pagina HTML. Per semplificare il processo creo una piccola app con [Svelte](https://svelte.dev/) in cui è possibile caricare un file SVG, modificarlo e poi salvarlo nuovamente su disco.

### Aprire un file SVG con HTML

Per prima cosa creo un pulsante per selezionare il file da caricare e un elemnto html dove mostrare il file

```svelte
<script lang="ts">
  import { tick } from "svelte";

  let src: string;
  let divSVG: HTMLDivElement;

  const onFileSelected = async (e) => {
    let file = e.target.files[0];

    src = null;
    await tick();
    src = await file.text();
    await tick();

    const svg = divSVG.getElementsByTagName("svg")[0];
    const viewBoxWidth = parseFloat(svg.getAttribute("width"));
    const viewBoxHeight = parseFloat(svg.getAttribute("height"));
    const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;
    svg.setAttribute("viewBox", viewBox);
  };
</script>

<main>
  <input type="file" accept=".svg" on:change={(e) => onFileSelected(e)} />
  {#if src}
  <div class="svg" bind:this="{divSVG}" style:width="100vw" style:height="80vh">
    {@html src}
  </div>
  {/if}
</main>
```

Dopo aver selezionato il file ottengo qualcosa simile a questo:

{% include picture img="svg-in-html.webp" ext="jpg" alt="" %}

### Come zoomare e muovere mappe SVG

Per alcune mappe può bastare una visuale complessiva ma in questo caso mi interessa poter zoomare su alcuni elementi. E, ovviamente, anche potermi muovere all'interno della mappa.

Per fare questo posso usare il codice del repository [luncheon/svg-pan-zoom-container](https://github.com/luncheon/svg-pan-zoom-container). Installo il pacchetto usando:

```bash
npm i svg-pan-zoom-container
```

Quindi modifico il mio codice:

```svelte
<script lang="ts">
  import "svg-pan-zoom-container";
</script>

<div
  class="svg"
  bind:this={divSVG}
  style:width="100vw"
  style:height="80vh"
  data-zoom-on-wheel="min-scale: 0.3; max-scale: 20;"
  data-pan-on-drag="button: left;modifier: Control"
>
  {@html src}
</div>
```

L'attributo `data-zoom-on-wheel` abilita lo `zoom` con la rotellina del mouse. Imposto come _scala minima 0.3_ e come _scala massima 20_. L'attributo `data-pan-on-drag` abilita lo spostamento con il mouse. In questo caso imposto che lo spostamento avviene usando la combinazione tasto `control` più `tasto sinistro del mouse`.

![zoom-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-04-22-usare-mappe-svg-con-svelte/zoom-01.gif)

Oltre all rotellina del mouse è utile avere anche un pulsante o qualcosa di simile per gestire lo zoom. Posso, per esempio creare un elemento `input` di tipo `range`, collegando il suo valore alla variabile `scale`

```html
<script>
  let scale = 1;
</script>
<input type="range" min="0.3" max="20" step="1" bind:value="{scale}" />
```

Per passare la scala dalla mappa all'elemento aggiungo [`MutationObserver`](https://github.com/luncheon/svg-pan-zoom-container#observation):

```js
import { getScale, setScale, resetScale } from "svg-pan-zoom-container";

let observer;

const onFileSelected = async (event) => {
  // ...
  observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      scale = getScale(divSVG);
    });
  });

  observer.observe(divSVG.firstElementChild, {
    attributes: true,
    attributeFilter: ["transform"],
  });
};
```

Aggiungo poi un nuovo evento all'elemento `input[range]` per poter modificare lo zoom in maniera dinamica:

```svelte
<input
  type="range"
  min="0.3"
  max="20"
  step="1"
  bind:value={scale}
  on:input={(e) => {
    setScale(divSVG, scale, { minScale: 0.3, maxScale: 20 });
  }}
/>
```

Il risultato è simile a questo:

![zoom-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-04-22-usare-mappe-svg-con-svelte/zoom-02.gif)

Infine, posso aggiungere un pulsante per resettare la scala e tornare a quella originaria:

```html
<button
  on:click={(e) => {
    resetScale(divSVG);
  }}>Reset Scale</button
>
```

![zoom-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-04-22-usare-mappe-svg-con-svelte/zoom-03.gif)
