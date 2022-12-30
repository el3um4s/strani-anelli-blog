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

Today's task involves finding the common denominator of a series of fractions. Then, calculating the numerator of each fraction and returning a string with the new fractions. This is a fairly simple math problem, but it requires some prior knowledge. This forced me to review old concepts and, above all, to write a couple of auxiliary functions. But let's start from the beginning.

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
convertFracs( [(1, 2], [1, 3], [1, 4]]) returns "(6,12)(4,12)(3,12)"
```

### The Solution

{% include picture img="image-2.webp" ext="jpg" alt="a Kawai cute little cartoon sloth character, teaching math in a classroom, 9:5, beautiful light, soft colour scheme, crayon" %}

Beyond the particularities of the language used, the problem has a strong mathematical connotation. To solve it, I divide the question into various parts so that I can tackle it more easily.

The first operation to do is to find all the denominators of the fractions. In this JavaScript exercise, the fractions are represented as elements of an array. The first element is the numerator, the second is the denominator. Each fraction is itself an element of an array. So, starting from this, I can extract the numerators and denominators with specific functions:

```js
const getNumerators = (lst) => lst.map((x) => x[0]);
const getDenominators = (lst) => lst.map((x) => x[1]);
```

To find the common denominator of all fractions, I need to find the least common multiple (`LCM`) of the denominators. To do this, I need a function that calculates the greatest common divisor (`GCD`) of two numbers:

```js
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const lcm = (...n) => n.reduce((x, y) => (x * y) / gcd(x, y));
```

I dedicated two posts to these two functions, explaining the reasoning I used to write the code. If you are interested, you can read them here:

- [How to Find the Greatest Common Divisor in JavaScript](https://el3um4s.medium.com/how-to-find-the-greatest-common-divisor-in-javascript-c1333aa313db)
- [How to Calculate the Least Common Multiple in JavaScript](https://el3um4s.medium.com/how-to-calculate-the-least-common-multiple-in-javascript-92248b24a476)

After finding the least common multiple, all that's left is to calculate the numerator of the fractions. To do this, I must multiply the common denominator by the ratio between the numerator and denominator of the fraction:

```js
const setNumerators = (den, lst) =>
  lst.map((x) => [Math.round((x[0] / x[1]) * den), den]);
```

Finally, I write a simple function to convert the individual fractions into a string:

```js
const stringify = (lst) => lst.map((x) => `(${x[0]},${x[1]})`);
```

Here is the complete code:

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

Obviously this function can be improved. I can use the `Array.reduce()` method for the common denominator:

```js
const cd = lst.reduce((a, [_, d]) => lcm(d, a), 1);
```

I can also use the `Array.map()` method to calculate the new numerators, already converted to a string:

```js
const num = lst.map(([n, d]) => `(${(n * cd) / d},${cd})`);
```

After these changes, the function becomes:

```js
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a * b) / gcd(a, b);

function convertFrac(lst) {
  const cd = lst.reduce((a, [_, d]) => lcm(d, a), 1);
  return lst.map(([n, d]) => `(${(n * cd) / d},${cd})`).join("");
}
```
