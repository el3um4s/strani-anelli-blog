---
title: "4 Modi per Mostrare Codice in Svelte"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-10-31 20:00"
categories:
  - Svelte
  - SvelteKit
  - Components
tags:
  - Svelte
  - SvelteKit
  - Components
---

Prima o poi dovrò decidermi a riscrivere completamente il codice del mio blog. Due anni fa sono passato da WordPress a Jekyll: è stata una buona scelta. Ma più approfondisco [Svelte](https://svelte.dev/) più sono curioso di vedere cosa posso tirare fuori. L'ultima cosa su cui mi sono appassionato è sul come mostrare snippet di codice in Svelte. Con mio stupore non pare un argomento molto approfondito, ma penso di aver trovato 4 modi che possono fare al mio caso.

### PrismJS e Svelte

Il primo metodo prevede di usare [Prismjs](https://prismjs.com/) direttamente in una pagina in formato Markdown. Come esempio uso il mio template [MEMENTO - SvelteKit & GitHub Pages](https://github.com/el3um4s/memento-sveltekit-and-github-pages). In questo progetto le pagine del blog sono dei file `md` (markdown). Ogni pagina nella cartella `blog` è per l'appunto un post di un ipotetico blog. E la scrittura del codice avviene usando quello che viene chiamato `code fencing`:

<script src="https://gist.github.com/el3um4s/a58307d7ebc0924c45a7f4607328d816.js"></script>

Quello che voglio ottenere è far si che il codice venga visualizzato in maniera simile a questa:

<script src="https://gist.github.com/el3um4s/6b600b4003767d1ac94991a7edb55384.js"></script>

Come fare? Per prima cosa importo Prism nel mio template usando:

```bash
npm i -D prismjs
```

Posso usarlo direttamente in un file Svelte ma conviene inserirlo una sola volta, nel file `__layout__`: in questo modo ogni pezzo di codice apparirà alla stessa maniera in ogni pagina del blog.

<script src="https://gist.github.com/el3um4s/781486671ddf869c50cfc1820f63ddfa.js"></script>

{% include picture img="prism-01.webp" ext="jpg" alt="" %}

In base al tema del blog posso decidere se cambiare il tema utilizzato per mostrare i codici. Posso anche usare un tema personalizzato, magari il `Dracula`. Per usarlo importo [prism-themes](https://www.npmjs.com/package/prism-themes) con il comando:

```bash
npm i -D prism-themes
```

e quindi importo il tema nel file con:

```js
import "prism-themes/themes/prism-dracula.css";
```

{% include picture img="prism-02.webp" ext="jpg" alt="" %}

### Svelte-Prism

Il secondo metodo è utilizzare un componente Svelte: [svelte-prism](https://github.com/jakobrosenberg/svelte-prism). Questo componente di [Jakob Rosenberg](https://github.com/jakobrosenberg) è molto comodo se si lavora all'interno di un file con estensione `.svelte`. Perché? Perché in questo caso non posso usare la sequenza di 3 backtick.

Per prima cosa installo il componente con:

```bash
npm i -D svelte-prism
```

Poi importo il componente dove mi serve:

<script src="https://gist.github.com/el3um4s/b2ce146321ba67d7420f2a14f1a38544.js"></script>

Il risultato finale è pressoché identico al primo esempio:

{% include picture img="prism-03.webp" ext="jpg" alt="" %}

### Mostrare GitHub Gist in Svelte con easy-gist-async

Il terzo metodo è di usare i [GitHub Gist](https://gist.github.com/) per mostrare i vari snippet di codice. Il vantaggio è la possibilità di mostrare qualcosa di molto più bellino e ben curato. Lo svantaggio principale è che il codice da mostrare vive al di fuori del post: rende un po' più complicato modificarlo e consultarlo offline.

Normalmente sarebbe sufficiente creare un Gist e poi copiare il codice di importazione con il pulsante in alto a destra

{% include picture img="gist-01.webp" ext="jpg" alt="" %}

Il problema qual è? Che il codice da usare è in questo formato:

```html
<script src="https://gist.github.com/el3um4s/b2ce146321ba67d7420f2a14f1a38544.js"></script>
```

Si tratta di aggiungere un altro script js in una pagina (o componente) Svelte. Ma Svelte accetta solamente un elemento di tipo Script per componente. Occorre di conseguenza creare un nuovo componente.

Ho trovato due modi per farlo. Il primo prevede di usare il pacchetto npm [easy-gist-async](https://www.npmjs.com/package/easy-gist-async). Ovviamente lo installo con

```bash
npm i -D easy-gist-async
```

Poi creo un componente `AsyncGist.svelte`:

<script src="https://gist.github.com/el3um4s/2ad412b720c35942a51f9370a36c43d3.js"></script>

E quindi uso il mio nuovo componente nella mia pagina:

<script src="https://gist.github.com/el3um4s/541175c91687963b4df0df692644c49f.js"></script>

{% include picture img="gist-02.webp" ext="jpg" alt="" %}

Il risultato dipende molto dallo stile della pagina in cui viene importato il componente. Può essere una cosa buona per personalizzare l'aspetto ma per quello che serve a me è più un fastidio.

### Usare Gist.svelte

L'ultimo modo è una mia rielaborazione di questo [svelte.dev/repl](https://svelte.dev/repl/2d4d41df9f404b2d896bb81c55cb75c0?version=3.44.0). L'idea alla base è di creare un frame HTML attorno allo script importato: in questo modo vengono mantenuti gli stili originali. Rispetto al codice originale ho aggiunto un meccanismo per variare la grandezza del frame in base al contenuto. Penso sia più comodo e più utile.

Creo quindi il componente `Gist.svelte`:

<script src="https://gist.github.com/el3um4s/aa50a936acaff00cda51eea707bcd0bc.js"></script>

e lo uso nella mia pagina:

<script src="https://gist.github.com/el3um4s/cdebaacbc49465c70e63e6b4ba94146d.js"></script>

Il risulto che ottengo è

{% include picture img="gist-03.webp" ext="jpg" alt="" %}

### Per finire

Per finire posso mettere tutte queste tecniche una dopo l'altra e ottengo

<script src="https://gist.github.com/el3um4s/84829423977963e0674bfcb57b2c0770.js"></script>

{% include picture img="image.webp" ext="jpg" alt="" %}
