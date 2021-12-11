---
title: "How To Generate a Random Password Using JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [unsplash](https://unsplash.com/@moneyphotos)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-12 13:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

The North Pole has security concerns. First [Santa Claus loses the message code](https://el3um4s.medium.com/how-to-convert-from-binary-to-text-in-javascript-and-viceversa-b617d9044436)). Then the elf in charge of the keys always uses the same one. Time to change all the locks. But this time, instead of keys, we will use passwords. Of different length and difficulty depending on the level of safety.

### The puzzle: Keeping Secrets Safe 🔑

{% include picture img="cover.webp" ext="jpg" alt="" %}

Day 11 of the [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-11): Today's problem is about creating passwords. We need to generate different passwords using different character sets.

The starting function is like this:

<script src="https://gist.github.com/el3um4s/f3c83e15edaa2a701f75b394f68d9f08.js"></script>

`length` is a number: it is the length of the password. `options` instead is an object containing 4 properties:

<script src="https://gist.github.com/el3um4s/f55391a753e9d66aa5d2c884a9a62e3b.js"></script>

To simplify, problem tests always consider every property in the `options` object to be true. Likewise, it is not necessary to pass all properties to the function.

The `generatePassword` function returns a string of random characters. There must be a character for each option property.

I start with catch mistakes. I need to verify that the `options` argument is not empty. To do this I use the [Object.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) method. This method returns an array with the names of the various properties of an object. Just check its length to understand if there are properties or not:

<script src="https://gist.github.com/el3um4s/18d0079b3a95ff42125afd0c9a427dc7.js"></script>

I use the same variable to verify that the required length is correct:

<script src="https://gist.github.com/el3um4s/591f29d4edbfc888796159526d3d9400.js"></script>

The next step is to make sure there is at least one character of each type selected. To do this I had to decide how the password will be generated. I think a good method would be to create each character independently and save it into an array. Then I'll mix the array with all the characters and turn it into a string with the [Array.prototype.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) method.

To manage the character sets, however, I use a separate object. In this way I can, in the future, increase or decrease the available properties:

<script src="https://gist.github.com/el3um4s/cfe01c18884f64ada2e2abde92ade6e3.js"></script>

I create a helper function to pick a random letter from a string.

<script src="https://gist.github.com/el3um4s/29066542fd690abe56aa326daf75c7d0.js"></script>

It remains to understand how to scroll through the various properties of an object. I need to decide which character sets to use. To do this I use the [for...in statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in). By combining these three pieces I can be sure that I have a character for each set selected in the password:

<script src="https://gist.github.com/el3um4s/d64a30f79eded9b5ded04b8fe2d268b9.js"></script>

For the remaining characters I reuse the `randomChar()` function. But passing all available characters as an argument. So I add a `characters` variable and start typing random letters in the `password`:

<script src="https://gist.github.com/el3um4s/6d76fd085b7ad5cfb1609c9795ccaf00.js"></script>

Finally I create a helper function to mix the array:

<script src="https://gist.github.com/el3um4s/24478f0f6a07766b163cb8289d57f971.js"></script>

This is my solution to the puzzle:

<script src="https://gist.github.com/el3um4s/fd22d8aacf3d0fd8182c9b60ab6e5945.js"></script>

That's all for today. To help me keep track of this series of posts I've created a list on Medium: [Dev Advent Calendar - The advent diary of an amateur programmer](https://el3um4s.medium.com/list/dev-advent-calendar-89d163132d6e).
