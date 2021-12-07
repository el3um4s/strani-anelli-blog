---
title: "How To Find The Sum of an Array of Objects in JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Park Troopers**](https://unsplash.com/@parktroopers)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-07 16:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

The elves have prepared many gifts and wrapped many candies. But only good children will receive gifts. The others will get the coal. Santa Claus will decide. He records all the actions done by each child in an old notebook. This year, however, he asked for help to do it faster.

### The puzzle: Making a list, checking it twice 📜

{% include picture img="cover.webp" ext="jpg" alt="" %}

Problem # 6 in [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-6) is about arrays and how to filter them based on a calculated value. It is not a trivial problem. I think it's a common situation. In a nutshell, it's about reducing an array of values to a single number.

### Sum of all elements of an array

Ok, maybe it is better to give an example. This is a child's card:

<script src="https://gist.github.com/el3um4s/74d5280b8e19b9a9992446e6793451d8.js"></script>

Each child has a matched list of actions, some good, some not. Each action corresponds to a value. The sum of the values of each action is used to calculate a score:

<script src="https://gist.github.com/el3um4s/469ac6a9b58895eb932cf6e9ba606d4b.js"></script>

In this case the score is positive, consequently the child deserves a prize:

<script src="https://gist.github.com/el3um4s/97c7cf6c2bd51dc3af1bb1f76a332967.js"></script>

All easy and simple as long as it is a single element. But what if we have hundreds, thousands, millions of children to bring gifts to? Well, Santa certainly can't keep doing everything by hand. Fortunately, there is a method that is right for us, the [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

<script src="https://gist.github.com/el3um4s/9e17f8411e5f373918038b7fa7cbec65.js"></script>

`reduce()` iterates through all elements of an array and performs some operations for each element. The result of each operation is added to the previous result. This way I can calculate the sum of all effects.

### Filter an array

The other part of the problem is a direct consequence of the first. After having found a way to establish whether a child deserves the gift or not, we can create two lists.

In the first we only put the children to bring the gifts to:

<script src="https://gist.github.com/el3um4s/be2832e587b6b2e7240ff9306275dbdd.js"></script>

In the second instead we put the others:

<script src="https://gist.github.com/el3um4s/fb9df92ae724d276480266795fde3b32.js"></script>

In both cases I used the [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method to get only the required children from the list.

### Import JSON into JavaScript

A single note to conclude. The very first thing to do is to import the list of children into the program. The list is in `json` format so it requires special treatment. There are various ways to do this. One requires the use of the [Node.js fs (filesystem) api](https://nodejs.org/api/fs.html):

<script src="https://gist.github.com/el3um4s/6b7a5491249fd850aac3cf2ea7a1e1eb.js"></script>

However, it is a cumbersome way to do a simple thing.

The second method requires some [experimental functions of Node.js](https://nodejs.medium.com/announcing-a-new-experimental-modules-1be8d2d6c2ff). To activate them I had to modify the `package.json` file by adding `-experimental-json-modules`:

<script src="https://gist.github.com/el3um4s/b9791da4c5728a8cd6c0176571b9ad4f.js"></script>

Then in the `naughtyOrNice.js` file I imported the file as a JavaScript object:

<script src="https://gist.github.com/el3um4s/d15c8a076a3aca9398d49016b4c96656.js"></script>

It works and is elegant.

In the future, you probably won't need to use `--experimental-json-modules`. There is an interesting proposal, [tc39/proposal-json-modules](https://github.com/tc39/proposal-json-modules), in stage 3, which will allow you to import JSON modules in JavaScript. In this case the syntax will be like this:

<script src="https://gist.github.com/el3um4s/669f4d3c748bd1fbc29efa195ab9c749.js"></script>

Well, that's all for today.
