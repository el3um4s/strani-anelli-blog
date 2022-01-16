---
title: "Statistiche di Medium con JavaScript e Svelte - Part 2"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Chris Liverani**](https://unsplash.com/@chrisliverani)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-01-14 15:00"
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

```js
function getListStories(postAmounts) {
  const result = postAmounts.map((p) => {
    return {
      id: p.post.id,
      title: p.post.title,
      amountMonth: p.amount,
      amountTot: p.totalAmountPaidToDate,
      homeCollectionId: p.post.homeCollectionId,
      wordCount: p.post.virtuals.wordCount,
      readingTime: p.post.virtuals.readingTime,
      firstPublishedAt: p.post.firstPublishedAt,
    };
  });
  return result;
}
```

C'è però un problema con questo modo di salvare `firstPublishedAt`: potrebbe creare delle complicazioni nel momento in cui voglio filtrare e ordinare i diversi post. Per evitare questo problema scompongo la data in più parti. Per farlo modifico `getDate()` aggiungendo il metodo [Date.prototype.getDate()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate):

```js
function getDate(periodStartedAt) {
  const date = new Date(parseInt(periodStartedAt));
  return {
    timestamp: date,
    year: date.getFullYear(),
    month: date.getMonth(),
    monthName: date.toLocaleString("default", { month: "short" }),
    day: date.getDate(),
  };
}
```

E di conseguenza correggo `getListStories()`:

```js
let listStories = [];

function getListStories(postAmounts) {
  const result = postAmounts.map((p) => {
    const firstPublishedAt = getDate(p.post.firstPublishedAt);
    return {
      id: p.post.id,
      title: p.post.title,
      amountMonth: p.amount,
      amountTot: p.totalAmountPaidToDate,
      homeCollectionId: p.post.homeCollectionId,
      wordCount: p.post.virtuals.wordCount,
      readingTime: p.post.virtuals.readingTime,
      firstPublishedAt: getDate(p.post.firstPublishedAt),
    };
  });
  return result;
}
```

Modifico il pulsante `Load dashboard.json` in modo da salvare il tutto nell'array `listStories`:

```svelte
  <button
    on:click={async () => {
      const stats = await loadDashboardJSON();
      monthlyAmounts = [...getMonthlyAmounts(stats)];
      listStories = [...getListStories(stats.payload.postAmounts)];
    }}>Load dashboard.json</button
  >
```

I dati mensili sono più semplici rispetto a quelle dei singoli articoli, anche limitandoci a questi 8 valori. Come mostrare a schermo in maniera ordinata tutto questo?

### Creo una tabella con CSS Grid

Tra le varie opzioni sul tavolo ho deciso di creare una tabella usando le [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout). All'inizio, durante la prima stesura di questo pezzo, mi sono dilungato a spiegare come fare. Però alla fine stava diventando un discorso molto lungo e in parte anche poco in tema. Ho creato però una guida con i miei appunti su come creare una tabella usando CSS Grid Layout. La si puù leggere qui:

- [How To Create Responsive Data Tables With CSS Grid](https://betterprogramming.pub/how-to-create-responsive-data-tables-with-css-grid-9e0a37394450)

Quindi, adesso ho un array con le varie statistiche delle mie storie. Mi serve un secondo array contente le informazioni riguardo alle colonne. Posso crearlo semplicemente a mano:

```js
const headersTable = [
  { key: "firstPublishedAt", title: "Date", type: "date", width: "12ch" },
  {
    key: "amountTot",
    title: "$ Tot",
    type: "cents",
    width: "10ch",
    align: "end",
  },
  {
    key: "amountMonth",
    title: "$ Month",
    type: "cents",
    width: "10ch",
    align: "end",
  },
  { key: "title", title: "Title", type: "text" },
  {
    key: "wordCount",
    title: "Words",
    type: "numeric",
    width: "6ch",
    align: "end",
  },
];
```

Aggiungo quindi il componente `Table` nella mia pagina:

```html
{#if listStories.length > 0}
<div class="list-stories">
  <table rows="{listStories}" headers="{headersTable}" />
</div>
{/if}
```

Sarebbe però comodo visualizzare il totale delle colonne. Posso farlo usando il props `totals`. Per prima cosa definisco una funzione che calcoli la somma dei vari valori:

```js
const calculateTotalsTable = (listStories, headersTable) => {
  const result = headersTable.map((header) => {
    let value = "";
    if (header.type === "numeric" || header.type === "cents") {
      value = calculateTotalKey(listStories, header.key);
    }
    return { ...header, value };
  });
  return result;
};

function calculateTotalKey(listStories, key) {
  return listStories.reduce((previous, current) => {
    return previous + current[key];
  }, 0);
}
```

Quindi modifico il file `App.svelte`:

```html
<script>
  $: totalsTable = [...calculateTotalsTable(listStories, headersTable)];
</script>

{#if listStories.length > 0}
<div class="list-stories">
  <table rows="{listStories}" headers="{headersTable}" totals="{totalsTable}" />
</div>
{/if}
```

Ed ecco la tabella con le statistiche dei vari articoli.

{% include picture img="table-01.webp" ext="jpg" alt="" %}

### Aggiungo le funzioni di ordinamento

Un'altra cosa utile è la possibilità di ordinare le storie in base alla data, al titolo, ai guadagni e al numero di parole. Per farlo uso un context menu e la variabile `ordersTable`;

```js
const ordersTable = [
  {
    key: "firstPublishedAt",
    functionOrderASC: (key, list) => [...orderDatesASC(key, list)],
    functionOrderDESC: (key, list) => [...orderDatesDESC(key, list)],
  },
  {
    key: "amountTot",
    functionOrderASC: (key, list) => [...orderNumbersASC(key, list)],
    functionOrderDESC: (key, list) => [...orderNumbersDESC(key, list)]
  },
  {
    key: "amountMonth",
    functionOrderASC: (key, list) => [...orderNumbersASC(key, list)],
    functionOrderDESC: (key, list) => [...orderNumbersDESC(key, list)]
  },
  {
    key: "title",
    functionOrderASC: (key: string, list: StoryAmountStats[]) => [..orderStringsASC(key, list)],
    functionOrderDESC: (key: string, list: StoryAmountStats[]) => [...orderStringsDESC(key, list)]
  },
  {
    key: "wordCount",
    functionOrderASC: (key, list) => [...orderNumbersASC(key, list)],
    functionOrderDESC: (key, list) => [...orderNumbersDESC(key, list)]
  },
];
```

Modifico la parte HTML

```html
<div class="list-stories">
  <table
    rows="{listStories}"
    headers="{headersTable}"
    totals="{totalsTable}"
    orders="{ordersTable}"
  />
</div>
```

E ottengo una lista simile a questa:

![table-css-grid-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-14-come-scaricare-le-statistiche-di-medium-part-2/table-css-grid-01.gif)

### Aggiungo un grafico a barre

La lista non mi è però sufficiente. Voglio aggiungere un qualcosa di grafico per avere una vista d'occhio migliore. Aggiungo quindi un grafico a barre nella mia tabella.

Sostanzialmente voglio usare lo spazio dedicato ai titolo degli articoli come area per disegnare i miei grafici a barre. Per prima cosa definisco quali colonne possono diventare la fonte del grafico:

```js
const chartsTable = ["amountTot", "amountMonth", "wordCount"];
```

Quindi aggiungo i props corrispondenti

```html
<table
  rows="{listStories}"
  headers="{headersTable}"
  totals="{totalsTable}"
  orders="{ordersTable}"
  chartsColumns="{chartsTable}"
  chartColumn="title"
  chartValue="amountMonth"
/>
```

E finalmente ottengo la lista con dei guadagni dei vari articoli:

![table-css-grid-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-14-come-scaricare-le-statistiche-di-medium-part-2/table-css-grid-02.gif)

### Facciamo una sintesi

Per quanto sia interessante e utile, quello che guardo ogni giorno è un dato di sintesi. Al momento compilo a mano, in excel, uno schema simile a questo:

{% include picture img="sintesi-01-excel.webp" ext="jpg" alt="" %}

Finché ho pochi articoli è tutto sommato semplice. O finché i mesi sono particolarmente bassi, come questo gennaio. Ma se continuerò a scrivere su Medium è prevedibile che la faccenda si complicherà. Per questo voglio rendere il più possibile automatico la raccolta e l'analisi delle statistiche di Medium che mi interessano.

Posso cominciare con il creare una versione semplificata di questa sintesi. La versione più semplice riguarda il mese in corso. Ma prima una precisazione.

Come ho già spiegato nel primo articolo di questa serie, sto usando TypeScript. O, meglio, finora ho usato solamente JavaScript ma da adesso in avanti le cose iniziano a farsi un po' più complicate. Quindi, per semplificarmi la vita, inizio a introdurre un po' di tipi. E il primo riguarda i dati che mi servono per creare la sintesi:

```ts
export interface MonthSynthesis {
  monthName: string;
  month: number;
  year: number;
  monthlyIncomeTotal: number;
  monthlyIncomeNewArticle: number;
  monthlyIncomeOldArticle: number;
  numberArticleTotal: number;
  numberArticleNewArticle: number;
  numberArticleOldArticle: number;
  monthsTopStory: number;
}
```

Quindi creo il componente. O, meglio, comincio con il crearne una versione molto semplificata:

```svelte
<script lang="ts">
  import type { MonthSynthesis } from "./Synthesis";
  export let monthSynthesis: MonthSynthesis;
</script>

<article>
  <div>Total Monthy Income: {monthSynthesis.monthlyIncomeTotal}</div>
  <div>
    New Article Earning (Active): {monthSynthesis.monthlyIncomeNewArticle}
  </div>
  <div>
    Old Article Earning (Passive): {monthSynthesis.monthlyIncomeOldArticle}
  </div>

  <div>Total Articles: {monthSynthesis.numberArticleTotal}</div>
  <div>
    # of New Articles Published: {monthSynthesis.numberArticleNewArticle}
  </div>
  <div>
    # of Old Articles Published: {monthSynthesis.numberArticleOldArticle}
  </div>

  <div>Month's top story: {monthSynthesis.monthsTopStory}</div>
</article>
```

Importo quindi il componente in `App.svelte`:

```html
<script lang="ts">
  import Synthesis from "./components/synthesis/Synthesis.svelte";
</script>

<div class="synthesis">
  <Synthesis {monthSynthesis} />
</div>
```

Ovviamente non ottengo nulla perché non ho ancora creato le funzioni per estrarre i dati che mi servono.

La cosa più semplice da calcolare è il numero di articoli pubblicati e il loro guadagno:

```ts
function getMonthlyIncomeTotal(listStories: StoryAmountStats[]): number {
  return listStories.reduce((sum, curr) => curr.amountMonth + sum, 0);
}

function getNumberArticleTotal(listStories: StoryAmountStats[]): number {
  return listStories.length;
}
```

È altrettanto rapido capire qual è la storia con più incassi nel mese:

```ts
function getMonthsTopStory(listStories: StoryAmountStats[]): number {
  const listValue = listStories.map((story) => story.amountMonth);
  return Math.max(...listValue);
}
```

Le cose si complicano un po' di più quando devo dividere i dati per le storie del mese in corso e quelle dei mesi precedenti.

Ci sono vari modi per farlo, uno furbo è usare un altro file json. Posso scaricare il file [stats.json](https://medium.com/me/stats?format=json&count=1000) e da lì estrarre la proprietà `firstPublishedAtBucket`. Ma non è quello che farò, non adesso. Più avanti userò questo nuovo file per ricavare altri dati: `views`, `reads`, `claps` e `fans`.

Oggi mi limito a usare quello che già ho. Quindi, come faccio a dividere i vari post per mese e anno di pubblicazione?

Quando ho creato l'interfaccia `StoryAmountStats` ho salvato anche la proprietà `firstPublishedAt` di tipo `CustomDateTime`:

```ts
interface StoryAmountStats {
  // ...
  firstPublishedAt: CustomDateTime;
}

interface CustomDateTime {
  timestamp: Date;
  year: number;
  month: number;
  monthName: string;
  day: number;
}
```

Bene, questo è tutto quello che mi serve per cominciare.

Come capisco in quale mese siamo? Posso calcolare la data del sistema con [Date.now()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now). Poi estraggo il numero del mese e dell'anno e lo uso come filtro.

```ts
function getCurrentMonth(): CustomDateTime {
  const date = Date.now();
  return getDate(date);
}

function getMonthData(obj: {
  listStories: StoryAmountStats[];
  month: number;
  year: number;
}): {
  income: number;
  articles: number;
} {
  const { listStories, month, year } = obj;
  const stories: StoryAmountStats[] = listStories.filter(
    (s) =>
      s.firstPublishedAt.month === month && s.firstPublishedAt.year === year
  );
  const income = getMonthlyIncomeTotal(stories);
  const articles = getNumberArticleTotal(stories);
  return { income, articles };
}
```

Per calcolare i dati degli articoli precedenti posso fare una sottrazione, oppure creare una funzione apposita. Penso che una funzione specifica sia più indicata, anche perché mi servirà più avanti. Quindi:

```ts
function getPreviousMonthData(obj: {
  listStories: StoryAmountStats[];
  month: number;
  year: number;
}): {
  income: number;
  articles: number;
} {
  const { listStories, month, year } = obj;
  const stories: StoryAmountStats[] = listStories.filter(
    (s) =>
      s.firstPublishedAt.year < year ||
      (s.firstPublishedAt.year === year && s.firstPublishedAt.month < month)
  );
  const income = getMonthlyIncomeTotal(stories);
  const articles = getNumberArticleTotal(stories);
  return { income, articles };
}
```

Adesso non mi resta che mettere il tutto assieme:

```ts
export const monthSynthesis = (
  listStories: StoryAmountStats[]
): MonthSynthesis => {
  const currentMonth = getCurrentMonth();
  const { monthName, month, year } = currentMonth;
  const currentMonthData = getMonthData({ listStories, month, year });
  const previousMonthsData = getPreviousMonthData({ listStories, month, year });
  return {
    monthName: monthName,
    month: month,
    year: year,
    monthlyIncomeTotal: getMonthlyIncomeTotal(listStories),
    monthlyIncomeNewArticle: currentMonthData.income,
    monthlyIncomeOldArticle: previousMonthsData.income,
    numberArticleTotal: getNumberArticleTotal(listStories),
    numberArticleNewArticle: currentMonthData.articles,
    numberArticleOldArticle: previousMonthsData.articles,
    monthsTopStory: getMonthsTopStory(listStories),
  };
};
```

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
