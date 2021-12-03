---
title: "3 Ways To Find an Item in an Array of Arrays"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-02 21:00"
categories:
  - dev advent
  - test
  - javascript
  - performance
tags:
  - dev advent
  - test
  - javascript
  - performance
---

Whenever Christmas approaches, my wife begins her _Beads Advent Calendar_. It's something I've always envied her, her constancy and perseverance. On her advice I decided to try something similar too. Obviously not linked to the world of handcrafted jewelry (it would be a disaster) but linked to coding. Luckily YouTube recommended this video by [Marc Backes](https://www.youtube.com/c/MarcBackesCodes) to me. I like his idea for the **[Dev Advent Calendar 2021](https://github.com/devadvent/readme)**:

<iframe width="560" height="315" src="https://www.youtube.com/embed/AmtkdsTcHTo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Of course, I still don't know if I'll be able to do my homework every day. I don't even know if I'll be able to write a post with my solution. I don't know about puzzles in advance, and I don't know if I'll have anything interesting to say. For the first problem, yes, there are a couple of interesting ideas.

### The first puzzle: find Rudolf

{% include picture img="cover.webp" ext="jpg" alt="" %}

```
Weeks before Christmas, Santa's reindeers start practicing their flying in order to be fit for the big night. Unfortunately, one of them (Rudolf) crashed and landed in the forest 🌲

Now, Santa 🎅 needs YOUR help to find him.
```

It is a search problem in an array of arrays. In other words I have to find coordinates of an element in a two-dimensional matrix. For example, if I have a matrix like this I expect to find Rudolf the reindeer at coordinates `(3, 2)`:

<script src="https://gist.github.com/el3um4s/992920a21fb0287ded411343889c764b.js"></script>

Instead in such a "forest" I will get negative coordinates, `(-1, -1)`:

<script src="https://gist.github.com/el3um4s/0063b6aaafeb3f2a44ab527d2c400b67.js"></script>

### Use forEach() to find an element in an array

The problem itself is quite simple. We can solve it in several ways. The most intuitive is to scroll through each line of the forest in search of Rudolf:

<script src="https://gist.github.com/el3um4s/a9f9f9cb35165a7146a45e2b3011368b.js"></script>

The [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) method executes the same code for each element of an array. The code is simply a search of the index Rudolf (🦌) is in using [indexOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf). If the index is negative Rudolf is not in that row. If instead we get a positive index then we have found both the row and the column where to retrieve it.

### Use some() to find an element in an array

I wondered if there is a faster way to find an element in an array. There is no way to stop a **forEach()** loop before it ends. For example, if Rudolf is at `(0, 0)` coordinates, there is no need to go looking for him throughout the forest. But this code does exactly that, it keeps looking even if an answer has already been found.

To solve this problem I decided to use another method, [Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some). `some()` does exactly the same thing as `forEach` but with one small but substantial difference: it stops the loop when it finds the element. Or, better, when the defined condition turns out to be true.

So I rewrite the code:

<script src="https://gist.github.com/el3um4s/8e25ac51a92319f52bf68a513ff165a0.js"></script>

I save the coordinate value in two variables, `col` and `row`. But I also save an additional variable, `found`, to be used as a reference to find out whether or not I was able to find Rudolf. Then I loop for each element in the forest and break it when `r.indexOf("🦌") > -1`, which is when I have found the value "🦌" in the array.

### Use flat() to find an element in an array

Everything is very nice but I am not satisfied yet. I'd like to be able to avoid both `forEach()` and `some()`. So I decided to try another way. The basic assumption is that the forest is made up of rows all of the same size. If so then I can transform the two dimensional array into a one dimensional array. Then I use `indexOf("🦌")` to find Rudolf's position. Finally I convert that index into a pair of two-dimensional coordinates. At the basis of all this reasoning is the [Array.prototype.flat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) method. The `flat()` method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.

Translating into code:

<script src="https://gist.github.com/el3um4s/b022a62dda708f08afd28343764f3eec.js"></script>

### What is the best method?

At this point I asked myself: well, I have three methods to find an element in a two-dimensional array, but what is the most efficient method?

To answer this question, I went looking for some clever methods to measure the performance of a function. The best method is the most common: record the time it takes for various functions to perform the same operation many times and compare them. In my research I have found some very informative readings. I recommend reading this post by Zell Liew, [Testing JavaScript Performance](https://zellwk.com/blog/performance-now/).

I create a function to use to calculate the execution time of a single function:

<script src="https://gist.github.com/el3um4s/a0f7f4515d2128e3102dffa3bbc37870.js"></script>

Then I create a set of random forests in which to look for the reindeer. I think a sample of 1,000,000 forests is enough for my tests

<script src="https://gist.github.com/el3um4s/facb059b57e99f32a6f57d7b5d3b4038.js"></script>

And I create functions to search for Rudolf sequentially in each of the forests:

<script src="https://gist.github.com/el3um4s/9ae689e3ada8dd3ae227409940649680.js"></script>

Finally, I do some testing:

<script src="https://gist.github.com/el3um4s/6786197b1486a8ac11afffc917ee1490.js"></script>

I get something like this:

![manuel-test.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-12-02-3-modi-per-trovare-un-elemento-in-un-array-di-array/test-manual-01.gif)

There does not seem to be a clear predominance of one method over another. I decide to save the test values in a file and try to see if the raw numbers can help. I install an additional package, [jsonexport](https://www.npmjs.com/package/jsonexport) to help me with the conversion of the `resultGeneral` variable and create a csv file:

<script src="https://gist.github.com/el3um4s/8d15d9730a1a7fdb76234d4b98e5dcdb.js"></script>

After importing the results into Excel I get this chart:

{% include picture img="graph.webp" ext="jpg" alt="" %}

Well, what about? So much effort for nothing: in my tests the performance of three methods is almost equivalent. But now it's time to put down the keyboard, to take the lantern and help the elves in the forest to find Rudolf.
