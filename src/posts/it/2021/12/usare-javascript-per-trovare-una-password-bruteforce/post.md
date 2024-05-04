---
title: Usare JavaScript per scoprire password (attacco bruteforce)
published: true
date: 2021-12-18 17:00
categories:
  - DevAdvent
  - JavaScript
tags:
  - DevAdvent
  - JavaScript
  - how-to-generate-paswword-with-javascript
  - how-to-implement-brute-force-attacks-on-hash-values-in-javascript
lang: it
cover: image.webp
description: "Lo sapevo: dopo aver insegnato agli elfi come creare password con JavaScript qualcuno ha perso la propria password. Questo è un problema, perché il sistema elfico informatico centrale non conserva copia delle password. Conserva semplicemente l'hash, che per sua natura è praticamente impossibile da decodificare. Cosa posso fare, allora?"
---

Lo sapevo: dopo aver insegnato agli elfi come [creare password con JavaScript](https://blog.stranianelli.com/how-to-generate-paswword-with-javascript/) qualcuno ha perso la propria password. Questo è un problema, perché il sistema elfico informatico centrale non conserva copia delle password. Conserva semplicemente l'[hash](https://en.wikipedia.org/wiki/Cryptographic_hash_function), che per sua natura è praticamente impossibile da decodificare. Cosa posso fare, allora?

### Il problema: Decoding The Code 🔐

![Immagine](./cover.webp)

Il problema 17 del [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-17) si può riassumere così: come crackare una password usando JavaScript? Oppure, come fare un attacco [bruteforce](https://en.wikipedia.org/wiki/Brute-force_search) a una tabella di hash?

Ovviamente messo così il problema è irrisolvibile. Per come sono costruite le funzioni di crittografia hash non sono reversibili. Ma prima di affrontare il problema mi conviene capire bene cosa vuol dire.

### Cryptographic hash function

In questo caso Wikipedia è una manna e spiega bene quali sono le caratteristiche.

Per prima cosa: cosa fa? Una funzione di _hash_ prende dei dati e li converte in una stringa binaria di dimensione fissa. Ogni set di dati produce un hash differente. E dati simili producono hash molto diversi.

Questi algoritmi sono progettati per resistere a vari tipo di attacco e presentano 3 livelli di sicurezza:

1. Resistenza alla preimmagine: non deve essere possibile risalire ai dati originari partendo dall'hash
2. Resistenza alla seconda preimmagine: non deve essere possibile creare un hash uguale a un altro a partire da un set di dati diversi
3. Resistenza alla collisione: non deve essere possibile trovare due set di dati diversi che producano lo stesso hash

Questo permette di essere sicuri che se due hash sono identici allora i dati di partenza sono identici.

Un esempio di utilizzo pratico sono le password. Se vogliamo creare un sistema di verifica dell'identità è pericoloso creare un database con le password dei vari utenti. Conviene conservare solamente l'hash delle password. In questo modo quando qualcuno prova ad accedere basta confrontare l'hash generato dalla richiesta con l'hash salvato: se sono identici allora la password è corretta.

Questa è una cosa che mi affascina. Poter verificare la correttezza di una password senza doverla conoscere. Come mi affascina tantissimo un'altra caratteristica: due password simili hanno hash diversissimo.

```js
const h = {
  abcde: "03de 6c57 0bfe 24bf c328 ccd7 ca46 b76e adaf 4334",
  ABCDE: "7be0 7aaf 460d 593a 323d 0db3 3da0 5b64 bfdc b3a5",
  abcdf: "9693 da0e 085a f20e f1f9 82b0 17fc 6ec2 4198 48e5",
  ABCDF: "0efb 7bbc eafd 99fe 7eaa 38ed d279 ca6e 277c 1aba",
};
```

Questo rende molto difficile risalire alla password di partenza.

### Calcolare l'Hash di una password

Ovviamente per rendere il problema affrontabile occorre semplificarlo. Le regole di ingaggio sono queste:

- conosciamo l'hash della password da trovare
- sappiamo che forma aveva la password di partenza: `<UPPER CASE LETTER>-<3-DIGIT-NUMBER>`. Per esempio `X-348`, `L-239`, `V-111`.

Questo è un grande aiuto. In questo modo noi possiamo creare un elenco delle potenziali password da testare. Poi calcoliamo l'hash di ognuna finché non troviamo quello corretto.

In NodeJS è facile trovare l'hash di una stringa. Basta usare l'API [crypto](https://nodejs.org/api/crypto.html):

```js
import { createHash } from "crypto";

const string = "abcde";

const hash = createHash("sha1").update(string).digest("hex");
// 03de 6c57 0bfe 24bf c328 ccd7 ca46 b76e adaf 4334
```

### Creare una lista di potenziali passwords

Il metodo più semplice per creare una lista delle potenziali password da testare è usando due `cicli for` annidati. Uso il primo per scorrere le lettere dell'alfabeto:

```js
export const bruteForcePassword = (hash) => {
  for (let i = "A".charCodeAt(); i <= "Z".charCodeAt(); i++) {}
  return null;
};
```

Inserisco poi un secondo ciclo per scorrere tutti i numeri da `0` a `999`

```js
export const bruteForcePassword = (hash) => {
  for (let i = "A".charCodeAt(); i <= "Z".charCodeAt(); i++) {
    for (let j = 0; j <= 999; j++) {}
  }
  return null;
};
```

Creo quindi una variabile `test` dentro cui registrare la password da testare.

```js
const test = `${String.fromCharCode(i)}-${j.toString().padStart(3, "0")}`;
```

Uso il metodo [String.prototype.padStart()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart) per far sì che ogni password abbia esattamente 3 numeri. In questo modo posso trasformare `A-0` in `A-000`, `C-12` in `C-012` e via dicendo.

Ricavo quindi l'hash

```js
const hashTest = createHash("sha1").update(test).digest("hex");
```

E infine lo confronto con quello che ho gìà:

```js
if (hash === hashTest) {
  return test;
}
```

Esco dalla funzione immediatamente: non mi occorre controllare le altre password. Una volta che ho trovato quella che genera l'hash corretto ho anche trovato quello che stavo cercando.

Il codice completo è così:

```js
import { createHash } from "crypto";

export const bruteForcePassword = (hash) => {
  for (let i = "A".charCodeAt(); i <= "Z".charCodeAt(); i++) {
    for (let j = 0; j <= 999; j++) {
      const test = `${String.fromCharCode(i)}-${j.toString().padStart(3, "0")}`;
      const hashTest = createHash("sha1").update(test).digest("hex");
      if (hash === hashTest) {
        return test;
      }
    }
  }
  return null;
};
```

### Refractor

È una soluzione abbastanza semplice e tutto comprensibile. Ma posso fare di meglio. Posso eliminare il ciclo annidato. Posso anche eliminare uno dei due `return`. In questo modo posso ottenere qualcosa di più chiaro:

```js
export const bruteForcePassword = (hash) => {
  let password = null;
  for (const test of listPassword()) {
    password = isPassword(hash, test);
    if (password) break;
  }
  return password;
};
```

In realtà si potrebbe semplificare ancora di più aggiungendo l'argomento `listPassword` invece di calcolarlo all'interno Della funzione. Ma il problema non mi permette di farlo quindi devo accontentarmi.

Ho deciso di estrarre dalla funzione `bruteForcePassword` tutto quello che non è direttamente collegato con il problema. Quindi la creazione della lista di password e il confronto degli hash:

```js
const getHash = (message) => createHash("sha1").update(message).digest("hex");
const isPassword = (hash, message) =>
  hash === getHash(message) ? message : null;
```

La funzione `isPassword` restituisce direttamente la password e non un valore boolean. In questo modo posso sfruttare la capacità di JavaScript di considerare come [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) le stringhe e come [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) i valori `null`. Mi serve per semplificare l'uscita dal ciclo `for...of`.

Per generare la lista delle password scompongo il problema in più parti. Per prima cosa mi serve un array contenente i numeri da `0` a `999`. Creo questa funzione:

```js
const createArrayNumbers = () =>
  [...Array(1000).keys()].map((n) => `${n.toString().padStart(3, 0)}`);
```

Su [stackoverflow](https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n) c'è una bella discussione su questo problema. In sintesi, posso creare un array di `n` elementi con `Array(n)`. Se ci aggiungo il metodo [Array.prototype.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys) e poi uso lo [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) posso ottenere un array di `n` elementi ognuno dei quali contiene un numero che rappresenta l'indice della propria posizione:

```js
[...Array(5).keys()];
// [0, 1, 2, 3, 4]
```

Uso direttamente questo array con il metodo [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) per aggiungere gli `0` mancanti ai primi `100` elementi.

Posso creare facilmente un array contenente le lettere dell'alfabeto:

```js
const createArrayChars = () =>
  [...Array(26)].map((n, i) => `${String.fromCharCode(i + "A".charCodeAt())}`);
```

Questa volta non uso `keys()`: posso lasciare nulli tutti gli elementi dell'array e poi usare l'indice per ottenere lo `charCode` della lettera che voglio inserire.

Creo una funzione di supporto per unire lettere e numeri:

```js
const combineCharWithNumber = (char, numbers) =>
  numbers.map((n) => `${char}-${n}`);
```

In questo modo aggiungo il carattere desiderato a ogni elemento dell'array con i numeri. Infine creo la lista delle potenziali password:

```js
const listPassword = () =>
  createArrayChars()
    .map((char) => combineCharWithNumber(char, createArrayNumbers()))
    .flat();
```

Unendo il tutto ottengo la mia soluzione:

```js
import { createHash } from "crypto";

const getHash = (message) => createHash("sha1").update(message).digest("hex");
const isPassword = (hash, message) =>
  hash === getHash(message) ? message : null;

const createArrayNumbers = () =>
  [...Array(1000).keys()].map((n) => `${n.toString().padStart(3, 0)}`);
const createArrayChars = () =>
  [...Array(26)].map((n, i) => `${String.fromCharCode(i + "A".charCodeAt())}`);
const combineCharWithNumber = (char, numbers) =>
  numbers.map((n) => `${char}-${n}`);

const listPassword = () =>
  createArrayChars()
    .map((char) => combineCharWithNumber(char, createArrayNumbers()))
    .flat();

export const bruteForcePassword = (hash) => {
  let password = null;
  for (const test of listPassword()) {
    password = isPassword(hash, test);
    if (password) break;
  }
  return password;
};
```

Con questo è tutto. Per chi fosse interessato, questo puzzle è collegato al numero 11:

- [How to Generate a Random Password Using JavaScript](https://blog.stranianelli.com/how-to-generate-paswword-with-javascript/)

Invece ho salvato in questa lista le soluzioni agli altri problemi di questa challenge:

- [Dev Advent Calendar](https://el3um4s.medium.com/list/dev-advent-calendar-89d163132d6e)
