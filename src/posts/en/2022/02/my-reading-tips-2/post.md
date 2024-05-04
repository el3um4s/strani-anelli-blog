---
title: "My Reading Tips #2"
published: true
date: 2022-02-11 11:00
categories:
  - Nessuna Categoria
tags:
  - my-reading-tips
  - collection-of-notable-things
lang: en
cover: image.webp
description: I keep putting my notes in order. This list of recommended posts is quite heterogeneous. But I think it's worth keeping track of the most interesting things, and maybe sharing them with those looking for something interesting to read. But no more chatter and off with the five of the week.
column: Collection of Notable Things
---

I keep putting my notes in order. This list of recommended posts is quite heterogeneous. But I think it's worth keeping track of the most interesting things, and maybe sharing them with those looking for something interesting to read. But no more chatter and off with the five of the week.

### An Easy Introduction to IndexedDB in the Browser

[link](https://javascript.plainenglish.io/indexeddb-cfb55e3e26d8)
by [Louis Petrik](https://louispetrik.medium.com/)

A quick introduction on how to use IndexedDB with JavaScript. But what is IndexedDB? It is a way to keep complex data in the memory of a browser. Louis explains how to initialize, use, modify and delete data using IndexedDB.

The tutorial is a good introduction to this API. However, I also recommend reading the Mozilla page dedicated to the topic:

- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

Mozilla also recommends some alternatives that are worth keeping an eye on:

1. [localForage](https://localforage.github.io/localForage/): A Polyfill providing a simple name:value syntax for client-side data storage, which uses IndexedDB in the background, but falls back to WebSQL and then localStorage in browsers that don't support IndexedDB.
2. [Dexie.js](https://dexie.org/): A wrapper for IndexedDB that allows much faster code development via nice, simple syntax.
3. [ZangoDB](https://github.com/erikolson186/zangodb): A MongoDB-like interface for IndexedDB that supports most of the familiar filtering, projection, sorting, updating and aggregation features of MongoDB.
4. [JsStore](https://jsstore.net/): An IndexedDB wrapper with SQL like syntax.
5. [MiniMongo](https://github.com/mWater/minimongo): A client-side in-memory mongodb backed by localstorage with server sync over http. MiniMongo is used by MeteorJS.
6. [PouchDB](https://pouchdb.com/): A client-side implementation of CouchDB in the browser using IndexedDB
7. [idb](https://www.npmjs.com/package/idb): A tiny (~1.15k) library that mostly mirrors the IndexedDB API, but with small improvements that make a big difference to usability.
8. [idb-keyval](https://www.npmjs.com/package/idb-keyval): A super-simple-small (~600B) promise-based keyval store implemented with IndexedDB
9. [sifrr-storage](https://www.npmjs.com/package/@sifrr/storage): A small (~2kB) promise based library for client side key-value storage. Works with IndexedDB, localStorage, WebSQL, Cookies. Can automatically use supported storage available based on priority.
10. [lovefield](https://github.com/google/lovefield): Lovefield is a relational database for web apps. Written in JavaScript, works cross-browser. Provides SQL-like APIs that are fast, safe, and easy to use.
11. [$mol_db](https://github.com/hyoo-ru/mam_mol/tree/master/db): Tiny (~1.3kB) TypeScript facade with promise-based api and automatic migrations.

### How To Write Flexible JavaScript Code With Pure Functional Wrappers

[link](https://betterprogramming.pub/how-to-write-flexible-javascript-code-with-pure-functional-wrappers-ad1cb39b2630)
by [Arnold Abraham](https://arnoldcode.medium.com/)

In this quick tutorial Arnold explains how to use functional programming principles to create a wrapper around `console.log`. If the example itself is rather trivial, the guide is well done.

I admit I'm not familiar with this programming paradigm, but I'm fascinated by it. This article, as well as the ones he recommends at the end of the piece, are a good introduction to the subject.

### 5 Modern Ways to Deploy Your Web App to the Internet

[link](https://javascript.plainenglish.io/5-modern-ways-to-deploy-your-web-app-to-the-internet-bd8c2f095fda)
by [Can Durmus](https://candurmuss.medium.com/)

This post is a good summary of how to upload a project online. It serves as a reminder for the future me. I am currently using GitHub Pages to upload my projects. But I want to experiment, especially when I will be able to put my hand to the code of my blog. Can Durmus recommends:

1. Vercel
2. Heroku
3. Netlify
4. GitHub Pages
5. Firebase

### Grid vs. Flexbox Battle

[link](https://levelup.gitconnected.com/grid-vs-flexbox-battle-75f9f940502a)
by [Fatima Amzil](https://famzil.medium.com/)

I would like to say about Fatima's posts: go to her profile and read them all.

However, this particular story is useful for reviewing the principles of flexbox and grid CSS. She puts in order the various main points for both techniques. Fatima writes about Flexbox:

1. Flexbox is the perfect choice for aligning items.
2. Not really good at overlapping. It requires negative margins or absolute positioning to break out the flex behavior, which is not clean in CSS.
3. Flex has its wrapping system. We can tell Flex to wrap down onto another row when the flex items fill a row.

Instead about Grid CSS:

1. Grid is the perfect choice for layouts.
2. Grid gives you a more clean and complete style with interesting features such as fractional units.
3. Good at overlapping. We can apply items on overlapping grid lines.
4. We can allow Grid to wrap items with its auto-filling option.

The conclusions?

```
The Flexbox system is perfect for aligning items vertically or horizontally.
```

```
Grid is a perfect choice for positioning items as a grid or array of 2 dimentions
```

As for me, I'm pretty bad with style sheets. For this I also find this list of articles useful:

- [CSS Useful Content](https://famzil.medium.com/list/css-useful-content-062de523ffaa)

### Revolutionise the Way You Write Docs with Marked.js

[link](https://javascript.plainenglish.io/revolutionise-the-way-you-write-docs-with-marked-js-5d1de8b8e725)
by [Seb Hulse](https://sebhulse.medium.com/)

This August 2021 article was helpful to me this summer when I tried to work on a new version of the site with my Construct 3 demo projects. Seb Hulse's technique integrates [MarkedJS](https://marked.js.org/) with[highlight.js](https://highlightjs.org/). Even if I then followed another path, it was still an interesting read.
