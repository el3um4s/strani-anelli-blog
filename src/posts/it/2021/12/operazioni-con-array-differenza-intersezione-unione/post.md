---
title: "Array in JavaScript: unione, differenza e intersezione"
published: true
date: 2021-12-24 11:30
categories:
  - DevAdvent
  - JavaScript
tags:
  - DevAdvent
  - JavaScript
  - array-intersection-difference-and-union-in-javascript
cover: image.webp
lang: it
description: Qualcosa è andato storto al Polo Nord. Babbo Natale ha fatto un controllo a campione ed è saltato fuori che nei sacchi manca qualche regalo. Per fortuna è tutto registrato e si possono confrontare le varie liste per trovare le differenze e aggiungere i pacchi mancanti.
---

Qualcosa è andato storto al Polo Nord. Babbo Natale ha fatto un controllo a campione ed è saltato fuori che nei sacchi manca qualche regalo. Per fortuna è tutto registrato e si possono confrontare le varie liste per trovare le differenze e aggiungere i pacchi mancanti.

### Il problema: Find The Missing Presents 🎁

![Immagine](./cover.webp)

Credo che il problema 23 del [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-23) sia quello con la soluzione più corta: bastano letteralmente 2 righe di codice per risolverlo:

```js
import items from "../data/items.js";
export const findMissing = (m, s) =>
  items.filter((x) => m.includes(x.id) && !s.includes(x.id));
```

Il problema di base è "come trovo gli elementi che ci sono in un array ma non nell'altro?".

### Trovare le differenze tra 2 array

Per rispondere a questa domanda basta unire due metodi degli array:

- [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), che restituisce un nuovo array contenente tutti gli elementi che passano un dato test
- [Array.prototype.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes), che restituisce il valore `vero` se l'array contiene un elemento specificato

Posso quindi ricavare questa funzione:

```js
const difference = (a, b) => a.filter((x) => !b.includes(x));
```

La seconda parte del puzzle prevede di restituire un array di oggetti ricavati dall'array con gli elementi appena trovati. Posso modificare questa funzione per ottenere il risultato che mi serve:

```js
const findMissing = (a, b) => {
  const diff = difference(a, b);
  const result = items.filter((x) => diff.includes(x.id));
};
```

Posso asciugare ancora il codice modificando il test passato a `filter`. In fin dei conti un altro modo di calcolare la differenza è dire che l'elemento `x` è incluso in `a` ma non in `b`:

```js
const difference = (list, a, b) =>
  list.filter((x) => a.includes(x) && !b.includes(x));
```

Che poi non è altro che la soluzione che sto cercando.

### Differenza Simmetrica tra due array

Ci sono due post, di qualche tempo fa, che mi sono stati molto utili:

- [Array intersection, difference, and union in ES6](https://medium.com/@alvaro.saburido/set-theory-for-arrays-in-es6-eb2f20a61848)
- [JavaScript Algorithm: Find Difference Between Two Arrays](https://javascript.plainenglish.io/javascript-algorithm-find-difference-between-two-arrays-ed8df86c4924)

Un altro problema interessante è capire come calcolare la differenza simmetrica tra due array in JavaScript. In pratica voglio trovare tutti gli elementi che appartengo ad un array ma non all'altro.

Posso trovarli eseguendo due filtri in sequenza e poi unendo gli array con il metodo [Array.prototype.concat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) oppure con lo [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax):

```js
const difference = (a, b) =>
  a.filter((x) => !b.includes(x)).concat(b.filter((x) => !a.includes(x)));
const difference = (a, b) => [...a.filter((x) => !b.includes(x)), ...b.filter((x) => !a.includes(x));
```

### Intersezione tra due array

Un'altra operazione comune è calcolare l'intersezione tra due array. In altre parole, come possiamo ottenere un nuovo array contenente tutti gli elementi presenti contemporaneamente nei due array di partenza?

Sempre con il metodo `filter`:

```js
const intersection = (a, b) => a.filter((x) => b.includes(x));
```

Detto con le parole, sono tutti gli elementi di `a` presenti in `b`.

### Unione di due array

L'ultima operazione è l'unione di due array. Ci sono due modi di intendere questa operazione. Possiamo semplicemente unire due array senza curarci di eventuali valori duplicati:

```js
const union = (a, b) => [...a, ...b];
```

Però in alcune situazioni vogliamo evitare di avere valori ripetuti. In questo caso conviene usare un [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set): è un oggetto di JavaScript che raccoglie solamente valori diversi impedendoci di creare dei doppioni.

Posso convertire un array in set semplicemente così:

```js
const arrayToSet = (a) => new Set(a);
```

L'operazione inversa, convertire un set in array è altrettanto semplice:

```js
const setToArray = (a) => [...a];
```

Così facendo l'unione di due array, eliminando i duplicati, diventa:

```js
const union = (a, b) => [...new Set([...a, ...b)];
```

Ok, forse sono andato un po' fuori tema rispetto all'esercizio di oggi. È stata però l'occasione giusta, per me, per ripassare un po' di operazioni con gli array.
