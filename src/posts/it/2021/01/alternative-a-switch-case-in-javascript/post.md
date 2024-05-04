---
title: Alternative a Switch-Case in Javascript
published: true
date: 2021-01-14
categories:
  - JavaScript
tags:
  - JavaScript
  - alternative-a-switch-case-in-javascript
cover: cover.webp
lang: it
description: Con l'inizio dell'anno nuovo ho ripreso in mano Construct 3. Il mio buon proposito è di rilasciare un template ogni 15 giorni, circa. Però mi sono accorto di alcuni limiti, miei, della mia conoscenza di JavaScript, de del mio codice. Non sempre (eufemismo per mai!) il mio codice è facilmente leggibile e interpretabile. Ho deciso, quindi, di seguire il più possibile i consigli del libro che mi regalato la Iaia (Clean Code).
---

Con l'inizio dell'anno nuovo ho ripreso in mano Construct 3. Il mio buon proposito è di rilasciare un template ogni 15 giorni, circa. Però mi sono accorto di alcuni limiti, miei, della mia conoscenza di JavaScript, de del mio codice. Non sempre (eufemismo per mai!) il mio codice è facilmente leggibile e interpretabile. Ho deciso, quindi, di seguire il più possibile i consigli del libro che mi regalato la Iaia (_Clean Code_).

Uno dei consigli recita di **non usare if/else oppure switch/case**. Fosse facile, dico io.

### Polimorfismo

Cercando in rete ho trovato alcun approcci. Il primo su un repository di _[frappacchio](https://github.com/frappacchio/clean-code-javascript/#evita-le-condizioni)_ consiglia di sfruttare il polimorfismo:

**Da evitare**

```js
const handleShape = (shape) => { console.log(shape.area()); }

class Shape {
  constructor(type = "Circle", width = 2)
  {
      this.type = type;
      this.width = width;
  }
  area() {
    switch (this.type) {
      case 'Square':
        return this.width ** 2;
      case 'Circle':
        return Math.PI * (this.width / 2) ** 2;
      default:
        return 0;
    }
  }
}

const shape = new Shape("Square");

handleShape(shape);
```

**Bene**

```js
const handleShape = (shape) => { console.log(shape.area()); }

class Shape {
    constructor(width = 2) { this.width = width; }
    area() { return 0; }
}

class Square extends Shape {
    area() { return this.width ** 2; }
}

class Circle extends Shape {
   area() { return Math.PI * (this.width / 2) ** 2; }
}

const shape = new Square();

handleShape(shape);   
```

### Matched & Match

Il secondo metodo, invece, l'ho trovato riportato da _Hajime Yamasaki Vukelic_ su [coderburst.io](https://codeburst.io/alternative-to-javascripts-switch-statement-with-a-functional-twist-3f572787ba1c). In pratica prevede di implementare le funzioni `match` e `matched`

```js
const matched = x => ({
  on: () => matched(x),
  otherwise: () => x,
})

const match = x => ({  
  on: (pred, fn) => (pred(x) ? matched(fn(x)) : match(x)),
  otherwise: fn => fn(x),
})
```

E poi implementare lo switch in una forma del tipo:

```js
const handleShape = (shape) => { console.log(area(shape)); };

function area (type = "Circle", width = 2) {
  return match(type)
          .on(type => type === "Circle", () => Math.PI * (width / 2) ** 2)
          .on(type => type === "Square", () => width ** 2)
          .otherwise(type => () => 0);
};

handleShape("Square");
```

### Jump Table

Il terzo approccio, presentato da _[Jamie Bullock](https://medium.com/better-programming/5-alternatives-to-if-statements-for-conditional-branching-6e8e6e97430b)_ sfrutta la possibilità di chiamare una funzione partendo da una [`jump table`](https://stackoverflow.com/questions/48017/what-is-a-jump-table):

```js
const circle = (width = 2 ) => Math.PI * (width / 2) ** 2;
const square = (width = 2 ) => width ** 2;

const handleShape =
{
    'Circle'  : circle,
    'Square'  : square
};

const shape = "Square";

handleShape[shape]();
```

Personalmente non ho ancora capito quale metodo preferisco. Anche perché ognuno è adatto a un contesto diverso.
