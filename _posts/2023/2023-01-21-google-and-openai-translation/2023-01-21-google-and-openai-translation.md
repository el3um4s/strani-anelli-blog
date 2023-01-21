---
title: "Google Translate and OpenAI GPT-3: A Side-by-Side Comparison of Translation Performance"
subtitle: ""
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2023-01-21 12:00"
categories:
  - js
  - ts
  - javascript
  - typescript
tags:
  - js
  - ts
  - javascript
  - typescript
---

In my experiments with Artificial Intelligence I found myself experimenting with Google Translate and OpenAI GPT-3. I was interested in understanding the differences between the two approaches, thinking about which one better addresses the problem of translation and understanding if it was possible to use the two in a combined way to obtain a better result. And, as an additional option, to understand if it made sense to think about an app that used the APIs of both services.

Having said that, I started doing some tests. I used the online version of Google Translate and OpenAI ChatGPT chat. I start with a simple translation, from Italian to English and vice versa. I indicate with _Original_ the original sentence, with _Google_ the Google translation and with _OpenAI_ the OpenAI translation.

### Simple Sentences

{% include picture img="image-01.webp" ext="jpg" alt="ChatGPT, Google, a Kawai cute little cartoon robot character, 9:5, beautiful light, soft colour scheme" %}

**Italiano -> Inglese**

| Original        | Google             | OpenAI             |
| --------------- | ------------------ | ------------------ |
| Ciao            | Hello              | Hello              |
| Come stai?      | How are you?       | How are you?       |
| Come ti chiami? | What's your name?  | What is your name? |
| Dove abiti?     | Where do you live? | Where do you live? |
| Che lavoro fai? | What do you do?    | What is your job?  |

**Inglese -> Italiano**

| Original           | Google                | OpenAI                |
| ------------------ | --------------------- | --------------------- |
| Hello              | Ciao                  | Ciao                  |
| How are you?       | Come stai?            | Come va?              |
| What's your name?  | Come ti chiami?       | Come ti chiami?       |
| Where do you live? | Dove vivi?            | Dove abiti?           |
| What is your job?  | Qual è il tuo lavoro? | Qual è il tuo lavoro? |

As you can see, the results are similar but not identical. The translation from Italian to English is similar, apart from the last question. The interesting thing is the reverse process, the translation from English to Italian. There are two answers that differ. It almost seems that the translation of OpenAi is more like informal language.

### Complex Sentences

{% include picture img="image-02.webp" ext="jpg" alt="ChatGPT, Google, a Kawai cute little cartoon robot character, 9:5, beautiful light, soft colour scheme" %}

But let's try to do some tests with more complex sentences. Let's see how the two services behave. For comparison, I take the beginning of two posts from [il Post](https://www.ilpost.it/) (an Italian online newspaper) and try to translate them.

The first talks about artificial intelligence and audio books.

**Original**

```
La scorsa settimana Apple ha presentato un catalogo di audiolibri la cui voce narrante è stata creata utilizzando un software di intelligenza artificiale: una voce sintetizzata da un computer, che legge il testo in un modo sorprendentemente realistico e simile a una persona in carne e ossa. Secondo Apple si tratta di «un prezioso accompagnamento agli audiolibri narrati da professionisti», che potrebbe ampliare il pubblico di chi ascolta romanzi e saggi.
```

**Google**

```
Last week, Apple unveiled a catalog of audiobooks whose narration was created using artificial intelligence software: a synthesized voice from a computer, which reads the text in a way that is surprisingly realistic and similar to a real person. According to Apple it is "a valuable accompaniment to professionally narrated audiobooks", which could expand the audience of those who listen to novels and essays.
```

**OpenAI**

```
Last week, Apple presented a catalog of audiobooks whose narrator voice was created using artificial intelligence software: a voice synthesized by a computer that reads the text in a surprisingly realistic and similar way to a real person. According to Apple, it is "a valuable accompaniment to audiobooks narrated by professionals", which could expand the audience of those who listen to novels and essays.
```

{% include picture img="image-03.webp" ext="jpg" alt="ChatGPT, Google, a Kawai cute little cartoon robot character, 9:5, beautiful light, soft colour scheme" %}

The second post is about Sherlock Holmes.

**Original**

```
Il primo gennaio sono entrati nel pubblico dominio gli ultimi due racconti con protagonista Sherlock Holmes, il celebre investigatore creato dallo scrittore scozzese Arthur Conan Doyle (1859-1930). La storia dei diritti d’autore su questo personaggio è particolarmente intricata: negli ultimi decenni infatti Sherlock Holmes ha ispirato film e serie di vario tipo, ma fino a pochi giorni fa i suoi eredi avevano spesso trovato il modo per guadagnarci nonostante in gran parte del mondo i diritti fossero terminati già più di vent’anni fa.
```

**Google**

```
On January 1, the last two stories starring Sherlock Holmes, the famous detective created by the Scottish writer Arthur Conan Doyle (1859-1930), entered the public domain. The history of copyrights on this character is particularly intricate: in fact, in recent decades Sherlock Holmes has inspired various types of films and series, but until a few days ago his heirs had often found a way to earn despite much of the world rights had already ended more than twenty years ago.
```

**OpenAI**

```
On January 1st, the last two stories featuring Sherlock Holmes, the famous detective created by Scottish writer Arthur Conan Doyle (1859-1930), entered the public domain. The story of the copyright on this character is particularly intricate: in recent decades, Sherlock Holmes has inspired various films and series, but until a few days ago, his heirs had often found ways to profit from it despite the fact that in much of the world, the rights had already expired over twenty years ago.
```

What can we understand from this? Well, although in both cases the translation is quite fitting to the original, the translation proposed by Google seems more accurate. But the differences are still minimal. And on a quick read they appear essentially identical.

{% include picture img="image-04.webp" ext="jpg" alt="ChatGPT, Google, a Kawai cute little cartoon robot character, 9:5, beautiful light, soft colour scheme" %}

Now let's try to do some tests with the reverse process. I start with a piece of a post by [Attila Vágó](https://medium.com/bricksnbrackets/japanese-art-and-lego-are-a-match-made-in-heaven-ca9a1574204) about Lego.

**Original**

```
Well, a match made in Billund, Denmark, but I’m sure for some of us, LEGO’s headquarters are essentially Heaven. Full disclosure, I’m no art nerd, so my assessment of art is purely from an average human’s perspective. My reviewing LEGO’s new Hokusai set is very much a LEGO review with a side of art, rather than the other way around. Hey, that rhymed! 😄
```

**Google**

```
Bene, una partita fatta a Billund, in Danimarca, ma sono sicuro che per alcuni di noi il quartier generale di LEGO è essenzialmente il paradiso. Divulgazione completa, non sono un nerd dell'arte, quindi la mia valutazione dell'arte è puramente dal punto di vista di un essere umano medio. La mia recensione del nuovo set Hokusai di LEGO è decisamente una recensione LEGO con un lato dell'arte, piuttosto che il contrario. Ehi, quello faceva rima! 😄
```

**OpenAI**

```
Beh, un match fatto a Billund, in Danimarca, ma sono sicuro che per alcuni di noi, la sede di LEGO è essenzialmente il paradiso. Aperture di credito, non sono un esperto d'arte, quindi la mia valutazione dell'arte è puramente dal punto di vista di un umano medio. La mia recensione del nuovo set Hokusai di LEGO è molto più una recensione di LEGO con un tocco d'arte, piuttosto che l'altro modo intorno. Hey, che rima! 😄
```

{% include picture img="image-06.webp" ext="jpg" alt="ChatGPT, Google, a Kawai cute little cartoon robot character, 9:5, beautiful light, soft colour scheme" %}

The second post is by [Clive Thompson](https://medium.com/@clivethompson/the-disappearance-of-the-ashtray-4badc1be9e3b) and talks about ashtrays.

**Original**

```
See that thing above?

I inherited it from my mother, who passed away in the summer of 2020. When I first handed it to one of my teenage sons, he was impressed. It’s beautiful, he said. But — what is it?

“It’s an ashtray,” I told him.

You could forgive him for not recognizing it. Rates of cigarette smoking have plummeted in the last half century; back in the 60s, over 40% of Americans smoked, but now it’s down to a mere 11%. These rates vary based on geography and educational attainment, but the overall trend-lines are a ski slope downwards. Sure there’s plenty of vaping going on. But the amount of Americans who need somewhere to flick their ash and stub out a cig are as low as they’ve been in a long, long while.
```

**Google**

```
Vedi quella cosa sopra?

L'ho ereditato da mia madre, che è morta nell'estate del 2020. Quando l'ho consegnato per la prima volta a uno dei miei figli adolescenti, è rimasto colpito. È bellissimo, disse. Ma cos'è?

"È un posacenere", gli dissi.

Potresti perdonarlo per non averlo riconosciuto. I tassi di fumo di sigaretta sono crollati nell'ultimo mezzo secolo; negli anni '60, oltre il 40% degli americani fumava, ma ora è sceso a un mero 11%. Questi tassi variano in base alla geografia e al livello di istruzione, ma le linee di tendenza generali sono una pista da sci verso il basso. Sicuramente c'è un sacco di svapo in corso. Ma il numero di americani che hanno bisogno di un posto dove gettare la cenere e spegnere una sigaretta è basso come lo è stato da molto, molto tempo.
```

**OpenAI**

```
Vedi quella cosa sopra?

L'ho ereditato dalla mia madre, che è morta nell'estate del 2020. Quando gliel'ho dato per la prima volta a uno dei miei figli adolescenti, lui era impressionato. È bello, ha detto. Ma - cos'è?

"È un portacenere", gli ho detto.

Puoi perdonarlo se non lo riconosceva. I tassi di fumo di sigarette sono scesi drasticamente negli ultimi cinquant'anni; negli anni '60, oltre il 40% degli americani fumava, ma adesso è sceso a solo l'11%. Questi tassi variano in base alla geografia e all'istruzione, ma le tendenze generali sono in calo. Certo, c'è un sacco di svapo in giro. Ma la quantità di americani che hanno bisogno di un posto dove buttare la cenere e spegnere una sigaretta è bassa come non lo è stata da molto, molto tempo.
```

In this case the two translations from English to Italian oscillate between the bad and the "you don't understand anything". The original pieces are well written, with personal style and sentence construction that captivates the reader. All of this is lost in translation from English to Italian. Maybe the Google version is slightly better, but it's not really a good translation.

### Conclusions

{% include picture img="image-07.webp" ext="jpg" alt="ChatGPT, Google, a Kawai cute little cartoon robot character, 9:5, beautiful light, soft colour scheme" %}

So how do I conclude? With two considerations:

1. translation into English is quite similar between Google and OpenAI; I personally prefer Google's version, but there isn't a huge difference;
2. the translation from English to Italian is much worse, and I don't like either version.

For the moment I'll stop here; I honestly don't think I will try to integrate either OpenAI or Google Translate in a test app to translate from English to Italian.
