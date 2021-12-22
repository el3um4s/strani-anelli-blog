---
title: "Come Creare un Cifrario di Cesare con JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Ilona Frey**](https://unsplash.com/@couleuroriginal)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-21 15:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Ultimamente gli elfi hanno preso proprio sul serio la sicurezza informatica. È praticamente diventata moda. E come ogni moda è arrivata anche ai bambini. Uno dei giochi preferiti dei piccoli elfi è scriversi dei messaggi cifrati durante l'orario di scuola. Qualcuno di loro ha trovato su Wikipedia la pagina sul [cifrario di Cesare](https://en.wikipedia.org/wiki/Caesar_cipher) e ora non la smettono più.

### Il problema: Secret Messages ✉️

{% include picture img="cover.webp" ext="jpg" alt="" %}

Il problema di oggi, il numero 22 del [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-22) riguarda ancora una volta le passoword, i codici e i metodi per decifrarli. E si va sul classico: il cifrario di Cesare:

```
È un cifrario a sostituzione monoalfabetica, in cui ogni lettera del testo in chiaro è sostituita, nel testo cifrato, dalla lettera che si trova un certo numero di posizioni dopo nell'alfabeto
```

Detto in parole semplici, si sostituisce ogni lettera con quella che la segue di `x` posizioni. Per esempio, con `shift = 1` la lettera `A` diventa `B`. Con `shift = 2` la lettera `A` diventa `C`. Con `shift = 3` la lettera `A` diventa `D`. E così via.

{% include picture img="caesar.webp" ext="jpg" alt="" %}

In rete si trovano diverse soluzioni ma quasi tutte prevedono la scrittura esplicita dell'alfabeto più qualche condizione `if` unita a dei cicli `for`. La mia soluzione del problema, invece, è leggermente diversa e parte dalla formula

```
f(x) = x + k(mod. m)
```

Con `m = numero di lettere dell'alfabeto` e `k = spostamento`.

Partendo da questa formula posso ottenere una funzione JavaScript simile a questa:

```js
const chiper = (char, shift) => mod(char + shift, alphabet.length);
```

Il problema è capire come passare le lettere. Il metodo più comune prevede di convertire il carattere nel corrispettivo codice numerico. Poi ci aggiungiamo lo shift da applicare e lo riconvertiamo in caratteri.

Ho però deciso di fare qualcosa di diverso. In fin dei conti un cifrario di Cesare non è altro che un dizionario in cui a ogni lettera ne corrisponde un'altra. Posso quindi creare un oggetto JavaScript con le varie lettere come chiavi. Ovviamente mi interessa che sia un procedimento automatico.

Per prima cosa mi creo due array, uno per le lettere maiuscole, l'altro per quelle in minuscolo:

```js
const uppercase = () =>
  [...Array(26)].map((n, i) => `${String.fromCharCode(i + "A".charCodeAt())}`);
const lowercase = () =>
  [...Array(26)].map((n, i) => `${String.fromCharCode(i + "a".charCodeAt())}`);
```

Poi mi serve una funzione per calcolare il modulo di un numero:

```js
const mod = (a, b) => {
  const c = a % b;
  return c < 0 ? c + b : c;
};
```

Infine qualcosa che crei una corrispondenza tra la chiave e la soluzione.

```js
const chiper = (array, shift) => {
  const cipher = {};
  array.forEach((value, index) => {
    cipher[value] = array[mod(index + shift, array.length)];
  });
  return cipher;
};
```

Questa funzione accetta in ingresso un'array contente l'alfabeto e restituisce un oggetto con il codice di cifratura.

Per ogni item dell'array, ovvero per ogni lettera dell'alfabeto, calcola la corrispondente lettera cifrata. La lunghezza dell'alfabeto è data dal numero di elementi presenti nell'array.

Per semplificare la risoluzione del problema creo una funzione di supporto per creare il dizionario sia delle lettere maiuscole che di quelle minuscole.

```js
const caesarChipher = (shift) => {
  return {
    ...chiper(uppercase(), shift),
    ...chiper(lowercase(), shift),
  };
};
```

In questo modo ottengo un oggetto simile a questo:

```js
const caesar = {
  A: "N",
  B: "O",
  C: "P",
  //...
  a: "n",
  b: "o",
  c: "p",
  //...
};
```

Va da sé che dopo aver ottenuto lo cifrario posso tradurre ogni lettera in maniera semplice:

```js
const a = caesar.a; // n
const aUpper = caesar.A; // N
const b = caesar["b"]; // o
```

Possiamo anche ignorare tutti i caratteri non alfabeti in maniera molto semplice: se non esiste la chiave corrispondete nel cifrario allora il carattere non viene convertito:

```js
const processCharacter = (cipher, character) =>
  cipher.hasOwnProperty(character) ? cipher[character] : character;
```

Dopo aver creato tutte le varie funzioni di supporto la soluzione al problema diventa molto corta e semplice:

```js
export default (text, shift) => {
  const caesar = caesarChipher(shift);
  return [...text].map((c) => processCharacter(caesar, c)).join("");
};
```

C'è un aspetto interessante in questa soluzione: la stessa funzione usata per decifrare può essere usata anche per decifrare. Come? Beh, basta inserire uno shift negativo: in questo modo le lettere non vengono fatte scorrere in avanti bensì all'indietro permettendo di recuperare il messaggio originale.

Il codice completo della mia soluzione è questo:

```js
const uppercase = () =>
  [...Array(26)].map((n, i) => `${String.fromCharCode(i + "A".charCodeAt())}`);
const lowercase = () =>
  [...Array(26)].map((n, i) => `${String.fromCharCode(i + "a".charCodeAt())}`);

const mod = (a, b) => {
  const c = a % b;
  return c < 0 ? c + b : c;
};

const chiper = (array, shift) => {
  const cipher = {};
  array.forEach((value, index) => {
    cipher[value] = array[mod(index + shift, array.length)];
  });
  return cipher;
};

const caesarChipher = (shift) => {
  return {
    ...chiper(uppercase(), shift),
    ...chiper(lowercase(), shift),
  };
};

const processCharacter = (cipher, character) =>
  cipher.hasOwnProperty(character) ? cipher[character] : character;

export default (text, shift) => {
  const caesar = caesarChipher(shift);
  return [...text].map((c) => processCharacter(caesar, c)).join("");
};
```

### La soluzione di Prashant Yadav

Come dicevo all'inizio in rete si possono trovare molte soluzioni a questo problema. [Prashant Yadav](https://learnersbucket.com/examples/algorithms/caesar-cipher-in-javascript/) ne propone alcune tra le più comuni.

```js
let ceaserCipher = (str) => {
  //Deciphered reference letters
  let decoded = {
    a: "n",
    b: "o",
    c: "p",
    d: "q",
    e: "r",
    f: "s",
    g: "t",
    h: "u",
    i: "v",
    j: "w",
    k: "x",
    l: "y",
    m: "z",
    n: "a",
    o: "b",
    p: "c",
    q: "d",
    r: "e",
    s: "f",
    t: "g",
    u: "h",
    v: "i",
    w: "j",
    x: "k",
    y: "l",
    z: "m",
  };

  //convert the string to lowercase
  str = str.toLowerCase();

  //decipher the code
  let decipher = "";
  for (let i = 0; i < str.length; i++) {
    decipher += decoded[str[i]];
  }

  //return the output
  return decipher;
};
```

Prashant individua i principali:

- un codice di questo genere permette una cifratura solamente con uno shift predefinito (in questo caso di 13)
- funziona solamente per le lettere in minuscolo

Io aggiungerei che

- funziona solamente con stringhe che non contengono spazi o altri caratteri non contenuti nella variabile `decoded`
- non serve per decifrare il messaggio

La sua seconda idea è invece molto più interessante:

```js
let caesarCipher => (str, key) {
  return str.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0)-65 + key ) % 26 + 65));
}
```

Si tratta di convertire tutte le lettere in maiuscolo e poi sostituirle direttamente nella stringa. Resta il problema della gestione delle lettere minuscole. Per farlo occorre modificare la funzione:

```js
//check if letter is uppercase
function isUpperCase(str) {
  return str === str.toUpperCase();
}

//decipher the string
let ceaserCipher = (str, key) => {
  let decipher = "";

  //decipher each letter
  for (let i = 0; i < str.length; i++) {
    //if letter is uppercase then add uppercase letters
    if (isUpperCase(str[i])) {
      decipher += String.fromCharCode(
        ((str.charCodeAt(i) + key - 65) % 26) + 65
      );
    } else {
      //else add lowercase letters
      decipher += String.fromCharCode(
        ((str.charCodeAt(i) + key - 97) % 26) + 97
      );
    }
  }

  return decipher;
};
```

Il problema resta però la gestione dei caratteri non alfabetici, spazi compresi.

### La soluzione di Marian Veteanu

Il blog di [Marian Veteanu](https://codeavenger.com/2017/05/19/JavaScript-Modulo-operation-and-the-Caesar-Cipher.html) presenta molti post interessanti. Tra questi c'è una soluzione a come creare un cifrario di Cesare:

```js
function mod(n, p) {
  return n - p * Math.floor(n / p);
}

function encrypt(msg, key) {
  var encMsg = "";

  for (var i = 0; i < msg.length; i++) {
    var code = msg.charCodeAt(i);

    if (code >= 65 && code <= 65 + 26 - 1) {
      code -= 65;
      code = mod(code + key, 26);
      code += 65;
    }
    if (code >= 97 && code <= 97 + 26 - 1) {
      code -= 97;
      code = mod(code + key, 26);
      code += 97;
    }

    encMsg += String.fromCharCode(code);
  }

  return encMsg;
}
```

Questa soluzione funziona, ma non mi piace la presenza di tanti valori hardcoded. Però ha il vantaggio di non far ricorso ad array o ad altri oggetti. Come la prossima soluzione.

### La soluzione di Evan Hahn

[Evan Hahn](https://gist.github.com/EvanHahn/2587465) propone una soluzione funzionante:

```js
var caesarShift = function (str, amount) {
  // Wrap the amount
  if (amount < 0) {
    return caesarShift(str, amount + 26);
  }

  // Make an output variable
  var output = "";

  // Go through each character
  for (var i = 0; i < str.length; i++) {
    // Get the character we'll be appending
    var c = str[i];

    // If it's a letter...
    if (c.match(/[a-z]/i)) {
      // Get its code
      var code = str.charCodeAt(i);

      // Uppercase letters
      if (code >= 65 && code <= 90) {
        c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
      }

      // Lowercase letters
      else if (code >= 97 && code <= 122) {
        c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
      }
    }

    // Append
    output += c;
  }

  // All done!
  return output;
};
```

Questa soluzione però presenta alcuni problemi. O, meglio, alcune cose che non mi piacciono. La prima è la presenza di diverse condizioni `if` e di un ciclo `for`. Sono sempre più convinto che rendano difficoltosa la lettura del codice e difficile la sua manutenzione.

In secondo luogo l'alfabeto su cui lavorare è fissato nel codice tramite dei valori scritti. Dove possibile è sempre meglio evitare di inserire dei valori hardcoded. Infine se volessi convertire questa funzione per usare un altro set di caratteri mi ritroverei in difficoltà.

Ma al netto di queste mie osservazioni una soluzione di questo genere funziona.

Bene, per oggi è tutto. Ovviamente io preferisco la soluzione che ho proposto io. Ma la cosa bella di JavaScript, e della programmazione in generale, è che possono esistere diversi modi per arrivare alla soluzione corretta. Anzi, parte del divertimento è capire quali sono le varie possibilità.
