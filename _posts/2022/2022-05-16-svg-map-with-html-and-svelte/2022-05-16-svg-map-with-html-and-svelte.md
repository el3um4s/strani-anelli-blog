---
title: "SVG Maps With HTML, JavaScript and Svelte"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-04-22 10:00"
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

One of the benefits of SVG files is the ability to edit them with JavaScript in an HTML page. To simplify the process I create a small app with [Svelte](https://svelte.dev/) where you can load an SVG file, edit it and then save it back to disk.

### Open an SVG file

First I create a button to select the file to upload and an html element to show the file

<script src="https://gist.github.com/el3um4s/d188820d00eb1ae8cc93b75a3dd0f7c0.js"></script>

After selecting the file I get something like this:

{% include picture img="svg-in-html.webp" ext="jpg" alt="" %}

### How to scale and move SVG maps

For some maps, an overall view is enough but in this case I am interested in being able to zoom in on some elements. And, of course, also being able to move around the map.

To do this I can use the repository [luncheon/svg-pan-zoom-container](https://github.com/luncheon/svg-pan-zoom-container). I install the package using:

```bash
npm i svg-pan-zoom-container
```

So I change my code:

<script src="https://gist.github.com/el3um4s/890fa48b75266762cc4d72159e83be82.js"></script>

The `data-zoom-on-wheel` attribute enables `zoom` with the mouse wheel. Set as _minimum scale 0.3_ and _maximum scale 20_. The `data-pan-on-drag` attribute enables mouse movement. In this case I set that the movement is done using the combination `control` key plus `left mouse button`.

![zoom-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-04-22-usare-mappe-svg-con-svelte/zoom-01.gif)

In addition to the mouse wheel it is also useful to have a button or something similar to manage the zoom. I can, for example, create an `input` element of type `range`, by binding its value to the `scale` variable.

<script src="https://gist.github.com/el3um4s/5a6207cd25086b342fd807a15e007f2d.js"></script>

To pass the scale from the map to the element I add [`MutationObserver`](https://github.com/luncheon/svg-pan-zoom-container#observation):

<script src="https://gist.github.com/el3um4s/8adbc597608a52f0bb56e4e7bed237bf.js"></script>

Then I add a new event to the `input [range]` element in order to dynamically change the zoom:

<script src="https://gist.github.com/el3um4s/d4f0f634ab74f61a0f5fdc30a145309c.js"></script>

The result looks like this:

![zoom-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-04-22-usare-mappe-svg-con-svelte/zoom-02.gif)

Finally, I can add a button to reset the scale and return to the original one:

<script src="https://gist.github.com/el3um4s/5c8ca5372517a776995f970a9c5cd6dd.js"></script>

![zoom-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-04-22-usare-mappe-svg-con-svelte/zoom-03.gif)

The next step is to understand how to manage layers and selections. But I'll talk about this in the next post.
