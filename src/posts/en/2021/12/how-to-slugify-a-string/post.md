---
title: How to slugify a string
published: true
date: 2021-12-04 13:00
categories:
  - DevAdvent
  - JavaScript
tags:
  - how-to-slugify-a-string
  - DevAdvent
  - JavaScript
lang: en
cover: image.webp
description: "New day and new Dev Advent Calendar 2021 puzzle to solve. Santa's elves got a taste for coffee and decided to take the plunge: they want to jump into the world of food delivery. First they have to fix the coffee shop site by adding an API capable of managing orders."
---

New day and new [Dev Advent Calendar 2021](https://github.com/devadvent/readme) puzzle to solve. Santa's elves got a taste for coffee and decided to take the plunge: they want to jump into the world of food delivery. First they have to fix the coffee shop site by adding an API capable of managing orders.

### The puzzle: Elf Coffee Shop API 🧝🥤

![Immagine](./cover.webp)

Today's puzzle is a little more difficult than the previous ones. But it can be easily broken down into two different sub-problems. The first is a simple problem of adding properties to a javascript object. The second instead requires playing with regular expressions. And in my opinion it's also the funniest part. But let's go in order and start from the beginning.

```js
import { slugify } from "./helpers";

const prepareForAPI = (menu) => {
  return menu.map((item) => {
    item.name = (item.flavor ? item.flavor + " " : "") + item.drink;
    item.slug = slugify(item.name);
    return item;
  });
};
```

I use the[map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method to iterate through each menu item and simply add the missing properties. Now all that remains is to fix the `slugify` function.

### How to get a "slugified" version of a text

I was confused. It is a problem that I have never asked myself. But I think it is a frequent situation. I like to face new problems, even if they are new only to me. However, in the text of the puzzle there is a hint: [Remove accents/diacritics in a string in JavaScript](https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript).

A world opened up for me, I didn't know it was possible to use something called [Unicode property escapes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes) to make it easier to create regular expressions. Starting from here, I followed the requests step by step.

To make each character lowercase I obviously used the [String.prototype.toLowerCase()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase) method: `text.toLowerCase()`.

To replace all the weird letters (including accented ones) I used this code: `text.normalize("NFD").replace(/\p{Diacritic}/gu, "")`. However, this does not solve the problem of emojis in the menu. Elves love emojis. One solution might be to use something like `replace(/\p{Emoji}/gu, "-"`. It works, but is redundant with the next request.

In fact, to replace all alphanumeric characters (including emojis) I can use the regex `.replace(/[^a-zA-Z0-9_\s-]/gu, " ")`. I replace everything with spaces, not directly with dashes (`-`). Why? Because in this way I can directly use `trim()` to eliminate the empty spaces at the beginning and at the end of the string.

The next step is to replace all spaces with dashes. I can use `.replace(/\s+/gu, "-")` to turn each sequence of spaces into a single dash.

I put it all together and I get the `slugify` function:

```js
const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9_\s-]/gu, " ")
    .trim()
    .replace(/\s+/gu, "-");
};
```

Well, that's it for today. I am curious to discover the puzzle of tomorrow.
