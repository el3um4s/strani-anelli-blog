---
title: "Consigli di Lettura #2"
published: true
date: 2022-02-11 10:00
categories:
  - Nessuna Categoria
tags:
  - my-reading-tips
  - collection-of-notable-things
lang: it
cover: image.webp
description: Continuo con il mettere in ordine i miei appunti. Come ho già fatto settimana scorsa, questa collezione di post da leggere è abbastanza eterogenea. Penso però che valga la pena tenere traccia delle cose più interessanti, e magari condividerle con chi fosse alla ricerca di qualcosa da leggere. Ma bando alle ciance e via con la cinquina della settimana.
column: Collection of Notable Things
---

Continuo con il mettere in ordine i miei appunti. Come ho già fatto settimana scorsa, questa collezione di post da leggere è abbastanza eterogenea. Penso però che valga la pena tenere traccia delle cose più interessanti, e magari condividerle con chi fosse alla ricerca di qualcosa da leggere. Ma bando alle ciance e via con la cinquina della settimana.

### An Easy Introduction to IndexedDB in the Browser

[link](https://javascript.plainenglish.io/indexeddb-cfb55e3e26d8)
by [Louis Petrik](https://louispetrik.medium.com/)

Una veloce introduzione su come usare IndexedDB con JavaScript. Ma cos'è? Beh, è un modo per conservare dati complessi nella memoria di un browser.

Louis spiega come inizializzare, usare, modificare ed eliminare dati usando IndexedDB.

Il tutorial è ben fatto e serve come introduzione a questa API. Consiglio però di leggere anche la pagina Mozilla dedicato all'argomento:

- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

Sempre Mozilla consiglia alcune alternative che vale la pena di tenere d'occhio:

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

In questo rapido tutorial Arnold spiega come usare i principi della programmazione funzionale per creare un wrapper attorno a `console.log`. Se l'esempio in sé è piuttosto banale, la guida è ben fatta.

Ammetto di non conoscere bene questo paradigma di programmazione, ma ne sono affascinato. Questo articolo, come anche quelli che lui consiglia alla fine del pezzo, sono una buona introduzione all'argomento.

### 5 Modern Ways to Deploy Your Web App to the Internet

[link](https://javascript.plainenglish.io/5-modern-ways-to-deploy-your-web-app-to-the-internet-bd8c2f095fda)
by [Can Durmus](https://candurmuss.medium.com/)

Questo post è una buona sintesi di come caricare online un progetto. Vale come promemoria per il me futuro. Al momento sto sempre e solo usando GitHub Pages per caricare i miei progetti. Ma voglio provare a sperimentare, sopratutto quando riuscirò a mettere mano al codice del mio blog. Can Durmus consiglia:

1. Vercel
2. Heroku
3. Netlify
4. GitHub Pages
5. Firebase

### Grid vs. Flexbox Battle

[link](https://levelup.gitconnected.com/grid-vs-flexbox-battle-75f9f940502a)
by [Fatima Amzil](https://famzil.medium.com/)

Dei post di Fatima mi verrebbe da dire: andate sul suo profilo e leggeteli tutti. Così faccio prima, e non ci penso più.

Comunque, questa storia in particolare è utile per ripassare i principi di flexbox e grid CSS. Lei mette in ordine i vari punti principali per entrambe le tecniche. Riguardo a Flexbox scrive:

1. Flexbox is the perfect choice for aligning items.
2. Not really good at overlapping. It requires negative margins or absolute positioning to break out the flex behavior, which is not clean in CSS.
3. Flex has its wrapping system. We can tell Flex to wrap down onto another row when the flex items fill a row.

Invece su Grid CSS:

1. Grid is the perfect choice for layouts.
2. Grid gives you a more clean and complete style with interesting features such as fractional units.
3. Good at overlapping. We can apply items on overlapping grid lines.
4. We can allow Grid to wrap items with its auto-filling option.

Le sue conclusioni? Da tenere su un post it attaccato al monitor del PC:

```
The Flexbox system is perfect for aligning items vertically or horizontally.
```

```
Grid is a perfect choice for positioning items as a grid or array of 2 dimentions
```

Per quanto riguarda me, invece, sono abbastanza scarso con i fogli di stile. Per questo trovo utile anche questa lista di articoli:

- [CSS Useful Content](https://famzil.medium.com/list/css-useful-content-062de523ffaa)

### Revolutionise the Way You Write Docs with Marked.js

[link](https://javascript.plainenglish.io/revolutionise-the-way-you-write-docs-with-marked-js-5d1de8b8e725)
by [Seb Hulse](https://sebhulse.medium.com/)

Questo articolo di Agosto 2021 mi è stato molto utile questa estate, quando ho provato a lavorare a una nuova versione del sito con i miei progetti demo di Construct 3. La tecnica che Seb Hulse propone integra [MarkedJS](https://marked.js.org/) con [highlight.js](https://highlightjs.org/). Anche se poi ho seguito un'altra strada è stata comunque una lettura interessante.
