---
title: "JS Tips #1: Human Readable Time"
published: true
date: 2022-12-27 09:00
categories:
  - JavaScript
  - TypeScript
tags:
  - JavaScript
  - TypeScript
cover: image.webp
lang: en
---

I have decided to continue writing my solutions to CodeWars puzzles in JavaScript and TypeScript. My goal is to continue practicing and not be satisfied with my current knowledge. So I am starting this "column" of tips on JavaScript and TypeScript. And I am starting today with the first problem: given a number, how can I transform it into a human-readable time?

### The Problem: Human Readable Time

link to the [kata](https://www.codewars.com/kata/52685f7382004e774f0001f7)

Write a function, which takes a non-negative integer (seconds) as input and returns the time in a human-readable format (`HH:MM:SS`)

`HH` = hours, padded to 2 digits, range: 00 - 99
`MM` = minutes, padded to 2 digits, range: 00 - 59
`SS` = seconds, padded to 2 digits, range: 00 - 59

The maximum time never exceeds `359999` (`99:59:59`)

### My Solution

![Immagine](./image-2.webp)

The problem is rated `5 kyu`. It is a wrong rating: it is easier. The most complicated part is counting the number of seconds in a minute and in an hour. Spoiler: there are always `60` seconds in a minute, and `3600` seconds in an hour.

Knowing this, I can use the [Remainder Operator (`%`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder) to get the values I need:

```ts
const getSeconds = (s: number): number => s % 60;
const getMinutes = (s: number): number => Math.floor((s % 3600) / 60);
const getHours = (s: number): number => Math.floor(s / 3600);
```

The second difficulty is understanding how to convert numbers into a string. Or, more precisely, how to make sure that one-digit numbers are preceded by a zero. To do this, I can use the [String.padStart()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart) method, setting the length to `2` and using the `0` character as the `padString`.

```ts
const pad = (n: number): string => n.toString().padStart(2, "0");
```

Finally, I can use the [Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) to create the final string.

```ts
`${pad(hh)}:${pad(mm)}:${pad(ss)}`;
```

By putting all these functions together, I get the solution to my programming problem.

```ts
const getSeconds = (s: number): number => s % 60;
const getMinutes = (s: number): number => Math.floor((s % 3600) / 60);
const getHours = (s: number): number => Math.floor(s / 3600);

const pad = (n: number): string => n.toString().padStart(2, "0");

export function humanReadable(seconds: number): string {
  const s: number = getSeconds(seconds);
  const m: number = getMinutes(seconds);
  const h: number = getHours(seconds);

  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
```
