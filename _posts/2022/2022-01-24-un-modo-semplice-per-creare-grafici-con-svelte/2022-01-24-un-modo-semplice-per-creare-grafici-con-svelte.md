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
date: "2022-01-24 11:00"
categories:
  - Chart
  - Google Chart
  - Data Analysis
  - TailwindCSS
  - Svelte
tags:
  - Chart
  - Google Chart
  - Data Analysis
  - TailwindCSS
  - Svelte
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

```html
<google-chart data='[["Month", "Days"], ["Jan", 31]]'></google-chart>
```

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

```svelte
<script type="ts">
  import "@google-web-components/google-chart";
</script>
```

Poi definisco i props che mi servono. La [documentazione di Google](https://developers.google.com/chart/interactive/docs/gallery/columnchart) è ben fatta e permette di capire cosa può servire. Per il momento mi limito alle cose fondamentali:

- `data`: per i dati da visualizzare
- `options`: per configurare alcuni dettagli del grafico

Non mi interessano molte opzioni. Mi basta poter personalizzare il titolo e decidere il colore delle varie colonne. Di conseguenza i props diventano:

```svelte
<script type="ts">
  import "@google-web-components/google-chart";

  export let data: (String[] | (string | number)[])[] = [];
  export let title: String = "";
  export let colors: String[] = [];
</script>
```

I dati sono di un tipo abbastanza bizzarro. Sostanzialmente sono un matrice dove la prima riga indica il nome e il tipo delle colonne:

```ts
const cols = [
  { label: "Title", type: "string" },
  { label: "$", type: "number" },
];
```

Le righe successive invece contengono i dati effettivi:

```ts
const rows = [
  ["september", 1.0],
  ["october", 1.5],
  ["november", 1.25],
];
```

Aggiungo una variabile dedicata alla configurazione:

```ts
const options = {
  title,
  legend: "none",
  backgroundColor: "transparent",
  colors: colors.length > 0 ? colors : undefined,
  titleTextStyle: { fontSize: 14, color: "#737373" },
};
```

Poiché uso solamente una serie di dati la leggenda è inutile, quindi la imposto come `none`. Modifico anche il colore dello sfondo in modo da non staccare dal resto della pagina (quindi è `transparent`). Infine cambio la formattazione del titolo del grafico usando le proprietà CSS.

Il codice completo del componente è:

```svelte
<script type="ts">
  import "@google-web-components/google-chart";

  export let data: (String[] | (string | number)[])[] = [];
  export let title: String = "";
  export let colors: String[] = [];

  $: options = {
    title,
    legend: "none",
    backgroundColor: "transparent",
    colors: colors.length > 0 ? colors : undefined,
    titleTextStyle: { fontSize: 14, color: "#737373" },
  };
</script>

<google-chart {data} options={{ ...options }} />
```

Ma come lo posso usare effettivamente in una pagina HTML? Così:

```svelte
<script lang="ts">
  import GoogleChartColumn from "./GoogleChartColumn.svelte";
  import { getMonthlyAmounts, monthlyEarning } from "./MonthlyAmounts";

  const monthlyAmounts = getMonthlyAmounts(mediumPartnerProgram);
  const monthlyEarning = earningPerMonth(monthlyAmounts);
</script>

<GoogleChartColumn
  title="Monthly Earnings"
  data={monthlyEarning}
  colors={["#ea580c"]}
/>
```

Per ricavare i dati da inserire creo la funzione `earningPerMonth`:

```ts
const earningPerMonth = (
  monthly: PartnerProgram_Analysis_Month[]
): [string, string | number][] => {
  const data = monthly.map((m) => m.amount).reverse();
  const labels: string[] = monthly
    .map((m) => `${m.month.monthName} ${m.month.year.toString().substring(2)}`)
    .reverse();

  const column: [string, string] = ["Month", "$"];
  const rows: [string, number][] = labels.map((label, index) => [
    label,
    data[index] / 100,
  ]);
  return [column, ...rows];
};
```

Ovviamente questa funzione va modificata in base ai propri dati.

### Creare un grafico a torta

![google-charts-with-svelte-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-03.gif)

Capito il ragionamento è facile creare anche gli altri grafici. Ovviamente ognuno ha delle caratteristiche particolari. Per esempio il grafico a torta.

Creo il file `GoogleChartPie.svelte`

```svelte
<script lang="ts">
  import "@google-web-components/google-chart";

  export let cols: {
    label: string;
    type: string;
  }[] = [];
  export let rows: [string, number][] = [];
  export let title: String = "";
  export let sliceVisibilityThreshold: number = 0;
</script>

<google-chart
  type="pie"
  {cols}
  {rows}
  options={{
    title,
    backgroundColor: "transparent",
    titleTextStyle: { fontSize: 14, color: "#737373" },
    sliceVisibilityThreshold,
  }}
/>
```

Il grafico a torta richiede i dati divisi in due diversi props: `cols` e `rows`. Permette inoltre di passare un valore numerico (compreso tra 0 e 1) per decidere la larghezza minima delle fette della torta.

Per esempio, se imposto `sliceVisibilityThreshold = 0.03` potrò vedere solamente le categorie che sono almeno il 3% del totale. Tutte quelle che sono più piccole verranno raggruppate sotto `Other`.

La funzione JavaScript per ottenere i dati è simile a questa:

```ts
interface PieData {
  cols: { label: string; type: string }[];
  rows: [string, number][];
}

const earningPerStory = (
  listStories: PartnerProgram_Analysis_ListStories[]
): PieData => {
  const listValue: { title: string; amount: number }[] = [...listStories]
    .sort((a, b) => b.amountTot - a.amountTot)
    .map((story) => {
      const title = story.title;
      const amount = story.amountTot;
      return { title, amount };
    });

  const groupedValue = groupBy(listValue, (s) => s.title);

  let rows = [];
  for (const property in groupedValue) {
    const amount = groupedValue[property].reduce(
      (sum, current) => sum + current.amount,
      0
    );
    rows.push([property, amount / 100]);
  }

  const cols = [
    { label: "Title", type: "string" },
    { label: "$", type: "number" },
  ];
  return {
    cols,
    rows,
  };
};

function groupBy(xs, f) {
  return xs.reduce(
    (r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
    {}
  );
}
```

Adesso posso inserire il grafico nella pagina con:

```svelte
<script lang="ts">
  import GoogleChartPie from "./GoogleChartPie.svelte";

  const listStories = getListStoryAmountStats(mediumPartnerProgram);
  const storyEarning = earningPerStory(listStories);
</script>

<GoogleChartPie
  cols={storyEarning.cols}
  rows={storyEarning.rows}
  title="Earning Per Story"
  sliceVisibilityThreshold={2.5 / 100}
/>
```

Usando lo stesso codice ma cambiando i valori passati ai props posso creare diversi grafici nella stessa pagina:

{% include picture img="chart-pie.webp" ext="jpg" alt="" %}

### Creare un grafico treemap (mappa ad albero)

![google-charts-with-svelte-04.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-04.gif)

[Wikipedia](https://en.wikipedia.org/wiki/Treemapping) spiega bene cosa è una treemap:

```
Una treemap (mappa alberata o mappa ad albero) in visualizzazione delle informazioni è un metodo per mostrare dati gerarchici usando rettangoli innestati.
```

Penso che oramai siano chiari i passaggi da seguire. Creo il file `GoogleChartTreemap.svelte`:

```svelte
<script lang="ts">
  import "@google-web-components/google-chart";

  export let data: [String, String | null, Number | String, Number | String][] =
    [];
  export let title: String = "";
  export let maxDepth: Number = 1;
  export let maxPostDepth: Number = 0;
  export let minColor: String = "#dd0000";
  export let midColor: String = "#000000";
  export let maxColor: String = "#00dd00";
</script>

<google-chart
  type="treemap"
  {data}
  options={{
    title,
    backgroundColor: "transparent",
    titleTextStyle: { fontSize: 14, color: "#737373" },
    maxDepth,
    maxPostDepth,
    minColor,
    midColor,
    maxColor,
  }}
/>
```

I [prop specifici](https://developers.google.com/chart/interactive/docs/gallery/treemap) di questo grafico sono:

- `maxDepth`: The maximum number of node levels to show in the current view.
- `maxPostDepth`: How many levels of nodes beyond maxDepth to show in "hinted" fashion.
- `minColor`, `midColor` e `maxColor`

La funzione per estrarre e preparare i dati è qualcosa di simile a questo:

```ts
const treemapWordsAndEarning = (
  listStories: PartnerProgram_Analysis_ListStories[]
): [String, String, Number | String, Number | String][] => {
  const rows: [String, String, Number, Number][] = listStories.map((story) => {
    const title = `${story.title} (${story.firstPublishedAt.year} ${story.firstPublishedAt.monthName} ${story.firstPublishedAt.day})`;
    const amount = story.amountTot;
    const words = story.wordCount;
    const month = `${story.firstPublishedAt.monthName} ${story.firstPublishedAt.year}`;
    return [title, month, words, amount];
  });

  const listMonths: [String, String, Number, Number][] = [
    ...new Set(rows.map((row) => row[1])),
  ].map((m) => [m, m.slice(m.length - 4), 0, 0]);

  const listYears: [String, String, Number, Number][] = [
    ...new Set(listMonths.map((m) => m[1])),
  ].map((y) => [y, "Total", 0, 0]);

  return [
    ["Title", "Month", "Words", "$"],
    ["Total", null, 0, 0],
    ...listYears,
    ...listMonths,
    ...rows,
  ];
};
```

Mentre il codice HTML è

```svelte
<GoogleChartTreemap
  data={treemapWords}
  title="Words And Earning Per Story"
  maxPostDepth={3}
  minColor="#fed7aa"
  midColor="#f97316"
  maxColor="#9a3412"
/>
```

### Creare un grafico a dispersione

![google-charts-with-svelte-05.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-05.gif)

Il grafico a dispersione permette di vedere se c'è qualche correlazione tra due dati. In questo esempio ho provato a mettere in relazione la lunghezza dei diversi post (misurata con il numero di parole) e il ricavo degli stessi. Inoltre ho impostato un tooltip personalizzato quando passiamo con il mouse sopra i vari punti.

Il codice del componente `GoogleChartScatter.svelte` è simile ai precedenti:

```svelte
<script lang="ts">
  import "@google-web-components/google-chart";

  export let data: [
    Number | String,
    Number | String,
    String | { type: String; role: String }
  ][] = [];
  export let title: String = "";

  export let axisX: String = data[0][0].toString();
  export let axisY: String = data[0][1].toString();
  export let colors: String[] = [];
</script>

<google-chart
  type="scatter"
  {data}
  options={{
    title,
    backgroundColor: "transparent",
    titleTextStyle: { fontSize: 14, color: "#737373" },
    legend: "none",
    hAxis: { title: axisX },
    vAxis: { title: axisY },
    colors: colors.length > 0 ? colors : undefined,
    tooltip: { isHtml: true },
  }}
/>
```

Ci sono 2 `props` specifici per questo grafico:

- `axisY`: il titolo da mostrare sull'asse delle Y
- `axisX`: il titolo da mostrare sull'asse delle X

Aggiungo inoltre l'opzione `tooltip: { isHtml: true }`. A cosa serve? A poter personalizzare il tooltip dei vari punti usando HTML e CSS.

La funzione per ottenere i dati per il grafico è leggermente diversa dalle precedenti:

```ts
export const scatterWordsAndEarning = (
  listStories: PartnerProgram_Analysis_ListStories[]
): [
  Number | String,
  Number | String,
  String | { type: String; role: String; p: { html: boolean } }
][] => {
  const cols: [
    String,
    String,
    { type: String; role: String; p: { html: boolean } }
  ] = [
    "Words",
    "Dollars",
    { type: "string", role: "tooltip", p: { html: true } },
  ];
  const rows: [Number, Number, String][] = listStories.map((story) => [
    story.wordCount,
    story.amountTot / 100,
    `
    <div style="padding:4px;">
    <div>${
      story.title.length > 30 ? story.title.slice(0, 30) + "..." : story.title
    }</div>
    <div style="display:grid;grid-template-columns:8ch 8ch;gap:1px; margin:2px;">
      <div>words</div><div><strong>${story.wordCount}</strong></div>
      <div>dollars</div><div><strong>${(story.amountTot / 100).toFixed(
        2
      )}</strong></div>
    </div>
    </div>`,
  ]);
  return [cols, ...rows];
};
```

Ai vari array delle righe aggiungo una string contenente del codice HTML. Questo codice viene poi renderizzato dal componente e mostrato come se fosse un elemento HTML della pagina.

Il codice HTML da usare nella pagina è semplicemente:

```svelte
<GoogleChartScatter
  data={scatterWords}
  title="Words vs Dollars comparison"
  colors={["#ea580c"]}
/>
```

### Creare un grafico a calendario

![google-charts-with-svelte-06.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-06.gif)

Il quinto grafico che ho inserito è un grafico a calendario. Serve sostanzialmente per visualizzare i dati su un calendario. L'intensità del colore dei singoli giorni indica la quantità relativa al giorno. Creo che l'esempio classico sia quello mostrato nel profilo di GitHub:

{% include picture img="github-calendar.webp" ext="jpg" alt="" %}

Rispetto ai grafici precedenti questo richiede un po' di CSS e un piccolo trucco. Ma prima il codice base:

```svelte
<script lang="ts">
  import "@google-web-components/google-chart";

  export let cols: {
    id: string;
    type: string;
  }[] = [];
  export let rows: [Date, number][] = [];
  export let title: String = "";

  export let colorAxis: [String, String] = ["#f0f9ff", "#0369a1"];
</script>

<section>
  <google-chart
    type="calendar"
    {cols}
    {rows}
    options={{
      title: title,
      backgroundColor: "transparent",
      colorAxis: { colors: colorAxis },
    }}
  />
</section>
```

In questo caso mi serve un solo props aggiuntivo, `colorAxis`. È un array composto dai codici dei colori da usare nei vari giorni. Di default il valore più basso è rappresentato da un bianco. Dopo aver importato il componente nella pagina mi sono però accorto che non era praticamente distinguibile dallo sfondo. Ho quindi deciso di partire da un colore più forte:

```svelte
<GoogleChartCalendar
  cols={dayWithWords.cols}
  rows={dayWithWords.rows}
  title="Words Per Day"
  colorAxis={["#fdba74", "#9a3412"]}
/>
```

La funzione per preparare i dati è simile alle precedent, con ovviamente alcune piccole differenze:

```ts
interface CalendarData {
  cols: ColsCalendar[];
  rows: [Date, number][];
}
interface ColsCalendar {
  id: string;
  type: string;
}
export const writingDay = (
  listStories: PartnerProgram_Analysis_ListStories[]
): CalendarData => {
  const listValue: { date: Date; words: number }[] = listStories.map(
    (story) => {
      const { day, month, year } = story.firstPublishedAt;
      const date: Date = new Date(year, month, day);
      const words = story.wordCount;
      return { date, words };
    }
  );

  const groupedValue = groupBy(listValue, (s) => s.date);

  let rows = [];
  for (const property in groupedValue) {
    const words = groupedValue[property].reduce(
      (sum, current) => sum + current.words,
      0
    );
    rows.push([new Date(property), words]);
  }

  const cols = [
    { type: "date", id: "Date" },
    { type: "number", id: "$" },
  ];
  return {
    cols,
    rows,
  };
};

function groupBy(xs, f) {
  return xs.reduce(
    (r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
    {}
  );
}
```

Bene ma non del tutto. Resta un problema legato alle dimensioni del grafico. Non so come mai ma il componente è troppo corto rispetto alla lunghezza del calendario. Devo quindi forzare un po' le dimensioni usando una proprietà CSS:

```css
section {
  height: fit-content;
}
google-chart {
  width: 1000px;
}
```

Il secondo problema riguarda invece l'altezza. In questo caso devo calcolarla in base al numero di anni che voglio mostrare. Quindi per prima cosa mi serve capire quanti anni sono:

```ts
const listDates = rows
  .map((r) => r[0])
  .sort((a, b) => {
    return a.getTime() - b.getTime();
  });
const firstYear = listDates[0].getFullYear();
const lastYear = listDates[listDates.length - 1].getFullYear();
const years = lastYear - firstYear + 1;
```

Poi uso la direttiva [style:property](https://svelte.dev/docs#template-syntax-element-directives-style-property):

```svelte
<!-- ... -->
  <google-chart
    type="calendar"
    {cols}
    {rows}
    options={{
      title: title,
      backgroundColor: "transparent",
      colorAxis: { colors: colorAxis },
    }}
    style:height="{175 * years}px"
  />
<!-- ... -->
```

Unendo il tutto il componente diventa:

```svelte
<script lang="ts">
  import "@google-web-components/google-chart";

  export let cols: {
    id: string;
    type: string;
  }[] = [];
  export let rows: [Date, number][] = [];
  export let title: String = "";

  export let colorAxis: [String, String] = ["#f0f9ff", "#0369a1"];

  const listDates = rows
    .map((r) => r[0])
    .sort((a, b) => {
      return a.getTime() - b.getTime();
    });
  const firstYear = listDates[0].getFullYear();
  const lastYear = listDates[listDates.length - 1].getFullYear();
  const years = lastYear - firstYear + 1;
</script>

<section>
  <google-chart
    type="calendar"
    {cols}
    {rows}
    options={{
      title: title,
      backgroundColor: "transparent",
      colorAxis: { colors: colorAxis },
    }}
    style:height="{175 * years}px"
  />
</section>

<style lang="postcss">
  section {
    height: fit-content;
  }
  google-chart {
    width: 1000px;
  }
</style>
```

Bene, con questo è tutto. Ovviamente questo metodo non è perfetto. Lo trovo però più semplice rispetto ad altre implementazioni che ho provato. Il codice, come al solito, è disponibile nel repository su GitHub:

- [el3um4s/medium-stats](https://github.com/el3um4s/medium-stats)

Ovviamente è un work in progress, quindi ci sono ancora dei dettagli da rifinire e probabilmente nel tempo cambierò ancora qualcosa.

Invece, per quanto riguarda Svelte, ho creato una lista su Medium con i miei vari post su questo argomento:

- [Svelte & SvelteKit](https://el3um4s.medium.com/list/svelte-sveltekit-bf5be8834fbf)

E con questo è davvero tutto.
