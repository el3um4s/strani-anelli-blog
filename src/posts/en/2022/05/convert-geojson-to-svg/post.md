---
title: How to Convert GeoJSON to SVG
published: true
date: 2022-05-15 10:00
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
  - convert-geojson-to-svg
lang: en
cover: image.webp
description: After converting a Shapefile to GeoJSON I can start creating the svg file. There are some repositories that can help. But I need something more specific.
---

After converting a Shapefile to GeoJSON I can start creating the svg file. There are some repositories that can help. But I need something more specific.

Conversion from GeoJSON to SVG must meet these requirements:

- keep the same aspect of the various geographical regions
- keep the various data for later use (for example the zone ID)
- create overlapping layers, each with its own id
- add a custom style to the various elements
- create and add custom labels for the various elements
- enlarge the result

I start from what already exists, so with these repositories:

- [gagan-bansal/geojson2svg](https://github.com/gagan-bansal/geojson2svg) to convert a geojson file to SVG
- [elrumordelaluz/scale-that-svg](https://github.com/elrumordelaluz/scale-that-svg/blob/master/index.js) to scale an SVG file
- [elrumordelaluz/svgson](https://github.com/elrumordelaluz/svgson) to convert SVG file to json (and be able to use it with `scale-that-svg`)
- [elrumordelaluz/svg-path-tools](https://github.com/elrumordelaluz/svg-path-tools) to customize `scale-that-svg`
- [elrumordelaluz/element-to-path](https://github.com/elrumordelaluz/element-to-path) to customize `scale-that-svg`
- [polylabel](https://www.npmjs.com/package/polylabel) to locate the _pole of inaccessibility_ of a zone

### Convertire un file GeoJSON in SVG

I start with the code. Obviously I need a starting GeoJSON file, to read and then to convert to JSON:

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

I then use `geojson2svg` to get an array of `paths`. To keep track of the various data I need a list of the attributes to preserve. I create the `attributes` variable specifically for this purpose.

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

After getting `svgStr` I can merge the various elements of the array so that I can get a string to use to create the SVG file.

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

Finally I just have to save the file to disk

```js
const fileOutput = "GM-comuni_100snap";

fs.writeFileSync(`${fileOutput}.svg`, comuniPOISvg);
```

### Add labels to an svg file

To add a label to the various parts of the map I must first locate the center point of each element. There are various algorithms that allow you to do this but the most useful one is called `polylabel` (it is used to identify the [Pole of inaccessibility](https://en.wikipedia.org/wiki/Pole_of_inaccessibility) of each area).

I calculate the POI of each element:

```js
import polylabel from "polylabel";

const poiJSON = dataJSON.features.map((shape) => {
  const p = polylabel(shape.geometry.coordinates[0], 1.0);
  const properties = JSON.stringify(shape.properties);
  return `{"type": "Feature", "properties": ${properties}, "geometry": {"type": "Point", "coordinates": [${p[0]},${p[1]}]}}`;
});
```

So I save the various points in GeoJSON format:

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

Then I convert this GeoJSON to an array of SVG element strings:

```js
const converter_poiGEOJSON = geojson2svg({
  attributes: attributes,
  pointAsCircle: true,
  r: 0.001,
});

const poiStr = converter_poiGEOJSON.convert(JSON.parse(poiGEOJSON));
```

So I convert this GeoJSON into an array of SVG element strings: To create the actual SVG file, however, I have to work with this array. I need a function that allows me to convert a point to text, and decide which text to use:

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

Then a function that transforms the array:

```js
function getArrayText(points, label) {
  return points.map((p) => createTextFromCircleSVG(p, label));
}
```

Finally I create a `parseSVG_poi` function to get the complete svg:

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

Save the result to disk so you can open it with Inkscape:

```js
const fileOutput_POI = "GM-comuni_poi_100snap";

fs.writeFileSync(`${fileOutput_POI}.svg`, label_svg);
```

### Use a GeoJSON file with indicated the points where to insert the labels

Of course, it is not necessary to create a temporary variable each time to be used to calculate the position of the labels. I can save this information in a GeoJSON file:

```js
fs.writeFileSync(`labels.geojson`, poiStr);
```

I can use this file whenever I need to retrieve the position of the labels to insert them into the SVG file

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

### Scale the SVG map

This method works quite well but has a problem: the resulting SVG file is often very small. The labels are disproportionate to the boundaries of the zones. To solve this problem I have to scale the whole file. I modified the [elrumordelaluz/scale-that-svg](https://github.com/elrumordelaluz/scale-that-svg/blob/master/index.js) repository. I just need a few lines of code to get the result that interests me.

```js
import { scaleSVG as scale } from "./scale-svg.js";

const scalePer = 2000;

const scaled = await scale(svg, {
  scale: scalePer,
});

fs.writeFileSync(`${fileOutput}_scaled_${scalePer}x.svg`, scaled);
```

After creating the SVG file all that remains is to use it in an HTML page. But I'll talk about this in another post.
