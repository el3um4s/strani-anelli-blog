---
title: "Array Intersection, Difference, and Union in JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Pierre Bamin**](https://unsplash.com/@bamin)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-24 13:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Something went wrong at the North Pole. Santa Claus did a sample check: he discovered that some gifts are missing in the bags. Fortunately, everything is recorded and we can compare the various lists to find the differences. We can add the missing packages.

### The Puzzle: Find The Missing Presents 🎁

{% include picture img="cover.webp" ext="jpg" alt="" %}

I think [Dev Advent Calendar problem 23 🎅](<(https://github.com/devadvent/puzzle-23)>) is the one with the shortest solution: literally 2 lines of code are enough to solve it:

```js
import items from "../data/items.js";
export const findMissing = (m, s) =>
  items.filter((x) => m.includes(x.id) && !s.includes(x.id));
```

The question is "_how do I find elements that are in one array but not the other?_".

### Find the differences between 2 arrays

To answer this question just combine two methods of arrays:

- [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), returns a new array containing all elements that pass a given test
- [Array.prototype.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes), returns the value `true` if the array contains a specified element

I can then derive this function:

```js
const difference = (a, b) => a.filter((x) => !b.includes(x));
```

The second part of the puzzle involves returning an array of objects taken from the array with the elements just found. I can change the function like this:

```js
const findMissing = (a, b) => {
  const diff = difference(a, b);
  const result = items.filter((x) => diff.includes(x.id));
};
```

I can shorten the code by modifying the test passed to `filter`. Another way to calculate the difference is to say that the element `x` is included in `a` but not in `b`:

```js
const difference = (list, a, b) =>
  list.filter((x) => a.includes(x) && !b.includes(x));
```

### Symmetric difference between two arrays

Another interesting problem is figuring out how to calculate the symmetric difference between two arrays in JavaScript. Basically I want to find all the elements that belong to one array but not the other.

There are two posts, from some time ago, that were useful to me:

- [Array intersection, difference, and union in ES6](https://medium.com/@alvaro.saburido/set-theory-for-arrays-in-es6-eb2f20a61848)
- [JavaScript Algorithm: Find Difference Between Two Arrays](https://javascript.plainenglish.io/javascript-algorithm-find-difference-between-two-arrays-ed8df86c4924)

I can find them by running two filters in sequence and then joining the arrays with the [Array.prototype.concat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) method or with the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax):

```js
const difference = (a, b) =>
  a.filter((x) => !b.includes(x)).concat(b.filter((x) => !a.includes(x)));
const difference = (a, b) => [...a.filter((x) => !b.includes(x)), ...b.filter((x) => !a.includes(x));
```

### Intersection of two arrays

Another common operation is to calculate the intersection of two arrays. In other words, how can we get a new array containing all the elements present at the same time in the two starting arrays?

Again with the `filter` method:

```js
const intersection = (a, b) => a.filter((x) => b.includes(x));
```

Said in words, they are all the elements of `a` present in `b`.

### Union of two arrays

The last operation is the union of two arrays. There are two ways of defining this operation. We can simply merge two arrays without caring for any duplicate values:

```js
const union = (a, b) => [...a, ...b];
```

In some situations we want to avoid having repeated values. In this case it is better to use a [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set): it is a JavaScript object that only collects different values, preventing us from creating duplicates.

I can convert an array to a set just like this:

```js
const arrayToSet = (a) => new Set(a);
```

The reverse operation, converting a set to an array, is simple:

```js
const setToArray = (a) => [...a];
```

I can join two arrays without repeating the double values ​​with this function:

```js
const union = (a, b) => [...new Set([...a, ...b)];
```

Okay, maybe I went a little off topic from today's exercise. But it was the right occasion for me to review the arrays.
