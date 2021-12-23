---
title: "How To Code a Caesar Cipher in JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Ilona Frey**](https://unsplash.com/@couleuroriginal)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-23 13:30"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

The elves have taken cybersecurity seriously. Like any fashion, it has also reached children. One of the little elves' favorite games is writing encrypted messages during school hours. Some of them found the page on the [Caesar cipher on Wikipedia](https://en.wikipedia.org/wiki/Caesar_cipher) and now they don't stop it anymore.

### The Puzzle: Secret Messages ✉️

{% include picture img="cover.webp" ext="jpg" alt="" %}

Today's problem, issue 22 of the [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-22) is once again about the passwords, the codes and the methods to decipher them. And we go to the classic: Caesar's cipher:

```
In cryptography, a Caesar cipher, also known as Caesar's cipher, the shift cipher, Caesar's code or Caesar shift, is one of the simplest and most widely known encryption techniques. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet.
```

Put simply, we replace each letter with the one that follows it in `x` positions. For example, with `shift = 1` the letter `A` becomes `B`. With `shift = 2` the letter `A` becomes `C`. With `shift = 3` the letter `A` becomes `D`. And so on.

{% include picture img="caesar.webp" ext="jpg" alt="" %}

There are several solutions on the internet but almost all of them involve explicit writing of the alphabet plus some `if` conditions combined with `for` loops. My solution to the problem is different and starts from the formula

```
f(x) = x + k(mod. m)
```

With `m = number of letters of the alphabet` and `k = shift`.

Starting from this formula I can get a JavaScript function similar to this:

<script src="https://gist.github.com/el3um4s/851279145673f5e2d5b960ae55b93f3b.js"></script>

The problem is figuring out how to pass the letters. The most common method involves converting the character into the corresponding numeric code. Then we add the shift and convert it back to characters.

I decided to do something different. After all, a Caesar cipher is nothing more than a dictionary in which each letter corresponds to another. I can then create a JavaScript object with the various letters as keys.

First I create two arrays, one for uppercase letters, the other for lowercase ones:

<script src="https://gist.github.com/el3um4s/ed84b9a68905a772abbfe48b0cfbb41c.js"></script>

Then I need a function to calculate the modulus of a number:

<script src="https://gist.github.com/el3um4s/2e84ec5bee1a7643124b4dd117a4444c.js"></script>

Finally something that creates a match between the key and the solution.

<script src="https://gist.github.com/el3um4s/13ab7218f445616bbf3d44b136d3af98.js"></script>

This function accepts an array containing the alphabet as input and returns an object with the encryption code.

For each item in the array, for each letter of the alphabet, it calculates the corresponding encrypted letter. The length of the alphabet is given by the number of elements in the array.

To simplify the resolution I create a helper function to handle the dictionary of both uppercase and lowercase letters.

<script src="https://gist.github.com/el3um4s/0b7f0b93eab9fbbe9518cd6e84944f3a.js"></script>

This way I get an object like this:

<script src="https://gist.github.com/el3um4s/e2fba60c909f7e8a3c58178cfafdc6cc.js"></script>

After getting the cipher I can translate each letter:

<script src="https://gist.github.com/el3um4s/af6bf90aa6de786b5ba62e8a082c9b7b.js"></script>

We can also ignore all non-alphabetic characters in a very simple way: if the matching key does not exist in the cipher then the character is not converted:

<script src="https://gist.github.com/el3um4s/996b17769caf581819ee569ff3416ce4.js"></script>

After creating all the various support functions the solution is short and simple:

<script src="https://gist.github.com/el3um4s/6144148f1404fc1d159f1df322b6d119.js"></script>

There is an interesting aspect to this solution: the same function used to decrypt can also be used to decrypt. Just use a negative shift: in this way the letters are not scrolled forward but backwards allowing you to recover the original message.

This is the complete code:

<script src="https://gist.github.com/el3um4s/998e8c16a587ccb65fb2567fc184c804.js"></script>

### Prashant Yadav's solution

As I said at the beginning, there are many solutions to this problem online. [Prashant Yadav](https://learnersbucket.com/examples/algorithms/caesar-cipher-in-javascript/) proposes some of the most common.

<script src="https://gist.github.com/el3um4s/2530fe9f005bc6f6718bb9b6fc750d43.js"></script>

What are the problems with this approach?

- this code only encrypts with a predefined shift (in this case of 13)
- only works for lowercase letters
- only works with strings that do not contain spaces or other characters not contained in the `decoded` variable
- does not decrypt the message

His second idea is more interesting:

<script src="https://gist.github.com/el3um4s/a14943575dc1814a853781c076576744.js"></script>

This function converts all letters to uppercase and then replaces them. There remains the problem of handling lowercase letters. To do this, you need to change the function:

<script src="https://gist.github.com/el3um4s/b39377e6728bfd00358a3800c3fe6740.js"></script>

The management of non-alphabetic characters, including spaces, remains problematic.

### Marian Veteanu's solution

[Marian Veteanu's blog](https://codeavenger.com/2017/05/19/JavaScript-Modulo-operation-and-the-Caesar-Cipher.html) has many interesting posts. There is a solution to how to create a Caesar cipher

<script src="https://gist.github.com/el3um4s/4c2315a634338c7243d1bb0a13347441.js"></script>

This solution works, but I don't like having so many hard-coded values. But it has the advantage of not using arrays or other objects. Like the next solution.

### Evan Hahn's solution

[Evan Hahn](https://gist.github.com/EvanHahn/2587465) proposes a working solution:

<script src="https://gist.github.com/el3um4s/5ccb8d8ac76eb06d9bf4ddc8ac6df1e1.js"></script>

However, this solution presents some problems. Or, rather, some things I don't like. The first is the presence of several `if` conditions and a` for` loop. I am increasingly convinced that they make it difficult to read the code and difficult to maintain.

Secondly, the alphabet to work on is fixed in the code by hard-coded values. Where possible it is always best to avoid entering hard-coded values. Finally if I wanted to convert this function to use another character set I would run into trouble.

But the code works.

Well, that's all for today. Obviously I prefer the solution that I have proposed. But the great thing about JavaScript, and programming in general, is that there can be several ways to get to the correct solution. Part of the fun is figuring out which paths are possible.
