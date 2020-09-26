---
title: "Reskyu (Vimjam Edition)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "reskyu-copertina"
  immagine_estesa: "reskyu-copertina"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2020-09-26 15:47"
categories:
  - 100DaysOfCode
  - Construct 3
  - Jam
tags:
  - 100DaysOfCode
  - Construct 3
  - Jam
  - Reskyu
  - Vimjam
---

Ho completato e inviato il mio gioco per la [VimJam: Collectables (8 Bits to Infinity)](https://itch.io/jam/vimjam), svoltasi dal 18 al 25 settembre (2020, ovviamente). Il vincolo era "_Collezionabili_", il tema "**There and back again**". E, lo devo ammettere, sono soddisfatto del risultato: per la prima volta sono riuscito a completare una Jam creando non solo il codice ma anche tutti gli assets (font escluso). Ho disegnato i personaggi e l'ambientazione, ho composto la musica, e persino i suoni del gioco. I risultati sono quelli che sono ma non mi importa.

Comincio con un po' di link, e poi racconto come è andata:

  - pagina del gioco: [Reskyu (Vimjam Edition)"](https://el3um4s.itch.io/reskyu-vimjam-edition)
  - pagina per votare: [Rate the Game](https://itch.io/jam/vimjam/rate/768009)
  - elenco dei giochi degli altri concorrenti: [VimJam - entries](https://itch.io/jam/vimjam/entries)

Ovviamente non posso commentare la classifica, anche perché le votazioni sono appena cominciate e prima di una settimana non si saprà il risultato. Ma posso raccontare come è andata. Comincio con l'idea:

![follow the player](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2020/2020-09-26-reskyu-vimjam-edition/the-idea.gif)

Un'idea tutto sommato semplice: i "_Collezionabili_" da raccogliere saranno delle "persone". Il "_back again_" sarà il loro riportarle indietro, a casa. Punto. Ma non a capo: volevo, e voglio tuttora, una dimensione aggiuntiva. I salvati avranno delle abilità aggiuntive che permetteranno di ricostruire la civiltà perduta dopo la catastrofe. Inoltre durante la ricerca il giocatore potrà recuperare oggetti utili sia per l'opera di ricostruzione della civiltà sia per aumentare le proprie abilità.

Lo so bene, tutto questo è impossibile da creare in una sola settimana. È impossibile per me, questo di certo. Quindi ho fatto una cosa nuova per me: mi sono obbligato a scegliere un solo aspetto. E, ovvio, ho scelto di concentrarmi sul meccanismo alla base, quello del "salvataggio" dei vari personaggi.

Penso di aver avuto davanti un bivio: scegliere un gioco top down, oppure un platformer. La scelta è stata determinata da due pensieri:

  - avevo voglia di provare a creare un platformer
  - volevo disegnarmi da solo tutti gli assets

E, onestamente, credo che sia più semplice creare un personaggio di profilo che dall'alto. A meno che non avessi scelto una grafica molto astratta. E, forse, sarebbe anche stata la scelta migliore.

Comunque sia, stabilito cosa fare si è trattato di affrontare i problemi man mano che sono sorti. Alcuni li ho risolti, altri li ho nascosti sotto il tappettino, altri ancora sono risbucati fuori dopo aver spedito il gioco.

{% include picture img="reskyu-01.webp" ext="jpg" alt="" %}

**Il primo problema è sempre il solito: il tempo**. Non ho sfruttato tutto il tempo a disposizione e mi sono perso dietro ad alcuni dettagli di poco conto. Ma rispetto alle altre volte la decisione di partire dalla meccanica di gioco mi ha avvantaggiato. Anche se non sono riuscito a creare molti livelli (e in realtà ne ho creato solamente due), ho ottenuto un prototipo funzionante in tutte le sue funzioni principali: il giocatore si muove, i personaggi seguono il giocatore, i nemici possono ferire, l'area sicura è sicura e il pulsante di recupero funziona.

Avere le meccaniche di base funzionanti mi ha permesso di creare molto rapidamente i due livelli presenti nella versione inviata per la VimJam, e anche il livello Tutorial. Quindi, se da un lato ho speso molto tempo a sistemare un livello sandbox non visibile, dall'altro questo mi ha permesso di creare un qualcosa di utilizzabile ancora per i prossimi livelli.

{% include picture img="reskyu-02.webp" ext="jpg" alt="" %}

**Il secondo problema è la grafica**. Mi sono impuntato nel voler disegnare tutto. Volevo creare qualcosa che richiamasse lo [Scribble Plaformer Pack di Kenney](https://www.kenney.nl/assets/scribble-platformer), ma a colori. Ma le mie abilità artistiche sono non dico assenti ma atrofizzate. Il primo tentativo è stato questo:

{% include picture img="disegno-a-mano.webp" ext="jpg" alt="" %}

Lo ammetto, non granché. E, ammetto anche questo, imparare a disegnare durante una Game Jam non è l'idea più geniale. Però in qualche modo me la sono cavata.
E non solo me la sono cavata, mi sono accorto di essere man mano più veloce. E ho acquisito una certa fiducia in questo stile di disegno. Certo, ho anche un po' barato. Perché? Perché a un certo punto mi sono accorto che i personaggi non risaltavano sullo sfondo. Quindi ho decido di creare uno stacco creando un contorno bianco, grazie a un utile plugin per Construct 3: [OUTLINE di Richard Lems](https://www.construct.net/en/make-games/addons/265/outline).

In realtà volevo anche aggiungerci un effetto ombra ma non ci sono riuscito...

{% include picture img="reskyu-04.webp" ext="jpg" alt="" %}

**Il terzo problema è legato al secondo**: man mano che la mia abilità grafica passava dal livello "da che parte si impugna la matita" al livello "adesso sono persino in grado di fare la punta alla matita" si notava la differenza. E si vede tuttora, nel gioco, che qualcosa non quadra dal punto di vista grafico. Avrei dovuto, dovrei, ridisegnare lo sfondo e le tilemap. Penso che lo farò.

{% include picture img="reskyu-03.webp" ext="jpg" alt="" %}

**Il quarto problema sono la musica e i suoni**. Per carità, li ho composti io, usando [BoscaCeoil](https://boscaceoil.net/), e di per sé non sono malaccio. Anche se a dire il vero c'è anche lo zampino di mia moglie che ha tentato di risolvere il mio disastro acustico. Però dai primi commenti al gioco non pare vadano bene. Ed è vero: alcuni effetti sono troppo alti, altri creano confusione. Però non sono preoccupato, ho tutto il tempo per sistemare il tutto.

{% include picture img="reskyu-copertina.webp" ext="jpg" alt="" %}

**L'ultimo problema è apparso alla fine**, dopo aver spedito. Ed è un problema che pensavo di aver risolto: in alcune situazioni, situazioni che non sono riuscito a identificare, ogni tanto il meccanismo di gioco si inceppa e i personaggi escono dall'area sicura e finiscono nella coordinata 0-0. Onestamente non ho capito perché si sia ripresentato questo bug. Dovrò ricontrollare il codice ma sono abbastanza ottimista di poter risolvere questo problema.

E quindi? Quindi niente. Adesso si tratta di provare gli altri giochi partecipanti alla Jam, ce ne sono alcuni molto interessanti. E poi di ragionare su come continuare con questo progetto.
