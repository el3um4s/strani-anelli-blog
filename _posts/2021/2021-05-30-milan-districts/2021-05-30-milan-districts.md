---
title: "Milan Districts"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-05-30 18:00"
categories:
  - Construct 3
  - JavaScript
tags:
  - Construct 3
  - JavaScript
---

Se la settimana scorsa ero contento per i miei esperimenti con [Svelte](https://svelte.dev/), questa non è così. Ho fatto diversi tentativi ma nulla di davvero concreto. Mi sto scontrando con alcuni limiti miei, e con alcuni limiti di Construct 3. Per questo dopo alcuni giorni ho deciso di completare una vecchia idea: un'app per mostrare l'andamento demografico dei quartieri di Milano. 

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-05-30-milan-districts/animation.gif)

Il funzionamento è abbastanza semplice. Sulla sinistra c'è una lista da cui scegliere il quartiere, sulla destra un grafico che si aggiorna in maniera dinamica. Il menù in alto serve per cambiare l'anno di analisi.

Ci sono due cose interessanti in questo template. La prima, è come creare una scrollable list con Construct 3. La seconda è come disegnare dei grafici a barre (ovvero istogrammi) in C3. Comincio con la lista scorrevole.

![scrollable list in construct 3](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-05-30-milan-districts/animation-02.gif)

L'idea mi è venuta guardando un video di [Bart Alluyn](https://www.youtube.com/watch?v=K5lu4GTFm3o) ed è concettualmente molto semplice: si crea un elemento draggable in un'unica direzione. Poi si mettono due sprite sopra in modo da nascondere l'elemento. E poi ci si aggiunge un controllo per impedire alla lista di andare troppo in alto o troppo in basso. Forse è più facile da spiegare con un disegno:

{% include picture img="scrollable-list-structure.webp" ext="jpg" alt="" %}

I due limiti, quello superiore e inferiore, servono per capire quando bloccare lo scrolling dell'elemento ed è l'unica parte dove serve usare un event sheet:

{% include picture img="scrollable-list-events.webp" ext="jpg" alt="" %}

Non è necessario usare una funzione `lerp` ma penso sia consigliabile. Permette di aggiungere un pizzico di eleganza al movimento della lista:

![scrollable list in construct 3](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-05-30-milan-districts/animation-03.gif)

Ho trovato altrettanto interessante creare la parte relativa agli istogrammi. Sopratutto perché ho preso ispirazione da un repository legato a Svelte: [Pancake](https://github.com/Rich-Harris/pancake). L'idea alla base è di usare dei `div` per disegnare i grafici sfruttando le caratteristiche di CSS. In questo modo si può evitare di disegnare direttamente su una Canvas e si risolvono alcuni problemi legati alla formattazione. Rich Harris lo spiega bene in un articolo molto interessante, [A new technique for making responsive, JavaScript-free charts](https://dev.to/richharris/a-new-technique-for-making-responsive-javascript-free-charts-gmp).

Ovviamente questa tecnica non funziona nativamente con Construct 3, anche se meriterebbe di essere investigata un po' più a fondo. Ma partendo da quella lettura ho deciso di utilizzare il plugin Tiled Background come base per creare le colonne del grafico.

Il codice base è molto semplice:

```
HistogramBar: set width to NewWidth
```

Poi ho esteso questo concetto con alcuni eventi aggiuntivi che permettono di cambiare la dimensione delle barre in base al rapporto tra le famiglie dei quartieri selezionati e quelle della città:

{% include picture img="histogram-events.webp" ext="jpg" alt="" %}

Per oggi ho finito. Nel file sorgente che ho caricato su GitHub ci sono alcune funzioni JS per semplificare l'acquisizione dei dati e l'ordinamento della lista. Ma sono marginali rispetto a questo articolo.

- [il progetto su GitHub](https://github.com/el3um4s/construct-demo)
- [la demo online](https://c3demo.stranianelli.com/javascript/011-milan-districts/demo/)
- [Patreon](https://www.patreon.com/el3um4s)