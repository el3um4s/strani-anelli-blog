---
title: "Come creare menu per elfi"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Nathan Dumlao**](https://unsplash.com/@nate_dumlao)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-03 15:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Secondo giorno del [Dev Advent Calendar 2021](https://github.com/devadvent/readme) e nuovo puzzle da risolvere. Gli elfi di Babbo Natale sono riusciti a trovare la renna Rudolf dispersa nella foresta. Rientrati nel villaggio hanno bisogno di scaldarsi con una tazza calda. Ma il menù dell'_Elf Coffee Shop_ è confusionario. Forse è il caso di dare una mano a rifarlo.

### Il problema: Elf Coffee Shop 🧝🥤

{% include picture img="cover.webp" ext="jpg" alt="" %}

Il problema di oggi riguarda l'unione di due array di oggetti e il loro ordinamento. Anche il puzzle di oggi è tutto sommato abbastanza semplice ma nel risolverlo ho dovuto approfondire alcune mie lacune. Non ho avuto il tempo di testare varie soluzioni, quindi non escludo che ci sia un modo più furbo. Ma bando alle ciance e cominciamo con le richieste.

### Ordinare un array di oggetti: ordine alfabetico

Affronto subito il problema dell'ordinamento. Come mai? Perché sospetto che sia più rapido ordinare due array piccoli secondo un criterio unico piuttosto che ordinare un array molto più grande con due criteri distinti. Quindi comincio con l'ordinare in maniera alfabetica l'elenco delle bevande.

Dal punto di vista teorico consiglio la lettura di un post di [Javascript Tutorial: Sorting Array Elements](https://www.javascripttutorial.net/javascript-array-sort/). E, ovviamente, la documentazione del metodo [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

```js
drinks.sort((a, b) => {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }

  return 0;
});
```

Il primo passaggio è di ordinare direttamente la lista delle bevande in base alla proprietà "name". Quindi controllo se il nome di una viene prima del nome dell'altra in base all'alfabeto e lascio che il metodo `sort()` faccia il suo dovere.

Il primo problema che può sorgere riguarda la differenza delle lettere maiuscole e minuscole. Se per noi umani non è difficile capire che `a === A` per Javascript un po' di problemi ci sono. Conviene quindi convertire tutti i nomi in lettere maiuscole (o minuscole).

```js
drinks.sort((a, b) => {
  if (a.name.toUpperCase() < b.name.toUpperCase()) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }

  return 0;
});
```

Bene, ma in questo modo vado a cambiare il menù stesso. Dopo sarà difficile ottenere un menù con i nomi scritti in maniera corretta. Per risolvere il problema non modifico direttamente l'array ma copio i nomi in delle variabili:

```js
drinks.sort((a, b) => {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  if (nameA < nameB) {
    return -1;
  } else if (nameB > nameA) {
    return 1;
  }

  return 0;
});
```

Resta un altro problema: il metodo `sort()` modifica direttamente l'ordine dell'array originale. Personalmente preferisco lasciare tutto il più immutato possibile. Di conseguenza seguo il consiglio di [Ramon Balthazar](https://stackoverflow.com/questions/30431304/functional-non-destructive-array-sort): usare `shuffledArray.slice().sort()`. In questo modo ottengo un nuovo array senza modificare quello originale:

```js
const sortedDrinks = drinks.slice().sort((a, b) => {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  if (nameA < nameB) {
    return -1;
  } else if (nameB > nameA) {
    return 1;
  }

  return 0;
});
```

### Ordinare un array di oggetti: ordine numerico

Dopo aver messo in ordine le bevande è ora di passare ai vari gusti personalizzati. Istintivamente posso pensare di usare una funzione simile, sostituendo alla proprietà `name` la proprietà `price`. E, di conseguenza, usare come confronto la formula `a.price < b.price`. Ma è più semplice usare direttamente `a.price - b.price`. Ok, meglio scriverlo bene:

```js
const sortedFlavors = flavors.slice().sort((a, b) => a.price - b.price);
```

C'è però un caso particolare che manca a questa lista di ingredienti: la bevanda è liscia, senza aggiunte particolari.

Penso il metodo più rapido per gestire questo caso sia di aggiungere un "gusto indefinito" con prezzo `0` alla lista. Lo aggiungo all'inizio della lista già ordinata usando il metodo [unshift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)

```js
sortedFlavors.unshift({
  name: undefined,
  price: 0,
});
```

### Combinare bevande e sapori in un menù

Adesso che ho due array ordinati (`sortedDrinks` e `sortedFlavors`) posso cominciare a combinare ingredienti e sapori. Potrei usare due cicli `for` annidati. Oppure usare il metodo [map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). Scelgo quest'ultima soluzione perché mi pare più chiara:

```js
const result = sortedDrinks.map((drink) => {
  return sortedFlavors.map((flavor) => {
    return {
      drink: drink.name,
      flavor: flavor.name,
      price: drink.price + flavor.price,
    };
  });
});
```

C'è però un problema: il risultato è un array contenente diversi arrays, uno per ogni bevanda. Il puzzle richiede un array di questo tipo:

```js
const result = [
  { drink: "Latte", flavor: undefined, price: 3 },
  { drink: "Latte", flavor: "Cinnamon", price: 4 },
  { drink: "Latte", flavor: "Peppermint", price: 5 },
  { drink: "Macchiato", flavor: undefined, price: 10 },
  { drink: "Macchiato", flavor: "Cinnamon", price: 11 },
  { drink: "Macchiato", flavor: "Peppermint", price: 12 },
];
```

Posso usare il metodo `flat()` su `result`. Oppure posso usare [Array.prototype.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap) per ottenere lo stesso risultato:

```js
const result = sortedDrinks.flatMap((drink) => {
  return sortedFlavors.map((flavor) => {
    return {
      drink: drink.name,
      flavor: flavor.name,
      price: drink.price + flavor.price,
    };
  });
});
```

Bene, direi che gli elfi di Babbo Natale possono essere soddisfatti. Tramite questa soluzione possono finalmente ordinare quello di cui hanno voglia da un comodo menù. Spero solamente che non salti loro in testa qualche richiesta aggiuntiva: adesso è giunto anche per me il momento di bere una bella tisana calda.
