---
title: "DevAdvent 2022: #21 Fibonacci Numbers"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-12-21 16:00"
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

Christmas is approaching, and this DevAdvent 2022 is also coming to an end. I don't have much time today, so I'll settle for solving a small problem related to Fibonacci numbers and JavaScript. I need an efficient method for checking if a number belongs to the Fibonacci series or not. Preferably without having to rebuild the numerical series every time.

### Fibonacci Numbers

But let's start with the basics. First of all, what is the Fibonacci series? It is a sequence of integers in which each number is the sum of the previous two, except for the first two, which are, by definition, 0 and 1.

The first elements of the series are the numbers:

```js
// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233,
```

### The obvious solution

{% include picture img="image-2.webp" ext="jpg" alt="hyperrealistic sculpture of an opalescent crystalline ammonite fossile encased in a colored glass crystal on a pedestal by ron mueck and duane hanson and damien hirst, hyperrealistic dramatic colored lighting trending on artstation 8 k" %}

The most obvious solution to finding out if a number belongs to the series is to calculate the series itself every time until you reach the sought number. This is an example function:

```js
const isFibonacci = (n) => {
  let a = 0;
  let b = 1;
  if (n == a || n == b) {
    return true;
  }

  let c = a + b;
  while (c <= n) {
    if (c === n) return true;
    a = b;
    b = c;
    c = a + b;
  }
  return false;
};
```

What's the problem with this approach? Well, as the number to be checked grows, the required calculation time increases. It is a workable approach, but not useful in the real world.

### A better solution

{% include picture img="image-3.webp" ext="jpg" alt="hyperrealistic sculpture of an opalescent crystalline ammonite fossile encased in a colored glass crystal on a pedestal by ron mueck and duane hanson and damien hirst, hyperrealistic dramatic colored lighting trending on artstation 8 k" %}

To solve the problem, it is useful to study the properties of the Fibonacci sequence a bit. [Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_sequence) comes to the rescue and cites Jacques Philippe Marie Binet. Binet was a French mathematician. Among his discoveries we can count a formula that allows us to [calculate the nth number](https://en.wikipedia.org/wiki/Jacques_Philippe_Marie_Binet) of the Fibonacci series:

```
F(n) = (φ^n - (1-φ)^n) / sqrt(5)
```

where `F(n)` is the nth number of the Fibonacci series, and `φ` (`phi`) is the golden ratio, which is approximately equal to `1.61803398875.`

Here is a JavaScript function that implements the Binet's formula for calculating the nth Fibonacci number:

```js
const fibonacci = (n) => {
  const phi = (1 + Math.sqrt(5)) / 2;
  return Math.round(
    (Math.pow(phi, n + 1) - Math.pow(1 - phi, n + 1)) / Math.sqrt(5)
  );
};
```

Or, if you prefer, you can use the following function:

```js
const fibonacci = (n) => {
  const x = n - 1;
  const sqr = 5 ** 0.5;
  const a = (1 + sqr) ** x;
  const b = (1 - sqr) ** x;
  const c = 2 ** x * sqr;
  return Math.round((a - b) / c);
};
```

This function takes a single argument `n`, which is the index of the Fibonacci number to be calculated. It returns the calculated Fibonacci number.

For example, to calculate the 8th Fibonacci number, you could call the function like this:

```js
console.log(fibonacci(8)); // Output: 13
```

Starting from Binet's formula, I can derive a formula to check whether a number belongs to the Fibonacci sequence:

```
if (5 * N^2 + 4) or (5 * N^2 - 4) is a perfect square, then the number is part of the Fibonacci sequence
```

Based on this definition, I can write the function `isFibonacci(n)`:

```js
const isFibonacci = (n) => {
  const x1 = 5 * n ** 2 + 4;
  const x2 = 5 * n ** 2 - 4;
  return Number.isInteger(Math.sqrt(x1)) || Number.isInteger(Math.sqrt(x2));
};
```

This function takes a single argument `n`, which is the number to be checked. It returns `true` if the number is a Fibonacci number, and `false` if it is not.

For example, to check if the number 13 is a Fibonacci number, you could call the function like this:

```js
console.log(isFibonacci(13)); // Output: true
```

I can write the same function more concisely:

```js
const isFibonacci = (n) =>
  Number.isInteger((5 * n ** 2 + 4) ** 0.5) ||
  Number.isInteger((5 * n ** 2 - 4) ** 0.5);
```

### How to find the position of a number in the Fibonacci series?

{% include picture img="image-4.webp" ext="jpg" alt="hyperrealistic sculpture of an opalescent crystalline ammonite fossile encased in a colored glass crystal on a pedestal by ron mueck and duane hanson and damien hirst, hyperrealistic dramatic colored lighting trending on artstation 8 k" %}

So, to summarize, we have written a JavaScript function to calculate the nth Fibonacci number (`fibonacci(n)`) and another function to check if a number belongs to the Fibonacci sequence (`isFibonacci(n)`). Now we just need to write a function to calculate the position of a Fibonacci number within the sequence.

The simplest solution is also the most resource-intensive and time-consuming:

```js
const fibonacciPosition = (n) => { {
  let position = 0;
  let current = 0;
  let next = 1;
  while (current < n) {
    position++;
    let temp = current;
    current = next;
    next = temp + current;
  }
  if (current === n) {
    return position + 1;
  } else {
    return -1;
  }
}
```

We can write a better function using Binet's formula again:

```js
const fibonacciPosition = (n) => {
  // Calculate the golden ratio
  const phi = (1 + Math.sqrt(5)) / 2;

  // Calculate the position using the formula
  const position = Math.log(n * 5 ** 0.5 + 0.5) / Math.log(phi);

  // Return the position as an integer
  return Math.floor(position) + 1;
};
```

However, there is a problem. The first numbers in the series are special: they are part of the definition of the Fibonacci series itself. Although it is poor programming practice, in this case it is worth adding a couple of conditions at the beginning:

```js
const fibonacciPosition = (n) => {
  if (n === 0) return 1;
  if (n === 1) return 2;

  const phi = (1 + Math.sqrt(5)) / 2;
  const position = Math.log(n * 5 ** 0.5 + 0.5) / Math.log(phi);
  return Math.floor(position) + 1;
};
```

Finally, there is one condition to check, and it is best to check it first. If the number is not a Fibonacci number, then we can skip all the calculations and return the value `-1`:

```js
const fibonacciPosition = (n) => {
  if (!isFibonacci(n)) return -1;
  if (n === 0) return 1;
  if (n === 1) return 2;

  const phi = (1 + Math.sqrt(5)) / 2;
  const position = Math.log(n * 5 ** 0.5 + 0.5) / Math.log(phi);
  return Math.floor(position) + 1;
};
```

With this, I think we have completed the topic.

But before we say goodbye, a small note. In the functions I added the number `1` to the position (both in `fibonacciPosition(n)` and in `fibonacci(n)`) to make the first position have index `1`. However, if we intend to work with arrays, and therefore with objects whose first position has index `0`, then it is simpler not to add anything.
