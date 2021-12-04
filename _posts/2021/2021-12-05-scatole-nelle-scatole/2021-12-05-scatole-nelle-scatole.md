---
title: "Scatole inscatolate"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Jackie Zhao**](https://unsplash.com/@jiaweizhao)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-05 15:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Gli elfi alla fine hanno fatto centro e gli affari della caffetteria continuano a crescere. Peccato che abbiano fatto un po' di confusione con le scatole. O, meglio, fanno fatica a capire come inscatolare tutte le spedizioni senza sprecare cartone. Le poste elfiche mettono a disposizione diversi formati tra cui scegliere. Il puzzle del [Dev Advent](https://github.com/devadvent/readme) di oggi riguarda proprio questo problema.

### Il problema: Optimizing shipping 📦

{% include picture img="cover.webp" ext="jpg" alt="" %}

Il problema di oggi riguarda la geometria: si tratta di capire se una scatola puà entrare in un'altra. Non basta misurare la lunghezza dei singoli angoli, una scatola può anche essere ruotata per farcela stare.

La soluzione è piuttosto banale e non richiede grandi spiegazioni:

<script src="https://gist.github.com/el3um4s/fbcd29143f3b25b2e0250ae99a69a43c.js"></script>

Ho cercato una formula generica per ottenere questo risultato in maniera più elegante ma non ho trovato nulla di meglio. E con sole 3 dimensioni è abbastanza semplice cavarsela con una formula manuale.

C'è però una cosa interessante. Ho rinominato le variabili durante l'operazione di object destructuring. Basta aggiungere il nome della nuova variabile dopo il nome di quella originale:

<script src="https://gist.github.com/el3um4s/682560a340ab2687e9dcb753c33652f6.js"></script>

L'esempio qui sopra non è mio, è di [Paul Vaneveld](https://medium.com/@paul.vaneveld). L'ho trovato in articolo interessante pubblicato su Medium: [7 Little-Known Techniques to Improve Your JavaScript]([7 Little-Known Techniques to Improve Your JavaScript](https://javascript.plainenglish.io/7-little-known-techniques-to-improve-your-javascript-20a9e870a5fe)).

Bene, per oggi direi che è tutto.
