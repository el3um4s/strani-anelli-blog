---
title: "DevAdvent 2022: #5 Highest and Lowest"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-12-05 10:00"
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

New day, new exercise for my DevAdvent 2023. Over the weekend I discovered a few other devAdvents but still decided not to follow any of them. Instead, I will continue to pick a random problem from CodeWars. [Today's one](https://www.codewars.com/kata/554b4ac871d6813a03000035) is about how to find the minimum and maximum of a series of numbers.

### The problem

In this little assignment you are given a string of space separated numbers, and have to return the highest and lowest number.

Examples

```js
highAndLow("1 2 3 4 5"); // return "5 1"
highAndLow("1 2 -3 4 5"); // return "5 -3"
highAndLow("1 9 3 4 -5"); // return "9 -5"
```

### The solution

{% include picture img="image-2.webp" ext="jpg" alt="page of mysterious mathematical equations" %}

This is my solution for TypeScript:

```ts
export class Kata {
  static highAndLow(numbers: string): string {
    const arr: number[] = numbers.split(" ").map((c) => parseInt(c));
    const max: number = Math.max(...arr);
    const min: number = Math.min(...arr);
    return `${max} ${min}`;
  }
}
```

This is my solution for JavaScript:

```js
function highAndLow(numbers) {
  const arr = numbers.split(" ").map((c) => parseInt(c));
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  return `${max} ${min}`;
}
```

Also in this case I preferred to divide the problem into several steps.

First of all, I split the string into an array of numbers. Then I used the `Math.max` and `Math.min` functions to find the maximum and minimum values. Finally, I returned the result as a string.

To split the string I use the [String.split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split) method. This way I get an array of strings.

```ts
// ts
const arrString: string[] = numbers.split(" ");

//js
const arrString = numbers.split(" ");
```

Then I use the [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method to modify each element of the array. This way I can convert each element to a number.

```ts
// ts
const arrNumber: number[] = arrString.map((c) => parseInt(c));

//js
const arrNumber = arrString.map((c) => +c);
```

Finally, I use the [Math.max()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max) and [Math.min()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min) functions to find the maximum and minimum values.

```ts
// ts
const max: number = Math.max(...arr);
const min: number = Math.min(...arr);

// js
const max = Math.max(...arr);
const min = Math.min(...arr);
```

I can also approach the problem in a slightly different way. After converting the string to an array of numbers, I sort the array. Then I return the first and last item.

```ts
export class Kata {
  static highAndLow(numbers: string) {
    let arr = numbers
      .split(" ")
      .map((x) => parseInt(x))
      .sort((a, b) => a - b);

    return `${arr[arr.length - 1]} ${arr[0]}`;
  }
}
```

```js
function highAndLow(numbers) {
  const arr = numbers
    .split(" ")
    .map((c) => parseInt(c))
    .sort((a, b) => a - b);

  return `${arr[arr.length - 1]} ${arr[0]}`;
}
```
