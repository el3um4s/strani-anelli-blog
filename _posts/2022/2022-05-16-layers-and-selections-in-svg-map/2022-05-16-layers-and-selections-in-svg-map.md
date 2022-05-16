---
title: "Layers and Selections in SVG maps"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Annie Spratt**](https://unsplash.com/@anniespratt)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-05-16 19:00"
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

Using SVG files to represent geographic maps offers other advantages, in addition to the ability to change the scale and position on the map. I can change the visibility of the various layers, or select some elements and highlight them with a different color. I can also save all these changes so that I can get a new file.

![selezione-e-livelli.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-05-10-livelli-e-selezioni-in-una-mappa-svg/selezione-e-livelli.gif)

### Manage layers in an SVG file

SVG does not natively implement a system for managing layers. But Inkscape yes, it's free, and it's my first choice. There are just a couple of things to keep in mind.

Inkscape adds some special attributes to the `g` element. Use these attributes to identify a `layer` from a _normal_ group:

- `inkscape:groupmode="layer"`: indicates that the group is a _layer_
- `inkscape:label="Custom Label"`: it is used to assign a label to the layer in order to identify it visually in an editor

I can extract individual layers from a file using a command similar to this:

<script src="https://gist.github.com/el3um4s/87948ed69e031678dcfb649541da7f85.js"></script>

Little more specific, I add these lines in the `onFileSelected` function in the main file of my project:

<script src="https://gist.github.com/el3um4s/febc0a97633873e28e98f20f946b2f20.js"></script>

After obtaining the list of the various levels, I can check which of these are visible and which are not. To do this, I just need to check everyone's style. I check the value of `display` in both _inline_ and _computed style_ styles:

<script src="https://gist.github.com/el3um4s/4221e9fc78ef5e6f799d56d6ba56d22b.js"></script>

This way I can use a condition to indicate whether the layer is visible or not.

By adding an event to the level list I can also change the visibility of each individual level:

<script src="https://gist.github.com/el3um4s/888e78361bb7a0777f75f56719507f19.js"></script>

![selezione-e-livelli.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-05-10-livelli-e-selezioni-in-una-mappa-svg/selezione-e-livelli.gif)

### Select individual elements

Another useful thing is the ability to select one or more elements. Selection involves some design decisions.

I can keep track of the various selected elements through a list (i.e. an array) or by modifying the elements themselves by adding a specific attribute. I chose to go both ways:

- I use an array to keep track of all the selected elements, so that I can manage them together more easily
- I add the `selected` attribute with values `0` or `1` to be able to keep memory of the selection (so that I can restore it when reopening the file).

I use `element.getAttribute("selected")` to check whether the element is selected or not. If the `selected` attribute does not exist then I need to create a new one with `element.setAttribute("selected", 0)`. If it exists and has the value `1` then I add it to the `selection` array with `selection.push(element)`.

To avoid problems later on, I should be sure that the same element is not inserted multiple times in the array. The quickest method is perhaps to convert the array to a [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) and then back to an array using `selection = [...new Set(selection)]`.

Putting it all together I get:

<script src="https://gist.github.com/el3um4s/e87b2d9ebd019c967e6bfc3f72b395bc.js"></script>

You need a method to select the various elements. A simple one is to use the mouse: with one click you select the area, with a second click you deselect it. To do this I need to add an `event listener`

<script src="https://gist.github.com/el3um4s/d9a0bf2be47946160444a99575ca0d73.js"></script>

### Save the SVG file

After selecting the elements and setting the visibility of the various levels, it's time to save the map. I choose to save all the information so that I can eventually resume work from the same point.

After a bit of testing I found some critical issues, especially if I run this app in Electron. To solve these problems I use two repositories:

- [blob-polyfill](https://www.npmjs.com/package/blob-polyfill): Blob.js implements the W3C [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) interface in browsers that do not natively support it
- [file-saver](https://www.npmjs.com/package/file-saver): the solution to saving files on the client-side, and is perfect for web apps that generates files on the client

I import these two components into my project with

```bash
npm i blob-polyfill file-saver
```

And I add a function to the page:

<script src="https://gist.github.com/el3um4s/5b9d2ef2c179b9b42c09e177431e51b5.js"></script>

I have to use `replaceAll("&nbsp", "")` because sometimes `Non Breakable SPaces` unsupported by SVG format may appear.

That is all for the moment.

In the next post I will talk about how to change the attributes starting from a json and xls file.
