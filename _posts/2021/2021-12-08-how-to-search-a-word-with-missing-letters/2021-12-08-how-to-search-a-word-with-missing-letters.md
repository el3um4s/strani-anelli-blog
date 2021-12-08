---
title: "How To Search a Word With Missing Letters"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Hannes Wolf**](https://unsplash.com/@hannes_wolf)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-08 12:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Something went wrong and the elves made a little mess. Some of the gifts ended up in the snow and the name tags were ruined. Fortunately, most of the letters of the names are visible. Santa Claus is convinced that the whole name can be reconstructed starting from the fragments.

### The puzzle: Matching Gift Names 🎁

{% include picture img="cover.webp" ext="jpg" alt="" %}

Today's problem, Issue 7 of the [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-7) is very fast. But it requires you to use **regular expressions**. I still struggle to handle this aspect of JavaScript - I find it difficult even with a simple problem like this.

I begin with the solution:

```js
import { default as names } from "../data/names.js";

export const matchedNames = (smudgedName) => {
  const nameWithRegex = smudgedName.replace(/#/gu, ".");
  const regex = new RegExp(`^${nameWithRegex}$`, "gu");

  return names.filter((name) => name.search(regex) > -1);
};
```

The first step is to try various combinations of regex and see which one is best suited to the problem. To do this I use [regex101](https://regex101.com/) and do some manual tests. After identifying the right rule, I create the regular expression.

There are two ways. What I've used so far is like this:

```js
const re = /hello/gu;
```

It is generally the best solution because it is the most efficient. However, it assumes that you always use the same rule. This is not the case today. I need to create a different regex for each name to check. I therefore use:

```js
const nameWithRegex = "hello";
const re = new RegExp(nameWithRegex, "gu");
```

Of course this code only works if I want to search for the word `hello`.

First I replace the `#` character with the `.` character. Why? Because the period, in the regex, indicates any single character. This way I can transform `h#ello` into the string `h.ello`. Then I'll use `h.ello` in the next step.

```js
const nameWithRegex = smudgedName.replace(/#/gu, ".");
```

The next step changes based on the source of the data. In our case, each name is a single word. I can therefore assume that the comparison takes place between complete strings. So I add two commands:

- `^` indicates that the pattern is at the beginning of the string
- `$` indicates that there is nothing after the last character of the pattern.

This way I make sure that `patt.` only returns `patty` and `patti` but not `patterson`.

```js
const regex = new RegExp(`^${nameWithRegex}$`, "gu");
```

After finding the regex to use, all that remains is to use it. The problem is, I can't use [RegExp.prototype.test()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test). `test()` always restarts the search from the last index found. This generates bugs: without code testing I would have had a lot of trouble catching this.

Consequently I decided to use [String.prototype.search()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search): this method always starts the search from position 0, and that's exactly what I need.

```js
return names.filter((name) => name.search(regex) > -1);
```

That's all

If you ara curious about [🎅 Dev Advent Calendar](https://github.com/devadvent/readme) then you can follow these links:

- [Which is The Best Method To Find an Item in an Array of Arrays in JavaScript?](https://betterprogramming.pub/which-is-the-best-method-to-find-an-item-in-an-array-of-arrays-in-javascript-5f51589d2086)
- [How to Get Unique Values from a List in JavaScript](https://javascript.plainenglish.io/how-to-get-unique-values-from-a-list-in-javascript-301675602985)
- [How To Find The Sum of an Array of Objects in JavaScript](https://el3um4s.medium.com/how-to-find-the-sum-of-an-array-of-objects-in-javascript-24965d883bd0)
