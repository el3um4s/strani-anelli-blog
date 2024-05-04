---
title: Come usare JavaScript per scegliere nomi da una lista
published: true
date: 2021-12-07 12:00
categories:
  - JavaScript
  - DevAdvent
tags:
  - JavaScript
  - DevAdvent
  - how-to-find-the-sum-of-an-array-of-objects-in-javascript
lang: it
description: Ovviamente i dolci che gli elfi hanno così diligentemente preparato non sono per tutti i bambini. Solo i bambini che hanno fatto i bravi meriteranno dolci e balocco. Gli altri, carbone. Ma non sta agli elfi decidere, questa è una responsabilità di Babbo Natale. Il quale ogni giorno registra le azioni buone e quelle meno buone di ogni bimbo del pianete. Lo fa su un vecchio taccuino, a mano. Finalmente è giunto il momento di modernizzare anche questo aspetto.
cover: image.webp
---

Ovviamente i dolci che gli elfi hanno così diligentemente preparato non sono per tutti i bambini. Solo i bambini che hanno fatto i bravi meriteranno dolci e balocco. Gli altri, carbone. Ma non sta agli elfi decidere, questa è una responsabilità di Babbo Natale. Il quale ogni giorno registra le azioni buone e quelle meno buone di ogni bimbo del pianete. Lo fa su un vecchio taccuino, a mano. Finalmente è giunto il momento di modernizzare anche questo aspetto.

### Il problema: Making a list, checking it twice 📜

![Immagine](./cover.webp)

Il problema numero 6 del [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-6) riguarda gli array e come filtrarli in base a un valore calcolato. Non è un problema banale e penso sia una situazione molto comune. In soldoni, si tratta di calcolare per ogni elemento di array un valore calcolato in base ad altre proprietà dello stesso elemento.

### Calcolare la somma di tutti gli elementi di un array

Ok, forse è meglio fare un esempio. Questa è la scheda di un bambino:

```json
{
  "name": "Fitzgerald Ashley",
  "events": [
    { "name": "Stole candy from the candy drawer", "effect": -10 },
    { "name": "Cheated on homework", "effect": -30 },
    { "name": "Pushed someone at school", "effect": -15 },
    { "name": "Helped a classmate with their homework", "effect": 10 },
    { "name": "Helped their sibling with homework", "effect": 25 },
    {
      "name": "Helped an elderly person cross the street",
      "effect": 30
    },
    {
      "name": "Told the truth even if it would get them in trouble",
      "effect": 30
    }
  ]
}
```

Ogni bambino ha abbinata una lista di azioni, alcune buone altre no. A ogni azione corrisponde un valore. La somma dei valori di ogni azione serve a calcolare un punteggio:

```js
const score = -10 + -30 + -15 + 10 + 25 + 30 + 30;
```

In questo caso il punteggio è positivo, di conseguenza il bimbo merita un premio:

```js
function findOutIfNaughtyOrNice(score) {
  return score < 0 ? "naughty" : "nice";
}
```

Tutto facile e semplice finché si tratta di un solo elemento. Ma cosa succede se abbiamo centinaia, migliaia, milioni di bambini a cui portare regali o carbone? Beh, Babbo Natale non può di certo continuare a fare tutto a mano. Per fortuna esiste un metodo che fa al caso nostro, [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

```js
export const findOutIfNaughtyOrNice = (kid) => {
  const value = kid.events.reduce((prev, curr) => prev + curr.effect, 0);
  return value < 0 ? "naughty" : "nice";
};
```

`reduce()` scorre tutti gli elementi di un array e per ogni elemento esegue alcune operazioni. Il risultato di ogni operazione viene aggiunto al risultato precedente. In questo modo posso calcolare la somma di tutti gli effetti in maniera automatica.

### Filtrare un array

L'altra parte del problema è una diretta conseguenza della prima. Dopo avere trovato un modo per stabile se un bambino merita o no il regalo possiamo creare due liste.

Nella prima mettiamo solo i bambini a cui portare i doni:

```js
export const getNiceKids = (kids) => {
  return kids.filter((kid) => findOutIfNaughtyOrNice(kid) === "nice");
};
```

Nella seconda invece mettiamo gli altri:

```js
export const getNaughtyKids = (kids) => {
  return kids.filter((kid) => findOutIfNaughtyOrNice(kid) === "naughty");
};
```

In entrambi i casi ho usato il metodo [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) per ricavare dalla lista solo i bambini richiesti.

### Importare JSON in JavaScript

Un unico appunto per concludere. La prima cosa da fare, in assoluto, è di importare la lista dei bambini dentro il programma. La lista è in formato `json` quindi richiede un trattamento particolare. Ci sono vari modi per farlo. Uno richiede l'uso delle [api di fs](https://nodejs.org/api/fs.html) (filesystem) di Node.js:

```js
const fs = require("fs");

let rawdata = fs.readFileSync("../data/sampleData.json");
let kids = JSON.parse(rawdata);
console.log(kids);
```

È però un modo un po' macchinoso per fare una cosa tutto sommato semplice.

Il secondo metodo richiede l'uso di alcune [funzioni sperimentali di Node.js](https://nodejs.medium.com/announcing-a-new-experimental-modules-1be8d2d6c2ff). Per attivarle ho dovuto modificare il file `package.json` aggiungendo `-experimental-json-modules`:

```json
  "scripts": {
    "dev": "nodemon --experimental-json-modules src/index.js --experimental-modules --ignore 'src/data/*.json'",
  },
```

Poi nel file `naughtyOrNice.js` ho importato direttamente il file come oggetto JavaScript:

```js
import kids from "../data/sampleData.json";
```

Funziona ed è tutto sommato elegante.

In futuro probabilmente non sarà necessario usare `--experimental-json-modules`. C'è una proposta interessante, [tc39/proposal-json-modules](https://github.com/tc39/proposal-json-modules), giunta oramai allo stage 3, che permetterà di avere nativamente in JavaScript la possibilità di importare moduli JSON. In questo caso la sintassi sarà così:

```js
import kids from "../data/sampleData.json" assert { type: "json" };
```

Bene, per oggi è tutto.
