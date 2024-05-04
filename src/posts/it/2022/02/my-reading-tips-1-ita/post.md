---
title: "Consigli di Lettura #1"
published: true
date: 2022-02-04 10:00
categories:
  - Nessuna Categoria
tags:
  - my-reading-tips
  - collection-of-notable-things
lang: it
cover: image.webp
description: "Uno dei miei hobby preferiti è leggere. Leggo molto, libri e non solo. Però non prendo appunti su quello che leggo: questo è un mio limite, a cui devo prima o poi porre rimedio. Per il momento voglio cominciare a tenere una traccia delle cose interessanti che leggo, settimana per settimana. Comincio oggi, con una collezione di 5 articoli che ho letto recentemente e che voglio ritrovare."
column: Collection of Notable Things
---

Uno dei miei hobby preferiti è leggere. Leggo molto, libri e non solo. Però non prendo appunti su quello che leggo: questo è un mio limite, a cui devo prima o poi porre rimedio. Per il momento voglio cominciare a tenere una traccia delle cose interessanti che leggo, settimana per settimana. Comincio oggi, con una collezione di 5 articoli che ho letto recentemente e che voglio ritrovare.

### You can build a neural network in JavaScript even if you don’t really understand neural networks

[link](https://itnext.io/you-can-build-a-neural-network-in-javascript-even-if-you-dont-really-understand-neural-networks-e63e12713a3)

Una guida ben fatta di come creare una rudimentale intelligenza artificiale usando JavaScript. Non si dilunga nella parte teorica ma realizza un esempio pratico usando [BrainJS](https://brain.js.org/), una libreria per browser e NodeJS.

È un post di qualche anno fa (2018... come passa velocemente il tempo) e c'è qualche problema con la formattazione. Consiglio quindi di leggerlo affiancando il codice sorgente del progetto. Lo si può trovare su GitHub: [lordpoint/neural-network-author-classifier](https://github.com/lordpoint/neural-network-author-classifier). Per usarlo in locale occorre avere Python 2.7. Consiglio però, se possibile, di usare il link CDN:

```ts
<script src="//unpkg.com/brain.js"></script>
```

Un esempio carino di quello che è possibile ottenere tramite questa libreria è il sito [Rock Paper Scissors - With Artificial Intellegence](https://rockpaperscissors-ai.vercel.app/). Possiamo giocare contro un'intelligenza artificiale che impara a riconoscere il nostro stile di gioco e a prevedere le nostre mosse. Un consiglio: l'unico modo per vincere è giocare completamente a caso.

### How to Build A Plugin System with Node.js

[link](https://javascript.plainenglish.io/how-to-build-a-plugin-system-with-node-js-68c097eb3a2e)

Ammetto di non avere ancora messo in pratica quanto scritto in questa guida di Novembre 2021, ma conto di farlo prima o poi. In questo post viene spiegato come creare un sistema di plugin da usare assieme a Node.js. La cosa mi intriga, e non poco. Uno dei problemi che mi ritroverò ad affrontare con il progetto [gest-dashboard](https://javascript.plainenglish.io/the-journey-of-a-programmer-january-2022-65b46994dfa1) sarà molto simile. Sapere che si può fare, e avere una vaga idea dei vari passaggi mi sarà molto utile.

### Here’s Bill Gates’s Advice to New Programmers. It Should Not be Ignored.

[link](https://javascript.plainenglish.io/heres-bill-gates-s-advice-to-new-programmers-it-should-not-be-ignored-33e31378f0ae)

[Somnath Singh](https://polymathsomnath.medium.com/) scrive spesso dei pezzi molto interessanti. Nella mia lista dei articoli da consigliare ce ne sono molti suoi. Quindi, oltre a questo articolo consiglio di sfogliare anche i suoi altri post e di leggerne alcuni. Ne vale la pena.

In ogni caso questo pezzo è molto interessante perché raccoglie alcuni consigli di Bill Gates, spiegandoli e aiutando a comprenderli meglio:

1. Don’t overthink, just dive in: `The best way to prepare [to be a programmer] is to write programs, and to study great programs that other people have written.`
2. Know your tools well — Really well: `If you ever talk to a great programmer, you’ll find he knows his tools like an artist knows his paintbrushes.`
3. Get good at reading the code: `I still think that one of the finest tests of programming ability is to hand the programmer about 30 pages of code and see how quickly he can read through and understand it.`
4. Learn to make things as simple as possible: `The hardest part is deciding what the algorithms are, and then simplifying them as much as you can.`
5. Learn to work in the group: `So the idea of spending a lot of time on structuring groups has always been very important.`
6. Visualize first then create it: `It’s what’s going on in their heads that’s most important.`
7. Know the joy of creating something: `It’s fun and quite rewarding.`

Somnath aggiunge un consiglio, che condivido: "**Embrace the new technology**".

### Avoiding Premature Software Abstractions

[link](https://betterprogramming.pub/avoiding-premature-software-abstractions-8ba2e990930a)

Un pezzo tecnico che affronta una questione complicata. Almeno per me, per quello che è il mio livello di conoscenza e di esperienza. È una lettura interessante e istruttiva. L'autore, [Jonas Tulstrup](https://jonastulstrup.medium.com/), presenta quattro esempi:

1. Responsibilities are abstracted too granularly
2. Design patterns are used without real benefit
3. Performance is optimized prematurely
4. Low coupling is introduced everywhere

Oltre questo post, consiglio anche l'altro scritto dallo stesso autore:

- [Why We Quit Unit Testing Classes to Focus On a Behavioral Approach](https://betterprogramming.pub/quit-unit-testing-classes-and-use-a-behavior-oriented-approach-306a667f9a31)

In questo pezzo spiega quelli che sono, a suo avviso, i problemi di test di unità basati sulle classi:

1. Class tests make changes painful
2. Class tests don’t validate actual behavior
3. Class tests are hard to understand

Al posto di questa metodologia propone: `instead of unit testing classes, we are treating our entire system, a microservice for example, as the unit or system under test.` Vale la pena di dedicare un po' di tempo a leggere questa idea.

### Here’s Why You Should be Bullet Journaling

[link](https://medium.com/swlh/heres-why-you-should-be-bullet-journaling-253537e60440)

L'ultimo articolo che consiglio non è strettamente legato al mondo della programmazione. Si tratta di un pezzo di [Jillian Fegan](https://medium.com/@jillianfegan) riguardo al suo utilizzo del Bullet Journal. Ci sono molti articoli di questo genere su Medium ma questo mi è piaciuto in particolar modo.

Cos'è il Bullet Journal? È una agenda costruita in base alle proprie esigenze e con la quale organizzare e tracciare tutto quello che serve, dalla vita privata al lavoro. La mia è orribile, esteticamente parlando, ma è una tecnica funzionale e che consiglio di provare.

Bene, per oggi va bene così. C'è abbastanza da leggere, credo. Conto di scrivere ancora dei pezzi di questo genere, magari con una cadenza regolare.
