---
title: How To Get Unique Values From a List in JavaScript
published: true
date: 2021-12-06 15:00
categories:
  - DevAdvent
  - JavaScript
tags:
  - how-to-get-unique-values-from-a-list-in-javascript
  - DevAdvent
  - JavaScript
lang: en
cover: image.webp
description: "Finally the elves have put aside their business ambitions and are back to their job: helping Santa with gifts for the children. They are late with the preparations and have to hurry to prepare the packages. As if that weren't enough Santa Claus has decided to add some candies."
---

Finally the elves have put aside their business ambitions and are back to their job: helping Santa with gifts for the children. They are late with the preparations and have to hurry to prepare the packages. As if that weren't enough Santa Claus has decided to add some candies.

### The puzzle: Prepare Bags of Candy 🍫🍬🍭

![Immagine](./cover.webp)

Today's problem can be broken down into two distinct parts. The first involves the creation of a Universally Unique IDentifier (UUID). The second is related to the manipulation of arrays from which to select "n" random and non-repeated items. Or, in other words, how to get unique values from a list in JavaScript.

### JavaScript function to create a UUID identifier

I didn't follow [Marc Backes](https://twitter.com/themarcba)' advice. The suggestion was to use the [uuid](https://www.npmjs.com/package/uuid) package to generate unique codes. For a "real" project I probably would have done this. Instead, I decided to create a standalone function to achieve the same result. To do this I followed the suggestions of an exercise page from [w3resource](https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php):

```js
function create_UUID() {
  let dt = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
```

Basically I generated a sequence of random numbers starting from a date. I used a character string as a template to ensure a unique format. This way I can easily generate unique code without the need for external dependencies.

### Get unique values from a list in JavaScript

The second problem concerns choosing an unknown quantity of elements from an array. There are various ways of dealing with this situation. Many solutions involve using some form of a `for loop`.

However, I am increasingly convinced that I can reduce the complexity of my code by avoiding loops as much as possible. I didn't have time to verify my hypothesis, maybe I'll come back to it in the future.

What do I want to do? Well, since I start from an array containing all the elements I need, I just need to mix the order of the various elements to get a new array. Then from this array I extract the first n elements.

```js
function createRandomArray(list, count = 3) {
  const randomList = list.sort(() => Math.random() - 0.5);
  return randomList.slice(0, count);
}
```

The hardest thing was figuring out how to shuffle an array. There are several posts on the internet that explain how to do it. One of the best explanations is [this post by Flavio Copes](https://flaviocopes.com/how-to-shuffle-array-javascript/). By the way, I recommend browsing his blog, it is full of interesting tips and tricks.

Another request is to return an error if too many candies are requested. In this case, a simple condition is sufficient:

```js
if (count > list.length) {
  throw new Error("TOO_MUCH_CANDY_PER_BAG");
}
```

### Let's put it all together

After writing the two functions it is quite simple to solve today's puzzle:

```js
import { default as candyList } from "../data/candy.js";

export const generateCandyBags = (bagCount = 0, candyCount = 3) => {
  let bags = [];
  for (let i = 0; i < bagCount; i++) {
    bags.push({
      id: create_UUID(),
      candies: createRandomArray(candyList, candyCount),
    });
  }

  return bags;
};

function create_UUID() {
  let dt = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function createRandomArray(list, count = 3) {
  if (count > list.length) {
    throw new Error("TOO_MUCH_CANDY_PER_BAG");
  }
  const randomList = list.sort(() => Math.random() - 0.5);
  return randomList.slice(0, count);
}
```

That's all for today's problem. But before saying goodbye, I want to give a little consideration. When I decided to participate in this **Dev Advent Calendar** I didn't know how difficult the questions would be. The puzzles are fast. Writing these post less. But I find it very instructive to report what I am learning. I realize that I have never spent time on this kind of problems, and in some cases I have always considered them beyond my abilities. I also like the presence of tests: the possibility to test code in real time is very useful. In the future I will have to look for other contests like this.
