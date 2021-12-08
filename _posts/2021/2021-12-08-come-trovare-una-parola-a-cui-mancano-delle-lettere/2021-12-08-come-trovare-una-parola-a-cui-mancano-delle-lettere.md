---
title: "Come usare JavaScript per scegliere nomi da una lista"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Hannes Wolf**](https://unsplash.com/@hannes_wolf)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-08 11:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Qualcosa è andato storto e gli elfi hanno fatto un piccolo pasticcio. Alcuni dei regali sono finiti in mezzo alla neve e i cartellini con i nomi si sono rovinati. Per fortuna la maggior parte delle lettere dei nomi sono visibili. Babbo Natale è convinto si possa ricostruire il nome intero a partire dai frammenti.

### Il problema: Matching Gift Names 🎁

{% include picture img="cover.webp" ext="jpg" alt="" %}

Il problema di oggi, il numero 7 del [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-7) è molto veloce. Ma richiede di usare le **regular expressions**. Onestamente faccio ancora fatica a maneggiare questo aspetto di JavaScript: trovo difficoltà anche con un problema semplice come questo.

Comincio con la soluzione:

```js
import { default as names } from "../data/names.js";

export const matchedNames = (smudgedName) => {
  const nameWithRegex = smudgedName.replace(/#/gu, ".");
  const regex = new RegExp(`^${nameWithRegex}$`, "gu");

  return names.filter((name) => name.search(regex) > -1);
};
```

Allora, il primo passo, per me, è di provare varie combinazioni di regex e vedere qual è più adatta al problema. Per fare questo uso un sito molto ben fatto, [regex101](https://regex101.com/) e faccio un po' di test manuali. Dopo aver individuato la regola (spero) giusta passo a creare la regular expression.

Ci sono due modi. Quello che finora ho usato più spesso è così:

```js
const re = /hello/gu;
```

In genere è la soluzione migliore perché quella più efficiente. Prevede però di conoscere già in partenza l'espressione da usare. Non è questo il caso di oggi. Devo creare una regex diversa per ogni nome da controllare. Uso quindi:

```js
const nameWithRegex = "hello";
const re = new RegExp(nameWithRegex, "gu");
```

Ovviamente questo codice funziona solamente se voglio cercare la parola `hello`. Non è questo il mio scopo.

Per prima cosa prendo la parola rovinata e sostituisco il carattere `#` con il carattere `.`. Come mai? Perché il punto, nelle regex, indica un singolo carattere qualsiasi. In questo modo posso trasformare `h#ello` nella stringa `h.ello` da usare direttamente come regex nel passaggio successivo. Quindi, scritto in codice:

```js
const nameWithRegex = smudgedName.replace(/#/gu, ".");
```

Il passaggio successivo richiede osservare com'è la lista dei nomi. Poiché si tratta di un array ogni nome è a se stante. Posso quindi dare per scontato che il confronto avvenga tra stringhe complete. Aggiungo quindi due comandi:

- `^` indica che il patter da trovare è all'inizio della stringa
- `$` indica che dopo l'ultimo carattere del pattern non c'è più nulla.

In questo modo mi assicuro che `patt.` restituisca solamente `patty` e `patti` ma non `patterson`.

```js
const regex = new RegExp(`^${nameWithRegex}$`, "gu");
```

Dopo aver trovato la regex da usare non resta che usarla effettivamente. Il problema è che non posso cavarmela con [RegExp.prototype.test()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test). Il problema è che `test()` fa ricominciare la ricerca sempre dall'ultimi risultato trovato. Questo genera dei bug: credo che senza i test sul codice avrei avuto molte difficoltà a comprendere questo inghippo.

Di conseguenza ho deciso di usare [String.prototype.search()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search): questo metodo fa partire la ricerca sempre dalla posizione `0`, ed è esattamente quello che serve a me. Sono

```js
return names.filter((name) => name.search(regex) > -1);
```

Bene, questo è tutto per oggi.

Chi invece è curioso di leggere le puntate precedenti di questa serie di articoli sul [🎅 Dev Advent Calendar](https://github.com/devadvent/readme), può seguire questi link:

- [Which is The Best Method To Find an Item in an Array of Arrays in JavaScript?](https://betterprogramming.pub/which-is-the-best-method-to-find-an-item-in-an-array-of-arrays-in-javascript-5f51589d2086)
- [How to Get Unique Values from a List in JavaScript](https://javascript.plainenglish.io/how-to-get-unique-values-from-a-list-in-javascript-301675602985)
- [How To Find The Sum of an Array of Objects in JavaScript](https://el3um4s.medium.com/how-to-find-the-sum-of-an-array-of-objects-in-javascript-24965d883bd0)
