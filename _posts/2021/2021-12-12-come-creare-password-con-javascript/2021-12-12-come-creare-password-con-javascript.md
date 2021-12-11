---
title: "Come creare password con JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [unsplash](https://unsplash.com/@moneyphotos)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-12 12:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Il Polo Nord ha seri problemi di sicurezza. Prima [Babbo Natale che perde il codice dei messaggi](https://el3um4s.medium.com/how-to-convert-from-binary-to-text-in-javascript-and-viceversa-b617d9044436), adesso l'elfo responsabile delle chiavi si è accorto che ce ne sono molte identiche. È ora di cambiare tutte le serrature. Ma questa volta invece delle chiavi si useranno delle password. Di lunghezza e difficoltà diverse a seconda del livello di sicurezza che serve.

### Il problema: Keeping Secrets Safe 🔑

{% include picture img="cover.webp" ext="jpg" alt="" %}

Giorno 11 del [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-11): il problema di oggi riguarda la creazione di password. Dobbiamo generare password diverse, ovvio, utilizzando diversi set di caratteri.

La funzione di partenza è così:

```js
export const generatePassword = (length, options = {}) => {
  return "";
};
```

`length` è un numero e indica la lunghezza della password da generare. `options` invece è un oggetto contente 4 proprietà:

```js
const options = {
  lowercase: true,
  uppercase: true,
  numbers: true,
  specialCharacters: true,
};
```

Credo che per semplificare le cose i test del problema considerano sempre vera ogni proprietà presente nell'oggetto `options`. Parimenti non è necessario passare tutte le proprietà alla funzione.

La funzione `generatePassword` restituisce una string di caratteri casuali. Per ogni set di caratteri impostato nelle opzioni deve esserci almeno un carattere.

La cosa più semplice da cui partire sono gli errori da intercettare. Devo verificare che l'argomento `options` non sia vuoto. Per farlo uso il metodo [Object.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys). Questo metodo restituisce un array con i nomi delle varie proprietà di un oggetto. Basta controllare la sua lunghezza per capire se ci sono o meno delle proprietà:

```js
const optionsKeysLength = Object.keys(options).length;

if (optionsKeysLength === 0) {
  throw new Error("NOT_ENOUGH_OPTIONS");
}
```

Uso la stessa variabile per verificare che la lunghezza richiesta sia corretta:

```js
if (optionsKeysLength > length) {
  throw new Error("PASSWORD_TOO_SHORT");
}
```

Il passo successivo è assicurarmi che ci sia almeno un carattere per ogni set definito. Per riuscirci ho dovuto decidere come verrà generata la password nel suo insieme. Penso che un buon metodo possa essere di creare ogni carattere in maniera indipendente e di salvarlo dentro un array. Poi mescolerò l'array con tutti i caratteri e lo trasformerò in una string con il metodo [Array.prototype.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join).

Per gestire i set di caratteri, invece, uso un oggetto a parte. In questo modo posso, in futuro, aumentare o diminuire le proprietà disponibili:

```js
const OPTIONS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "1234567890",
  specialCharacters: "!@#$%^&*()",
};
```

Creo una funzione di supporto per scegliere una lettera a caso da una parola, ovvero da una string.

```js
const randomChar = (string) =>
  string[Math.floor(Math.random() * string.length)];
```

Resta da capire come scorrere le varie proprietà di un oggetto in modo da capire quali set di carattere usare. Per fare questo uso [for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in). Unendo questi tre pezzi posso essere certo di avere un carattere per ogni set selezionato nella password:

```js
const password = [];

for (const property in options) {
  password.push(randomChar(OPTIONS[property]));
}
```

Resta da decidere come scegliere i caratteri restanti. Ho deciso di riutilizzare la funzione `randomChar()`. Ma usando come argomento tutti i caratteri disponibili. Aggiungo quindi una variabile `characters` e comincio a inserire delle lettere a caso nella `password`:

```js
let characters = "";

for (const property in options) {
  characters += OPTIONS[property];
}

for (let i = optionsKeysLength; i < length; i++) {
  password.push(randomChar(characters));
}
```

Per finire creo una funzione di supporto per mescolare l'array:

```js
const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);
```

Mettendo tutto assieme ottengo una soluzione possibile al problema:

```js
const OPTIONS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "1234567890",
  specialCharacters: "!@#$%^&*()",
};

export const generatePassword = (length, options = {}) => {
  const optionsKeysLength = Object.keys(options).length;

  if (optionsKeysLength === 0) {
    throw new Error("NOT_ENOUGH_OPTIONS");
  }

  if (optionsKeysLength > length) {
    throw new Error("PASSWORD_TOO_SHORT");
  }

  const password = [];
  let characters = "";

  for (const property in options) {
    characters += OPTIONS[property];
    password.push(randomChar(OPTIONS[property]));
  }

  for (let i = optionsKeysLength; i < length; i++) {
    password.push(randomChar(characters));
  }

  return shuffleArray(password).join("");
};

const randomChar = (string) =>
  string[Math.floor(Math.random() * string.length)];
const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);
```

Per oggi è tutto. Per aiutarmi a tenere traccia di questa serie di post ho creato una lista su Medium: [Dev Advent Calendar - The advent diary of an amateur programmer](https://el3um4s.medium.com/list/dev-advent-calendar-89d163132d6e).
