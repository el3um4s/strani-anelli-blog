---
title: "Un'ipotesi su come documentare componenti Svelte"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Sigmund**](https://unsplash.com/@sigmund)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-11-14 11:00"
categories:
  - Svelte
  - SvelteKit
  - Components
  - Documentation
  - NPM
  - NodeJS
tags:
  - Svelte
  - SvelteKit
  - Components
  - Documentation
  - NPM
  - NodeJS
---

Sono un paio di settimane che non scrivo nulla: è un errore. Mi sono concentrato su come creare in maniera rapida la documentazione per i miei componenti [Svelte](https://svelte.dev/). Non voglio ripetere un mio errore classico: creare delle cosine anche interessanti ma poi non riuscire a mantenere la documentazione aggiornata. Mi serve un metodo per scrivere e sopratutto mantenere coordinata la documentazione con il codice. Mi sono quindi messo in testa di capire come far sì che sia Svelte stesso ad occuparsene. Non ci sono riuscito del tutto, ma credo di avere impostato il procedimento generale.

### I passi da fare

Ho indagato alcune strade, e sono risultati per lo più dei vicoli ciechi. Il primo tentativo è stato di usare [svelte.parse](https://svelte.dev/docs#svelte_parse): non mi ha condotto da nessuna parte. Il secondo mi ha portato a provare alcuni parser JavaScript, a partire da [acorn](https://github.com/acornjs/acorn). Un altro buco nell'acqua. Mi sono dovuto quindi concentrare su partire da un livello ancora più basso. Riassumendo per poter far sì che Svelte si autodocumenti devo:

1. leggere i componenti Svelte non ancora compilati, ovvero i file raw **.svelte**
2. estrarre le informazioni che mi servono:
   - i **props**, con i rispettivi _nome_, _tipo_ e _valore predefinito_
   - le **azioni** che si possono eseguire; in questo caso è sufficiente il nome, se è abbastanza autoesplicativo
   - i nomi degli **slot** che si possono usare
   - e, ma non ne sono ancora del tutto sicuro, le **variabili css** utilizzate dal componente
3. salvare queste informazioni in un file **json**
   - farlo in maniera automatica, in modo da non doverselo ricordare
4. importare queste informazioni in Svelte
5. usare un componente specifico per leggere le informazioni e mostrarle in maniera automatica

Poiché le informazioni su un componente cambiano solo in fase di sviluppo non è un problema se la configurazione risulta un po' macchinosa. Se poi è tutto automatizzato posso concentrarmi sullo sviluppo in sé senza stare a curarmi dei dettagli.

### La struttura generale

Non ho capito se posso integrare tutte queste operazioni in un unico pacchetto NPM. Ho comunque deciso di dividere il progetto in due diversi repository:

1. [el3um4s/svelte-get-component-info](https://github.com/el3um4s/svelte-get-component-info) per gestire la parte relativa all'estrazione dei dati
2. [el3um4s/svelte-component-info](https://github.com/el3um4s/svelte-component-info) per semplificare la visualizzazione delle varie proprietà

Giusto per essere chiaro: i due repository non sono ancora completi, qui mi interessa tenere traccia dei passi che ho fatto e di quelli ancora da compiere. Appena il progetto sarà abbastanza maturo lo integrerò nel mio template [svelte-component-package-starter](https://github.com/el3um4s/svelte-component-package-starter)

### Come ottenere l'elenco dei props di un componente Svelte

Andiamo in ordine. Il problema di ricavare l'elenco delle proprietà di un componente Svelte è grosso modo assimilabile a un problema di ricerca in un file di testo. Si tratta di leggere un file, estrarne il contenuto e poi scorrerlo estraendone i pezzi che mi servono.

Comincio quindi con il creare una funzione per leggere un file e restituire il suo contenuto come stringa di testo:

<script src="https://gist.github.com/el3um4s/971052655845fab19be97d4f2312eceb.js"></script>

Uso l'API [readFileSync](https://nodejs.org/api/fs.html#fsreadfilesyncpath-options) di [NodeJS](https://nodejs.org/en/) per fare il grosso del lavoro.

Dopo aver ottenuto il contenuto del file comincio a cercare quello che mi interessa. Per estrarre i props di un componente posso limitare la mia ricerca al blocco [script](https://svelte.dev/docs#script):

<script src="https://gist.github.com/el3um4s/1103f41f3dbf6cccde09a908ac678b23.js"></script>

Uso un'espressione regex `/<script[\s\S]*?>[\s\S]*?<\/script>/gi` in [string.match(regex)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) per ottenere solo una parte del codice e ottenere una stringa di testo.

Uso questo risultato per cercare tutte le variabili `let` esportate dal componente e salvarle in un array. L'espressione regex che uso è `/export let [\s\S]*?;/gi`:

<script src="https://gist.github.com/el3um4s/ee611ba2011e24cb037d1bf4f3b15c89.js"></script>

### Ricavo le proprietà dei props

Adesso posso iniziare a cercare i nomi dei props, sempre usando una regex (`/(?<=let )(.*?)(?=\s|;|=|:)/`):

<script src="https://gist.github.com/el3um4s/01dd17a385c1ea77241fb7e1079cdc16.js"></script>

Il passo successivo è estrarre i tipi delle variabili. In questo caso la regex che uso è `/(?<=let [:]|[:])(.*?)(?=;|=)/`:

<script src="https://gist.github.com/el3um4s/e830fcf2f1b0abc4a6f30c73c13ae979.js"></script>

Ricavare il valore predefinito delle variabili è un po' più complesso. Non posso usare una espressione regex, ci sono troppi casi ambigui possibili. Posso però cavarmela con un trucco grazie a una scelta fatta all'inizio, quando ho salvato ogni variabile let come elemento di un array. In questo modo posso considerare come valore di default tutto quello che appare tra il simbolo uguale (`=`) e l'ultimo carattere della stringa (che dovrebbe essere il punto e virgola `;`).

<script src="https://gist.github.com/el3um4s/30dec60df01c35c82c6d6caae48e9576.js"></script>

L'unico caso ambiguo possibile è quando il valore predefinito è una stringa: gli apici non appartengono al valore e vanno quindi eliminati. Per farlo ho usato le funzioni `isStringType` e `getStringWithoutQuote`:

<script src="https://gist.github.com/el3um4s/11af711c847d40a2c64a8541157bc9a4.js"></script>

### Creo un oggetto

Adesso che ho tutti i vari pezzetti posso cominciare a mettere insieme il tutto. Mi conviene creare una funzione che ricavi `name`, `type` e `defaultValue` in un solo colpo:

<script src="https://gist.github.com/el3um4s/289938f3cb5ebe1b05995172a5f2c6ad.js"></script>

Quindi creo una funzione che legga il file, estragga i valori e li restituisca come oggetto:

<script src="https://gist.github.com/el3um4s/f65c76e6ec7e2d2bc0b9bc511adfe7ae.js"></script>

### Il componente Svelte

Bene, dopo aver estratto tutti i valori devo capire come visualizzarli. Per semplificare le cose sto creando un componente Svelte [el3um4s/svelte-component-info](https://github.com/el3um4s/svelte-component-info). Voglio ottenere qualcosa di simile a questo:

{% include picture img="demo.webp" ext="jpg" alt="" %}

La prima cosa da fare è creare un componente `SvelteInfo.svelte` e decidere quali props mi servono:

<script src="https://gist.github.com/el3um4s/01c06b7e3b8503fd8d1eec2cd0558c99.js"></script>

Mi serve il nome del componente, il nome del pacchetto (per inserire automaticamente il codice per scaricarlo da npm) e ovviamente tutte le informazioni che posso ricavare usando il codice che ho creato poco fa.

Usando queste informazioni posso creare automaticamente una sezione che spiega come importare il componente dentro un progetto:

<script src="https://gist.github.com/el3um4s/7ea7902312e10cc89f6846ae4a58efea.js"></script>

E come usare il componente stesso:

<script src="https://gist.github.com/el3um4s/16eac9d3923b5fe527e6bb1ec06b8a89.js"></script>

Posso anche creare automaticamente una tabella con tutte le informazioni necessarie sui props:

<script src="https://gist.github.com/el3um4s/4e4c619d53aeb9e2bee03e4125cfff79.js"></script>

### Usare il tutto

Adesso che ho tutti i vari pezzi posso metterli assieme per semplificare la creazione della documentazione di un componente. Parto da componente che ho già creato e inizio con installare quello che mi serve:

```bash
npm i @el3um4s/svelte-get-component-info @el3um4s/svelte-component-info
```

Creo quindi un file per gestire la creazione del file `infoSvelteComponents.json` con le informazioni:

<script src="https://gist.github.com/el3um4s/a05fe133e2ee88f30cd8aa846f711f37.js"></script>

Aggiorno quindi il file `package.json` aggiungendo alcuni script:

<script src="https://gist.github.com/el3um4s/7b33cdc9eacdc45c4687baacbd26721b.js"></script>

Modifico la pagina con la documentazione componente importando `InfoSvelte.svelte` e il file json. Aggiungo poi il componente:

<script src="https://gist.github.com/el3um4s/00a8a1d9462d7da90b51dff525777020.js"></script>

E poi... niente, è tutto qui. Basta importare il componente e il file JSON e nient'altro. Da adesso in avanti ogni volta che creo la documentazione del componente usando `npm run build` importerò automaticamente tutte le informazioni aggiornate.

Con questo è tutto, per il momento. I due repository sono ancora un work in progress. Conto di aggiornarli ancora nei prossimi giorni ma per il momento ci tenevo a mettere in ordine i vari passaggi fatti fino a qui.
