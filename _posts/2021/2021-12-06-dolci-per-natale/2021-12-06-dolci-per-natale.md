---
title: "Dolci di Natale"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Viktor Talashuk**](https://unsplash.com/@viktortalashuk)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-06 10:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Finalmente gli elfi hanno messo da parte le ambizioni imprenditoriali e sono tornati a fare il loro lavoro: aiutare Babbo Natale con i doni per i bambini di tutto il mondo. Sono in ritardo con i preparativi e devono sbrigarsi a preparare i pacchi. Per di più Babbo Natale quest'anno ha deciso di aggiungere delle caramelle. Ovviamente anche queste devono essere personalizzate.

### Il problema: Prepare Bags of Candy 🍫🍬🍭

{% include picture img="cover.webp" ext="jpg" alt="" %}

Il problema di oggi è scomponibile in due. Il primo prevede la creazione di un Universally Unique IDentifier (UUID) da abbinare a ogni pacco. Il secondo è legato alla manipolazione di array da cui estrarre n elementi casuali e non ripetuti.

### Generare un codice univoco con JavaScript

Questa volta non ho seguito i consigli di [Marc Backes](https://twitter.com/themarcba) e ho fatto di testa mia. Il suggerimento era di usare il pacchetto [uuid](https://www.npmjs.com/package/uuid) per generare dei codici univoci. Per un progetto "reale" probabilmente avrei fatto così. Ma ho deciso invece di creare una funzione autonoma per ottenere lo stesso risultato. Per farlo ho seguito i suggerimenti di una pagina di esercizi di [w3resource](https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php):

```js
function create_UUID() {
  let dt = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
```

In pratica ho generato una sequenza di numeri casuali a partire da una data. Ho usato una stringa di caratteri come template per assicurare un formato univoco. In questo modo posso facilmente generare un codice univoco senza bisogno di dipendenze esterne.

### Scegliere n elementi casuali da un array

Il secondo problema riguarda la scelta di una quantità non nota a priori di elementi da un array. Ci sono vari modi per affrontare questa situazione, molti prevedono l'utilizzo di una qualche forma di `ciclo for`. Ultimamente però sono un po' allergico a questi metodi: mi sto convincendo sempre di più di poter ridurre all'osso la complessità del mio codice evitandoli il più possibile. Ovviamente non ho avuto il tempo di verificare la mia ipotesi, magari in futuro ci tornerò sopra.

Cosa voglio fare? Beh, poiché parto da un array contente tutti gli elementi che mi servono mi basta mescolare l'ordine dei vari elementi per ottenere un nuovo array. Poi da questo array estraggo i primi n elementi e sono a posto.

```js
function createRandomArray(list, count = 3) {
  const randomList = list.sort(() => Math.random() - 0.5);
  return randomList.slice(0, count);
}
```

La cosa più complicata è stato capire come rimescolare un array. Per fortuna in rete esistono diversi post che spiegano come fare. Una delle spiegazioni migliori è quella di [Flavio Copes](https://flaviocopes.com/how-to-shuffle-array-javascript/). Tra parentesi, consiglio di spulciare il suo blog, è pieno di trucchi e consigli interessanti.

Un'altra richiesta è di restituire un errore se vengono richieste più caramelle rispetto alla quantità disponibile. In questo caso è sufficiente un semplice condizione:

```js
if (count > list.length) {
  throw new Error("TOO_MUCH_CANDY_PER_BAG");
}
```

### Mettiamo tutto assieme

Dopo aver scritto le due funzioni è abbastanza semplice risolvere il puzzle di oggi:

```js
import { default as candyList } from "../data/candy.js";

export const generateCandyBags = (bagCount = 0, candyCount = 3) => {
  let bags = [];
  for (let i = 0; i < bagCount; i++) {
    bags.push({
      id: create_UUID(),
      candies: createRandomArray(candyList, candyCount),
    });
  }

  return bags;
};

function create_UUID() {
  let dt = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function createRandomArray(list, count = 3) {
  if (count > list.length) {
    throw new Error("TOO_MUCH_CANDY_PER_BAG");
  }
  const randomList = list.sort(() => Math.random() - 0.5);
  return randomList.slice(0, count);
}
```

Per il problema di oggi è tutto. Però prima di salutarci voglio riportare una piccola considerazione. Quando ho deciso di partecipare a questo **Dev Advent Calendar** non avevo ben chiaro cosa avrebbe comportato in termini di tempo e di energie. I puzzle sono effettivamente abbastanza veloci. Lo è un po' meno la scrittura di questo diario di viaggio. Ma trovo molto istruttivo riportare quello che sto apprendendo. Mi rendo conto di non aver mai dedicato del tempo a questo genere di problemi, e in alcuni casi li ho sempre considerati al di là delle mie capacità. La possibilità di testare il codice in tempo reale è molto utile. In futuro dovrò cercare altri contest di questo tipo.
