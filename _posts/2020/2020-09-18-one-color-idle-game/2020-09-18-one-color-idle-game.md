---
title: "One Color Idle Game"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "one-color-idle-game"
  immagine_estesa: "one-color-idle-game"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2020-09-18 15:40"
categories:
  - 100DaysOfCode
  - Construct 3
tags:
  - 100DaysOfCode
  - Construct 3
---

Nell'ultimo mese e mezzo, circa, ho sistemato alcuni vecchi template e progetti, rendendoli open source in un repository su GitHub dal nome molto fantasioso: [Construct Demo](https://github.com/el3um4s/construct-demo). E visto che c'ero ho creato anche un mini sito, [qui](https://c3demo.stranianelli.com/). Ma non è di questo che voglio parlare bensì dell'ultimo template che ho pubblicato: **One Color Idle Game**.

### L'idea

![json and javascript](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2020/2020-09-18-one-color-idle-game/first-version.gif)

L'idea alla base è, anzi, era, replicare [questo video di Zyger su Youtube](https://www.youtube.com/watch?v=5TO_GHShqEQ): un semplice Idle game, con solamente un pulsante da premere e 4 o 5 "potenziamenti". Devo ammettere di essere stato abbastanza veloce: in qualche ora ho ottenuto un template funzionate. Ma... ma non ero soddisfatto del risultato. Perché? Perché Construct 3 è ottimo per creare dei prototipi veloci, ma nella velocità si perde una cosa a mio parere fondamentale: la possibilità di riusare il codice. Quindi ho deciso di andare più lentamente e sistemare alcune cose. Con il senno del poi sono però andato troppo lento, ma questo è un altro aspetto.

### Matematica

{% include picture img="second-version.webp" ext="jpg" alt="" %}

Il primo problema è di tipo matematico: come cavolo si calcola e si gestisce l'aumento del prezzo dei vari potenziamenti? Ammetto di aver inizialmente sottovalutato questo aspetto, e questo mi ha fatto perdere un po' di tempo. Poi ho trovato un post di qualche anno fa su GameAnalytics, [The Math of Idle Games](https://gameanalytics.com/blog/idle-game-mathematics.html). E lì mi si è aperto un mondo: consiglio a tutti di leggerlo, soprattutto la seconda parte.

Il problema vero però comincia adesso: ho un template tutto sommato divertente e pronto. Ma se voglio aggiungere altri elementi al gioco devo districarmi tra diverse righe dell'event sheet di Construct 3. Inoltre i conti da fare, per quanto tutto sommato semplici, diventano abbastanza complicati da seguire. Non tanto per la matematica in sé quanto per la filosofia ad eventi dietro C3.

### È il momento di JSON

{% include picture img="json-time.webp" ext="jpg" alt="" %}

Ci sono due problemi distinti: il primo su come salvare le "regole del gioco", ovvero su come spiegare al gioco stesso il quando, il come e il quanto dei vari generatori.

Da un po' di tempo sono innamorato dei file JSON. Li trovo comodi ed efficienti: penso sia la soluzione migliore per scrivere le regole. E anche per salvare le informazioni del gioco. Dopo alcuni tentatavi andati a vuoto ho trovato una soluzione in grado di soddisfarmi:

```json
{
  "curencies": {
    "primary": {
        "label": "Points"
    }
  },
  "generators": {
    "generator_a": {
      "name": "Name A",
      "label": "A",
      "icon": "icon_name_a",
      "requires": {
          "currencies": [
              {
                  "currency": "primary",
                  "quantity": "10"
              }
          ],
          "generators": []
      },
      "cost": [
          {
            "currency": "primary",
            "starting_cost": "10",
            "cost_multi_factor": "1.11"
          }
      ],
      "effects": [
        {
          "immediate": "false",
          "action": "add",
          "currency": "primary",
          "base_income": "1",
          "timer_seconds": "1",
          "generators": ["generator_a"]
        }
      ]
    }
  }
}
```

Per quanto a prima vista possa sembrare complicato, il concetto alla base è inserire per ogni generatore tutte le informazioni fondamentali: il nome da mostrare, le condizioni per renderlo disponibile all'acquisto, il prezzo di partenza e il fattore di moltiplicazione da applicare e, infine, gli effetti da ottenere. In questo modo semplicemente modificando un file di testo esterno al gioco stesso è possibile cambiare il funzionamento del gioco stesso. Bello, vero?

### Vai con JavaScript

![json and javascript](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2020/2020-09-18-one-color-idle-game/json-and-javascript.gif)

E qui entra il secondo problema: come far comunicare le regole con Construct 3? Beh, il modo più sensato sarebbe stato usare il [plugin JSON](https://www.construct.net/en/make-games/manuals/construct-3/plugin-reference/json). Ma questo avrebbe reso meno semplice il codice del gioco rispetto al puro JS. Inoltre avrebbe richiesto un ulteriore passaggio verso javascript per fare i calcoli. La soluzione che ho trovato, e di cui sono anche abbastanza soddisfatto, è dividere i compiti. C3 si sarrbbe occupato della gestione della grafica, JS dei calcoli e di tutto il resto.

Per poter arrivare a questo ho creato e utilizzato diversi file JS:

  - **c3_json_helper.js** per gestire tutti i file JSON, sia nell'interfaccia grafica che nel codi JavaScript
  - **c3_colors_helper.js** per gestire i colori e i temi del gioco
  - **c3_idle_const.js** per salvare alcune costanti generali. Onestamente è un file pressoché inutile, probabilmente potevo salvare le stesse due righe di codice dentro _c3_idle_count_helper.js_
  - **c3_idle_count_helper.js** contenente tutte le funzioni usate per fare i calcoli
  - **c3_idle_number_formatter.js** alcune funzioni per mostrare i grandi numeri in una maniera leggibile agli umani
  - **c3_idle_interface_helper.js** per capire quando e cosa mostrare nell'interfaccia grafica

Questa parte oltre a essere quella che mi ha richiesto più tempo è anche quella più interessante. Da qui posso, e dovrò, tirare fuori almeno altri 2 o 3 template più semplici (come gestire grandi numeri con construct 3, come creare temi dinamici con c3 e come salvare file json come file base64). Ci penserò nelle prossime settimane.

Un'aspetto interessante è stato l'uso intensivo del file _c3_json_helper.js_. È un file che avevo già usato in altri template ma mai così a fondo e soprattutto senza mai stressarlo così tanto. Questo mi ha fatto scoprire alcuni suoi limiti, in primis sulla gestione di chiave annidate. E in secondo luogo sulla gestione dei valori `null`. Di conseguenza ho dovuto praticamente riscriverlo da zero. Ma penso ne sia valsa la pena.

### Salvare il gioco

{% include picture img="save-system.webp" ext="jpg" alt="" %}

Un altro aspetto interessante è stato ragionare su come gestire i salvataggi del gioco. Non ho voluto usare la funzione integrata di Construct 3 perché ha dei limiti con il salvataggio dei file JSON. E soprattutto perché volevo emulare il meccanismo classico di questo genere di giochi: copiare e incollare una lunga stringa di testo per esportare il salvataggio da un computer al un altro.

Anche in questo caso modificare direttamente un file JS si è rivelata la soluzione più rapida, sia per salvare la partita nella memoria del browser sia per convertirla in una stringa base64.

### Infine

{% include picture img="final-version.webp" ext="jpg" alt="" %}

Ovviamente il template non è davvero finito. Mancano ancora alcune caratteristiche di un certo interesse:

  - un meccanismo di log, per mostrare continuamente numeri e informazioni: penso possa aggiungere un po' di divertimento al gioco
  - la possibilità di caricare una partita salvata partendo da un link personalizzato (ho già una mezza idea di come poterlo fare)
  - l'introduzione del prestigio e quindi la possibilità di aumentare il tempo di gioco in maniera esponenziale
  - un nuovo generatore in grado di ridurre il tempo necessario agli altri generatori per produrre punti
  - una nuova categoria di generatori, questa volta in grado di generare a loro volta altri generatori

Per il momento però mi fermo qui. Perché? Perché sono andato ben oltre il mio scopo iniziale, ed è il momento di pubblicare qualcosa. E l'ho fatto in due (anzi, tre) posti distinti:

  - ovviamente sul sito contenente il codice del gioco stesso: [c3demo.stranianelli.com](https://c3demo.stranianelli.com/template/005-one-color-idle-game/)
  - su itch.io: [el3um4s.itch.io](https://el3um4s.itch.io/one-color-idle-game)
  - su Construct Arcade: [construct.net](https://www.construct.net/en/free-online-games/one-color-idle-game-17631/play?via=mn)

Ovviamente da un lato voglio andare avanti e aggiungere alcuni se non tutti i 5 punti precedenti. Dall'altro voglio passare a qualcosa di nuovo, magari approfittando di ottobre e della [Devtober Jam 2020](https://itch.io/jam/devtober-2020). Vedremo.
