---
title: Come scrivere dei buoni prompt per creare immagini con intelligenze artificiali
published: true
date: 2022-10-30 19:00
categories:
  - AI Prompts
tags:
  - AI
  - Prompts
  - MachineLearning
lang: it
cover: image.webp
description: Sì, è il mio quarto articolo di fila dedicato alle intelligenze artificiali, e in particolar modo a quelle specializzate nel generare immagini a partire da un prompt di testo. Nonostante la mia scarsa conoscenza dell'argomento, sto scoprendo che è molto facile ottenere dei risultati interessanti. La difficoltà maggiore sta nel capire come scrivere dei buoni prompt. In questo articolo cercherò di spiegare come fare.
column: AI Experiments
---

Sì, è il mio quarto articolo di fila dedicato alle intelligenze artificiali, e in particolar modo a quelle specializzate nel generare immagini a partire da un prompt di testo. Nonostante la mia scarsa conoscenza dell'argomento, sto scoprendo che è molto facile ottenere dei risultati interessanti. La difficoltà maggiore sta nel capire come scrivere dei buoni prompt. In questo articolo cercherò di spiegare come fare.

E lo farò partendo dall'ottimo post di [Andrew Wong](https://medium.com/@andrewwongai), [How to come up with good prompts for AI image generation](https://medium.com/@andrewwongai/how-to-come-up-with-good-prompts-for-ai-image-generation-f28355e46d21). Oltre a questo, consiglio di consultare anche:

- [Stable Diffusion Akashic Records](https://github.com/Maks-s/sd-akashic)
- [Create detailed prompts for AI art instantly](https://promptomania.com/prompt-builder/)
- [Like Grammarly, but for AI Generated Art](https://write-ai-art-prompts.com/)

Andrew suggerisce di utilizzare il seguente schema per scrivere un prompt:

1. Subject
2. Medium
3. Style
4. Artist
5. Website
6. Resolution
7. Additional details
8. Color

Meglio aggiungere più informazioni possibile, in modo da dare più informazioni all'intelligenza artificiale. Per esempio, se vogliamo creare un'immagine di un gatto, potremmo scrivere semplicemente `cat`:

![Immagine](./cat-01.webp)

Il risultato è decisamente brutto. Per renderlo più interessante possiamo aggiungere alcuni dettagli, magari `Cat in Boots`:

![Immagine](./cat-02.webp)

Decisamente non ci siamo. Aggiungo altri dettagli per rendere un po' più chiara la mia idea:

```
a big fiery cat, powerful and menacing, wearing cowboy boots, hat, holding an old gun
```

Tra i primi risultati salta fuori questo gatto:

![Immagine](./cat-03.webp)

Però è solo un caso, le altre immagini non sono tutte come questa:

![Immagine](./cat-04.webp)

È il momento di aggiungere qualche informazione. Per esempio il `medium` verso cui vogliamo puntare, ad esempio `digital paint`:

![Immagine](./medium.webp)

![Immagine](./cat-05.webp)

Le cose iniziano a farsi interessanti. Aggiungo altre informazioni. Voglio un disegno, `white and black`. Poi imposto la risoluzione a `4k`.

![Immagine](./cat-06.webp)

Aggiungere un artista richiede un po' più di perizia, per lo meno per me. Se aggiungo lo stile di un autore che non ha trattato il tema del mio disegno, l'immagine che ottengo non è molto interessante, oppure diventa qualcosa di completamente diverso. Per esempio, se provo a usare lo stile di [Franklin Booth](https://en.wikipedia.org/wiki/Franklin_Booth) il gatto sparisce dalla composizione

![Immagine](./cat-07.webp)

Penso che per sperimentare più a fondo, serve un po' di conoscenza dell'arte. Per l'arte del far west posso ispirarmi a [Charles Marion Russell e Frederic Remington](https://en.wikipedia.org/wiki/Western_American_Art):

![Immagine](./cat-08.webp)

Se invece mi ispiro a Tim Burton, usando come prompt:

```
Sketch, Black and White, 4k, a big fiery cat, powerful and menacing, wearing cowboy hat, holding an old gun, by tim burton
```

![Immagine](./cat-09.webp)

Per finire, se uso `Picasso` ottengo un risultato molto interessante:

![Immagine](./cat-10.webp)

Bene, per il momento è tutto. Penso che mi manchi ancora un po' di pratica per scrivere dei prompt migliori.
