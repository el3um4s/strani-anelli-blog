---
title: "Geometric Draw"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-04-11 22:50"
categories:
  - Construct 3
  - JavaScript
tags:
  - Construct 3
  - JavaScript
---

Qualche giorno fa sono incappato in un twitter di [Martin Kleppe](https://twitter.com/aemkei/status/1378106731386040322): mostrava come disegnare dei pattern geometrici a partire da una semplice formula: `(x ^ y) % 9`.

{% include picture img="geometric_pattern.webp" ext="jpg" alt="" %}

Il procedimento è tutto sommato semplice. Usando una canvas è sufficiente una funzione simile a questa:

```js
const context = canvas.getContext('2d');
for (let x = 0; x < 256; x++) {
  for (let y = 0; y < 256; y++) {
    if ((x ^ y) % 9) {
      context.fillRect(x*4, y*4, 4, 4);
    }
  }
}
```

Partendo da questo spunto sono entrato nel mood _chissà se riesco a replicare questa cosa_. Il risultato? Questo qui:

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-04-11-geometric-draw/animation.gif)

Ovviamente ho caricato il [codice su GitHub](https://github.com/el3um4s/construct-demo) e una [demo online](https://c3demo.stranianelli.com/template/018-geometric-draw/demo/).

Il template permette di generare dei disegni geometrici a partire da formule matematiche. È possibile usare le variabili `x` e `y` per indicare le coordinate sulla canvas. Volendo si possono dichiarare altre variabili e usarle nelle formule. Si possono inoltre combinare formule diverse. Per esempio, è possibile usare formule come:

```js
(x ^ y) % 9;
(x ^ y) % 17 == 1;
Math.sin(x/333)*12%Math.sin((y-228)/133)*12|0;
var r=66; ((r-x)*(r-x)+(r-y)*(r-y)) % (r*9) < r*5;
(x-y || y % 4) & (x+y % 4);
```

Inoltre c'è la possibilità di cambiare il colore dello sfondo (di default è trasparente) e il colore in primo piano.

{% include picture img="geometric_pattern_2.webp" ext="jpg" alt="" %}

Creare tutto questo con Construct3 mi ha costretto ad affrontare alcuni problemi legati ad alcuni limiti di C3:

1. non è possibile scrivere via JavaScript direttamente sulla canvas
2. non è possibile usare i colori nel formato esadecimale (quello `#FF00FF`, per capirci)
3. non esiste un controllo di tipo `input type="color"` (chissà perché, poi...)

Parto da quest'ultimo punto perché è quello più semplice da risolvere.

### Come creare un selettore di colore

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-04-11-geometric-draw/geometric-draw-test-colors-04.gif)

Il trucco è di utilizzare un altro elemento di Construct 3, il plugin [Text Input](https://www.construct.net/en/make-games/manuals/construct-3/plugin-reference/text-input), aggiungendo un `id` identificativo dell'elemento. Dopo di ché é sufficiente una riga di JavaScript:

```js
const colorBackground = document.getElementById("color-background");
colorBackground.type = "color";
```

### Come usare colori HEX in Construct 3

Questo è problema che ho dovuto già affrontare e che in passato ho risolto con un plugin ad hoc ([ConverterColorJS - Aioute Gao](https://github.com/el3um4s/construct-plugins-and-addons)). Ma, forse ne ho già parlato, sto valutando di abbandonare lo sviluppo di plugin specifici: oramai C3 è abbastanza maturo da poter usare direttamente codice JavaScript per risolvere la maggior parte dei problemi. E così ho fatto: ho creato una semplice funzione che accetta in ingresso un colore esadecimale e lo restituisce nel formato richiesto da C3.

Su GitHub è possibile vedere il [codice completo di **hexToRGBA**](https://raw.githubusercontent.com/el3um4s/construct-demo/master/template/018-geometric-draw/source/files/scripts/colorshelper.js).

```js
function hexToRGBA(hex,
  {
    formatNumber = "0-1 Range", 
    formatReturn = "array" 
  } = {})
```

È possibile scegliere tra 3 formati di colore:

* 0-1 Range
* Percentage
* 0-255 Range

e ottenere il colore convertito come un `array` ([r,g,b,a]) o come un `oggetto` ({r,g,b,a}).

### Come disegnare un punto sulla Canvas

Il terzo aspetto è abbastanza facile, a patto di non voler usare solo JS.

Per prima cosa ho creato una funzione `Canvas_DrawPoint` per disegnare un rettangolo di 1 punto di lato (che di fatto è un punto)

{% include picture img="canvas-draw-point.webp" ext="jpg" alt="" %}

In questo modo posso richiamare da JavaScript la funzione con il codice:

```js
runtime.callFunction("Canvas_DrawPoint", uid, x, y, x+1, y+1, r, g, b, 100);
```

### Uniamo i pezzi

Bene, adesso si tratta solamente di unire i vari pezzi nella funzione `Canvas_DrawFromRules`

```js
const uid = localVars.UID;
const canvas = runtime.getInstanceByUid(uid);
const hex = localVars.Color;
const {r, g, b } = hexToRGBA(hex, {formatNumber: "PERCENTAGE", formatReturn: "OBJECT" });

const width = canvas.surfaceDeviceWidth;
const height = canvas.surfaceDeviceHeight;

const rules = localVars.Rules;

for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {

	const condition = eval(rules);
    if (condition) {
      runtime.callFunction("Canvas_DrawPoint", uid, x, y, x+1, y+1, r, g, b, 100);
    }

  }
}
```

Ma cos'è `condition = eval(rules)`? Allora, ho usato [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) per calcolare il risultato della formula del disegno.

### Tilemap

Non è necessario usare una canvas per disegnare. Nel template ho inserito un secondo layout dove utilizzo due tilemap al posto della canvas. Questo permette di ricreare tutto in JavaScript "puro" senza passare attraverso gli event sheet di Construct 3. In questo modo il codice diventa:

```js
const uid = localVars.UID;
const rules = localVars.Rules;
const hex = localVars.Color;
const tilemap = runtime.getInstanceByUid(uid);
const clearBackground = !!localVars.ClearBackground;

const color = hexToRGBA(hex, {formatNumber: "0-1 Range", formatReturn: "ARRAY" });
tilemap.colorRgb = color;

const width = tilemap.mapWidth;
const height = tilemap.mapHeight;

for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
	const condition = eval(rules);

    if (condition) {
		  tilemap.setTileAt(x, y, 1);
    } else if (clearBackground) {
		  tilemap.setTileAt(x, y, -1);
	  }
  }
}
```

Direi che con questo è tutto, ricordo che il codice di questo progetto è disponibile su GitHub:

- [il progetto su GitHub](https://github.com/el3um4s/construct-demo)
- [la demo online](https://c3demo.stranianelli.com/template/018-geometric-draw/demo/)
- [Patreon](https://www.patreon.com/el3um4s)
