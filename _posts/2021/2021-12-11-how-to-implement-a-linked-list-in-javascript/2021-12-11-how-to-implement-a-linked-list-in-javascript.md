---
title: "How To Implement a Linked List in JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**John Matychuk**](https://unsplash.com/@john_matychuk)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-11 15:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

It's cold in the North Pole. I don't understand why Santa Claus insists on spending most of the year there. But so it is, and we have to deal with it. Problems are not lacking. After the name tags damaged by the snow today there was another accident. Someone forgot to check the revision date of the gift train wagons. Obviously the train left late.

### The puzzle: Train Maintenance 🚂

{% include picture img="cover.webp" ext="jpg" alt="" %}

Day 10 of the [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-10): I'm definitely out of my comfort zone. Today's problem concerns linked lists. According to [Wikipedia](https://en.wikipedia.org/wiki/Linked_list) they are fundamental dynamic data structures. I have to admit that I've never used them before.

### What are Linked Lists

The first thing was to understand what they were. There are many articles online, some more technical than others. Wikipedia is a great start. But I also found three specific posts helpful. The first is an overview of the various types of linked lists. There is also some sample code in C ++ and Python.

- [Data Structures Explained with Examples - Linked List](https://www.freecodecamp.org/news/data-structures-explained-with-examples-linked-list/)

The other two involve implementing linked lists in JavaScript. They were useful to make me understand in general how to deal with today's puzzle.

- [How to Implement a Linked List in JavaScript](https://www.freecodecamp.org/news/implementing-a-linked-list-in-javascript/)
- [Singly Linked List in JavaScript](https://medium.com/swlh/singly-linked-list-in-javascript-a0e58d045561)

There aren't many quick videos on YouTube explaining what they are. There are some videos, well done, but very long. Luckily [Anthony Sistilli](https://www.youtube.com/channel/UCoYzQqZNCRqqAomJwJ6yEdg) summarized the fundamental concepts in 3 minutes:

<iframe width="560" height="315" src="https://www.youtube.com/embed/W-9hyTm1syc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

In short words, linked lists are a collection of objects, each property of the previous one.

{% include picture img="singly-linked-list.webp" ext="jpg" alt="" %}

They are objects made like this:

<script src="https://gist.github.com/el3um4s/37c6256296bf4cdc0368150ec0ce308b.js"></script>

The fundamental property is `next`. We can actually call it whatever we want but `next` is a pretty clear term. The `mario` object is the `head` of the list. All elements are `nodes` of the structure.

I can rewrite the previous code in this way:

<script src="https://gist.github.com/el3um4s/04e68e762da640706945f6111a2fc1be.js"></script>

I can also create longer and more complex structures but I think this is enough to understand the basic concept.

### Iterate the elements of a list

The problem requires you to go through a list of items and take an action for each. Forcing the comparison is to create a kind of `map()` method.

The first step is to understand how to iterate between all the various elements. In this case, with this structure, it is better to use a [while](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while) loop: I scroll through the next property of each element as long as the property itself exists:

<script src="https://gist.github.com/el3um4s/0110664446dc1e78b26fea01021688a1.js"></script>

This code is the foundation upon which I can build my solution. Suspicion will also be the basis of all the other methods linked to linked lists.

### Filter items in a linked list

To make the list useful, and to solve the puzzle, I need to add a couple more arguments to the `iterateList` function. I add the `actionFn` argument

<script src="https://gist.github.com/el3um4s/a726d957310582ea6347eb2796957553.js"></script>

I also need a way to perform actions on only certain items in the list. A kind of filter, `filterFn`:

<script src="https://gist.github.com/el3um4s/aff5c875ba7f2b816f8fa20685e6c1d2.js"></script>

This is all I need to solve the problem. The complete code of my solution, after renaming the variables to make it easier to read, is this:

<script src="https://gist.github.com/el3um4s/94637ff80d5d9bc516d9b7d6853245f5.js"></script>

### Useful methods for Linked List in JavaScript

After solving the question I spent some time experimenting with linked lists. I have compiled a list of some methods that may be of use to me in the future. I bring them back here, for the future me.

### Calculate the size of a linked list

The first method allows to calculate the number of nodes present in a list.

<script src="https://gist.github.com/el3um4s/fad8155a3777a9250f2346f038d1bd6f.js"></script>

But I can also get the same result starting from `iterateList()`:

<script src="https://gist.github.com/el3um4s/3ccc6ae2f925499cf441f8cade13ae0e.js"></script>

### Count how many nodes in a linked list satisfy a condition

I prefer the second method because you can easily modify it to count how many nodes in a list satisfy a given condition:

<script src="https://gist.github.com/el3um4s/7d01dbec06f0dce0c8b76a0e74815042.js"></script>

### Find the last node in a linked list

In arrays, it is easy to find the last element. With linked lists you need to scroll through all the nodes until you get to the last one:

<script src="https://gist.github.com/el3um4s/daaadbe7fc618ea715b46945bb45531b.js"></script>

I can add a filter to get the last of the nodes that satisfies a given condition:

<script src="https://gist.github.com/el3um4s/a3a1515a378b4ded254788f92a009002.js"></script>

### Find the first item in a list based on a condition

I can modify the last function to create a method to get the first node that satisfies a certain condition:

<script src="https://gist.github.com/el3um4s/f81dddd93678230db97bb28d85dd7838.js"></script>

### Find a node in a linked list based on its location

Although there is no index, as with arrays, it is possible to obtain a node of a linked list based on its position.

<script src="https://gist.github.com/el3um4s/f58ce70d0275729337b87d4267ed8e83.js"></script>

I can also decide to count the elements starting from `1` instead of `0`: just change the original value of `counter`.

### Add a node at the beginning of a linked list

So far I have only searched among the various nodes. But it can be useful to add a new node. The easiest situation is when we want to add something at the beginning, emulating the `unshift()` method of arrays:

<script src="https://gist.github.com/el3um4s/1d05033d209a7e269591648e0719125e.js"></script>

Things get a little complicated. At this point it is advisable to create a specific class to manage the various borderline cases. I recommend reading the post by [Gulgina Arkin](https://medium.com/swlh/singly-linked-list-in-javascript-a0e58d045561) that I linked at the beginning.

### Delete a node at the top of the list

It's quick to delete the head of a list:

<script src="https://gist.github.com/el3um4s/ee2275560a610e4521975a0b46e4cd9a.js"></script>

### Add a node to the end of the list

Adding a node to the end of the list takes an extra step. I must first find the last node, and then add the new one to that:

<script src="https://gist.github.com/el3um4s/535beb837c2a42d045a45a454e0c2574.js"></script>

In one line it would be:

<script src="https://gist.github.com/el3um4s/5b85bf0df869e13c62baa7bcfe528e46.js"></script>

### Delete a node at the end of the list

In a symmetrical way I can delete the last element of a linked list:

<script src="https://gist.github.com/el3um4s/9944a05685c6e7fb6d47eeb7217837bf.js"></script>

Or in a more synthetic way

<script src="https://gist.github.com/el3um4s/82c14a40d62200f16b0e9795d90d9a9d.js"></script>

### Add an item in a linked list

Another operation that can be useful is to insert an element in a specific position in the list. To do this I have to change the element that precedes the desired position.

<script src="https://gist.github.com/el3um4s/533d6ed071209b9676623d891b3722fc.js"></script>

### Delete a node from a list

Deleting a node involves modifying the node that precedes it.

<script src="https://gist.github.com/el3um4s/9a346564e81984d613d3f4679787e1d3.js"></script>

### Edit a node

The last common operation left is to modify a node. This case is quite simple, just retrieve the node to modify with `getByIndex()`

<script src="https://gist.github.com/el3um4s/c3ff999d337782127f0e7aecb264ca02.js"></script>

That's all for today. To help me keep track of this series of posts I've created a list on Medium: [Dev Advent Calendar - The advent diary of an amateur programmer](https://el3um4s.medium.com/list/dev-advent-calendar-89d163132d6e).
