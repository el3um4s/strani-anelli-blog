---
title: "JS Tips #3: Greatest common divisor"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image-7"
  immagine_estesa: "image-7"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-12-30 14:45"
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

The problem today is related to mathematics. Specifically, it is about finding the greatest common divisor of two positive integers. In mathematics, the greatest common divisor of two integers `a` and `b`, which are not both equal to zero, is denoted by `GCD(a,b)` and is the largest natural number by which both can be divided.

### The Problem: Greatest Common Divisor

link to the [kata](https://www.codewars.com/kata/5500d54c2ebe0a8e8a0003fd)

Find the greatest common divisor of two positive integers. The integers can be large, so you need to find a clever solution.

The inputs `x` and `y` are always greater or equal to `1`, so the greatest common divisor will always be an integer that is also greater or equal to `1`.

### The Solution: The Euclidean Algorithm

{% include picture img="image-2.webp" ext="jpg" alt="a Kawai cute little cartoon robot character,  teaching math in a classroom, beautiful light, soft colour scheme, 8 k render" %}

The greatest common divisor can be calculated, in principle, by determining the prime factorization of the two given numbers and multiplying the common factors, considered only once with their smallest exponent.

This method is only practical for very small numbers: the prime factorization of a number generally takes too much time.

A much more efficient method is provided by the Euclidean algorithm. Wikipedia has a nice page dedicated to the [Euclidean algorithm](https://en.wikipedia.org/wiki/Euclidean_algorithm), so I recommend reading it.

In summary, there are 3 different ways to get the Greatest Common Divisor. The first method is the one used by Euclid and uses subtraction.

```js
function gcd(a, b) {
  while (a !== b) {
    if (a > b) {
      a -= b;
    } else {
      b -= a;
    }
  }
  return a;
}
```

The second method uses multiplication.

```js
function gcd(a, b) {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}
```

Finally, the third method is a recursive function.

```js
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
```

But there are also other methods.

### Method of least absolute remainders

{% include picture img="image-3.webp" ext="jpg" alt="a Kawai cute little cartoon robot character,  teaching math in a classroom, beautiful light, soft colour scheme, 8 k render" %}

The method of least absolute remainders is a variant of the Euclidean algorithm that is used to find the GCD of two integers. It is based on the observation that the GCD of two integers is equal to the GCD of the absolute values of their remainders. This method is particularly useful when the input integers may be negative, as it ensures that the GCD is always a positive integer.

```js
function gcd(a, b) {
  if (a === 0 || b === 0) {
    return Math.max(a, b);
  }
  let r = a % b;
  while (r) {
    a = b;
    b = r;
    r = a % b;
  }
  return Math.abs(b);
}
```

### The binary GCD algorithm

{% include picture img="image-6.webp" ext="jpg" alt="a Kawai cute little cartoon robot character,  teaching math in a classroom, beautiful light, soft colour scheme, 8 k render" %}

The binary GCD algorithm is an efficient variant of the Euclidean algorithm that uses bitwise operations and recursive calls to find the GCD of two integers. It has a time complexity of O(log n), where n is the larger of the two input integers, making it faster than other GCD algorithms in certain cases. However, it requires more memory due to the use of recursive calls, and may not always be the most suitable algorithm to use.

```js
function gcd(a, b) {
  if (a === 0 || b === 0) {
    return Math.max(a, b);
  }
  if (a === b) {
    return a;
  }
  if (a % 2 === 0 && b % 2 === 0) {
    return 2 * gcd(a / 2, b / 2);
  }
  if (a % 2 === 0) {
    return gcd(a / 2, b);
  }
  if (b % 2 === 0) {
    return gcd(a, b / 2);
  }
  return gcd(Math.abs(a - b), Math.min(a, b));
}
```
