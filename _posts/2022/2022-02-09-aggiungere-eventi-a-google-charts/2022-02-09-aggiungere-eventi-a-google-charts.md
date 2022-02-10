---
title: "Come Aggiungere Eventi a Grafici Google Charts"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-02-09 20:00"
categories:
  - Charts
  - JavaScript
  - Svelte
  - TypeScript
  - Medium
tags:
  - Charts
  - JavaScript
  - Svelte
  - TypeScript
  - Medium
---

Qualche giorno fa [Corey Thompson](https://github.com/thompcd) ha provato ad aggiungere degli eventi ai grafici di un mio precedente tutorial. Ammetto di aver volutamente lasciato l'argomento. Ho però approfittato della domanda per indagare un po' più a fondo su come rendere più interessanti i vari grafici. Ne è uscita una nuova versione della mia web app per analizzare le statistiche di Medium.

Innanzi tutto, ecco cosa voglio ottenere:

![charts-events-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-02-09-aggiungere-eventi-a-google-charts/charts-events-01.gif)

Si tratta, in sintesi, di due diverse azioni. La prima permette di cambiare lo zoom del grafico scatter plot usando due slider. Il secondo evento permette di recuperare i dati dell'elemento selezionato e di visualizzare alcune informazioni aggiuntive. Ma prima di poter fare questo occorre dare una ripulita al codice.

### Pulire il codice

In questo post continuo il ragionamento cominciato qualche settimana fa in questa storia:

- [Visualize Your Medium Stats With Svelte and JavaScript](https://betterprogramming.pub/visualize-your-medium-stats-with-svelte-and-javascript-eb1ef7c71a63)

Tutto il codice, di questo tutorial e di quelli precedenti, è disponibile nel repository

- [el3um4s/medium-stats](https://github.com/el3um4s/medium-stats)

Rispetto alla prima parte, ho modificato la struttura del progetto nel tentativo di semplificarla.

Per prima cosa ho deciso di non passare più i vari dati tramite `props` ma di usare direttamente uno [store di Svelte](https://svelte.dev/docs#run-time-svelte-store). In questo modo posso raggruppare tutti i metodi in maniera più logica, semplificando la loro modifica ed eliminando i vari doppioni.

Creo il file `StorePartnerProgram.ts` e inizio a importare i tipi TS che mi servono, oltre al modulo `writable`:

<script src="https://gist.github.com/el3um4s/9e3b5acdee2b08b0594094d812c608d1.js"></script>

Creo lo store e lo preparo per l'esportazione:

<script src="https://gist.github.com/el3um4s/cf4dc1b5af40f3ebc35b4ab0cea33b34.js"></script>

Raggruppo quindi tutti i vari metodi di cui ho già parlato in dei nuovi file e li importo:

<script src="https://gist.github.com/el3um4s/06c6c8281e8eb8d569409f9313e16ad4.js"></script>

Infine aggiungo i vari metodi allo store:

<script src="https://gist.github.com/el3um4s/a41dd01e6710ba6eea407efaad2015ea.js"></script>

Dopo aver inglobato i vari metodi in `partnerProgram` posso richiamarli direttamente dai vari componenti.

Per esempio posso ricavare la lista degli articoli del mese scrivendo semplicemente:

<script src="https://gist.github.com/el3um4s/f9b31ef486c774327b5621a63e21af43.js"></script>

### Controllo lo zoom del grafico scatter plot

Dopo aver ripulito un po' il codice posso cominciare a ragionare su come migliorare i vari grafici. La prima cosa che mi serve è qualcosa per vedere più in dettaglio il rapporto tra lunghezza dei vari post e la loro resa. Penso che la soluzione migliore possa essere aggiungere due slider, uno orizzontale, l'altro verticale.

![charts-events-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-02-09-aggiungere-eventi-a-google-charts/charts-events-02.gif)

La prima cosa è capire come creare i due slider. Possiamo divertirci a crearli da zero oppure affidarci a qualcosa di già pronto. Per il momento ho scelto la strada semplice. In Internet si possono trovare diversi componenti interessanti. Ho deciso di usare [Range Slider](https://github.com/simeydotme/svelte-range-slider-pips) di [Simon Goellner](https://github.com/simeydotme).

Installo il componente nel mio progetto usando:

```bash
npm install svelte-range-slider-pips --save-dev
```

Quindi importo il componente in `GoogleChartScatter.svelte`:

<script src="https://gist.github.com/el3um4s/6c2bfe0bd3aa9bea78993f36dd7275f2.js"></script>

L'utilizzo è abbastanza banale:

<script src="https://gist.github.com/el3um4s/99867c8d49fc96579fbdf5eb8e040821.js"></script>

Ci sono solamente alcuni punti da comprendere. Devo stabilire qual è il range entro cui scegliere i numeri. Conviene calcolarli subito in modo da poter tornare alla visualizzazione originale in un secondo momento:

<script src="https://gist.github.com/el3um4s/d89b7b9d1c8223bdaab67ff6813814c8.js"></script>

Il secondo punto riguarda come intercettare i due input. Per farlo creo un array con soli due elementi. Il primo indica il valore minore, il secondo il maggiore:

<script src="https://gist.github.com/el3um4s/55da329314656d6ee67d30085ea81413.js"></script>

Poi non mi resta che unire i pezzi, usando la direttiva [bind:property](https://svelte.dev/docs#template-syntax-element-directives-bind-property) per legare i valori:

<script src="https://gist.github.com/el3um4s/4a09a9c765b340b0fb139e11e0a29bcb.js"></script>

Questo per quanto riguarda gli slider. Devo modificare leggermente anche il grafico. O, meglio, le proprietà `hAxis` e `vAxis` legandole ai valori degli slider.

<script src="https://gist.github.com/el3um4s/49ef70fb5f6c4cc6dba8cae40e3ba073.js"></script>

### Aggiungere un evento quando selezioniamo un valore nel grafico

Il secondo evento che mi interessa è poter vedere alcune informazioni aggiuntive quando seleziono un elemento in un grafico. Passo quindi al grafico `GoogleChartPie.svelte` e comincio a modificarlo per ottenere questo:

![charts-events-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-02-09-aggiungere-eventi-a-google-charts/charts-events-03.gif)

Per generare eventi all'interno di un componente Svelte uso [createEventDispatcher](https://svelte.dev/docs#run-time-svelte-createeventdispatcher):

<script src="https://gist.github.com/el3um4s/5b64b16f9b5cff25f1f1707cf3b677be.js"></script>

Posso creare un evento legato alla selezione di un elemento usando:

<script src="https://gist.github.com/el3um4s/38b4fdeae28b648ce206e4b18a0fe5dc.js"></script>

Uso l'[evento select](https://developers.google.com/chart/interactive/docs/events#the-select-event) di Google Chart per recuperare i valori da passare fuori dal componente.

Prima di andare avanti un appunto sugli eventi di Google Charts. Ci sono 3 eventi che è possibile chiamare da (quasi) ogni grafico:

- `select`
- `error`
- `ready`

Se però vogliamo usare altri eventi li dobbiamo registrare. Per esempio posso voler intercettare l'evento `on mouse over`:

<script src="https://gist.github.com/el3um4s/c4f6180f8d751cc7aec24874a4ca113c.js"></script>

Oppure l'evento `onmouseout`:

<script src="https://gist.github.com/el3um4s/5a86bb8e38acc577c5a7607c9cdee57b.js"></script>

### Mostro un'anteprima della storia

Quello che voglio ottenere è un metodo semplice e veloce per capire a quale post si riferisce un dato. Per farlo passo al grafico anche l'ID della storia:

<script src="https://gist.github.com/el3um4s/fb2594c8f948c2db20d07720ef88b05f.js"></script>

Posso quindi modificare il componente nel file `MonthlyAmounts.svelte`

<script src="https://gist.github.com/el3um4s/dff5b580dc77efe7c1540ac1040254ab.js"></script>

Per ricavare i dati del post a partire dal suo ID è sufficiente la funzione `getStoryById`:

<script src="https://gist.github.com/el3um4s/4fc5a5eb0ef4204ba46992e67dc2695d.js"></script>

Per visualizzare l'anteprima ho invece creato un componente `CardStory.svelte`:

<script src="https://gist.github.com/el3um4s/6912fb7f84ba0893410f3e621224dd4f.js"></script>

Posso usare questo componente nelle varie pagine passandogli semplicemente i dati della storia da mostrare:

<script src="https://gist.github.com/el3um4s/81db024199c2bc28719acdcc11dce3f5.js"></script>

Bene, questo è tutto per oggi. Ricordo che è possibile vedere il codice del progetto su GitHub.
