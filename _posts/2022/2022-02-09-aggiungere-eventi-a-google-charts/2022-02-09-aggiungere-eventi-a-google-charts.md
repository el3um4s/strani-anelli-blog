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

```ts
import type { Writable } from "svelte/store";
import { writable, get } from "svelte/store";
import type { PartnerProgram } from "../../Interfaces/MediumPartnerProgram";
```

Creo lo store e lo preparo per l'esportazione:

```ts
const partnerProgramStore: Writable<PartnerProgram> = writable();

export const partnerProgram = {
  subscribe: partnerProgramStore.subscribe,
  set: (p: PartnerProgram) => partnerProgramStore.set(p),
};
```

Raggruppo quindi tutti i vari metodi di cui ho già parlato in dei nuovi file e li importo:

```ts
import * as H from "./HelperPartnerProgram";
import * as U from "./Utility";
import * as ChartsMonthly from "./HelperMonthlyAmountsCharts";
import * as ChartsCurrentMonth from "./HelperCurrentMonthCharts";
import * as Stories from "./HelperSingleStoryData";
import { getCurrentMonthSynthesis } from "./HelperSynthesis";
```

Infine aggiungo i vari metodi allo store:

```ts
export const partnerProgram = {
  subscribe: partnerProgramStore.subscribe,
  set: (p: PartnerProgram) => partnerProgramStore.set(p),
  getCurrentMonthDate: () => U.getCurrentMonthDate(get(partnerProgramStore)),
  getMonthlyAmounts: () => H.getMonthlyAmounts(get(partnerProgramStore)),
  getListStories: () => H.getListStories(get(partnerProgramStore)),
  getStoryById: (id: string) =>
    Stories.getStoryById(get(partnerProgramStore), id),
  getCurrentMonthSynthesis: () =>
    getCurrentMonthSynthesis(get(partnerProgramStore)),
  getChartsData: {
    monthly: {
      earningPerMonth: () =>
        ChartsMonthly.earningPerMonth(get(partnerProgramStore)),
      earningPerStory: () =>
        ChartsMonthly.earningPerStory(get(partnerProgramStore)),
      treemapWordsAndEarning: () =>
        ChartsMonthly.treemapWordsAndEarning(get(partnerProgramStore)),
      scatterWordsAndEarning: () =>
        ChartsMonthly.scatterWordsAndEarning(get(partnerProgramStore)),
      wordPerDay: () => ChartsMonthly.wordPerDay(get(partnerProgramStore)),
    },
    currentMonth: {
      earningPerMonthPub: () =>
        ChartsCurrentMonth.earningPerMonthPub(get(partnerProgramStore)),
      earningPerMonthStory: () =>
        ChartsCurrentMonth.earningPerMonthStory(get(partnerProgramStore)),
    },
  },
};
```

Dopo aver inglobato i vari metodi in `partnerProgram` posso richiamarli direttamente dai vari componenti.

Per esempio posso ricavare la lista degli articoli del mese scrivendo semplicemente:

```ts
import { partnerProgram } from "./StorePartnerProgram";
const listStories = partnerProgram.getListStories();
```

### Controllo lo zoom del grafico scatter plot

Dopo aver ripulito un po' il codice posso cominciare a ragionare su come migliorare i vari grafici. La prima cosa che mi serve è qualcosa per vedere più in dettaglio il rapporto tra lunghezza dei vari post e la loro resa. Penso che la soluzione migliore possa essere aggiungere due slider, uno orizzontale, l'altro verticale.

![charts-events-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-02-09-aggiungere-eventi-a-google-charts/charts-events-02.gif)

La prima cosa è capire come creare i due slider. Possiamo divertirci a crearli da zero oppure affidarci a qualcosa di già pronto. Per il momento ho scelto la strada semplice. In Internet si possono trovare diversi componenti interessanti. Ho deciso di usare [Range Slider](https://github.com/simeydotme/svelte-range-slider-pips) di [Simon Goellner](https://github.com/simeydotme).

Installo il componente nel mio progetto usando:

```bash
npm install svelte-range-slider-pips --save-dev
```

Quindi importo il componente in `GoogleChartScatter.svelte`:

```ts
import RangeSlider from "svelte-range-slider-pips";
```

L'utilizzo è abbastanza banale:

```svelte
<RangeSlider
  values = [...]
  min = 0
  max = 100
  range
  float
/>
```

Ci sono solamente alcuni punti da comprendere. Devo stabilire qual è il range entro cui scegliere i numeri. Conviene calcolarli subito in modo da poter tornare alla visualizzazione originale in un secondo momento:

```ts
const dataRange = {
  hAxis: {
    min: 0,
    max: Math.floor(
      Math.max(
        ...data.map((d, i) => (i > 0 && typeof d[0] == "number" ? d[0] : null))
      ) * 1.1
    ),
  },
  vAxis: {
    min: 0,
    max: Math.floor(
      Math.max(
        ...data.map((d, i) => (i > 0 && typeof d[1] == "number" ? d[1] : null))
      ) * 1.1
    ),
  },
};
```

Il secondo punto riguarda come intercettare i due input. Per farlo creo un array con soli due elementi. Il primo indica il valore minore, il secondo il maggiore:

```ts
let hRange = [dataRange.hAxis.min, dataRange.hAxis.max];
let vRange = [dataRange.vAxis.min, dataRange.vAxis.max];
```

Poi non mi resta che unire i pezzi, usando la direttiva [bind:property](https://svelte.dev/docs#template-syntax-element-directives-bind-property) per legare i valori:

```svelte
<RangeSlider
  vertical
  bind:values={vRange}
  min={dataRange.vAxis.min}
  max={dataRange.vAxis.max}
  range
  float
/>

<RangeSlider
  bind:values={hRange}
  min={dataRange.hAxis.min}
  max={dataRange.hAxis.max}
  range
  float
/>
```

Questo per quanto riguarda gli slider. Devo modificare leggermente anche il grafico. O, meglio, le proprietà `hAxis` e `vAxis` legandole ai valori degli slider.

```svelte
<script lang="ts">
  $: hAxis = {
    title: axisX,
    viewWindow: { min: hRange[0], max: hRange[1] },
  };

  $: vAxis = {
    title: axisY,
    viewWindow: { min: vRange[0], max: vRange[1] },
  };
</script>

<google-chart
  class="chart"
  type="scatter"
  {data}
  options={{
    title,
    backgroundColor: "transparent",
    titleTextStyle: { fontSize: 14, color: "#737373" },
    legend: "none",
    hAxis,
    vAxis,
    colors: colors.length > 0 ? colors : undefined,
    tooltip: { isHtml: true },
  }}
/>
```

### Aggiungere un evento quando selezioniamo un valore nel grafico

Il secondo evento che mi interessa è poter vedere alcune informazioni aggiuntive quando seleziono un elemento in un grafico. Passo quindi al grafico `GoogleChartPie.svelte` e comincio a modificarlo per ottenere questo:

![charts-events-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-02-09-aggiungere-eventi-a-google-charts/charts-events-03.gif)

Per generare eventi all'interno di un componente Svelte uso [createEventDispatcher](https://svelte.dev/docs#run-time-svelte-createeventdispatcher):

```ts
import { createEventDispatcher } from "svelte";
import "@google-web-components/google-chart";

const dispatch = createEventDispatcher();
```

Posso creare un evento legato alla selezione di un elemento usando:

```svelte
<google-chart
  // ...
  on:google-chart-select={(e) => {
    const selection = e.detail.chart.getSelection();
    dispatch("select", {
      selection,
      row: selection[0]?.row,
      value: rows[selection[0]?.row],
    });
  }}
/>
```

Uso l'[evento select](https://developers.google.com/chart/interactive/docs/events#the-select-event) di Google Chart per recuperare i valori da passare fuori dal componente.

Prima di andare avanti un appunto sugli eventi di Google Charts. Ci sono 3 eventi che è possibile chiamare da (quasi) ogni grafico:

- `select`
- `error`
- `ready`

Se però vogliamo usare altri eventi li dobbiamo registrare. Per esempio posso voler intercettare l'evento `on mouse over`:

```svelte
<google-chart
  events={["onmouseover"]}
  on:google-chart-onmouseover
/>
```

Oppure l'evento `onmouseout`:

```svelte
<google-chart
  events={["onmouseover","onmouseout"]}
  on:google-chart-onmouseover
  on:google-chart-onmouseout={(e) => { dispatch("mouseout", e); }}
/>
```

### Mostro un'anteprima della storia

Quello che voglio ottenere è un metodo semplice e veloce per capire a quale post si riferisce un dato. Per farlo passo al grafico anche l'ID della storia:

```ts
export const earningPerStory = (mediumPartnerProgram: PartnerProgram) => {
  const listStories = getListStories(mediumPartnerProgram);
  const rows = listStories
    .sort((a, b) => b.amountTot - a.amountTot)
    .map((story) => {
      const title = story.title;
      const id = story.id;
      const amount = story.amountTot / 100;
      return [title, amount, id];
    });

  const cols = [
    { label: "Title", type: "string" },
    { label: "$", type: "number" },
    { label: "ID", type: "string" },
  ];

  return {
    cols,
    rows,
  };
};
```

Posso quindi modificare il componente nel file `MonthlyAmounts.svelte`

```svelte
  <GoogleChartPie
    cols={storyEarning.cols}
    rows={storyEarning.rows}
    title="Earning Per Story"
    sliceVisibilityThreshold={2.5 / 100}
    on:select={(e) => {
      const id = e.detail.value ? e.detail.value[2] : undefined;
      storySelected = id ? partnerProgram.getStoryById(id) : undefined;
    }}
  />
```

Per ricavare i dati del post a partire dal suo ID è sufficiente la funzione `getStoryById`:

```ts
export const getStoryById = (
  mediumPartnerProgram: PartnerProgram,
  id: string
) => {
  const list = mediumPartnerProgram.payload.postAmounts;
  return list.find((p) => p.post.id === id);
};
```

Per visualizzare l'anteprima ho invece creato un componente `CardStory.svelte`:

```svelte
<script type="ts">
  import { slide } from "svelte/transition";
  export let story;

  $: id = story.post.id;
  $: backgroundImage = `url(https://miro.medium.com/max/160/${story.post.virtuals.previewImage.imageId})`;
</script>

<section>
  {#key id}
    <div class="content" transition:slide>
      <div class="info">
        <div class="title">{story.post.title}</div>
        <div class="subtitle">{story.post.virtuals.subtitle}</div>
        <div class="link">
          <a href="https://medium.com/story/{story.post.id}" target="_blank"
            >Link: medium.com/story/{story.post.id}</a
          >
        </div>
      </div>
      <div class="previewImage" style:background-image={backgroundImage} />
    </div>
  {/key}
</section>
```

Posso usare questo componente nelle varie pagine passandogli semplicemente i dati della storia da mostrare:

```svelte
{#if storySelected}
  <div class="storySelected">
    <CardStory story={storySelected} />
  </div>
{/if}
```

Bene, questo è tutto per oggi. Ricordo che è possibile vedere il codice del progetto su GitHub.
