---
title: "Come accoppiare ogni elemento di una lista"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Bonnie Kittle**](https://unsplash.com/@bonniekdesign)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-09 12:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Dopo i problemi degli ultimi giorni gli elfi si meritano finalmente un po' di riposo. Hanno così deciso di organizzare una festicciola. E già che ci sono preparano l'occorrente per il loro Babbo Natale Segreto. Qui da me, in Italia, non c'è questa abitudine: ho dovuto farmela spiegare. E nello spiegarmela gli elfi mi hanno chiesto come risolverei il problema delle coppie. Ecco la mia soluzione.

### Il problema: Secret Santa 🤫

{% include picture img="cover.webp" ext="jpg" alt="" %}

Ovviamente non ho perso il senno, sto parlando del problema numero 8 del [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-8). La sfida di oggi è di abbinare a ogni elemento di un array un altro elemento. Ovviamente non posso abbinare un elemento a sè stesso e ogni coppia di elementi deve essere diversa.

Prima del mio codice, una breve parentesi per chi non conosce la tradizione del Babbo Natale Segreto:

_The concept of "secret santa" is the following: Each participant is assigned a so-called "secret santa", a person that will have to get a thoughtful gift for that person._

_Usually this is in-person: All names are thrown in a hat, and each participant draws one. The paper you draw it the person you have to give a gift to._

In pratica si mettono i nomi di tutti in un cappello, poi ognuno estrae un bigliettino. Il nome scritto sul biglietto indica la persona a cui dovrai fare un regalo di Natale.

### La mia soluzione

Anche in questo caso il problema può essere risolto velocemente usando i metodi degli array. Ma andiamo con ordine. Ci sono 3 richieste da soddisfare, comincio dalla prima.

Per prima cosa, se ci sono due elfi con lo stesso nome devo ottenere un errore. In questo caso già il testo del quiz contiene un suggerimento:

```js
export const hasDuplicates = (arr) => {
  return new Set(arr).size !== arr.length;
};
```

Quindi a me non resta che scrivere una semplice condizione:

```js
export const assignNames = (names) => {
  if (hasDuplicates(names)) {
    throw new Error("DUPLICATE_NAMES");
  }
  return [];
};
```

La seconda e la terza condizione la posso affrontare contemporaneamente. Devo assegnare a ogni nome un Babbo Natale Segreto. E un elfo non può essere il Babbo Natale di sé stesso.

Per risolvere questa cosa per prima cosa mescolo il cappello, pardon, l'array con i nomi dei partecipanti:

```js
const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);
const list = shuffleArray(names);
```

Poi decido di accoppiare a due a due i vari nomi in base alla loro posizione nell'array. In pratica creo delle coppie così:

```js
const santa = [
  { name: list[0], secretSanta: list[1] },
  { name: list[1], secretSanta: list[2] },
  { name: list[2], secretSanta: list[3] },
  { name: list[3], secretSanta: list[0] },
];
```

In questo modo sono sicuro che ogni nome avrà un compagno diverso.

E, basta, il codice completo della mia soluzione è semplicemente questo:

```js
const hasDuplicates = (arr) => new Set(arr).size !== arr.length;

const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

export const assignNames = (names) => {
  if (hasDuplicates(names)) {
    throw new Error("DUPLICATE_NAMES");
  }

  const list = shuffleArray(names);

  return list.map((name, index, array) => {
    const secretSanta = array[index + 1] ? array[index + 1] : array[0];
    return {
      name,
      secretSanta,
    };
  });
};
```

Bene, per il problema di oggi è tutto.

C'è però una cosa che voglio dire. Sto trovando molto istruttivo, per me, tenere traccia dei problemi che incontro e di come li risolvo. Trovo inoltre utile, sempre per me ovviamente, tradurre questi pezzi in inglese. Da un lato mi permette di esercitarmi in una lingua non mia, e che ho appreso per di più da autodidatta. Dall'altro lato tradurre i concetti mi aiuta a fare semplificare la mia prosa, e a verificare quello che credo di aver capito.

Ok, e quindi? Quindi sono davvero contento di una segnalazione di [Marc Schärer](https://medium.com/@dreamora) riguardo un titolo fuorviante ([questo titolo](https://javascript.plainenglish.io/how-to-get-unique-values-from-a-list-in-javascript-301675602985)). Trovo difficoltà a titolare i miei post, sia in italiano che in inglese. Ma sono contento che qualcuno li legga, e si prenda addirittura il disturbo di segnalare errori. Grazie!
