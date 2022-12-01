---
title: "DevAdvent 2022: #2 You're a square!"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-12-02 16:00"
categories:
  - devadvent
  - js
  - ts
  - javascript
  - typescript
tags:
  - devadvent
  - js
  - ts
  - javascript
  - typescript
---

The second problem of my DevAdvent 2022 concerns square roots. The [story of the problem](https://www.codewars.com/kata/54c27a33fb7da0db0100040e) is about cubes, squares and a passion for the numbers. But long story short, it's about whether a number is a [perfect square](https://en.wikipedia.org/wiki/Square_number) or not.

The problem is very simple, and my solution requires only a couple of steps:

```ts
export default function isSquare(n: number): boolean {
  const square: number = n ** 0.5;
  const truncated: number = Math.trunc(square);

  return square == truncated;
}
```

In JavaScript it becomes:

```js
const isSquare = function (n) {
  const square = n ** 0.5;
  const truncated = Math.trunc(square);

  return square == truncated;
};
```

Put into words, first I calculate the square of the number. To do this I use the exponential operator `**` setting `1/2` as the exponent. Alternatively, I can use [Math.sqrt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt).

```js
const square = n ** 0.5;
const square = Math.sqrt(n);
```

Then I have to figure out if the resulting number is integer. I can do it in two ways. The long way is by truncating the number and checking that the result is equal to the original number.

```js
const truncated = Math.trunc(square);
const isInteger square == truncated;
```

The easiest way is to use the [Number.isInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger) method.

```js
const isInteger = Number.isInteger(square);
```

Finally I can also use the [Remainder](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder) `%` operator to check if the remainder of division by `1` returns `0`.

```js
const isSquare = (n) => Math.sqrt(n) % 1 === 0;
```
