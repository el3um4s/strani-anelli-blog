---
title: "Un modo semplice per creare grafici con Svelte"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-01-24 18:00"
categories:
  - Chart
tags:
  - Chart
---

I numeri spiegano la realtà, ma a volte lo fanno in maniera complicata. Le serie e i rapporti sono strumenti potenti ma non sempre chiari. Per questo, spesso, conviene aggiungere un grafico alle proprie pagine. Ma come farlo? Beh, oggi provo a spiegare il modo più semplice che ho trovato per aggiungere grafici a una pagina web.

### Premessa

Ma prima di cominciare, ecco cosa voglio creare:

![google-charts-with-svelte-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-01.gif)

Sono 5 grafici diversi:

- un grafico a colonne
- un grafico a torta
- un grafico treemap
- un grafico a dispersione
- un grafico a calendario

ma il procedimento è molto simile.

In questo tutorial userò i dati del Medium Partner Program. Li ho già usati qualche giorno quando ho parlato di come [creare tabelle responsive con CSS](https://betterprogramming.pub/how-to-create-responsive-data-tables-with-css-grid-9e0a37394450). Per vedere come scaricare e importare le statistiche consiglio questo articolo:

- [How to Get Medium Stats With JavaScript and Svelte](https://javascript.plainenglish.io/how-to-get-medium-stats-with-javascript-and-svelte-part-1-a1d08b96799e)

Comunque, in sintesi, basta andare all'indirizzo [medium.com/me/stats?format=json&count=100](https://medium.com/me/stats?format=json&count=100) e scaricare la pagina. Ovviamente posso creare i grafici con qualsiasi dato, ma per ricordare il procedimento al me futuro mi servono dei dati di esempio.

### La cassetta degli attrezzi

Cosa mi serve per creare facilmente dei grafici con JavaScript, HTML e CSS? In rete si possono trovare varie librerie, quella più semplice da usare, secondo me, è [Google Charts](https://developers.google.com/chart). Come è facilmente intuibile dal nome, si tratta di una libreria di Google. Google la definisce così:

```
Google Charts provides a perfect way to visualize data on your website
```

Ma c'è un problema. Quale? Che non è così semplice da usare. La pagina [quickstart](https://developers.google.com/chart/interactive/docs/quick_start) spiega come creare un grafico a torta. È un buon punto di partenza ma non è la strada che intendo seguire.

Cercando in rete è possibile trovare le [Google Charts API come web components](https://www.npmjs.com/package/@google-web-components/google-chart). Questo permette di creare un grafico con una sintassi simile a questa:

<script src="https://gist.github.com/el3um4s/854eb9e50b51ad99b9268172b1832441.js"></script>

Posso importare le API in un progetto con il comando:

```bash
npm i @google-web-components/google-chart
```

Il secondo strumento che intendo usare è [Svelte](https://svelte.dev/). Svelte permette di creare facilmente delle web app. E, sopratutto, mi permette di scrivere del codice di esempio comprensibile anche a chi è alle prime armi con JavaScript (o TypeScript), CSS e HTML.

Anche in questo caso, ovviamente, è possibile usare qualsiasi altro framework, o anche nessuno. Però Svelte semplifica molto il lavoro.

### Creare un grafico a colonne

Allora, comincio con il primo grafico, questo:

![google-charts-with-svelte-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-02.gif)

Comincio con il creare un componente `GoogleChartColumn.svelte`. Per prima cosa importo `@google-web-components/google-chart`:

<script src="https://gist.github.com/el3um4s/49c767f931dc416f9f85b71c98102ca7.js"></script>

Poi definisco i props che mi servono. La [documentazione di Google](https://developers.google.com/chart/interactive/docs/gallery/columnchart) è ben fatta e permette di capire cosa può servire. Per il momento mi limito alle cose fondamentali:

- `data`: per i dati da visualizzare
- `options`: per configurare alcuni dettagli del grafico

Non mi interessano molte opzioni. Mi basta poter personalizzare il titolo e decidere il colore delle varie colonne. Di conseguenza i props diventano:

<script src="https://gist.github.com/el3um4s/01edbc6ee3567f1a14ecb99ea1b8d55c.js"></script>

I dati sono di un tipo abbastanza bizzarro. Sostanzialmente sono un matrice dove la prima riga indica il nome e il tipo delle colonne:

<script src="https://gist.github.com/el3um4s/95bfbf39306e991229d8ef35ac5f8b1e.js"></script>

Le righe successive invece contengono i dati effettivi:

<script src="https://gist.github.com/el3um4s/20f9c4bb2e6d9f50defe079a5dfaece6.js"></script>

Aggiungo una variabile dedicata alla configurazione:

<script src="https://gist.github.com/el3um4s/ecf943a202996fe47ecee8f3c33cd92e.js"></script>

Poiché uso solamente una serie di dati la leggenda è inutile, quindi la imposto come `none`. Modifico anche il colore dello sfondo in modo da non staccare dal resto della pagina (quindi è `transparent`). Infine cambio la formattazione del titolo del grafico usando le proprietà CSS.

Il codice completo del componente è:

<script src="https://gist.github.com/el3um4s/4fabd098e03ba65f968b4b0a811c15b8.js"></script>

Ma come lo posso usare effettivamente in una pagina HTML? Così:

<script src="https://gist.github.com/el3um4s/937b17bddb8b84fd141c5b092480a657.js"></script>

Per ricavare i dati da inserire creo la funzione `earningPerMonth`:

<script src="https://gist.github.com/el3um4s/d119ba276021377fc71ea57672033f36.js"></script>

Ovviamente questa funzione va modificata in base ai propri dati.

### Creare un grafico a torta

![google-charts-with-svelte-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-03.gif)

Capito il ragionamento è facile creare anche gli altri grafici. Ovviamente ognuno ha delle caratteristiche particolari. Per esempio il grafico a torta.

Creo il file `GoogleChartPie.svelte`

<script src="https://gist.github.com/el3um4s/e4df3588a5025bceb43ec336dbc7658a.js"></script>

Il grafico a torta richiede i dati divisi in due diversi props: `cols` e `rows`. Permette inoltre di passare un valore numerico (compreso tra 0 e 1) per decidere la larghezza minima delle fette della torta.

Per esempio, se imposto `sliceVisibilityThreshold = 0.03` potrò vedere solamente le categorie che sono almeno il 3% del totale. Tutte quelle che sono più piccole verranno raggruppate sotto `Other`.

La funzione JavaScript per ottenere i dati è simile a questa:

<script src="https://gist.github.com/el3um4s/ace4623349c4dc1f2c1e08a2e8cb9b04.js"></script>

Adesso posso inserire il grafico nella pagina con:

<script src="https://gist.github.com/el3um4s/e9562420ffc9afbbedb4a8057a501866.js"></script>

Usando lo stesso codice ma cambiando i valori passati ai props posso creare diversi grafici nella stessa pagina:

{% include picture img="chart-pie.webp" ext="jpg" alt="" %}

### Creare un grafico treemap (mappa ad albero)

![google-charts-with-svelte-04.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-04.gif)

[Wikipedia](https://en.wikipedia.org/wiki/Treemapping) spiega bene cosa è una treemap:

```
Una treemap (mappa alberata o mappa ad albero) in visualizzazione delle informazioni è un metodo per mostrare dati gerarchici usando rettangoli innestati.
```

Penso che oramai siano chiari i passaggi da seguire. Creo il file `GoogleChartTreemap.svelte`:

<script src="https://gist.github.com/el3um4s/3e269aeee7562a33f4ae89cb1c64b827.js"></script>

I [prop specifici](https://developers.google.com/chart/interactive/docs/gallery/treemap) di questo grafico sono:

- `maxDepth`: The maximum number of node levels to show in the current view.
- `maxPostDepth`: How many levels of nodes beyond maxDepth to show in "hinted" fashion.
- `minColor`, `midColor` e `maxColor`

La funzione per estrarre e preparare i dati è qualcosa di simile a questo:

<script src="https://gist.github.com/el3um4s/9e6f3c6fc6aed96a278c4ff34df409be.js"></script>

Mentre il codice HTML è

<script src="https://gist.github.com/el3um4s/7319bbcdce3aaf20a4a7685034ab0083.js"></script>

### Creare un grafico a dispersione

![google-charts-with-svelte-05.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-05.gif)

Il grafico a dispersione permette di vedere se c'è qualche correlazione tra due dati. In questo esempio ho provato a mettere in relazione la lunghezza dei diversi post (misurata con il numero di parole) e il ricavo degli stessi. Inoltre ho impostato un tooltip personalizzato quando passiamo con il mouse sopra i vari punti.

Il codice del componente `GoogleChartScatter.svelte` è simile ai precedenti:

<script src="https://gist.github.com/el3um4s/1fd0b424576dccc48858803f88c51f49.js"></script>

Ci sono 2 `props` specifici per questo grafico:

- `axisY`: il titolo da mostrare sull'asse delle Y
- `axisX`: il titolo da mostrare sull'asse delle X

Aggiungo inoltre l'opzione `tooltip: { isHtml: true }`. A cosa serve? A poter personalizzare il tooltip dei vari punti usando HTML e CSS.

La funzione per ottenere i dati per il grafico è leggermente diversa dalle precedenti:

<script src="https://gist.github.com/el3um4s/3bda277bb09dead474734c9b04df0bc6.js"></script>

Ai vari array delle righe aggiungo una string contenente del codice HTML. Questo codice viene poi renderizzato dal componente e mostrato come se fosse un elemento HTML della pagina.

Il codice HTML da usare nella pagina è semplicemente:

<script src="https://gist.github.com/el3um4s/2a04e49050b0559bf1698280226ced3e.js"></script>

### Creare un grafico a calendario

![google-charts-with-svelte-06.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-06.gif)

Il quinto grafico che ho inserito è un grafico a calendario. Serve sostanzialmente per visualizzare i dati su un calendario. L'intensità del colore dei singoli giorni indica la quantità relativa al giorno. Creo che l'esempio classico sia quello mostrato nel profilo di GitHub:

{% include picture img="github-calendar.webp" ext="jpg" alt="" %}

Rispetto ai grafici precedenti questo richiede un po' di CSS e un piccolo trucco. Ma prima il codice base:

<script src="https://gist.github.com/el3um4s/5956304bf471104e348b4ae0efabdd25.js"></script>

In questo caso mi serve un solo props aggiuntivo, `colorAxis`. È un array composto dai codici dei colori da usare nei vari giorni. Di default il valore più basso è rappresentato da un bianco. Dopo aver importato il componente nella pagina mi sono però accorto che non era praticamente distinguibile dallo sfondo. Ho quindi deciso di partire da un colore più forte:

<script src="https://gist.github.com/el3um4s/186f6e8ed23a300e7a2072395c4ea903.js"></script>

La funzione per preparare i dati è simile alle precedent, con ovviamente alcune piccole differenze:

<script src="https://gist.github.com/el3um4s/bbcc4b46a8faadb31407930c85b33f2c.js"></script>

Bene ma non del tutto. Resta un problema legato alle dimensioni del grafico. Non so come mai ma il componente è troppo corto rispetto alla lunghezza del calendario. Devo quindi forzare un po' le dimensioni usando una proprietà CSS:

<script src="https://gist.github.com/el3um4s/266a0b61c99bc1f709658d11578d8168.js"></script>

Il secondo problema riguarda invece l'altezza. In questo caso devo calcolarla in base al numero di anni che voglio mostrare. Quindi per prima cosa mi serve capire quanti anni sono:

<script src="https://gist.github.com/el3um4s/1b14a9ab8ebc3091279618e70424ecfa.js"></script>

Poi uso la direttiva [style:property](https://svelte.dev/docs#template-syntax-element-directives-style-property):

<script src="https://gist.github.com/el3um4s/b91dc8d8a84556ed674743a9fc9a9307.js"></script>

Unendo il tutto il componente diventa:

<script src="https://gist.github.com/el3um4s/b575bcda702376174ca4cd4d74659db4.js"></script>

Bene, con questo è tutto. Ovviamente questo metodo non è perfetto. Lo trovo però più semplice rispetto ad altre implementazioni che ho provato. Il codice, come al solito, è disponibile nel repository su GitHub:

- [el3um4s/medium-stats](https://github.com/el3um4s/medium-stats)

Ovviamente è un work in progress, quindi ci sono ancora dei dettagli da rifinire e probabilmente nel tempo cambierò ancora qualcosa.

Invece, per quanto riguarda Svelte, ho creato una lista su Medium con i miei vari post su questo argomento:

- [Svelte & SvelteKit](https://el3um4s.medium.com/list/svelte-sveltekit-bf5be8834fbf)

E con questo è davvero tutto.
