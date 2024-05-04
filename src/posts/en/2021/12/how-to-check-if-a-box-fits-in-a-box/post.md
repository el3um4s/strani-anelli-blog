---
title: How to check if a box fits in a box
published: true
date: 2021-12-05 12:00
categories:
  - DevAdvent
  - JavaScript
tags:
  - DevAdvent
  - JavaScript
  - how-to-check-if-a-box-fits-in-a-box
cover: image.webp
lang: en
description: "The elves are in luck: the cafeteria business continues to grow. Too bad they made a bit of confusion with the boxes. They struggle to figure out how to box all shipments without wasting cardboard. The Elf Post Service 📯 (ECS) has several formats to choose from. Today's Dev Advent puzzle is about this."
---

The elves are in luck: the cafeteria business continues to grow. Too bad they made a bit of confusion with the boxes. They struggle to figure out how to box all shipments without wasting cardboard. The Elf Post Service 📯 (ECS) has several formats to choose from. Today's [Dev Advent](https://github.com/devadvent/readme) puzzle is about this.

### The puzzle: Optimizing shipping 📦

![Immagine](./cover.webp)

Today's problem concerns geometry: it is a question of understanding whether one box can fit into another. It is not enough to measure the length of the individual corners, a box can also be rotated to make it fit.

The solution is trivial and does not require explanations:

```js
export const selectBox = (item) => {
  return boxes.find((box) =>
    isBoxable({
      item,
      box,
    })
  );
};

function isBoxable({ item, box }) {
  const { width: x, length: y, height: z } = item;
  const { width: a, length: b, height: c } = box;

  const caseA = a >= x && ((b >= y && c >= z) || (b >= z && c >= y));
  const caseB = a >= y && ((b >= x && c >= z) || (b >= z && c >= x));
  const caseC = a >= z && ((b >= x && c >= y) || (b >= y && c >= x));

  return caseA || caseB || caseC;
}
```

I have looked for a generic formula to achieve this in a more elegant way but I have not found anything better. And with only 3 dimensions, a manual formula is enough.

There is, however, one interesting thing. I renamed the variables during the object destructuring operation. Just add the name of the new variable after the name of the original one:

```js
const caroline = {
  firstNm: "Caroline",
  ag: 27,
};

const { firstNm: firstName, ag: age } = caroline;

console.log(firstName, age);

// Caroline, 27
```

The example above is not mine, it is from [Paul Vaneveld](https://medium.com/@paul.vaneveld). I found it in an interesting article published on Medium: [7 Little-Known Techniques to Improve Your JavaScript](https://javascript.plainenglish.io/7-little-known-techniques-to-improve-your-javascript-20a9e870a5fe).

Well, that's all for today.
