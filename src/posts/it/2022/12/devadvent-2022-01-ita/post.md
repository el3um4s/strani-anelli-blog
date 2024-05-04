---
title: "DevAdvent 2022: #1 Il quadrato di ogni cifra"
published: true
date: 2022-12-01 15:00
categories:
  - DevAdvent
  - TypeScript
  - JavaScript
tags:
  - DevAdvent
  - TypeScript
  - JavaScript
cover: image.webp
lang: it
---

Con il mondo di Twitter in subbuglio, e la mia decisione di abbandonarlo, mi sono probabilmente perso qualcosa. Di certo non so se qualcuno sta o meno organizzando un DevAdvent come l'anno scorso. È stata una bella esperienza, l'anno scorso, e mi piacerebbe replicarla. Però il mio tempo è quello che è, e non posso dedicarci molto tempo. Quindi ho deciso di fare una cosa spuria: ogni giorno sceglierò un problema a caso di quelli proposti da [CodeWars](https://www.codewars.com/) e proverò a risolverlo. Vediamo come va.

### Il problema

Il problema di oggi è [Square Every Digit](https://www.codewars.com/kata/546e2562b03326a88e000020). Il problema è molto semplice: dato un numero, restituire un numero ottenuto elevando al quadrato ogni cifra del numero. Per esempio, se il numero è 9119, il risultato sarà 811181. Se il numero è 0, il risultato sarà 0.

### La soluzione

![Immagine](./image-2.webp)

La soluzione che propongo (in TypeScript) è questa:

```ts
export class Kata {
  static squareDigits(num: number): number {
    const char: string = num.toString();
    const result: string = [...char].map((c) => parseInt(c) ** 2).join("");
    return parseInt(result);
  }
}
```

Posso anche scrivere la soluzione in JavaScript:

```js
function squareDigits(num) {
  const char = num.toString();
  const result = [...char].map((c) => parseInt(c) ** 2).join("");
  return +result;
}
```

### Spiegazione

Posso scomporre il problema in diversi pezzetti in modo da semplificare i vari ostacoli.

Per prima cosa converto il numero in una stringa.

```ts
// ts
const char: string = num.toString();

// js
const char = num.toString();
```

Perché faccio così? Perché questo mi permette di estrarre ogni singola cifra del numero. Posso usare il metodo [toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString), oppure concatenare la stringa vuota con il numero. Entrambi i metodi funzionano allo stesso modo.

```ts
// ts
const char: string = "" + num;

// js
const char = "" + num;
```

Il problema e i test riguardano i numeri positivi, ma è interessante anche considerare i numeri negativi. Posso risolvere la questione in vari modo. Posso usare il metodo [Math.abs()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs) per convertire il numero in positivo.

```ts
// ts
const char: string = Math.abs(num).toString();
const char: string = "" + Math.abs(num);

// js
const char = Math.abs(num).toString();
const char = "" + Math.abs(num);
```

Dopo aver trovato la stringa posso convertirla in un array in modo da poter usare il metodo [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

Converto una stringa in array usando lo [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax):

```ts
// ts
const array: Array<string> = [...char];

// js
const array = [...char];
```

Per fare la potenza di un numero posso usare l'operatore [Exponentiation (\*\*)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Exponentiation)

```ts
// ts
const result: number = 2 ** 3;

// js
const result = 2 ** 3;
```

Per convertire una stringa in un numero posso usare il metodo [parseInt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt).

```ts
// ts
const result: number = parseInt("123");

// js
const result = parseInt("123");
```

Mentre per convertire un array in una stringa uso il metodo [Array.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join).

Mettendo questo assieme ottengo

```ts
// ts
const result: string = [...char].map((c) => parseInt(c) ** 2).join("");

// js
const result = [...char].map((c) => parseInt(c) ** 2).join("");
```

Non mi resta quindi che restituire il risultato come fosse un numero:

```ts
return parseInt(result);
```

### Altre soluzioni

Ovviamente non è l'unica soluzione possibile. Per esempio, posso usare il metodo [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) per ottenere il risultato.

```ts
// ts
const result: number = +[...char].reduce((acc, cur) => acc + +cur * +cur, "");
return result;
```

ovvero:

```ts
// ts
export class Kata {
  static squareDigits(num: number): number {
    return +[...("" + Math.abs(num))].reduce(
      (acc, cur) => acc + +cur * +cur,
      ""
    );
  }
}

// js
function squareDigits(num) {
  return +[...("" + Math.abs(num))].reduce((acc, cur) => acc + +cur * +cur, "");
}
```

Un'altra alternativa è utilizzare le [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) e il metodo [String.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace).

```ts
// ts
export class Kata {
  static squareDigits(num: number): number {
    return +("" + Math.abs(num)).replace(/\d/g, (x) => (+x * +x).toString());
  }
}

// js
function squareDigits(num) {
  return +("" + Math.abs(num)).replace(/\d/g, (x) => (+x * +x).toString());
}
```
