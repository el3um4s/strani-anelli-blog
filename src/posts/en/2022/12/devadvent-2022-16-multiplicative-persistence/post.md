---
title: "DevAdvent 2022: 16 Multiplicative Persistence"
published: true
date: 2022-12-16 14:00
categories:
  - DevAdvent
  - JavaScript
  - TypeScript
tags:
  - DevAdvent
  - JavaScript
  - TypeScript
cover: image.webp
lang: en
---

The problem for today's DevAdvent involves a mathematical concept that I was not familiar with: the persistence of a number. This worried me a bit. But after understanding the underlying concept, I realized something: beyond its mathematical formulation, the exercise is really simple. But let's start with the problem text.

### The Problem: Persistent Bugger

link to the [Kata](https://www.codewars.com/kata/55bf01e5a717a0d57e0000ec)

Write a function, `persistence`, that takes in a positive parameter `num` and returns its multiplicative persistence, which is the number of times you must multiply the digits in `num` until you reach a single digit.

For example (Input --> Output):

```
39 --> 3 (because 3*9 = 27, 2*7 = 14, 1*4 = 4 and 4 has only one digit)
999 --> 4 (because 9*9*9 = 729, 7*2*9 = 126, 1*2*6 = 12, and finally 1*2 = 2)
4 --> 0 (because 4 is already a one-digit number)
```

### My solution

![Immagine](./image-2.webp)

Let's start with the definition of 'multiplicative persistence'. According to [Wikipedia](https://en.wikipedia.org/wiki/Persistence_of_a_number), the `persistence of a number` is defined as the number of times this operation must be applied to the integer before a fixed point is reached, at which the operation no longer alters the number. Usually, this involves additive or multiplicative persistence of a non-negative integer, which is how often one has to replace the number by the sum or product of its digits until one reaches a single digit.

In other words, the persistence of a number is the number of times you have to multiply the digits of a number until you get a single digit. For example, the persistence of 39 is 3, because you have to multiply the digits 3 and 9 until you get 27, then 2 and 7 until you get 14, then 1 and 4 until you get 4. The persistence of 4 is 0, because 4 is already a single digit.

How can we approach this problem? As usual, it's best to break it down into smaller steps. But first, we need to make a small conceptual abstraction. At first glance, the argument of the operation is a number (like number). But if we think about the problem, we are not interested in the number as a mathematical entity. What we are interested in is the number as a list of digits. In other words, what we are interested in is the number as an array of digits in sequence.

```ts
const digits = (n: number): number[] => [...("" + n)].map(Number);
```

Why is it useful for us to see numbers as arrays? Because this way we can work on each digit using the predefined methods of JavaScript. In this case, I find the [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) method useful. I can use it to multiply each digit by the result of the previous multiplication. The only caution is to set a starting value (in this case 1): by default, the first value is always 0, and multiplication by 0 always gives 0.

```ts
const multiplice = (n: number): number => digits(n).reduce((a, v) => a * v, 1);
```

This function calculates the multiplication of each digit only once. We must repeat the operation several times until there is a number with a single digit. We can use a loop (for example while) or a recursive function. But before deciding, let's think a moment about the exit condition.

We can calculate the length of the number using String.length() or Array.length(). When this value is equal to 1, then we are at the end of the operations to be done.

![Immagine](./image-3.webp)

But there is a faster way to get the same result. Since we are using positive integers, any number less than 10 has only one digit. So we just need a condition like: `n < 10` to exit the loop.

Now I have all the pieces to solve the problem. I can do it using a while loop:

```ts
const digits = (n: number): number[] => [...("" + n)].map(Number);
const multiplice = (n: number): number => digits(n).reduce((a, v) => a * v, 1);

const persistence = (n: number): number => {
  let i = 0;
  while (n >= 10) {
    n = multiplice(n);
    i++;
  }
  return i;
};
```

I can also use a recursive function to get the same result:

```ts
const digits = (n: number): number[] => [...("" + n)].map(Number);
const multiplice = (n: number): number => digits(n).reduce((a, v) => a * v, 1);

const persistence = (n: number, i: number = 0): number =>
  n < 10 ? i : persistence(multiplice(n), ++i);
```

Personally, I like the latter solution: it is short, simple and fairly clear. But we can take it a step further and reduce everything to a single function.

```ts
const persistence = (n: number, i: number = 0): number =>
  n < 10
    ? i
    : persistence(
        [...("" + n)].reduce((a, v) => a * +v, 1),
        ++i
      );
```

The result is a bit more cryptic; I prefer to avoid code that is too "clever": my future self may not be able to read it. However, it is still interesting to see how JavaScript (and TypeScript) can solve a math problem in a few characters.