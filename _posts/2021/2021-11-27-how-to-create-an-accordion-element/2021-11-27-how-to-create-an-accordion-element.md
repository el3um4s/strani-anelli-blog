---
title: "Come creare un elemento Accordion con Svelte e TailwindCSS"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Yan Krukov**](https://www.pexels.com/@yankrukov)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-11-27 20:00"
categories:
  - Svelte
  - SvelteKit
  - Components
  - Documentation
tags:
  - Svelte
  - SvelteKit
  - Components
  - Documentation
---

Prima o poi dovrò trovare il tempo per riportare le mie impressioni sul metodo Agile e su quello che sto imparando in questi mesi. So però una cosa: la mia idea di creare un sistema automatico per documentare componenti Svelte mi sta portando via più tempo del previsto. La tecnica non è molto complicata, ma continuano a saltare fuori dettagli che non avevo previsto. E, sopratutto, la mia tendenza a voler capire come funzionano le cose mi sta portando a impiegare molto tempo per ricreare alcuni elementi base. L'ultimo in ordine di tempo è l'**accordion**: un elemento che si può ingrandire e diminuire con un click.

### Cosa voglio costruire

![accordion-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-11-27-how-to-create-an-accordion-element/accordion-01.gif)

Cosa mi serve? Mi serve un elemento in grado di raggruppare le varie sezioni del componente principale in modo da non mostrare troppe informazioni. Un qualcosa di semplice, che non dipenda da altre librerie e che sia abbastanza leggero e personalizzabile. Per fortuna con [Svelte](https://svelte.dev/) è molto facile crearlo. E per quanto riguarda la parte CSS mi sono oramai abituato alla comodità di [TailwindCSS](https://tailwindcss.com/).

### Partiamo dalla struttura

<script src="https://gist.github.com/el3um4s/de7f80d943110abd719863ac17e68adf.js"></script>

La struttura base è molto semplice, bastano solamente 2 parti:

- una da usare come _header_ del componente per inserire il titolo sezione;
- l'altra è un semplice _slot_ in cui verrò inserito il contenuto da mostrare.

Ovviamente senza aggiungere né stili CSS né azioni il risultato è abbastanza deludente:

{% include picture img="accordion-02.webp" ext="jpg" alt="" %}

### Aggiungiamo un po' di stili

Passo quindi ad aggiungere un po' di stili per evidenziare il titolo dell'elemento e i suoi margini. Per questo componente voglio usare uno stile monocromatico. E, sinceramente, sono sempre più attirato da questo genere di utilizzo dei colori, ma questo è un'altra storia.

Comincio quindi con il definire il titolo:

<script src="https://gist.github.com/el3um4s/009e1229a41ae198d1b5b49c90e081a7.js"></script>

{% include picture img="accordion-03.webp" ext="jpg" alt="" %}

Per quello che riguarda il contenuto non posso aggiungere uno stile css direttamente allo _slot_. Posso però inserirlo in un _div_ e stilizzare quello:

<script src="https://gist.github.com/el3um4s/87b74358db16d1a18a06be7f3d02d80a.js"></script>

{% include picture img="accordion-04.webp" ext="jpg" alt="" %}

### Apriamo e chiudiamo l'elemento

Svelte permette di nascondere e visualizzare un elemento della pagina in maniera molto semplice. Usando una semplice condizione `if...then...else` legata a un _prop_ posso controllarne lo stato:

<script src="https://gist.github.com/el3um4s/fe918e7fed23086238b6d4c54726ae54.js"></script>

{% include picture img="accordion-05.webp" ext="jpg" alt="" %}

### Aggiungo un'icona ruotante

Ma quello che serve a me è un modo per aprire con un click l'elemento. Per farlo mi serve un pulsante e, possibilmente, un'animazione per evidenziare il click. Il modo più elegante che ho trovato mi è stato suggerito da un video di [Johnny Magrippis](https://magrippis.com/)([How to: Svelte Hamburger Menu Animation 🍔](https://www.youtube.com/watch?v=fWzKPUUQdQY&t=3s)). Consiglio di guardare il video, anche perché é abbastanza veloce. In ogni caso, per cominciare mi serve un altro componente, `ChevronRight.svelte`, in cui inserisco un'immagine `svg`:

<script src="https://gist.github.com/el3um4s/a9803acb87f1027a836679544a656d57.js"></script>

Ovviamente mi conviene aggiungere un po' di stili per integrarla nel titolo del componente principale:

<script src="https://gist.github.com/el3um4s/6e222eb8feec49b106e70e35b72085b5.js"></script>

{% include picture img="accordion-06.webp" ext="jpg" alt="" %}

Lo scopo di questa icona è servire come pulsante: quando viene cliccata apre oppure chiude la parte sottostante dell'accordion. Quindi la inserisco in un elemento `button` e ci aggiungo due `props`:

<script src="https://gist.github.com/el3um4s/4a3f04f1df52f50a53810d5fe3e0095a.js"></script>

Uso il prop `open` anche come classe CSS. In questo modo quando l'elemento è aperto posso cambiare l'icona a piacere. In particolare voglio farla ruotare di 180 gradi. Aggiungo quindi un po' di stili CSS utili a questo scopo:

<script src="https://gist.github.com/el3um4s/6909f222a7b35278668bc8a30553d1e6.js"></script>

![accordion-07.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-11-27-how-to-create-an-accordion-element/accordion-07.gif)

### Aggiungiamo un'azione al componente

Adesso che l'icona fa il suo dovere posso tornare al componente principale e inserire un'azione controllare direttamente il suo stato:

<script src="https://gist.github.com/el3um4s/73e14a761de4a3a24718b9784a7fe347.js"></script>

Cliccando sull'icona ottengo finalmente di poter aprire e chiudere l'accordion:

![accordion-08.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-11-27-how-to-create-an-accordion-element/accordion-08.gif)

### Aggiungiamo una transition

Il componente funziona ma, come dire, non è molto bello vedere apparire e sparire all'improvviso una parte della pagina. Per risolvere la cosa posso usare una delle caratteristiche di Svelte, le [transition](https://svelte.dev/docs#svelte_transition):

<script src="https://gist.github.com/el3um4s/0aaaa88a775a787c1662c8686200a4db.js"></script>

Ed ecco il risultato finale:

![accordion-09.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-11-27-how-to-create-an-accordion-element/accordion-09.gif)

Come sempre il codice è liberamente consultabile e scaricabile da GitHub:

- [el3um4s/svelte-component-info](https://github.com/el3um4s/svelte-component-info)
