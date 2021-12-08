---
title: "How To Generate an Array of Pairs From an Array in JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Bonnie Kittle**](https://unsplash.com/@bonniekdesign)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-09 15:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

After the troubles of the last few days, the elves deserve a break. So they decided to organize a Secret Santa. In Italy there is no such translation: the elves had to explain it to me. In return they asked me how I would solve the problem of matching pairs. Here is my solution.

### The puzzle: Secret Santa 🤫

{% include picture img="cover.webp" ext="jpg" alt="" %}

I don't have hallucinations: I'm talking about problem number 8 of the [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-8). Today's challenge is to match each element of an array with another element. I cannot match an element to itself and each pair of elements must be different.

Before my code, a brief parenthesis for those unfamiliar with the tradition of the Secret Santa:

_The concept of "secret santa" is the following: Each participant is assigned a so-called "secret santa", a person that will have to get a thoughtful gift for that person._

_Usually this is in-person: All names are thrown in a hat, and each participant draws one. The paper you draw it the person you have to give a gift to._

### My solution

The puzzle can be solved quickly using array methods. But let's go in order. There are 3 requests to satisfy, I start with the first.

First, if there are two elves with the same name I have to get an error. In this case, the text of the quiz already contains a hint:

<script src="https://gist.github.com/el3um4s/8ce82b42f73d57a8398ba697abb1c219.js"></script>

So I just have to write a simple condition:

<script src="https://gist.github.com/el3um4s/4e15ee22ddeb1baaf5606752c45000b0.js"></script>

The second and third conditions can be solved together. I have to give each name a Secret Santa. And an elf cannot be his own Secret Santa.

To solve this first I mix the hat, sorry, the array with the names of the participants:

<script src="https://gist.github.com/el3um4s/c62467a808bc250be9705922029de625.js"></script>

Then I decide to pair the various names in pairs based on their position in the array. In practice I create pairs like this:

<script src="https://gist.github.com/el3um4s/78f268bb8b7ba07780b96c1fb162f4d9.js"></script>

Using this technique I am sure that each elf will have a different companion.

The complete code of my solution is simply this:

<script src="https://gist.github.com/el3um4s/a8dc48eca578f6408e4bedd6fad9c7a6.js"></script>

Well, today's problem is solved.

But there is one thing I want to say. It helps me keep track of problems and solutions. It is also helpful for me to translate these pieces into English. On the one hand, it allows me to practice in a language that is not mine, and which I learned by myself. On the other hand, translating concepts helps me simplify my prose, and verify what I think I understand.

Ok, so what? So I'm really happy with a report from [Marc Schärer](https://medium.com/@dreamora) about a misleading title ([this title](https://javascript.plainenglish.io/how-to-get-unique-values-from-a-list-in-javascript-301675602985)). It's difficult for me to find a title in English. But I'm glad someone reads what I write. And I'm very happy that you take the time to report my mistakes. Thanks!
