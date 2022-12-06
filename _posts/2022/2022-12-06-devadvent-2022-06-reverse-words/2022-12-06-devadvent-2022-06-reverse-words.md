---
title: "DevAdvent 2022: #6 Reverse Words"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-12-06 10:00"
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

Today's problem is how to reverse the order of the letters in a word, and of each word in a sentence. It's a fairly simple problem but one that shouldn't be underestimated. It allows you to test your knowledge of arrays and strings.

### The problem

link to the [Kata](https://www.codewars.com/kata/5259b20d6021e9e14c0010d4)

Complete the function that accepts a string parameter, and reverses each word in the string. All spaces in the string should be retained.

Examples

```
"This is an example!" ==> "sihT si na !elpmaxe"
"double  spaces"      ==> "elbuod  secaps"
```

### The solution

{% include picture img="image-2.webp" ext="jpg" alt="robot humanoid grabbing a book" %}

The first thing to do is to read the problem well. It's not just about reversing the order of the letters in a word or phrase. It's not just about reversing the order of the letters in a word or phrase. But it may be useful to start from this part, to understand how to deal with the problem.

So, I need a function that converts a string to an array of letters. I can do this using the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax).

```ts
const reverseString = (str: string): string[] => [...str];
```

After getting an array I use the [Array.reverse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) method to ...reverse the order of the elements of the array.

```ts
const reverseString = (str: string): string[] => [...str].reverse();
```

Finally I concatenate the various elements again to obtain a string (I use the [Array.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) method)

```ts
const reverseString = (str: string): string => [...str].reverse().join("");
```

Now I have a function that I can reuse to reverse the order of the letters in a word. I just have to apply it to a sentence. But first I have to break each sentence into words. I can do this using the [String.split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split) method.

```ts
const words: string[] = str.split(" ");
```

To change each word I use the [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method combined with the reverseString() function. This way I get this function:

```ts
const reverseString = (str: string): string => [...str].reverse().join("");

export function reverseWords(str: string): string {
  const words: string[] = str.split(" ");
  const invertedWords: string[] = words.map((w) => reverseString(w));
  const result: string = invertedWords.join(" ");
  return result;
}
```

I can refractor the function like this:

```ts
const reverseString = (str: string): string => [...str].reverse().join("");

export function reverseWords(str: string): string {
  const invertedWords: string = str
    .split(" ")
    .map((w) => reverseString(w))
    .join(" ");
  return invertedWords;
}
```

And then like this:

```ts
const reverseString = (str: string): string => [...str].reverse().join("");

export const reverseWords = (s: string): string =>
  s
    .split(" ")
    .map((w) => reverseString(w))
    .join(" ");
```

What about the JavaScript version? Well, I remove the types and I get:

```js
const reverseString = (str) => [...str].reverse().join("");

export const reverseWords = (s) =>
  s
    .split(" ")
    .map((w) => reverseString(w))
    .join(" ");
```
