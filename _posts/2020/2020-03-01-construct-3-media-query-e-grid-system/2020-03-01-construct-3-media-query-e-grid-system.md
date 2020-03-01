---
title: "Construct 3: Media Query e grid system"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "css-media-query-construct-3"
  immagine_estesa: "css-media-query-construct-3"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2020-03-01 15:00"
categories:
  - 100DaysOfCode
  - Construct 3
tags:
  - 100DaysOfCode
  - Construct 3
---

Lavorando alla mia idea di un metodo semplice e veloce per [personalizzare l'esportazione in HTML di progetti di Construct 3]({% post_url 2020-02-29-construct-3-come-personalizzare-l-esportazione-in-html %}) mi sono nuovamente imbattuto in un problema: C3 rende abbastanza difficile gestire pagine html responsive. Anche se, dopo averci sbattuto la testa un po' di volte, ho forse trovato un metodo abbastanza veloce e replicabile per simulare Media Query in Construct 3.

Comincio con il far vedere il risultato che ho ottenuto. La GIF è un po' pesante, spero non in impieghi una vita e mezza a caricarsi.

<img src="https://blog.stranianelli.com/images/gif/2020-03-01-construct-3-media-query-e-grid-system.gif">

Bello, vero? Ovviamente [questo è il file c3p con il codice che ho usato](https://blog.stranianelli.com/c3p/grid-system-for-construct-3.c3p). Vale però la pena, soprattutto pensando al _me futuro_ riassumere il ragionamento e i vari passaggi necessari.

### L'idea

L'idea alla base è piuttosto banale: far si che Construct 3 non gestisca direttamente la posizione e la dimensione dei vari elementi della pagina. Come? Usando una serie di sprite come caselle di una griglia da usare come riferimento per tutto quanto. Questi sprite si posizionano automaticamente in base alla dimensione della finestra del browser.

Per poter fare tutto ciò ci sono due problemi da risolvere:

1. Construct 3 non deve modificare la dimensione relativa dei vari elementi con il cambiare della dimensione della finestra
2. Ogni sprite deve calcolare la propria posizione in relazione alla dimensione della finestra. E deve essere abbastanza furbo da capire quando le dimensioni possono variare da quando invece devono essere fisse.

### Adattare dinamicamente l'elemento CANVAS di Construct 3 alla finestra

Il primo problema si può risolvere abbastanza rapidamente impostando `Fullscreen mode` su `Off`:

{% include picture img="fullscreen-mode-off.webp" ext="jpg" alt="" %}

e poi modificando la dimensione della `canvas` alle dimensioni della finestra:

~~~
-> System: Set canvas size to Browser.WindowInnerWidth x Browser.WindowInnerHeight
~~~

### Adattare dinamicamente la dimensione e la posizione degli sprite

Il secondo problema richiede la creazione di un sistema di coordinate e di misurazione da sovrapporre a Construct 3. Fortunatamente possiamo crearlo usando due variabili:

- VIEWPORT_SIZE_WIDTH
- VIEWPORT_SIZE_HEIGHT

Nella prima registriamo la larghezza originale della viewport (per capirci, in questo esempio, 856), nella seconda l'altezza (quindi 480). Per calcolare la posizione relativa basta una semplice proporzione:

`X_originale : Viewport_originale = X_nuova : Finestra_Browser`

Che diventa quindi:

~~~
X_nuova = (X_originale / VIEWPORT_SIZE_WIDTH) * Browser.WindowInnerWidth
~~~

Lo stesso ragionamento si può applicare per le altre coordinate.

### position = absolute in Construct 3

Esiste poi un caso ancora più semplice, ovvero il voler tenere un elemento fisso nella stessa pozione e della stessa dimensione. In questo caso è sufficiente:

~~~
X_nuova = X_originale
~~~

Tutto qui.

### Media Query in Construct 3

È possibile affrontae il discorso dell'insiremnento delle Media Query in Construct 3 in due modi. Il primo, modificando la posizione degli sprite in base alle dimensioni della finestra. Per esempio, in pseudo code:

~~~js
switch(Browser.WindowInnerWidth) {
  case <500:
    sprite.x = 50;
  break;
  case <768:
    sprite.x = 100;
  break;
  default:
    sprite.x = 200;
}
~~~

Per quanto sia la soluzione più semplice ed elegante in JS, è però anche particolarmente lunga e soggetta a errori se sviluppata in un event sheet di Construct 3.

L'alternativa, quella usata nel file di esempio, è creare più livelli e in ogni livello inserire gli sprite nella posizione voluta in base alla dimensione dello schermo. Poi, usando un semplice evento

~~~
+ System: Browser.WindowInnerWidth ≤ 500
  -> System: Set layer "grid_little" Visible
  -> System: Set layer "grid" Invisible
  -> System: Set layer "grid_big" Invisible
  -> System: Set layer "grid_large" Invisible
~~~

rendere visibile solo il layer voluto.

### Infine

<img src="https://blog.stranianelli.com/images/gif/2020-03-01-construct-3-media-query-e-grid-system-smile.gif">

Infine, l'ultima questione. Questo metodo permette di creare una griglia responsive in grado di adattarsi a diversi schermi. Si puù usare lo stesso metodo, oltre che per gli sprite anche per ogni altro oggetto di Construct. Oppure, volendo, usare questa griglia come base di riferimento per l'inserimento di altri elementi.
