---
title: Livelli e selezioni in una mappa SVG
published: true
date: 2022-05-10 18:00
categories:
  - Maps
  - JavaScript
  - Svelte
  - TypeScript
tags:
  - Maps
  - JavaScript
  - Svelte
  - TypeScript
  - layers-and-selections-in-svg-map
lang: it
cover: image.webp
description: Usare file SVG per rappresentare delle mappe geografiche offre altri vantaggi, oltre alla possibilità di cambiare la scala e la posizione sulla mappa. Posso cambiare la visibilità dei vari livelli, oppure selezionare alcuni elementi ed evidenziarli con un colore diverso. Posso anche salvare tutte queste modifiche in modo da poter ottenere un nuovo file.
---

Usare file SVG per rappresentare delle mappe geografiche offre altri vantaggi, oltre alla possibilità di cambiare la scala e la posizione sulla mappa. Posso cambiare la visibilità dei vari livelli, oppure selezionare alcuni elementi ed evidenziarli con un colore diverso. Posso anche salvare tutte queste modifiche in modo da poter ottenere un nuovo file.

![selezione-e-livelli.gif](./selezione-e-livelli.gif)

### Gestire livelli in un file SVG

SVG non implementa in maniera nativa un sistema per gestire i livelli. Però Inkscape sì, ed essendo gratuito è anche la mia prima scelta. Ci sono solamente un paio di cose da tenere a mente.

Inkscape aggiunge alcuni attributi speciali all'elemento `g`. Sono attributi che servono a identificare un `livello` da un gruppo _normale_:

- `inkscape:groupmode="layer"`: indica che il gruppo è un _livello_
- `inkscape:label="Custom Label"`: serve per assegnare un'etichetta al livello in modo da identificarlo visivamente in un editor

Sapendo questo posso estrarre da un file i singoli livelli usando un comando simile a questo:

```js
divSVG.querySelectorAll(`g[inkscape\\:groupmode="layer"]`);
```

Andando un po' più nello specifico, aggiungo queste righe nella funzione `onFileSelected` nel file principale del mio progetto:

```ts
let layers = [];

const onFileSelected = async (event) => {
  fileSVG = event.detail.target.files[0];

  src = null;
  await tick();
  src = await fileSVG.text();
  await tick();

  selection = [];
  layers = [];

  const svg = divSVG.getElementsByTagName("svg")[0];
  const viewBoxWidth = parseFloat(svg.getAttribute("width"));
  const viewBoxHeight = parseFloat(svg.getAttribute("height"));
  const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;
  svg.setAttribute("viewBox", viewBox);

  divSVG.querySelectorAll(`g[inkscape\\:groupmode="layer"]`).forEach((g) => {
    layers.push(g);
  });
  layers = [...layers];
};
```

Dopo aver ottenuto l'elenco dei vari livelli posso verificare quali di questi sono visibili e quali invece no. Per farlo mi è sufficiente controllare lo stile di ognuno. Controllo il valore di `display` sia negli stili _inline_ sia nei _computed style_:

```ts
function isStyleDisplayNone(el: HTMLDivElement): boolean {
  const inline = el.style.display === "none";
  const style = getComputedStyle(el).display === "none";
  return inline || style;
}
```

In questo modo posso usare una condizione per indicare se il livello è visibile oppure no.

Aggiungendo un evento alla lista dei livelli posso anche modificare la visibilità di ogni singolo livello:

```ts
let visibile = isStyleDisplayNone(element);
let onClickEye = () => {
  visibile = !visibile;
  element.style.display = visibile ? null : "none";
};
```

![selezione-e-livelli.gif](./selezione-e-livelli.gif)

### Selezionare singoli elementi

Un'altra cosa utile è la possibilità di selezionare uno o più elementi. La selezione comporta alcune decisioni di progettazione.

Posso tenere traccia dei vari elementi selezionati tramite una lista (ovvero un array) oppure modificando gli elementi stessi aggiungendo un attributo specifico. Ho scelto di seguire entrambe le strade:

- uso un array per tenere traccia di tutti gli elementi selezionati, in modo da poterli gestire assieme in maniera più semplice
- aggiungo l'attributo `selected` con valori `0` oppure `1` per poter mantenere memoria della selezione (in modo da poterla ripristinare alla riapertura del file).

Uso `element.getAttribute("selected")` per verificare se l'elemento è selezionato oppure no. Se l'attributo `selected` non esiste allora ne devo creare uno nuovo con `element.setAttribute("selected", 0)`. Se invece esiste e ha valore `1` allora lo aggiungo all'array `selection` con `selection.push(element)`.

Per evitarmi dei problemi più avanti mi conviene essere certo che lo stesso elemento non venga inserito più volte nell'array. Il metodo più veloce è forse convertire l'array in un [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) e poi di nuovo in un array usando `selection = [...new Set(selection)]`.

Mettendo tutto assieme ottengo:

```ts
let selection = [];

const onFileSelected = async (event) => {
  fileSVG = event.detail.target.files[0];

  src = null;
  await tick();
  src = await fileSVG.text();
  await tick();

  selection = [];

  const svg = divSVG.getElementsByTagName("svg")[0];
  const viewBoxWidth = parseFloat(svg.getAttribute("width"));
  const viewBoxHeight = parseFloat(svg.getAttribute("height"));
  const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;
  svg.setAttribute("viewBox", viewBox);

  divSVG.querySelectorAll(`path`).forEach((p) => {
    const selected = p.getAttribute("selected");
    p.setAttribute("selected", selected ? selected : "0");
    if (selected === "1") {
      selection.push(p);
      selection = [...new Set(selection)];
    }
  });
};
```

Serve un metodo per selezionare i vari elementi. Uno semplice è usare il mouse: con un click si seleziona la zona, con un secondo click la si deseleziona. Per farlo devo aggiungere un `event listener`

```js
divSVG.querySelectorAll(`path`).forEach((p) =>
  p.addEventListener("click", (event) => {
    const selected = p.getAttribute("selected");
    if (selected === "0") {
      p.setAttribute("selected", "1");
      selection.push(p);
      selection = [...new Set(selection)];
    } else {
      p.setAttribute("selected", "0");
      selection = selection.filter((e) => e != p);
      selection = [...new Set(selection)];
    }
  })
);
```

### Salvare il file SVG

Dopo aver selezionato gli elementi e impostato la visibilità dei vari livelli è il momento di salvare la mappa. Scelgo di salvare tutte le informazioni in modo da poter eventualmente riprendere il lavoro dallo stesso punto.

Dopo un po' di prove ho trovato alcune criticità, soprattutto se faccio girare questa app in Electron. Per risolvere questi problemi uso due repository:

- [blob-polyfill](https://www.npmjs.com/package/blob-polyfill): implementa l'interfaccia [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) per i browser che non la supportano nativamente
- [file-saver](https://www.npmjs.com/package/file-saver): semplifica il download file generati dal browser.

Importo questi due componenti nel mio progetto con

```bash
npm i blob-polyfill file-saver
```

E aggiungo una funzione alla pagina:

```js
import { Blob } from "blob-polyfill";
import { saveAs } from "file-saver";

function saveSVG(divSVG) {
  resetScale(divSVG);
  const text = divSVG
    .getElementsByTagName("svg")[0]
    .outerHTML.replaceAll("&nbsp", "");
  var blob = new Blob([text], {
    type: "image/svg+xml",
  });
  saveAs(blob, "map.svg");
}
```

Devo usare `replaceAll("&nbsp", "")` perché a volte possono apparire dei `Non Breakable SPace` non supportati dal formato SVG.
