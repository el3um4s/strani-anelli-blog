---
title: "DevAdvent 2022: #12 4 Simple Problem in JavaScript and TypeScript"
published: true
date: 2022-12-12 09:00
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

Today's DevAdvent problem is very simple. For this I decided to solve more than one. They are all simple problems, but useful for practice.

### Testing 1-2-3

link to the [Kata](https://www.codewars.com/kata/54bf85e3d5b56c7a05000cf9)

Your team is writing a fancy new text editor and you've been tasked with implementing the line numbering.

Write a function which takes a list of strings and returns each line prepended by the correct number.

The numbering starts at 1. The format is n: string. Notice the colon and space in between.

Examples: (Input --> Output)

```
[] --> []
["a", "b", "c"] --> ["1: a", "2: b", "3: c"]
```

You can solve this problem in one simple line. I can use the [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) method together with template literals.

In TypeScript:

```ts
export const number = (arr: string[]): string[] =>
  arr.map((s, i) => `${++i}: ${s}`);
```

And in JavaScript:

```js
export const number = (arr) => arr.map((s, i) => `${++i}: ${s}`);
```

### Even or Odd

link to the [Kata](https://www.codewars.com/kata/53da3dbb4a5168369a0000fe)

![Immagine](./image-2.webp)

Create a function that takes an integer as an argument and returns "Even" for even numbers or "Odd" for odd numbers.

The most common solution is to use the [remainder operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder) ( `%`). If I divide a number by two, and the remainder equals zero, then that number is even.

In TypeScript:

```ts
export const even_or_odd = (n: number): string =>
  n % 2 === 0 ? "Even" : "Odd";
```

And in JavaScript:

```js
export const even_or_odd = (n) => (n % 2 === 0 ? "Even" : "Odd");
```

But there is a slightly different and more mathematically interesting method. We can also represent a number as binary. And we can use the [Bitwise AND (&) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND) to check the value of the last bit. Why only the value of the last bit? Because if it's the last bit it's `1` then the number is odd, if it's `0` then it's even (if you're curious see [this pdf](http://homepages.math.uic.edu/~scole3/mcs260_fall2011/binary.pdf)).

In TypeScript:

```ts
export const even_or_odd = (n: number): string => (n & 1 ? "Odd" : "Even");
```

In JavaScript:

```js
export const even_or_odd = (n) => (n & 1 ? "Odd" : "Even");
```

### Return Negative

link to the [Kata](https://www.codewars.com/kata/55685cd7ad70877c23000102)

![Immagine](./image-3.webp)

In this simple assignment you are given a number and have to make it negative. But maybe the number is already negative?

The number can be negative already, in which case no change is required. Zero (0) is not checked for any specific sign. Negative zeros make no mathematical sense.

Examples

```
makeNegative(1);  // return -1
makeNegative(-5); // return -5
makeNegative(0);  // return 0
```

In this case I know that the number to get is always negative. I can check if it already is and do nothing. Or I can take the absolute value of the number and then return its negative.

In TypeScript:

```ts
export const makeNegative = (num: number): number => -Math.abs(num);
```

In JavaScript:

```js
export const makeNegative = (num) => -Math.abs(num);
```

### Convert boolean values to strings 'Yes' or 'No'.

link to the [Kata](https://www.codewars.com/kata/53369039d7ab3ac506000467)

Complete the method that takes a boolean value and return a "Yes" string for true, or a "No" string for false.

In this case I use a [ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) to return the correct value.

In TypeScript:

```ts
export const boolToWord = (bool: boolean): string => (bool ? "Yes" : "No");
```

In JavaScript:

```js
export const boolToWord = (bool) => (bool ? "Yes" : "No");
```
