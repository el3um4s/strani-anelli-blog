---
title: "Convertire GeoJSON in SVG"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-04-21 10:00"
categories:
  - Maps
  - JavaScript
  - Svelte
  - TypeScript
  - NodeJS
tags:
  - Maps
  - JavaScript
  - Svelte
  - TypeScript
  - NodeJS
---

Dopo aver convertito un Shapefile in GeoJSON posso cominciare a creare il file svg. Ci sono alcuni repository che possono aiutare ma per quello che serve a me è necessario un qualcosa di più specifico.

La conversione da GeoJSON a SVG che mi serve deve rispettare questi requisiti:

- mantenere lo stesso aspetto delle varie regioni geografiche
- conservare i vari dati collegati per poterli riutilizzare in seguito (e in particolar modo l'ID della zona)
- creare livelli sovrapposti, ognuno con il suo id
- poter aggiungere uno stile personalizzato ai vari elementi
- creare e aggiungere delle etichette personalizzate per i vari elementi
- poter ingrandire il risultato in modo da poterlo stampare in maniera leggibile

Parto da quello che già esiste, quindi con questi repository:

- [gagan-bansal/geojson2svg](https://github.com/gagan-bansal/geojson2svg) per convertire un file geojson in svg
- [elrumordelaluz/scale-that-svg](https://github.com/elrumordelaluz/scale-that-svg/blob/master/index.js) per scalare un file svg
- [elrumordelaluz/svgson](https://github.com/elrumordelaluz/svgson) per convertire un file svg in json (e poterlo quindi usare con `scale-that-svg`)
- [elrumordelaluz/svg-path-tools](https://github.com/elrumordelaluz/svg-path-tools) per personalizzare `scale-that-svg`
- [elrumordelaluz/element-to-path](https://github.com/elrumordelaluz/element-to-path) per personalizzare `scale-that-svg`
- [polylabel](https://www.npmjs.com/package/polylabel) per localizzare il _pole of inaccessibility_ di una zona

### Convertire un file GeoJSON in SVG

Sistemato questo, comincio con il codice. Mi serve ovviamente un file GeoJSON di partenza, da leggere da convertire in JSON:

```js
import * as fs from "fs";

const inputGeoJSON =
  "./maps/geojson/GM-grande-milano/GM-comuni_100snap.geojson";
const dataJSONSource = fs.readFileSync(inputGeoJSON, {
  encoding: "utf8",
  flag: "r",
});

const dataJSON = JSON.parse(dataJSONSource);
```

Uso quindi `geojson2svg` per ottenere un array di `path`. Per tenere traccia dei vari dati mi serve un elenco degli attributi da preservare. Creo la variabie `attributes` appositamente per questo scopo.

```js
import geojson2svg from "geojson2svg";

const attributes = [
  "properties.PRO_COM_T",
  "properties.COMUNE",
  "properties.COD_REG",
  "properties.COD_PROV",
];

const converter = geojson2svg({
  attributes: attributes,
});

const svgStr = converter.convert(dataJSON);
```

Dopo aver ricavato `svgStr` posso unire i vari elementi dell'array in modo poter ottenere una stringa da usare per creare il file svg.

```js
const svg = parseSVG(str);

function parseSVG(str) {
  const paths = `<g class="comuni" id="comuni">\r\n${str.join("\r\n")}</g>`;

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
>
<style>
g.comuni {
    fill: lightyellow;
    stroke-width: 0.5;
    stroke-linecap: square;
    stroke-linejoin: bevel;
    stroke-miterlimit: 3;
    stroke-opacity: 1;
    stroke: slategray;
    fill-opacity: 1;
}
</style>
<g inkscape:groupmode="layer" id="layer1" inkscape:label="Base"/>
<g inkscape:groupmode="layer" id="layer2" inkscape:label="Comuni">
${paths}
</g>
</svg>
`;
}
```

Infine non mi resta che salvare il file su disco

```js
const fileOutput = "GM-comuni_100snap";

fs.writeFileSync(`${fileOutput}.svg`, comuniPOISvg);
```

### Aggiungere delle etichette a un file svg

Per aggiungere un'etichetta alle varie parti della mappa devo prima individuare il punto centrale di ogni elemento. Ci sono vari algoritmi che permettono di farlo ma quello più utile si chiama `polylabel` (serve per individuare il [Pole of inaccessibility](https://en.wikipedia.org/wiki/Pole_of_inaccessibility) di ogni area).

Calcolo il POI di ogni elemento:

```js
import polylabel from "polylabel";

const poiJSON = dataJSON.features.map((shape) => {
  const p = polylabel(shape.geometry.coordinates[0], 1.0);
  const properties = JSON.stringify(shape.properties);
  return `{"type": "Feature", "properties": ${properties}, "geometry": {"type": "Point", "coordinates": [${p[0]},${p[1]}]}}`;
});
```

Quindi salvo i vari punti in formato GeoJSON:

```js
const poiGEOJSON = `{
"type": "FeatureCollection",
"name": "${poiJSON.name}_labels",
"crs": ${JSON.stringify(poiJSON.crs)},
"features": [
    ${poiJSON.join()}
    ]
}`;
```

Quindi converto questo GeoJSON in un array di stringhe di elementi SVG:

```js
const converter_poiGEOJSON = geojson2svg({
  attributes: attributes,
  pointAsCircle: true,
  r: 0.001,
});

const poiStr = converter_poiGEOJSON.convert(JSON.parse(poiGEOJSON));
```

Per creare il file SVG vero e proprio devo però trattare questo array. Mi serve una funzione che mi permetta di convertire un punto in testo, e di decidere che testo usare:

```js
function createTextFromCircleSVG(point, label) {
  const reLabel = new RegExp(`(?<=${label}=")(.*?)(?=")`, "ig").exec(point);
  return point
    .replace(' cx="', ' x="')
    .replace(' cy="', ' y="')
    .replace("<circle ", "<text ")
    .replace("/>", ">" + reLabel[0] + "</text>");
}
```

Poi, ovviamente, una funzione che trasformi tutto l'array in un colpo solo:

```js
function getArrayText(points, label) {
  return points.map((p) => createTextFromCircleSVG(p, label));
}
```

Infine creo una funzione `parseSVG_poi` per ottenere l'svg completo:

```js
const labelName = "COMUNE";

const label_svg = parseSVG_poi(poiStr, labelName);

function parseSVG_poi(str, label) {
  const text = `<g class="label-text" id="label-text">\r\n${getArrayText(
    str,
    label
  ).join("\r\n")}</g>`;

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
xmlns:dc="http://purl.org/dc/elements/1.1/"
xmlns:cc="http://creativecommons.org/ns#"
xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
xmlns:svg="http://www.w3.org/2000/svg"
xmlns="http://www.w3.org/2000/svg"
xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"

>

<style>

g.label-text {
    font-size: 6px;
    text-anchor:middle;
    alignment-baseline:middle;
    font-style:normal;
    font-variant:normal;
    font-weight:normal;
    font-stretch:normal;
    font-family:'Open Sans', Arial, sans-serif;
    letter-spacing:0px;
    fill:#4a4a4a;
    fill-opacity:1;
    stroke:#ffffff;
    stroke-width:1;
    stroke-linecap:butt;
    stroke-linejoin:miter;
    stroke-miterlimit:4;
    stroke-dasharray:none;
    stroke-opacity:1;
    paint-order:markers stroke fill;
}


</style>
<g inkscape:groupmode="layer" id="layer1" inkscape:label="Base"/>
<g inkscape:groupmode="layer" id="layer2" inkscape:label="Labels">
${text}
</g>
</svg>
`;
}
```

Salvo il risultato su disco in modo da poterlo aprire con Inkscape:

```js
const fileOutput_POI = "GM-comuni_poi_100snap";

fs.writeFileSync(`${fileOutput_POI}.svg`, label_svg);
```

### Usare un file GeoJSON con indicati i punti dove inserire le etichette

Ovviamente non è necessario creare ogni volta una variabile temporanea da usare per calcolare la posizione delle etichette. Posso salvare questa informazione in un file GeoJSON:

```js
fs.writeFileSync(`labels.geojson`, poiStr);
```

Posso usare questo file ogni volta che mi serve recuperare la posizione delle etichette per inserirle nel file SVG

```js
const input =
  "./maps/geojson/GM-grande-milano/GM-comuni_100snap_polylabel.geojson";

const poiGEOJSONfile = fs.readFileSync(input, {
  encoding: "utf8",
  flag: "r",
});

const poiGEOJSON = JSON.parse(poiGEOJSONfile);

const attributes = [
  "properties.PRO_COM_T",
  "properties.COMUNE",
  "properties.COD_REG",
  "properties.COD_PROV",
];

const converter_poiGEOJSON = geojson2svg({
  attributes: attributes,
  pointAsCircle: true,
  r: 0.001,
});

const poiStr = converter_poiGEOJSON.convert(JSON.parse(poiGEOJSON));

const labelName = "COMUNE";

const label_svg = parseSVG_poi(poiStr, labelName);

const fileOutput_POI = "GM-comuni_poi_100snap";

fs.writeFileSync(`${fileOutput_POI}.svg`, label_svg);
```

### Ingrandire la mappa SVG

Questo metodo funziona abbastanza bene ma presenta un problema: il file SVG risultante è spesso molto piccolo. O, meglio, le etichette risultato sproporzionate rispetto ai confini delle zone. Per risolvere questo problema devo scalare tutto il file. Ho modificato il repository [elrumordelaluz/scale-that-svg](https://github.com/elrumordelaluz/scale-that-svg/blob/master/index.js) per adattarlo alle mie esigenze. In questo modo mi bastano alcune righe di codice per ottenere il risultato che mi interessa

```js
import { scaleSVG as scale } from "./scale-svg.js";

const scalePer = 2000;

const scaled = await scale(svg, {
  scale: scalePer,
});

fs.writeFileSync(`${fileOutput}_scaled_${scalePer}x.svg`, scaled);
```
