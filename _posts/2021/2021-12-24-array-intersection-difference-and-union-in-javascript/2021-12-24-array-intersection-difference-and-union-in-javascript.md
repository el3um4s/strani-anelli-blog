---
title: "Array Intersection, Difference, and Union in JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Pierre Bamin**](https://unsplash.com/@bamin)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-24 13:10"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Something went wrong at the North Pole. Santa Claus did a sample check: he discovered that some gifts are missing in the bags. Fortunately, everything is recorded and we can compare the various lists to find the differences. We can add the missing packages.

### The Puzzle: Find The Missing Presents 🎁

{% include picture img="cover.webp" ext="jpg" alt="" %}

I think [Dev Advent Calendar problem 23 🎅](https://github.com/devadvent/puzzle-23) is the one with the shortest solution: literally 2 lines of code are enough to solve it:

<script src="https://gist.github.com/el3um4s/96ea733118a96c3017f2ad9b0e4468c9.js"></script>

The question is "_how do I find elements that are in one array but not the other?_".

### Find the differences between 2 arrays

To answer this question just combine two methods of arrays:

- [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), returns a new array containing all elements that pass a given test
- [Array.prototype.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes), returns the value `true` if the array contains a specified element

I can then derive this function:

<script src="https://gist.github.com/el3um4s/70b5c78ea5560089f70e77cc70e5851f.js"></script>

The second part of the puzzle involves returning an array of objects taken from the array with the elements just found. I can change the function like this:

<script src="https://gist.github.com/el3um4s/c89f2a331fd77b011b450f5ec2882293.js"></script>

I can shorten the code by modifying the test passed to `filter`. Another way to calculate the difference is to say that the element `x` is included in `a` but not in `b`:

<script src="https://gist.github.com/el3um4s/07f409f0abe5885c833a49924cf5ab01.js"></script>

### Symmetric difference between two arrays

Another interesting problem is figuring out how to calculate the symmetric difference between two arrays in JavaScript. Basically I want to find all the elements that belong to one array but not the other.

There are two posts, from some time ago, that were useful to me:

- [Array intersection, difference, and union in ES6](https://medium.com/@alvaro.saburido/set-theory-for-arrays-in-es6-eb2f20a61848)
- [JavaScript Algorithm: Find Difference Between Two Arrays](https://javascript.plainenglish.io/javascript-algorithm-find-difference-between-two-arrays-ed8df86c4924)

I can find them by running two filters in sequence and then joining the arrays with the [Array.prototype.concat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) method or with the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax):

<script src="https://gist.github.com/el3um4s/89d8c0b70a9df30db118fac8174e0d65.js"></script>

### Intersection of two arrays

Another common operation is to calculate the intersection of two arrays. In other words, how can we get a new array containing all the elements present at the same time in the two starting arrays?

Again with the `filter` method:

<script src="https://gist.github.com/el3um4s/49482206246d02f227956aa026f84724.js"></script>

Said in words, they are all the elements of `a` present in `b`.

### Union of two arrays

The last operation is the union of two arrays. There are two ways of defining this operation. We can simply merge two arrays without caring for any duplicate values:

<script src="https://gist.github.com/el3um4s/b89de3ddd26481bfeea4a8f10067a19b.js"></script>

In some situations we want to avoid having repeated values. In this case it is better to use a [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set): it is a JavaScript object that only collects different values, preventing us from creating duplicates.

I can convert an array to a set just like this:

<script src="https://gist.github.com/el3um4s/fae53a6748a812209d9c133e5330cefd.js"></script>

The reverse operation, converting a set to an array, is simple:

<script src="https://gist.github.com/el3um4s/8108db05ced1a9d3f3bd2b3ad2c1ed59.js"></script>

I can join two arrays without repeating the double values ​​with this function:

<script src="https://gist.github.com/el3um4s/15c15ce2565aed1e2e1db25fd2b5c1cb.js"></script>

Okay, maybe I went a little off topic from today's exercise. But it was the right occasion for me to review the arrays.
