---
title: "DevAdvent 2022: #1 Square Every Digit"
published: true
date: 2022-12-01 16:00
categories:
  - DevAdvent
  - TypeScript
  - JavaScript
tags:
  - DevAdvent
  - TypeScript
  - square-every-digit
  - JavaScript
cover: image.webp
lang: en
---

The Twitter world is in turmoil. I've decided to abandon it. I am certainly missing something. For example I don't know if anyone is organizing a DevAdvent like last year. It was a good experience last year and I would like to repeat it. But I don't have all the time I had last year. So I decided to do something spurious: every day I will choose a random problem from those proposed by [CodeWars](https://www.codewars.com/) and try to solve it. Let's see how it goes.

### The problem

Today's problem is [Square Every Digit](https://www.codewars.com/kata/546e2562b03326a88e000020). The problem is very simple: given a number, return a number obtained by squaring each digit of the number. For example, if the number is 9119, the result will be 811181. If the number is 0, the result will be 0.

### The solution

![Immagine](./image-2.webp)

The solution I propose (in TypeScript) is this:

```ts
export class Kata {
  static squareDigits(num: number): number {
    const char: string = num.toString();
    const result: string = [...char].map((c) => parseInt(c) ** 2).join("");
    return parseInt(result);
  }
}
```

I can also write the solution in JavaScript:

```js
function squareDigits(num) {
  const char = num.toString();
  const result = [...char].map((c) => parseInt(c) ** 2).join("");
  return +result;
}
```

### Explanation

I can break the problem into several pieces in order to simplify the various steps.

First I convert the number to a string.

```ts
// ts
const char: string = num.toString();

// js
const char = num.toString();
```

Why am I doing this? Because this allows me to extract every single digit of the number. I can use the [toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) method, or concatenate the empty string with the number. Both methods work the same way.

```ts
// ts
const char: string = "" + num;

// js
const char = "" + num;
```

The problem and the tests are about positive numbers, but it's also interesting to consider negative numbers. I can resolve the issue in various ways. I can use [Math.abs()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs) method to convert number to positive.

```ts
// ts
const char: string = Math.abs(num).toString();
const char: string = "" + Math.abs(num);

// js
const char = Math.abs(num).toString();
const char = "" + Math.abs(num);
```

After finding the string I can convert it to an array so that I can use the [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method.

Then I transform a string into an array using the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax):

```ts
// ts
const array: Array<string> = [...char];

// js
const array = [...char];
```

To make the power of a number I can use the [Exponentiation operator (\*\*)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Exponentiation)

```ts
// ts
const result: number = 2 ** 3;

// js
const result = 2 ** 3;
```

To convert a string to a number I can use the [parseInt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) method.

```ts
// ts
const result: number = parseInt("123");

// js
const result = parseInt("123");
```

Instead to convert an array into a string I use the [Array.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) method.

Putting this together I get

```ts
// ts
const result: string = [...char].map((c) => parseInt(c) ** 2).join("");

// js
const result = [...char].map((c) => parseInt(c) ** 2).join("");
```

I just have to return the result as a number:

```ts
return parseInt(result);
```

### Other solutions

Obviously it is not the only possible solution. For example, I can use the [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) method to get the result.

```ts
// ts
const result: number = +[...char].reduce((acc, cur) => acc + +cur * +cur, "");
return result;
```

That is to say:

```ts
// ts
export class Kata {
  static squareDigits(num: number): number {
    return +[...("" + Math.abs(num))].reduce(
      (acc, cur) => acc + +cur * +cur,
      ""
    );
  }
}

// js
function squareDigits(num) {
  return +[...("" + Math.abs(num))].reduce((acc, cur) => acc + +cur * +cur, "");
}
```

Another alternative is to use [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) and the [String.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) method.

```ts
// ts
export class Kata {
  static squareDigits(num: number): number {
    return +("" + Math.abs(num)).replace(/\d/g, (x) => (+x * +x).toString());
  }
}

// js
function squareDigits(num) {
  return +("" + Math.abs(num)).replace(/\d/g, (x) => (+x * +x).toString());
}
```
