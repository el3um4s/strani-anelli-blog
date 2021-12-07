---
title: "How To Find The Sum of an Array of Objects in JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Park Troopers**](https://unsplash.com/@parktroopers)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-07 16:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

The elves have prepared many gifts and wrapped many candies. But only good children will receive gifts. The others will get the coal. Santa Claus will decide. He records all the actions done by each child in an old notebook. This year, however, he asked for help to do it faster.

### The puzzle: Making a list, checking it twice 📜

{% include picture img="cover.webp" ext="jpg" alt="" %}

Problem # 6 in [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-6) is about arrays and how to filter them based on a calculated value. It is not a trivial problem. I think it's a common situation. In a nutshell, it's about reducing an array of values to a single number.

### Sum of all elements of an array

Ok, maybe it is better to give an example. This is a child's card:

```json
{
  "name": "Fitzgerald Ashley",
  "events": [
    { "name": "Stole candy from the candy drawer", "effect": -10 },
    { "name": "Cheated on homework", "effect": -30 },
    { "name": "Pushed someone at school", "effect": -15 },
    { "name": "Helped a classmate with their homework", "effect": 10 },
    { "name": "Helped their sibling with homework", "effect": 25 },
    {
      "name": "Helped an elderly person cross the street",
      "effect": 30
    },
    {
      "name": "Told the truth even if it would get them in trouble",
      "effect": 30
    }
  ]
}
```

Each child has a matched list of actions, some good, some not. Each action corresponds to a value. The sum of the values of each action is used to calculate a score:

```js
const score = -10 + -30 + -15 + 10 + 25 + 30 + 30;
```

In this case the score is positive, consequently the child deserves a prize:

```js
function findOutIfNaughtyOrNice(score) {
  return score < 0 ? "naughty" : "nice";
}
```

All easy and simple as long as it is a single element. But what if we have hundreds, thousands, millions of children to bring gifts to? Well, Santa certainly can't keep doing everything by hand. Fortunately, there is a method that is right for us, the [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

```js
export const findOutIfNaughtyOrNice = (kid) => {
  const value = kid.events.reduce((prev, curr) => prev + curr.effect, 0);
  return value < 0 ? "naughty" : "nice";
};
```

`reduce()` iterates through all elements of an array and performs some operations for each element. The result of each operation is added to the previous result. This way I can calculate the sum of all effects.

### Filter an array

The other part of the problem is a direct consequence of the first. After having found a way to establish whether a child deserves the gift or not, we can create two lists.

In the first we only put the children to bring the gifts to:

```js
export const getNiceKids = (kids) => {
  return kids.filter((kid) => findOutIfNaughtyOrNice(kid) === "nice");
};
```

In the second instead we put the others:

```js
export const getNaughtyKids = (kids) => {
  return kids.filter((kid) => findOutIfNaughtyOrNice(kid) === "naughty");
};
```

In both cases I used the [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method to get only the required children from the list.

### Import JSON into JavaScript

A single note to conclude. The very first thing to do is to import the list of children into the program. The list is in `json` format so it requires special treatment. There are various ways to do this. One requires the use of the [Node.js fs (filesystem) api](https://nodejs.org/api/fs.html):

```js
const fs = require("fs");

let rawdata = fs.readFileSync("../data/sampleData.json");
let kids = JSON.parse(rawdata);
console.log(kids);
```

However, it is a cumbersome way to do a simple thing.

The second method requires some [experimental functions of Node.js](https://nodejs.medium.com/announcing-a-new-experimental-modules-1be8d2d6c2ff). To activate them I had to modify the `package.json` file by adding `-experimental-json-modules`:

```json
  "scripts": {
    "dev": "nodemon --experimental-json-modules src/index.js --experimental-modules --ignore 'src/data/*.json'",
  },
```

Then in the `naughtyOrNice.js` file I imported the file as a JavaScript object:

```js
import kids from "../data/sampleData.json";
```

It works and is elegant.

In futuro probabilmente non sarà necessario usare `--experimental-json-modules`. C'è una proposta interessante, [tc39/proposal-json-modules](https://github.com/tc39/proposal-json-modules), giunta oramai allo stage 3, che permetterà di avere nativamente in JavaScript la possibilità di importare moduli JSON. In questo caso la sintassi sarà così:

In the future, you probably won't need to use `--experimental-json-modules`. There is an interesting proposal, [tc39/proposal-json-modules](https://github.com/tc39/proposal-json-modules), in stage 3, which will allow you to import JSON modules in JavaScript. In this case the syntax will be like this:

```js
import kids from "../data/sampleData.json" assert { type: "json" };
```

Well, that's all for today.
