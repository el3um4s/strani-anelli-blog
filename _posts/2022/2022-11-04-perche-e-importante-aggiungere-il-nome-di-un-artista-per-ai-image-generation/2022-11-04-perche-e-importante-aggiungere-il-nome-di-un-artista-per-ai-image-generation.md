---
title: "Perché Aggiungere il Nome di un Artista al Prompt per Creare Immagini con l'IA"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-11-04 23:00"
categories:
  - machine-learning
  - stable-diffusion
  - image auto generated
tags:
  - machine-learning
  - stable-diffusion
  - image auto generated
---

Da afantasico trovo molto interessante la generazione di immagini usando l'Intelligenza Artificiale. Non ho molte aspettative sui risultati che è possibile ottenere. In fin dei conti la mia interpretazione del mondo fa a meno delle immagini, quindi non mi aspetto un particolare risultato da un prompt testuale specifico. D'altro canto è interessante vedere come l'IA riesca comunque a tradurre in immagini il testo che gli viene dato.

Provando e riprovando, leggendo e rileggendo, è facile vedere dei pattern di funzionamento in questi sistemi di generazione di immagini. Uno di questi è legato all'utilizzo del nome di un artista in particolare per imprimere uno stile specifico al risultato. Si tratta di uno strumento potente, che permette di ottenere risultati molto interessanti. Ma che va usato con un una certa cautela.

Se ci pensi è abbastanza logico. Il dataset usato per addestrare questi programmi è composto da immagini, e spesso sono immagini di artisti famosi. Fa parte del processo di addestramento che l'IA impari a riconoscere le caratteristiche di uno stile. Di converso, usare il nome di un artista non famoso, potrebbe portare a risultati molto diversi da quelli che ci si aspetta. E spesso a qualcosa di bizzarro, non sempre in senso buono.

Ma proviamo subito con un esempio. Questa volta voglio provare a riprodurre un ritratto di Sherlock Holmes, ma basandomi sulla [descrizione di Conan Doyle](https://www.arthur-conan-doyle.com/index.php/Sherlock_Holmes#Physical_appearance). In questo modo, l'IA non ha modo di riconoscere il nome di Holmes, e quindi non può usare il suo stile per generare l'immagine. Il risultato è abbastanza interessante, anche se non è proprio quello che mi aspettavo.

```
Portrait of a man. He had a tall, gaunt figure made even gaunter and taller by his long grey travelling-cloak and close-fitting cloth cap. He had a dolichocephalic skull with well-marked supra-orbital development. His hair were black.
```

{% include picture img="sherlock-00.webp" ext="jpg" alt="" %}

Nonostante il risultato spiazzante, c'è qualcosa di interessante in queste immagini. Ma adesso è il momento di sperimentare con lo stesso prompt, ma aggiungendo il nome di un artista. Comincio con uno dei più iconici, [Vincent Van Gogh](https://en.wikipedia.org/wiki/Vincent_van_Gogh)

```
Portrait of a man. He had a tall, gaunt figure made even gaunter and taller by his long grey travelling-cloak and close-fitting cloth cap. He had a dolichocephalic skull with well-marked supra-orbital development. His hair were black. By Vincent Van Gogh
```

{% include picture img="sherlock-01.webp" ext="jpg" alt="" %}

Beh, questo Sherlock Holmes è molto diverso da quello precedente. Si vede chiaramente come il solo nome dell'artista è in grado di cambiare completamente il tono del risultato.

Proviamo con un altro artista, [Pablo Picasso](https://en.wikipedia.org/wiki/Pablo_Picasso)

{% include picture img="sherlock-02.webp" ext="jpg" alt="" %}

Anche in questo caso, lo stile è indiscutibilmente quello di Picasso. Ma. Ma è il Picasso più famoso, quello del periodo cubista. Aggiungendo altri termini, come per esempio `Blue Period` o `Rose Period`, non modifica in maniera sostanziale il risultato. L'IA non è in grado di capire che Picasso ha avuto più stili diversi, e quindi non riesce a generare immagini che siano in linea con il periodo specificato. Per lo meno, non ancora.

{% include picture img="sherlock-03.webp" ext="jpg" alt="" %}

Questo caso mette bene in evidenza il limite di questo tipo di AI. E nel contempo il perché usare bene i prompt è importante.

Proviamo con un altro artista, [Claude Monet](https://en.wikipedia.org/wiki/Claude_Monet)

{% include picture img="sherlock-04.webp" ext="jpg" alt="" %}

Fino a questo momento abbiamo generato immagini quadrate. Ma alcuni artisti rendono meglio con immagini più alte. Proviamo con [Alphonse Mucha](https://en.wikipedia.org/wiki/Alphonse_Mucha), e vediamo cosa succede.

{% include picture img="sherlock-05.webp" ext="jpg" alt="" %}

Mi pare che il risultato sia interessante e che richiami abbastanza lo stile dell'artista. Anche con [Osamu Tezuka](https://en.wikipedia.org/wiki/Osamu_Tezuka) si ottiene qualche buon risultato.

{% include picture img="sherlock-06.webp" ext="jpg" alt="" %}

Tim Burton, invece, si presta bene anche con immagini un po' più lunghe

{% include picture img="sherlock-07.webp" ext="jpg" alt="" %}

Ma cosa succede se proviamo a usare un artista importante ma non così famoso? Provo con [Hugo Pratt](https://en.wikipedia.org/wiki/Hugo_Pratt)

{% include picture img="sherlock-08.webp" ext="jpg" alt="" %}

In questo caso il risultato non è per niente soddisfacente.

Quindi, per concludere: aggiungere il nome di un artista al prompt di testo per generare immagini con l'AI è un'ottima idea. Ma l'IA non è in grado di riconoscere tutti gli artisti. E, sopratutto, non riesce ancora a differenziare tra i vari stili che un'artista attraversa nel corso della propria vita artistica.
