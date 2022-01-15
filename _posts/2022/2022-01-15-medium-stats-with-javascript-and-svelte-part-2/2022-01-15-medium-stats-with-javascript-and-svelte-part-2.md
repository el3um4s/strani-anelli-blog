---
title: "Medium Stats With JavaScript and Svelte - Part 2"
published: false
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Chris Liverani**](https://unsplash.com/@chrisliverani)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-01-15 17:00"
categories:
  - Svelte
  - Components
  - Documentation
  - Medium
tags:
  - Svelte
  - Components
  - Documentation
  - Medium
---

Dopo aver capito come scaricare e visualizzare i guadagni complessivi di Medium è il momento di capire come fare lo stesso per i vari post. Riprendo quindi il discorso della prima parte, ma questa volta concentrandomi sulla proprietà `postAmounts`. Per il momento mi interessa concentrarmi solamente su alcuni valori:

- `totalAmountPaidToDate`, ovvero tutto quello che l'articolo ha guadagnato
- `amount`, ovvero il guadagno nel mese in corso
- `post.id`, ovvero l'`ID` identificativo dell'articolo
- `firstPublishedAt`, ovvero la data della prima pubblicazione (per il momento decido di ignorare la data dell'ultima modifica)
- `post.title`, ovvero il titolo dell'articolo
- `post.virtuals.wordCount`, ovvero il numero di parole nell'articolo
- `post.virtuals.readingTime`, ovvero il tempo di lettura stimato
- `post.homeCollectionId`, ovvero l'ID della pubblicazione che ospita la storia

### Mostro i dati delle storie

Stabilito questo posso cominciare a caricare i dati nella mia applicazione. Per farlo utilizzo la funzione `loadDashboardJSON()`

<script src="https://gist.github.com/el3um4s/23176172d22b1aa10992d4b334c0d6e5.js"></script>

Devo però aggiungere una funzione specifica per caricare i dati di ogni post in un oggetto distinto. Creo la funzione `getListStories()`:

<script src="https://gist.github.com/el3um4s/8df8518e9ee282b9caf2ffb668864311.js"></script>

C'è però un problema con questo modo di salvare `firstPublishedAt`: potrebbe creare delle complicazioni nel momento in cui voglio filtrare e ordinare i diversi post. Per evitare questo problema scompongo la data in più parti. Per farlo modifico `getDate()` aggiungendo il metodo [Date.prototype.getDate()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate):

<script src="https://gist.github.com/el3um4s/080e983706ddd5aac58b27d57f8b2636.js"></script>

E di conseguenza correggo `getListStories()`:

<script src="https://gist.github.com/el3um4s/9496949b16d873ef55e49f9c47ef6e56.js"></script>

Modifico il pulsante `Load dashboard.json` in modo da salvare il tutto nell'array `listStories`:

<script src="https://gist.github.com/el3um4s/4a73598e5022882c5b550041efd2ab03.js"></script>

I dati mensili sono più semplici rispetto a quelle dei singoli articoli, anche limitandoci a questi 8 valori. Come mostrare a schermo in maniera ordinata tutto questo?

### Creo una tabella con CSS Grid

Tra le varie opzioni sul tavolo ho deciso di creare una tabella usando le [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout). All'inizio, durante la prima stesura di questo pezzo, mi sono dilungato a spiegare come fare. Però alla fine stava diventando un discorso molto lungo e in parte anche poco in tema. Ho creato però una guida con i miei appunti su come creare una tabella usando CSS Grid Layout. La si puù leggere qui:

- [How To Create Responsive Data Tables With CSS Grid](https://betterprogramming.pub/how-to-create-responsive-data-tables-with-css-grid-9e0a37394450)

Quindi, adesso un array con le varie statistiche delle mie storie. Mi serve un secondo array contente le informazioni riguardo alle colonne. Poso crearlo semplicemente a mano:

<script src="https://gist.github.com/el3um4s/996ca253a154a1098e8052d92d45bcfd.js"></script>

Aggiungo quindi il componente `Table` nella mia pagina:

<script src="https://gist.github.com/el3um4s/3e06359a59643f05136cd4f62b8c99ba.js"></script>

Sarebbe però comodo visualizzare il totale delle colonne. Posso farlo usando il props `totals`. Per prima cosa definisco una funzione che calcoli la somma dei vari valori:

<script src="https://gist.github.com/el3um4s/d09fee9f825ab6e4e3431f9d60149d7e.js"></script>

Quindi modifico il file `App.svelte`:

<script src="https://gist.github.com/el3um4s/ceaaeceba2cc1e70fe49680895568251.js"></script>

Ed ecco la tabella con le statistiche dei vari articoli.

{% include picture img="table-01.webp" ext="jpg" alt="" %}

### Aggiungo le funzioni di ordinamento

Un'altra cosa utile è la possibilità di ordinare le storie in base alla data, al titolo, ai guadagni e al numero di parole. Per farlo uso un context menu e la variabile `ordersTable`;

<script src="https://gist.github.com/el3um4s/8dc4f496ce884da596d149cad9886e85.js"></script>

Modifico la parte HTML

<script src="https://gist.github.com/el3um4s/586c90b5e02337359efef18c1044168c.js"></script>

E ottengo una lista simile a questa:

![table-css-grid-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-14-come-scaricare-le-statistiche-di-medium-part-2/table-css-grid-01.gif)

### Aggiungo un grafico a barre

La lista non mi è però sufficiente. Voglio aggiungere un qualcosa di grafico per avere una vista d'occhio migliore. Aggiungo quindi un grafico a barre nella mia tabella.

Sostanzialmente voglio usare lo spazio dedicato ai titolo degli articoli come area per disegnare i miei grafici a barre. Per prima cosa definisco quali colonne possono diventare la fonte del grafico:

<script src="https://gist.github.com/el3um4s/63ec7a384657d6665bca91f3aea7cfb9.js"></script>

Quindi aggiungo i props corrispondenti

<script src="https://gist.github.com/el3um4s/6bf11b700ae87e26a19c46cc359104bb.js"></script>

E finalmente ottengo la lista con dei guadagni dei vari articoli:

![table-css-grid-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-14-come-scaricare-le-statistiche-di-medium-part-2/table-css-grid-02.gif)

### Facciamo una sintesi

Per quanto sia interessante e utile, quello che guardo ogni giorno è un dato di sintesi. La momento compilo a mano, in excel, uno schema simile a questo:

{% include picture img="sintesi-01-excel.webp" ext="jpg" alt="" %}

Finché ho pochi articoli è tutto sommato semplice. O finché i mesi sono particolarmente bassi, come questo gennaio. Ma se continuerò a scrivere su Medium è prevedibile che la faccenda si complicherà. Per questo voglio rendere il più possibile automatico la raccolta e l'analisi delle statistiche di Medium che mi interessano.

Posso cominciare con il creare una versione semplificata di questa sintesi. La versione più semplice riguarda il mese in corso. Ma prima una precisazione.

Come ho già spiegato nel primo articolo di questa serie, sto usando TypeScript. O, meglio, finora ho usato solamente JavaScript ma da adesso in avanti le cose iniziano a farsi un po' più complicate. Quindi, per semplificarmi la vita, inizio a introdurre un po' di tipi. E il primo riguarda i dati che mi servono per creare la sintesi:

<script src="https://gist.github.com/el3um4s/a29f4701a02647ca4cf93540531d71ae.js"></script>

Quindi creo il componente. O, meglio, comincio con il crearne una versione molto semplificata:

<script src="https://gist.github.com/el3um4s/8ed05694b516e1f6093f2a9706bae59e.js"></script>

Importo quindi il componente in `App.svelte`:

<script src="https://gist.github.com/el3um4s/137d5d7a17f05a2f25498401d784e349.js"></script>

Ovviamente non ottengo nulla perché non ho ancora creato le funzioni per estrarre i dati che mi servono.

La cosa più semplice da calcolare è il numero di articoli pubblicati e il loro guadagno:

<script src="https://gist.github.com/el3um4s/ca626d84801fbd3c0ea64238931ff0ca.js"></script>

È altrettanto rapido capire qual è la storia con più incassi nel mese:

<script src="https://gist.github.com/el3um4s/5843b70900b1feb50d795883c6e75563.js"></script>

Le cose si complicano un po' di più quando devo dividere i dati per le storie del mese in corso e quelle dei mesi precedenti.

Ci sono vari modi per farlo, uno furbo è usare un altro file json. Posso scaricare il file [stats.json](https://medium.com/me/stats?format=json&count=1000) e da lì estrarre la proprietà `firstPublishedAtBucket`. Ma non è quello che farò, non adesso. Più avanti userò questo nuovo file per ricavare altri dati: `views`, `reads`, `claps` e `fans`.

Oggi mi limito a usare quello che già ho. Quindi, come faccio a dividere i vari post per mese e anno di pubblicazione?

Quando ho creato l'interfaccia `StoryAmountStats` ho salvato anche la proprietà `firstPublishedAt` di tipo `firstPublishedAt`:

<script src="https://gist.github.com/el3um4s/13f691a15f0dce4beae7c5088df8c5ed.js"></script>

Bene, questo è tutto quello che mi serve per cominciare.

Come capisco in quale mese siamo? Posso calcolare la data del sistema con [Date.now()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now). Poi estraggo il numero del mese e dell'anno e lo uso come filtro.

<script src="https://gist.github.com/el3um4s/72be5684147d0bd51f75b4aedcc7562a.js"></script>

Per calcolare i dati degli articoli precedenti posso fare una sottrazione, oppure creare una funzione apposita. Penso che una funzione specifica sia più indicata, anche perché mi servirà più avanti. Quindi:

<script src="https://gist.github.com/el3um4s/dca2c9ff2d188d1c1a1fb552b9df0e24.js"></script>

Adesso non mi resta che mettere il tutto assieme:

<script src="https://gist.github.com/el3um4s/133eedc098c5d65b7495e06d8ce1c318.js"></script>

Dopo aver aggiunto un po' di stili CSS finalmente ottengo uno schema riassuntivo del mese:

{% include picture img="sintesi-02-svelte.webp" ext="jpg" alt="" %}

### A che punto siamo

Per oggi mi fermo qui. Ci sono ancora alcuni problemi da risolvere. E in particolar modo quello che ha dato il via a tutto questo: come posso visualizzare gli stessi dati ma per più mesi di fila? Di questo parlerò in un prossimo articolo.

Fino ad adesso abbiamo creato una pagina che mostra il rendimento complessivo dei vari mesi, il rendimento delle singole storie e una breve sintesi del mese in corso:

![medium-stats-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-14-come-scaricare-le-statistiche-di-medium-part-2/medium-stats-01.gif)

Per quanto riguarda la prima parte di questo articolo, è possibile leggerla qui:

- [How to Get Medium Stats With JavaScript and Svelte](https://blog.stranianelli.com/medium-stats-with-javascript-and-svelte-part-1/)

Invece su Medium c'è una lista con i miei articoli su Svelte e SvelteKit:

- [Svelte & SvelteKit](https://el3um4s.medium.com/list/svelte-sveltekit-bf5be8834fbf)

Infine questo è il repository con il codice:

- [el3um4s/medium-stats](https://github.com/el3um4s/medium-stats)

Ovviamente è ancora un work in progress, di conseguenza ci sono ancora delle funzioni da sistemare è un po' di codice da pulire.
