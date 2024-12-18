---
title: Typo Battle
published: true
date: 2021-01-21
categories:
  - Construct 3
  - JavaScript
tags:
  - Construct
  - JavaScript
  - new-template-typo-battle
  - construct-3-unit-test-e-jsunit
lang: it
cover: cover.webp
description: Il mio progetto per il 2021 è di pubblicare ogni 15 giorni un nuovo template per Construct 3. Vuol dire il 15 (attorno al) e il 30 (attorno al) di ogni mese. Con template intendo un gioco, più o meno completo. Ovviamente sono già in ritardo.
---
Il mio progetto per il 2021 è di pubblicare ogni 15 giorni un nuovo template per Construct 3. Vuol dire il 15 (attorno al) e il 30 (attorno al) di ogni mese. Con template intendo un gioco, più o meno completo. Ovviamente sono già in ritardo :).

Il primo prototipo dell'anno (escludendo l'esperimento con gli [unit test](https://blog.stranianelli.com/construct-3-unit-test-e-jsunit/)) si chiama **Typo Battle**. Dall'alto cadono delle lettere, bisogna digitare sulla tastiera la lettera corrispondente per farla esplodere e raccogliere punti.

![typo battle animation](./typo-battle.gif)

Il giochino in sé non è molto divertente, la difficoltà è settata su un livello molto alto, forse troppo. Però dal lato didattico - ovvero, quello che _io_ ho imparato - ci sono alcuni aspetti interessanti. Comincio dal codice:

![Immagine](./code-typo-battle.webp)

Il foglio principale conta meno di 20 eventi. Poi però ci sono alcuni fogli aggiuntivi in cui ho implementato le funzioni necessarie. Ho cercato di tenere il codice il più pulito possibile, credo di esserci tutto sommato riuscito. Ci sono però alcune funzioni non usate, che non mi sono ancora deciso a eliminare.

Durante lo sviluppo di questo prototipo ho notato alcune cose riguardo il mio metodo di lavoro. Innanzitutto non mi segno le idee, tendo a tenerle a mente. E a dimenticarle. O a scartarle a priori. Per correggere questo mio problema ho deciso di creare un repository (privato) da usare come quadernaccio per gli appunti.

Un altro problema è legato alla sottovalutazione dei test. Nonostante me lo sia ripromesso, non ho testato ogni modifica fatta. Di conseguenza mi sono ritrovato con una versione funzionante ma brutta, e una elegante ma che non funzionava. Senza sapere come mai.

Infine, non sto praticamente usando i social per far vedere il mio lavoro: da un lato non ho voglia di curare questo aspetto, dall'altro so che è importante.

Basta, è il momento dei link:

- [il progetto su github](https://github.com/el3um4s/construct-demo)
- [la demo giocabile](https://c3demo.stranianelli.com/template/015-typo-battle/demo/)
- [Patreon](https://www.patreon.com/el3um4s)
