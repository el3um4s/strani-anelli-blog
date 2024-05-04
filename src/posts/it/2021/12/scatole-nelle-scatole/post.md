---
title: Scatole inscatolate
published: true
date: 2021-12-05 15:00
categories:
  - JavaScript
  - DevAdvent
tags:
  - JavaScript
  - DevAdvent
  - how-to-check-if-a-box-fits-in-a-box
lang: it
cover: image.webp
description: Gli elfi alla fine hanno fatto centro e gli affari della caffetteria continuano a crescere. Peccato che abbiano fatto un po' di confusione con le scatole. O, meglio, fanno fatica a capire come inscatolare tutte le spedizioni senza sprecare cartone. Le poste elfiche mettono a disposizione diversi formati tra cui scegliere. Il puzzle del Dev Advent di oggi riguarda proprio questo problema.
---

Gli elfi alla fine hanno fatto centro e gli affari della caffetteria continuano a crescere. Peccato che abbiano fatto un po' di confusione con le scatole. O, meglio, fanno fatica a capire come inscatolare tutte le spedizioni senza sprecare cartone. Le poste elfiche mettono a disposizione diversi formati tra cui scegliere. Il puzzle del [Dev Advent](https://github.com/devadvent/readme) di oggi riguarda proprio questo problema.

### Il problema: Optimizing shipping 📦

![Immagine](./cover.webp)

Il problema di oggi riguarda la geometria: si tratta di capire se una scatola puà entrare in un'altra. Non basta misurare la lunghezza dei singoli angoli, una scatola può anche essere ruotata per farcela stare.

La soluzione è piuttosto banale e non richiede grandi spiegazioni:

```js
export const selectBox = (item) => {
  return boxes.find((box) =>
    isBoxable({
      item,
      box,
    })
  );
};

function isBoxable({ item, box }) {
  const { width: x, length: y, height: z } = item;
  const { width: a, length: b, height: c } = box;

  const caseA = a >= x && ((b >= y && c >= z) || (b >= z && c >= y));
  const caseB = a >= y && ((b >= x && c >= z) || (b >= z && c >= x));
  const caseC = a >= z && ((b >= x && c >= y) || (b >= y && c >= x));

  return caseA || caseB || caseC;
}
```

Ho cercato una formula generica per ottenere questo risultato in maniera più elegante ma non ho trovato nulla di meglio. E con sole 3 dimensioni è abbastanza semplice cavarsela con una formula manuale.

C'è però una cosa interessante. Ho rinominato le variabili durante l'operazione di object destructuring. Basta aggiungere il nome della nuova variabile dopo il nome di quella originale:

```js
const caroline = {
  firstNm: "Caroline",
  ag: 27,
};

const { firstNm: firstName, ag: age } = caroline;

console.log(firstName, age);

// Caroline, 27
```

L'esempio qui sopra non è mio, è di [Paul Vaneveld](https://medium.com/@paul.vaneveld). L'ho trovato in articolo interessante pubblicato su Medium: [7 Little-Known Techniques to Improve Your JavaScript](https://javascript.plainenglish.io/7-little-known-techniques-to-improve-your-javascript-20a9e870a5fe).

Bene, per oggi direi che è tutto.
