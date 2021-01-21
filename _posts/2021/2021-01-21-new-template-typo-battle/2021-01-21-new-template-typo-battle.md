---
title: "New Template: Typo Battle"
published: ture
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "typo-battle"
  immagine_estesa: "typo-battle"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-01-21 20:00"
categories:
  - Construct 3
  - Template
tags:
  - Construct 3
  - JavaScript
  - Template
---

Allora, la mia idea per quest'anno è di pubblicare un nuovo template ogni due settimane, circa. Vuol dire il 15 (attorno al) e il 30 (attorno al) di ogni mese. Con template intendo un gioco, più o meno completo. Ovviamente sono già in ritardo :).

Il primo prototipo dell'anno (escludendo l'esperimento con gli [unit test](https://blog.stranianelli.com/construct-3-unit-test-e-jsunit/)) si chiama **Typo Battle**. Dall'alto cadono delle lettere, bisogna digitare sulla tastiera la lettera corrispondente per farla esplodere e raccogliere punti.

![follow the player](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-01-21-new-template-typo-battle/typo-battle.gif)

Il giochino in sé non è molto divertente, la difficoltà è settata su un livello molto alto, forse troppo. Però dal lato didattico - ovvero, quello che _io_ ho imparato - ci sono alcuni aspetti interessanti. Comincio dal codice:

{% include picture img="typo-battle.webp" ext="jpg" alt="" %}

Il fogli principale conta meno di 20 eventi. Poi però ci sono alcuni fogli aggiuntivi in cui ho implementato le funzioni necessarie. Ho certao di tenere il codice il più pulito possibile, credo di esserci tutto sommato riuscito.

Ci sono ancora alcuni punti piuttosto aggrovigliati, in particolar modo la gestione dei colori e dei file json: non li ho risolti ancora, anche perché non sono utilizzati in questo template.

Durante lo sviluppo di questo prototipo ho notato alcune cose riguardo il mio metodo di lavoro. Innanzitutto non mi segno le idee, tendo a tenerle a mente. E a dimenticarle. O a scartarle a priori. Per correggere questo mio problema ho deciso di creare un repository (privato) da usare come quadernaccio per gli appunti.

Un altro problema è legato alla sottovalutazione dei test. Nonostante me lo sia ripromesso, non ho testato ogni modifica fatta. Di conseguenza mi sono ritrovato con una versione funzionante ma brutta, e una elegante ma che non funzionava. Senza sapere come mai.

Infine, non sto praticamente usando i social per far vedere il mio lavoro: da un lato non ho voglia di curare questo aspetto, dall'altro so che è importante.

Basta, è il momento dei link:

- [il progetto su github](https://github.com/el3um4s/construct-demo)
- [la demo giocabile](https://c3demo.stranianelli.com/template/015-typo-battle/demo/)
