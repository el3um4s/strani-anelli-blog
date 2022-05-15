---
title: "How to Convert GeoJSON to SVG"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-05-15 10:00"
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

<script src="https://gist.github.com/el3um4s/cfbbbb97ed8a1b36147ca70b0692d693.js"></script>

I then use `geojson2svg` to get an array of `paths`. To keep track of the various data I need a list of the attributes to preserve. I create the `attributes` variable specifically for this purpose.

<script src="https://gist.github.com/el3um4s/9a2e4f82663987f31c47c183500fcb61.js"></script>

After getting `svgStr` I can merge the various elements of the array so that I can get a string to use to create the SVG file.

<script src="https://gist.github.com/el3um4s/9b714ec764abb1ff68734f4991933166.js"></script>

Finally I just have to save the file to disk

<script src="https://gist.github.com/el3um4s/3f7bc0e5226c3c9bec5e22755c1ab423.js"></script>

### Add labels to an svg file

To add a label to the various parts of the map I must first locate the center point of each element. There are various algorithms that allow you to do this but the most useful one is called `polylabel` (it is used to identify the [Pole of inaccessibility](https://en.wikipedia.org/wiki/Pole_of_inaccessibility) of each area).

I calculate the POI of each element:

<script src="https://gist.github.com/el3um4s/98ca9ce53917fa6a7fd6c66e01e6177e.js"></script>

So I save the various points in GeoJSON format:

<script src="https://gist.github.com/el3um4s/e5c0cd9b93d899ff7c7df49d63594bd7.js"></script>

Then I convert this GeoJSON to an array of SVG element strings:

<script src="https://gist.github.com/el3um4s/cff9e062415ede11fd3c7b1dbabe723e.js"></script>

So I convert this GeoJSON into an array of SVG element strings: To create the actual SVG file, however, I have to work with this array. I need a function that allows me to convert a point to text, and decide which text to use:

<script src="https://gist.github.com/el3um4s/6117551cc110b3dc67257aa0c0a2d265.js"></script>

Then a function that transforms the array:

<script src="https://gist.github.com/el3um4s/3e577ceb28a0e2a2485cb76e45b11a1a.js"></script>

Finally I create a `parseSVG_poi` function to get the complete svg:

<script src="https://gist.github.com/el3um4s/360e6eeb3f0fbb8428f3ab05f178cc6a.js"></script>

Save the result to disk so you can open it with Inkscape:

<script src="https://gist.github.com/el3um4s/6b871ce93472f41c08edb7060f48219b.js"></script>

### Use a GeoJSON file with indicated the points where to insert the labels

Of course, it is not necessary to create a temporary variable each time to be used to calculate the position of the labels. I can save this information in a GeoJSON file:

<script src="https://gist.github.com/el3um4s/617978fc49a88a39e98112ae28ea7b72.js"></script>

I can use this file whenever I need to retrieve the position of the labels to insert them into the SVG file

<script src="https://gist.github.com/el3um4s/1fe839db47e502a3c9bc4f3d2b7c7f59.js"></script>

### Scale the SVG map

This method works quite well but has a problem: the resulting SVG file is often very small. The labels are disproportionate to the boundaries of the zones. To solve this problem I have to scale the whole file. I modified the [elrumordelaluz/scale-that-svg](https://github.com/elrumordelaluz/scale-that-svg/blob/master/index.js) repository. I just need a few lines of code to get the result that interests me.

<script src="https://gist.github.com/el3um4s/f4a361091222b5fa9c067172b43b2784.js"></script>

After creating the SVG file all that remains is to use it in an HTML page. But I'll talk about this in another post.
