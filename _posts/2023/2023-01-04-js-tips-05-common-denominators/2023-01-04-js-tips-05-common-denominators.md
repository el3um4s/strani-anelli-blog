---
title: "JS Tips #5: Common Denominators"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2023-01-04 09:00"
categories:
  - js
  - ts
  - javascript
  - typescript
tags:
  - js
  - ts
  - javascript
  - typescript
---

### The Problem: Common Denominators

link to the [kata](https://www.codewars.com/kata/54d7660d2daf68c619000d95)

You will have a list of rationals in the form

`[ [numer_1, denom_1] , ... [numer_n, denom_n] ] `

where all numbers are positive ints. You have to produce a result in the form:

`(N_1, D) ... (N_n, D)`

in which `D` is as small as possible and

`N_1/D == numer_1/denom_1 ... N_n/D == numer_n,/denom_n`.

Example:

```
convertFracs([(1, 2), (1, 3), (1, 4)]) returns "(6,12)(4,12)(3,12)"
```

### The Solution

{% include picture img="image-2.webp" ext="jpg" alt="a Kawai cute little cartoon sloth character, teaching math in a classroom, 9:5, beautiful light, soft colour scheme, crayon" %}

```js
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const lcm = (...n) => n.reduce((x, y) => (x * y) / gcd(x, y));

const getDenominators = (lst) => lst.map((x) => x[1]);
const setNumerators = (den, lst) =>
  lst.map((x) => [Math.round((x[0] / x[1]) * den), den]);

const stringify = (lst) => lst.map((x) => `(${x[0]},${x[1]})`);

function convertFrac(lst) {
  if (lst.length === 0) return "";

  const d = getDenominators(lst);
  const l = lcm(...d);
  const n = setNumerators(l, lst);

  const result = stringify(n);

  return result.join("");
}
```

```js
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a * b) / gcd(a, b);

function convertFrac(arr) {
  const cd = arr.reduce((a, [_, d]) => lcm(d, a), 1);
  return arr.map(([n, d]) => `(${(n * cd) / d},${cd})`).join("");
}
```
