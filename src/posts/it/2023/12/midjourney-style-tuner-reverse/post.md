---
title: Guida Pratica al Reverse Engineering degli Stili di Midjourney
published: true
date: 2023-12-15 20:30
categories:
  - AI Prompts
  - AI
  - Machine Learning
  - Midjourney
tags:
  - AI
  - Prompts
  - MachineLearning
  - Midjourney
column: AI Experiments
cover: image.webp
lang: it
description: Una delle funzioni più interessanti di Midjourney è la possibilità di creare stili personalizzati. La funzione tune interpreta il prompt e permette di affinare e personalizzare lo stile delle immagini generate dall'Intelligenza Artificiale. In questo modo è possibile mantenere una coerenza stilistica attraverso le diverse iterazioni. Ma come ogni strumento richiede una certa pratica per maneggiarlo bene. Un buon modo è studiare i diversi stili già disponibili e tentare di capire come replicarli.
---

Una delle funzioni più interessanti di Midjourney è la possibilità di creare stili personalizzati. La funzione `/tune` interpreta il prompt e permette di affinare e personalizzare lo stile delle immagini generate dall'Intelligenza Artificiale. In questo modo è possibile mantenere una coerenza stilistica attraverso le diverse iterazioni. Ma come ogni strumento richiede una certa pratica per maneggiarlo bene. Un buon modo è studiare i diversi stili già disponibili e tentare di capire come replicarli.

Ma qual è il problema? Beh, che gli stili vengono condivisi in questo modo:

```text
Description: Flat abstract illustration.
Prompt Template:  [3-5 words single focus subject], abstract --style v6k9dkS9FT4SPJwK0jc2sn7vURzlhorZqDL5jlft
[contributed by @Mardiray]
```

Mardiray ha creato diversi stili interessanti, e questo in particolar modo: permette di creare illustrazioni astratte, molto adatte per illustrare post.

![Immagine](./flat-gallery.webp)

Ho provato a replicare lo stesso stile usando comandi simili a questi:

```text
/tune prompt: illustration abstract flat
/tune prompt: flat abstract
/tune prompt: solid color flat abstract
```

Il problema è che ottengo solamente immagini astratte, e in generale meno belle. Dopo un po' di tentativi andati a vuoto ho cominciato a chiedermi come capire quale fosse il comando originale utilizzato da Mardiray per generare lo stile.

Ci sono due metodi per fare questa specie di "reverse engineering". Il primo, il più semplice, è usare questo link: [Style Decoder for Midjourney (V1) — Revision 6](https://cdn.kaetemi.be/dl/mj/style_dec_r6.html):

![Immagine](./style-decoder-for-midjourney-01.webp)

Dopo aver incollato il codice dello stile (in questo caso `v6k9dkS9FT4SPJwK0jc2sn7vURzlhorZqDL5jlft`) nella casella di testo, clicco su `Convert`:

![Immagine](./style-decoder-for-midjourney-02.webp)
Ottengo una serie di informazioni utili, ma quelle che adesso mi interessano sono le prime righe, con due link:

- Style Tuner: [v6k9dkS9FT4SPJwK0jc2sn7vURzlhorZqDL5jlft](https://tuner.midjourney.com/code/v6k9dkS9FT4SPJwK0jc2sn7vURzlhorZqDL5jlft)
- Alternate Tuner: [v6k9dkS9FT4SPJwK0jc2sn7vURzlhorZqCauQHGT](https://tuner.midjourney.com/code/v6k9dkS9FT4SPJwK0jc2sn7vURzlhorZqCauQHGT)

Cliccando sul primo link ottengo il prompt originale, `House by canal`

![Immagine](./style-decoder-for-midjourney-03.webp)

Subito sotto ci sono le immagini generate, con evidenziate quelle selezionate e che permettono a Midjourney di creare lo stile personalizzato.

![Immagine](./style-decoder-for-midjourney-04.webp)

A fondo pagina trovo un prompt di esempio con lo stile creato

![Immagine](./style-decoder-for-midjourney-05.webp)

```text
/imagine prompt: House by canal --style v6k9dkS9FT4SPJwK0jc2sn7vURzlhorZqDL5jlft
```

Il secondo metodo è altrettanto semplice ma non funziona se lo stile è stato originato dal comando `--style random`.

Per ottenere il prompt di origine dello stile è sufficiente sostituire `<code>` con lo stile a questo indirizzo:

```text
https://tuner.midjourney.com/code/<code>
```

Usando sempre lo stesso stile come esempio, ottengo: [https://tuner.midjourney.com/code/v6k9dkS9FT4SPJwK0jc2sn7vURzlhorZqDL5jlft](https://tuner.midjourney.com/code/v6k9dkS9FT4SPJwK0jc2sn7vURzlhorZqDL5jlft). Dopo aver cliccato sull'indirizzo, ottengo un nuovo indirizzo nel formato:

```text
https://tuner.midjourney.com/<tuner>?answer=<code>
```

Nel mio caso, [https://tuner.midjourney.com/kMU8tgR?answer=v6k9dkS9FT4SPJwK0jc2sn7vURzlhorZqDL5jlft](https://tuner.midjourney.com/kMU8tgR?answer=v6k9dkS9FT4SPJwK0jc2sn7vURzlhorZqDL5jlft)

Oltre alla possibilità di studiare i prompt originali, e quindi migliorare le proprie capacità artistiche, poter accedere al'URL del tuner originale permette di sperimentare senza dover usare `Fast Time`.

Per esempio, posso modificare lo stesso stile per ottenere un effetto decisamente più dark:

```
Description: Realistic dark illustration.
Prompt Template:  [3-5 words single focus subject], dark --style 14yasUfsTj8AuhAwbpNP599Sykn4Rde4B36j
```

Se ricreo le stesse immagini del primo esempio usando questo nuovo stile e confronto il risultato, ottengo questo

![Immagine](./flat-dark-gallery.webp)
