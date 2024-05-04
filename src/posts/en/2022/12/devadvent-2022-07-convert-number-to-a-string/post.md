---
title: "DevAdvent 2022: #7 Convert a Number to a String!"
published: true
date: 2022-12-07 13:00
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

Today's problem of this DevAdvent 2022 is really simple. I could categorize it among the essential things to know in JavaScript: how to convert a number to a string. But although it is a simple problem, there are various solutions. Let's see what they are.

### The problem

link to the [Kata](https://www.codewars.com/kata/5265326f5fda8eb1160004c8)

We need a function that can transform a number (integer) into a string. What ways of achieving this do you know?

Examples

```
123  --> "123"
999  --> "999"
-100 --> "-100"
```

### My solution: template literals

![Immagine](./image-2.webp)

The first solution that comes to mind is to use [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). Mozilla defines them like this:

```
Template literals are literals delimited with backtick (`) characters, allowing for multi-line strings, string interpolation with embedded expressions, and special constructs called tagged templates.
```

Consequently this is my solution:

```js
const numberToString = (x) => `${x}`;
```

### Number.toString()

![Immagine](./image-3.webp)

But that's not the only way forward. One solution is to use the [Number.toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString) method. In some cases it is even the best solution.

```js
const numberToString = (x) => x.toString();
```

This method takes one parameter, called `radix`. The radix is an integer in the range `2` through `36` specifying the base to use for representing the number value. Defaults to 10.

Basically it allows you to convert a number from one base to another and get a string with the result. The only thing to remember is that to use it directly on a number (and not on a variable) you need to surround the number itself with tone brackets.

```js
10.toString(); // SyntaxError: Invalid or unexpected token

(10).toString(); // "10"
(10).toString(2); // "1010"
(10).toString(8); // "12"
(10).toString(16); // "a"
```

### String()

Another way to convert a number to string in JavaScript can be using the [String() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/String). The String constructor is used to create a new String object. When called instead as a function, it performs type conversion to a primitive string.

```js
const numberToString = (x) => x.toString();
```

But if we decide to go this route we can simplify the code even more:

```js
const numberToString = String;
```

In doing so I combine the numberToString constant with the String() constructor. So writing `numberToString(10)` is the same as writing `String(10)`. It's a matter of taste.

### String concatenation

Another possible variation is to use string concatenation. This forces JS to convert the number to a string automatically. It's a variation of my solution:

```js
const numberToString = (x) => "" + x;
```

### Custom toString()

![Immagine](./image-4.webp)

The last solution is the most complicated. But certainly the most intriguing. It's about reproducing the toString() method, to analyze its algorithm. This code aims to do what `toString()` does (for integers), but without using the built-in function.

Not my code, but [Xormias'](https://www.codewars.com/users/XoRMiAS).

```js
function numberToString(num) {
  //create a new empty string in which the result will be written
  var str = "";

  //Check, whether the number is positive or negative. The multiplier 1 or -1 will be saved for later
  const mult = num < 0 ? -1 : 1;

  //Take the absolut value of num. Could also be done with Math.abs
  num *= mult;

  //Loop, which will run as often as num has digits
  do {
    //Take the least significant digit of num (num % 10), add 48 and get the associated ascii character. The number 0 has the ascii value of 48, 1 = 49... 9 = 57.
    //Then prepend that character to the string.
    str = String.fromCharCode((num % 10) + 48) + str;

    //Remove the least significant digit from num. (Divide by ten, then round down)
    num = ~~(num / 10);
  } while (num > 0);

  //If the input number was negative, prepend a -.
  if (mult < 0) str = "-" + str;
  return str;
}
```

I've come up with 5 ways to convert a number to string. From the simplest to the most complex. It wasn't such a trivial problem, in the end.
