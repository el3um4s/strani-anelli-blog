---
title: 10 Modi Per Trovare Una Parola In Un Testo Con JavaScript
published: true
date: 2022-11-20 17:30
categories:
  - JavaScript
tags:
  - how-to-check-if-a-string-contains-substring-in-javascript
  - JavaScript
lang: it
cover: image.webp
description: Una delle cose più divertenti della programmazione è trovare tutti i modi disponibili per risolvere un problema. Oggi voglio capire, e condividere, quali metodi esistono per verificare se una stringa contiene una sottostringa in JavaScript.
---

Una delle cose più divertenti della programmazione è trovare tutti i modi disponibili per risolvere un problema. Oggi voglio capire, e condividere, quali metodi esistono per verificare se una stringa contiene una sottostringa in JavaScript.

### String.prototype.includes()

Cominciamo con la soluzione migliore, il metodo [`String.prototype.includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes). Permette di verificare se una stringa contiene una sottostringa, e ritorna un valore booleano.

```js
const string = "Hello World!";

console.log(string.includes("Hello")); // true
console.log(string.includes("!")); // true
console.log(string.includes("Hello World!")); // true

console.log(string.includes("Hello World!!")); // false
```

Il suo limite principale è che è case-sensitive, quindi non funziona con le stringhe che contengono caratteri maiuscoli e minuscoli.

```js
const string = "Hello World!";
console.log(string.includes("hello")); // false
```

Possiamo risolvere questo problema trasformando la stringa in minuscolo prima di eseguire il controllo.

```js
const string = "Hello World!";
const substring = "HeLLo";
console.log(string.toLowerCase().includes(substring.toLowerCase())); // true
```

### String.prototype.indexOf()

Un secondo metodo usa [`String.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf). Questo metodo ritorna l'indice della prima occorrenza di una sottostringa all'interno di una stringa, o `-1` se non viene trovata. Posso quindi convertire l'indice in un valore booleano.

```js
const string = "Hello World!";

console.log(string.indexOf("Hello") !== -1); // true
console.log(!string.indexOf("Hello")); // true
```

Anche in questo caso, il metodo è case-sensitive.

```js
const string = "Hello World!";
const substring = "HeLLo";

console.log(!string.indexOf(substring)); // false

console.log(!string.toLowerCase().indexOf(substring.toLowerCase())); // true
```

### Polyfill

Se non è possibile usare un browser moderno (a me a volte capita ancora), è comunque possibile creare un polyfill per aggiungere il metodo `String.prototype.includes()`. Per farlo uso ancora una volta `String.prototype.indexOf()` ma lo _nascondo_ in un metodo `includes()`.

```js
if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    "use strict";
    if (typeof start !== "number") {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}
```

### Knuth–Morris–Pratt algorithm

Un'altra soluzione è usare l'algoritmo di [Knuth–Morris–Pratt](https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm). Questo algoritmo, degli anni '70, permette una ricerca molto veloce, ed è spesso usato come base per altri algoritmi di ricerca di stringhe. Questa è la versione di [Nayuki](https://www.nayuki.io/res/knuth-morris-pratt-string-matching/kmp-string-matcher.js)

```js
function kmpSearch(pattern, text) {
  if (pattern.length == 0) return 0; // Immediate match

  // Compute longest suffix-prefix table
  var lsp = [0]; // Base case
  for (var i = 1; i < pattern.length; i++) {
    var j = lsp[i - 1]; // Start by assuming we're extending the previous LSP
    while (j > 0 && pattern[i] !== pattern[j]) j = lsp[j - 1];
    if (pattern[i] === pattern[j]) j++;
    lsp.push(j);
  }

  // Walk through text string
  var j = 0; // Number of chars matched in pattern
  for (var i = 0; i < text.length; i++) {
    while (j > 0 && text[i] != pattern[j]) j = lsp[j - 1]; // Fall back in the pattern
    if (text[i] == pattern[j]) {
      j++; // Next char matched, increment position
      if (j == pattern.length) return i - (j - 1);
    }
  }
  return -1; // Not found
}

console.log(kmpSearch("ays", "haystack") != -1); // true
console.log(kmpSearch("asdf", "haystack") != -1); // false
```

### Altri metodi

Ma questi non sono le uniche strade che possiamo prendere. Esistono altre possibilità, a patto di forzare un po' la mano a JavaScript. Non consiglio di usarle, ma sono interessante per capire come funziona JavaScript.

Nei prossimi esempi userò due variabili, `string` e `substring`, che conterranno rispettivamente la stringa e la sottostringa da cercare.

```js
const string = "Hello World!";
const substring = "Hello";
```

Posso usare [`String.prototype.match()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) per trovare il risultato di una ricerca con una espressione regolare. Se la ricerca non trova nulla, ritorna `null`. Converto quindi il risultato in un valore booleano.

```js
console.log(!!string.match(substring)); // true
```

In maniera simile [`String.prototype.search()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search) restituisce `-1` se la ricerca non trova nulla. Mi basta quindi controllare che il risultato sia maggiore o uguale a zero.

```js
console.log(string.search(substring) >= 0); // true
```

Un altro metodo può essere di sostituire la sottostringa con un valore vuoto e controllare che la lunghezza della stringa sia cambiata. Oppure posso anche semplicemente verificare che non sia uguale a sé stessa. Per farlo uso il metodo [`String.prototype.replace()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)

```js
console.log(string.replace(substring, "") != string); // true
console.log(string.replace(substring, "").length != string.length); // true
```

### startWith() e endsWith()

Infine, se voglio controllare solamente l'inizio o la fine posso usare [`String.prototype.startsWith()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith) e [`String.prototype.endsWith()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)

```js
const string = "Hello World!";

console.log(string.startsWith("Hello")); // true
console.log(string.endsWith("!")); // true
```

Questi due metodi possono essere utili in casi particolari, e può capitare di doverli usare più di quanto uno possa pensare. Ma se si vuole fare una ricerca generica, è meglio usare un'altra soluzione.

### Conclusioni

Bene, direi che queste dieci soluzioni possono bastare. Al di là del divertissement legato a questo caso specifico, vale sempre la pena dedicare un po' di tempo per esplorare le varie soluzioni disponibili. Non è sempre detto che la prima idea sia la migliore. E, in generale, è un buon modo per approfondire un argomento.
