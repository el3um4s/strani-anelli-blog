---
title: "DevAdvent 2022: #8 Descending Order"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-12-08 09:00"
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

Today's DevAdvent problem is an exercise in number ordering. But with an interesting variation: it requires you to break down a number and use its digits to get the highest possible number. In some ways it is related to the two previous problems ([How To Get Min Or Max Of An Array In JavaScript And TypeScript](https://medium.com/@el3um4s/how-to-get-min-or-max-of-an-array-in-javascript-and-typescript-ed1087c080cf) and [5 Ways to Convert a Number to a String in JavaScript](https://medium.com/@el3um4s/5-ways-to-convert-a-number-to-a-string-in-javascript-8335c233357f))

### The problem

link to the [Kata](https://www.codewars.com/kata/5467e4d82edf8bbf40000155)

Your task is to make a function that can take any non-negative integer as an argument and return it with its digits in descending order. Essentially, rearrange the digits to create the highest possible number.

Examples:
Input: `42145` Output: `54421`

Input: `145263` Output: `654321`

Input: `123456789` Output: `987654321`

### My solution

{% include picture img="image-2.webp" ext="jpg" alt="kawai cute little representation of math concept of biggest number, beautiful light. soft colour scheme, 8 k render" %}

The solution I propose is divided into 5 steps:

1. Convert the number to a string (this is necessary because the number is not iterable)
   ```ts
   const str: string = "" + n;
   ```
2. Convert the string to an array of characters
   ```ts
   const strArray: string[] = [...str];
   ```
3. Sort the array of characters
   ```ts
   const sortedArray: string[] = strArray.sort((a, b) => +b - +a);
   ```
4. Join the array of characters
   ```ts
   const arrayJoined: string = sortedArray.join("");
   ```
5. Convert the string to a number
   ```ts
   const result = +arrayJoined;
   ```

By putting the various pieces together I get this function

```ts
export function descendingOrder(n: number): number {
  const str: string = "" + n;
  const strArray: string[] = [...str];
  const sortedArray: string[] = strArray.sort((a, b) => +b - +a);
  const arrayJoined: string = sortedArray.join("");
  return +arrayJoined;
}
```

I can write a more concise version by merging the various steps into one

```ts
export const descendingOrder = (x: number): number =>
  +[...("" + x)].sort((a, b) => +b - +a).join("");
```

Starting from this version I can get the equivalent in JavaScript.

```js
export const descendingOrder = (x) =>
  +[...("" + x)].sort((a, b) => +b - +a).join("");
```

I'll stop here for today. Today is the ninth anniversary of my first date with my wife. Enough coding for today. Time to spend the day with my bride.
