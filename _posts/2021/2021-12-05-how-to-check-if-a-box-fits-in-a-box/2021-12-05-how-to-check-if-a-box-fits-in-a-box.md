---
title: "How to check if a box fits in a box"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Jackie Zhao**](https://unsplash.com/@jiaweizhao)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-05 12:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

The elves are in luck: the cafeteria business continues to grow. Too bad they made a bit of confusion with the boxes. They struggle to figure out how to box all shipments without wasting cardboard. The Elf Post Service 📯 (ECS) has several formats to choose from. Today's [Dev Advent](https://github.com/devadvent/readme) puzzle is about this.

### The puzzle: Optimizing shipping 📦

{% include picture img="cover.webp" ext="jpg" alt="" %}

Today's problem concerns geometry: it is a question of understanding whether one box can fit into another. It is not enough to measure the length of the individual corners, a box can also be rotated to make it fit.

The solution is trivial and does not require explanations:

<script src="https://gist.github.com/el3um4s/fbcd29143f3b25b2e0250ae99a69a43c.js"></script>

I have looked for a generic formula to achieve this in a more elegant way but I have not found anything better. And with only 3 dimensions, a manual formula is enough.

There is, however, one interesting thing. I renamed the variables during the object destructuring operation. Just add the name of the new variable after the name of the original one:

<script src="https://gist.github.com/el3um4s/682560a340ab2687e9dcb753c33652f6.js"></script>

The example above is not mine, it is from [Paul Vaneveld](https://medium.com/@paul.vaneveld). I found it in an interesting article published on Medium: [7 Little-Known Techniques to Improve Your JavaScript](https://javascript.plainenglish.io/7-little-known-techniques-to-improve-your-javascript-20a9e870a5fe).

Well, that's all for today.
