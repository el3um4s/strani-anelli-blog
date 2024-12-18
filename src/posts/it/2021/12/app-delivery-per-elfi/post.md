---
title: App delivery per elfi
published: true
date: 2021-12-04 12:00
categories:
  - JavaScript
  - DevAdvent
tags:
  - DevAdvent
  - JavaScript
  - how-to-slugify-a-string
lang: it
cover: image.webp
description: "Giorno tre del mio Dev Advent Calendar 2021 e nuovo puzzle da risolvere. Gli elfi di Babbo Natale ci hanno preso gusto con il caffè e hanno deciso di fare il grande passo: vogliono buttarsi nel mondo del food delivery. Per prima cosa devono sistemare il sito della caffetteria aggiungendo un'API in grado di gestire gli ordini. E indovinate un po' a chi tocca?"
---

Giorno tre del mio [Dev Advent Calendar 2021](https://github.com/devadvent/readme) e nuovo puzzle da risolvere. Gli elfi di Babbo Natale ci hanno preso gusto con il caffè e hanno deciso di fare il grande passo: vogliono buttarsi nel mondo del food delivery. Per prima cosa devono sistemare il sito della caffetteria aggiungendo un'API in grado di gestire gli ordini. E indovinate un po' a chi tocca?

### Il problema: Elf Coffee Shop API 🧝🥤

![Immagine](./cover.webp)

Il puzzle di oggi a prima vista è un po' più complesso dei precedenti. Ma può essere facilmente scomposto in due diversi sotto problemi. Il primo è un semplice problema di aggiunta di proprietà ad un oggetto javascript. Il secondo richiede invece di giocare con le regular expressions. E a parer mio è anche la parte più divertente. Ma andiamo con ordine e cominciamo dall'inizio.

```js
import { slugify } from "./helpers";

const prepareForAPI = (menu) => {
  return menu.map((item) => {
    item.name = (item.flavor ? item.flavor + " " : "") + item.drink;
    item.slug = slugify(item.name);
    return item;
  });
};
```

Punto. Uso il metodo [map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) per scorrere ogni elemento del menu e aggiungo semplicemente le proprietà che mancano. Adesso non rimane che sistemare la funzione `slugify`.

### Come ottenere una versione "slugified" di un testo

Ammetto di essere rimasto spaesato. È un problema che non mi sono mai posto anche se credo sia abbastanza comune. Mi piace affrontare problemi nuovi, anche se sono nuovi solo per me. Comunque, nel testo del puzzle c'è un suggerimento: [Remove accents/diacritics in a string in JavaScript](https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript).

Mi si è aperto un mondo, non sapevo fosse possibile usare una cosa chiamata [Unicode property escapes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes) per semplificare la creazione di regular expressions. Partendo da qui ho seguito passo passo le richieste.

Per rendere mettere ogni carattere in minuscolo ho ovviamente usato il metodo [String.prototype.toLowerCase()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase): `text.toLowerCase()`.

Per sostituire tutte le lettere strane (comprese quelle accentate) ho usato questo codice: `text.normalize("NFD").replace(/\p{Diacritic}/gu, "")`. Questo però non risolve il problema delle emoji nel menu. Non so come mai ma gli elfi amano le emoji: le sto trovando in ogni angolo. Una soluzione potrebbe essere l'utilizzo di qualcosa di simile a `replace(/\p{Emoji}/gu, "-"`. Funziona, ma poi si rivela ridondante con la richiesta successiva.

Infatti, per sostituire tutti i caratteri alfanumerici (compre le emoji) posso usare questa regex: `.replace(/[^a-zA-Z0-9_\s-]/gu, " ")`. Sostituisco tutto con degli spazi, non direttamente con i trattini (`-`). Perché? Perché in questo modo posso usare direttamente `trim()` per eliminare gli spazi vuoti all'inizio e alla fine della stringa.

Il passo successivo è sostituire tutti gli spazi con dei trattini. Posso usare `.replace(/\s+/gu, "-")` per tasformare ogni sequenza di spazi in un unico trattino.

Mettendo tutto insieme la funzione `slugify` diventa così:

```js
const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9_\s-]/gu, " ")
    .trim()
    .replace(/\s+/gu, "-");
};
```

Bene, e anche per oggi è fatta. Adesso non rimane che aspettare il puzzle di domani.
