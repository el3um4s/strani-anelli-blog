---
title: "Come Creare una Tabella con CSS Grid"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-01-11 22:20"
categories:
  - Svelte
  - Components
  - Documentation
  - CSS
  - Tables
  - Tailwind
tags:
  - Svelte
  - Components
  - Documentation
  - CSS
  - Tables
  - Tailwind
---

In HTML le tabelle sono una cosa abbastanza complicata. Esistono dagli albori della rete e si portano dietro alcune problematiche non da poco. Sono ottime per mostrare pochi dati ma piuttosto complicate quando i dati aumentano. Per un mio recente progetto (relativo a [come usare le statistiche di Medium](https://javascript.plainenglish.io/how-to-get-medium-stats-with-javascript-and-svelte-part-1-a1d08b96799e)) mi sono dovuto ingegnare per trovare un modo. La soluzione che ho scelto prevede l'utilizzo di CSS e del [Grid Layout Module](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout). Riporto qui i miei passaggi e i miei ragionamenti.

Ma prima di cominciare un'immagine con il risultato che voglio ottenere:

![table-css-grid-00.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-00.gif)

### Premessa

Il primo passo è, ovviamente, cercare quello che già esiste. In rete ci sono alcuni articoli interessanti che vale la pena leggere:

- [Responsive data tables with CSS Grid](https://medium.com/evodeck/responsive-data-tables-with-css-grid-3c58ecf04723)
- [How to create responsive tables with pure CSS using Grid Layout Module](https://www.freecodecamp.org/news/https-medium-com-nakayama-shingo-creating-responsive-tables-with-pure-css-using-the-grid-layout-module-8e0ea8f03e83/)
- [Really Responsive Tables using CSS3 Flexbox](https://hashnode.com/post/really-responsive-tables-using-css3-flexbox-cijzbxd8n00pwvm53sl4l42cx)

Partendo da questo ho cominciato a ragionare su come creare la mia tabella.

Per prima cosa mi servono, ovviamente, i dati. Ho deciso di non usare dei dati inventati, per questo articolo, semplicemente perché il modo migliore per imparare qualcosa è risolvendo un problema reale. Il mio problema è: ho alcune statistiche riguardo ai miei guadagni su Medium. Come posso analizzarli in maniera ordinata?

In un prossimo articolo andrò nel dettaglio su come scaricare i dati. Per il momento mi basta sapere come sono organizzati. E ho deciso di organizzarli un array, `listStories`. Ogni elemento di questo array è un oggetto composto da queste proprietà:

```ts
interface StoryAmountStats {
  id: string;
  title: string;
  amountMonth: number;
  amountTot: number;
  homeCollectionId: string;
  wordCount: number;
  readingTime: number;
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

Non mi interessa mostrare ogni singola proprietà. E mi interessa avere un modo semplice per decidere quali visualizzare e l'ordine. Per farlo mi serve un altro array, questa volta composto da oggetti composti così:

```ts
interface Table_Labels {
  key: string;
  title: string;
  type: string;
  width?: string;
  align?: string;
}
```

Il senso è questo:

- `key` indica la proprietà da mostrare nella tabella
- `title` è il nome della colonna
- `type` indica il tipo di dato (numerico, data, string, boolean,...)
- `width` la larghezza della colonna. Se non è presente viene interpretato come `auto`
- `align` serve per allineare il testo della colonna

### Creo una tabella semplice

Il procedimento che seguo è basato su CSS ma per usare effettivamente il codice mi serve qualcosa per inserire automaticamente i vari dati nella tabella. Ognuno può usare il metodo che preferisce. Io ho deciso di usare [Svelte](https://svelte.dev/): mi permette di tenere in un unico file il codice JavaScript, la parte in HTML5 e gli stili della tabella. Inoltre per velocizzare la scrittura del CSS uso le classi di [Tailwind CSS](https://tailwindcss.com/).

Comincio con il creare i props per importare i dati e le etichette della tabella:

```html
<script lang="ts">
  import type { Table_Labels } from "./Table";

  export let rows = [];
  export let header: Table_Labels[] = [];
</script>
```

Scrivo quindi la parte HTML:

```svelte
<div class="table">
  {#each headers as header}
    <div class="table-header">{header.title}</div>
  {/each}

  {#each rows as row}
    {#each headers as header}
      <div>
        {row[header.key]}
      </div>
    {/each}
  {/each}
</div>
```

Ovviamente il risultato è terribile:

{% include picture img="table-01.webp" ext="jpg" alt="" %}

Devo aggiungere un po' di stili per rendere il tutto presentabile. Comincio con definire il tutto come una Grid CSS:

```css
.table {
  display: grid;
}
```

Poi metto in grassetto la prima riga, quella con i nomi delle varie colonne:

```css
.table > div.table-header {
  font-weight: 700;
}
```

Infine aggiungo una linea per dividere ogni riga della tabella:

```css
.table > div {
  border-bottom: 1px solid var(--text-color, theme("colors.gray.800"));
}
```

Il risultato è un po' più elegante ma non è per nulla utile:

{% include picture img="table-02.webp" ext="jpg" alt="" %}

Cosa devo fare? Devo usare la proprietà [grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns) per definire quante colonne ci devono essere.

Poco fa ho spiegato come creare il prop `headers`. Bene, il numero di colonne è semplicemente il numero di elementi dell'array.

```html
<script>
  const columnsNumber: headers.length;
  $: gridTemplate = `grid-template-columns: repeat(${columnsNumber}, 1fr);`;
</script>

<div class="table" style="{gridTemplate}">
  <!-- ... -->
</div>
```

Finalmente appare qualcosa di simile a una tabella:

{% include picture img="table-03.webp" ext="jpg" alt="" %}

C'è però una cosa che non mi piace: le colonne sono tutte della stessa dimensione, avrebbe più senso rimpicciolirne alcune e lasciare più grande quella con il titolo dell'articolo. Per farlo utilizzo la proprietà `width` di ogni `label`:

```ts
const getWidthColumns = (header: Table_Labels[]) => {
  const widths = header.map((h) => (h?.width ? h.width : "auto"));
  return widths.join(" ");
};

$: gridTemplate = `grid-template-columns: ${getWidthColumns(headers)};`;
```

E con questo appare una tabella un po' più bellina.

{% include picture img="table-04.webp" ext="jpg" alt="" %}

Restano però delle criticità. In primo luogo alcuni valori non appaiono, altri sono in un formato sbagliato. Mi conviene aggiungere una funzione per gestirli:

```ts
const convertToDollars = (cents: number) => cents / 100;
const convertToDate = (date: CustomDateTime) =>
  `${date.year} ${date.monthName} ${date.day}`;

const convert = (t: string, v: number | CustomDateTime | string) => {
  if (t === "cents" && typeof v === "number") {
    return convertToDollars(v);
  }
  if (t === "date" && typeof v === "object") {
    return convertToDate(v);
  }
  return v;
};
```

E quindi correggere la parte in HTML:

```svelte
<div class="table" style={gridTemplate}>
  {#each headers as header}
    <div class="table-header">{header.title}</div>
  {/each}

  {#each rows as row}
    {#each headers as header}
      <div>
        {convert(header.type, row[header.key])}
      </div>
    {/each}
  {/each}
</div>
```

Questo risolve il problema dei dati nel formato sbagliato:

{% include picture img="table-05.webp" ext="jpg" alt="" %}

In maniera simile posso anche correggere l'allineamento delle colonne:

```svelte
<script lang="ts">
  const getAlignItem = (header: Table_Labels) => {
    return header?.align ? `text-align: ${header.align};` : "";
  };
</script>

<div class="table" style={gridTemplate}>
  {#each headers as header}
    <div class="table-header" style={getAlignItem(header)}>{header.title}</div>
  {/each}

  {#each rows as row}
    {#each headers as header}
      <div style={getAlignItem(header)}>
        {convert(header.type, row[header.key])}
      </div>
    {/each}
  {/each}
</div>
```

### Mantenere l'intestazione visibile

Per tabelle con pochi dati va bene così. Ma c'è un problema quando cominciano a esserci diverse righe di dati. Scorrendo verso il basso sparisce l'intestazione delle colonne rendendo difficile la lettura. Per mantenere la prima riga fissa devo modificare la struttura della parte HTML e dello stile CSS. Comincio con l'aggiungere un tag `header` e un tag `section`:

```svelte
<article class="table">
  <header style={gridTemplate}>
    {#each headers as header}
      <div class="cell title" style={getAlignItem(header)}>
        {header.title}
      </div>
    {/each}
  </header>

  <section style={gridTemplate}>
    {#each rows as row}
      {#each headers as header}
        <div class="cell" style={getAlignItem(header)}>
          {convert(header.type, row[header.key])}
        </div>
      {/each}
    {/each}
  </section>
</article>
```

L'idea è di fissare un'altezza massima alla sezione con le righe dei dati e poi aggiungere una scrollbar laterale per scorrere i dati non inizialmente visibili. Per farlo devo prima cambiare la proprietà `display` di `article`:

```css
article {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  width: 100%;
}
```

`header` e `section` invece diventano `grid`:

```css
header,
section {
  display: grid;
}

section {
  overflow-y: auto;
}
```

Inoltre definisco che `section` possa avere una scrollbar verticale.

Per mantenere l'allineamento dell'ultima colonna mi conviene personalizzare la scrollbar. Per i dettagli consiglio di leggere [CSS Almanac - Scrollbar](https://css-tricks.com/almanac/properties/s/scrollbar/):

```css
::-webkit-scrollbar {
  width: 1rem;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(246, 107, 33, 0.5);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(234, 88, 12, 0.8);
}
```

Accorcio anche leggermente la larghezza di `header`:

```css
header {
  width: calc(100% - 1rem);
}
```

Il risultato di tutto questo è una tabella con la prima riga fissa in alto:

![table-css-grid-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-01.gif)

### Aggiungere una riga per i totali

Un'altra cosa che mi serve è una riga con il totale. Perché sopratutto quando aggiungerò un sistema di filtri è comodo vedere subito qual è il valore della selezione. Per farlo aggiungo un `footer` alla tabella:

```html
<footer style="{gridTemplate}">
  {#each totals as total}
  <div class="cell total" style="{getAlignItem(total)}">{total.value}</div>
  {/each}
</footer>

<style>
  footer {
    display: grid;
    border-top: 1px solid var(--text-color, theme("colors.gray.800"));
    border-bottom: 1px solid var(--text-color, theme("colors.gray.800"));
    width: calc(100% - 1rem);
  }
</style>
```

Lo so, non ho ancora definito `totals`. Devo però decidere dove e come calcolare i totali. Il modo più semplice è aggiungendo un terzo props e lasciare che non sia compito della tabella stessa. In questo modo posso riutilizzare più facilmente questo codice in altre parti e non lo lego troppo strettamente al problema particolare.

Definisco quindi un props di questo tipo:

```ts
interface Table_Totals {
  key: string;
  title: string;
  type: string;
  width?: string;
  align?: string;
  value: number | string;
}

export let totals: Table_Totals[] = [];
```

Correggo leggermente il codice HTML per formattare i valori:

```html
{#if totals.length > 0}
<footer style="{gridTemplate}">
  {#each totals as total}
  <div class="cell total" style="{getAlignItem(total)}">
    {convert(total.type, total.value)}
  </div>
  {/each}
</footer>
{/if}
```

Questo mi permette di ottenere qualcosa di simile a questo:

{% include picture img="table-06.webp" ext="jpg" alt="" %}

### Ordinare i dati

Una funzionalità utile è la possibilità di ordinare i dati a piacere. O, per lo meno è quello che mi piacerebbe ottenere.

Ci sono vari modi per arrivare a questo risultato. Posso aggiungere dei pulsanti fuori dalla tabella, oppure posso aggiungere un controllo basato sul mouse. Sarà per abitudine ma mi piacerebbe ordinare in maniera crescente o decrescente usando un context menu.

Magari ne parlerò in maniera più approfondita in un altro post, ma con Svelte è abbastanza facile creare un context menu. Per il momento mi limito a consigliare questo repl:

- [Svelte: Context Menu](https://svelte.dev/repl/3a33725c3adb4f57b46b597f9dade0c1?version=3.25.0)

Per quello che riguarda la tabella creo un componente molto semplice. Per prima cosa mi servono un paio di icone (`SortAscending` e `SortDescending`) da usare come pulsanti.

```html
<script lang="ts">
  import SortAscending from "./SortAscending.svelte";
  import SortDescending from "./SortDescending.svelte";
</script>

<button><SortDescending /></button>
<button><SortAscending /></button>
```

Poi un paio di props per gestire la posizione a schermo:

```html
<script lang="ts">
  export let x: number = 0;
  export let y: number = 0;
</script>

<section style="top: {y}px; left: {x}px;">
  <!--  -->
</section>
```

Ovviamente serve anche qualcosa per capire quando il menù deve essere visualizzato e quando no:

```html
<script lang="ts">
  export let show: boolean = false;
  const hide = () => {
    show = false;
  };
</script>
```

Uso [createEventDispatcher](https://svelte.dev/docs#run-time-svelte-createeventdispatcher) per impostare gli eventi che mi servono:

```html
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

{#if show}
  <section style="top: {y}px; left: {x}px;">
    <button
      on:click={() => {
        hide();
        dispatch("order-desc");
      }}><SortDescending /></button
    >
    <button
      on:click={() => {
        hide();
        dispatch("order-asc");
      }}><SortAscending /></button
    >
  </section>
{/if}
```

Poi aggiungo gli eventi necessari per nascondere il menù contestuale quando clicchiamo su qualche altro elemento della pagina:

```html
<svelte:body on:click="{hide}" on:wheel="{hide}" />
```

Infine aggiungo qualche stile CSS:

```css
section {
  position: absolute;
  display: grid;
  border: 1px solid #0003;
  box-shadow: 2px 2px 5px 0px #0002;
  background: white;
  padding: 4px;
}
```

Mettendo tutto assieme diventa:

```html
<script lang="ts">
  import SortAscending from "./SortAscending.svelte";
  import SortDescending from "./SortDescending.svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let x: number = 0;
  export let y: number = 0;
  export let show: boolean = false;

  const hide = () => {
    show = false;
  };
</script>

{#if show}
  <section style="top: {y}px; left: {x}px;">
    <button
      on:click={() => {
        hide();
        dispatch("order-desc");
      }}><SortDescending /></button
    >
    <button
      on:click={() => {
        hide();
        dispatch("order-asc");
      }}><SortAscending /></button
    >
  </section>
{/if}

<svelte:body on:click={hide} on:wheel={hide} />

<style lang="postcss">
  section {
    position: absolute;
    display: grid;
    border: 1px solid #0003;
    box-shadow: 2px 2px 5px 0px #0002;
    background: white;
    padding: 4px;
  }
</style>
```

Adesso non resta che inserirlo nella tabella. Ho deciso di attivare il context menu ogni volta che si clicca su una cella, non solamente nelle intestazioni di colonna:

```html
<script lang="ts">
  import TableContextMenu from "../contextMenu/TableContextMenu.svelte";

  let showContextMenu = false;
  let posContextMenu = { x: 0, y: 0 };

  async function onRightClick(header, event) {
    if (showContextMenu) {
      showContextMenu = false;
      await new Promise((res) => setTimeout(res, 10));
    }
    posContextMenu = { x: event.pageX, y: event.pageY };
    showContextMenu = true;
  }
</script>

<TableContextMenu show={showContextMenu} {...posContextMenu} />

<!--  -->
<div
  class="cell title"
  style={getAlignItem(header)}
  on:contextmenu|preventDefault={(event) => {
    onRightClick(header, event);
  }}
>
  {header.title}
</div>
<!--  -->
```

È un context menu abbastanza minimale ma per il momento è sufficiente:

![table-css-grid-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-02.gif)

Se clicco sulle icone non succede nulla. Ovviamente, direi, perché non ho ancora collegato alcuna funzione ai due comandi. Per farlo devo tornare sulla tabella e aggiungere un altro prop:

```ts
export let orders: Table_Orders[] = [];

interface Table_Orders {
  key: string;
  functionOrderASC: Function;
  functionOrderDESC: Function;
}
```

Mi servono anche due funzioni per ordinare in maniera ascendente e discendente i valori:

```ts
function orderAsc() {
  rows = [
    ...getFunctions(cellData.key, orders).functionOrderASC(cellData.key, rows),
  ];
}

function orderDesc() {
  rows = [
    ...getFunctions(cellData.key, orders).functionOrderDESC(cellData.key, rows),
  ];
}

function getFunctions(key: string, orders: Table_Orders[]): Table_Orders {
  const index = orders.findIndex((o) => o.key === key);
  return orders[index];
}
```

Infine aggiorno il codice HTML

```html
<TableContextMenu
  show="{showContextMenu}"
  {...posContextMenu}
  on:order-asc="{orderAsc}"
  on:order-desc="{orderDesc}"
/>
```

Adesso posso ordinare le varie colonne:

![table-css-grid-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-03.gif)

### Aggiungere un po' di colore

Per quanto possa funzionare resta un problema. Non è visibile in maniera chiara quale colonna abbiamo selezionato, o su quale riga è posizionato il mouse. Per risolvere il problema posso ricorrere a qualche riga di CSS.

Cominciamo dalle righe. Penso il modo più rapido è di aggiungere un elemento per che contenga tutti gli elementi della riga:

```html
<section>
  {#each rows as row}
    <div class="row" style={gridTemplate}>
      {#each headers as header}
        <div
          class="cell"
          style={getAlignItem(header)}
          on:contextmenu|preventDefault={(event) => {
            onRightClick(header, event);
          }}
        >
          {convert(header.type, row[header.key])}
        </div>
      {/each}
    </div>
  {/each}
</section>
```

Sistemo gli stili per mantenere lo stesso formato:

```css
section {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.row {
  display: grid;
}
```

E poi ovviamente aggiungo un effetto legato al passaggio del mouse:

```css
.row:hover {
  background-color: theme("colors.orange.100");
}
```

![table-css-grid-04.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-04.gif)

Per quanto riguarda le colonne, invece, uso la variabile `cellData` per gestire gli stili. Innanzitutto mi assicuro di evitare stili indesiderati quando il context menu non è visibile:

```ts
$: cellData = !showContextMenu ? null : cellData;
```

Poi aggiungo una direttiva [class:name](https://svelte.dev/docs#template-syntax-element-directives-class-name)

```html
<div
  class="cell"
  class:column-order={cellData?.key === header.key} >
  Value
</div>
```

E aggiungo lo stile che voglio:

```css
.cell {
  @apply pt-2 pb-2 pr-1 pl-1;
  border: 2px solid transparent;
  box-sizing: content-box;
}

.column-order {
  border-left: 2px dotted theme("colors.orange.300");
  border-right: 2px dotted theme("colors.orange.300");
  background-color: theme("colors.orange.100");
}
```

Questo mi permette di rende un po' più comprensibili gli effetti del menu contestuale:

![table-css-grid-05.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-05.gif)

### Aggiungere un grafico

Numeri e parole vanno bene ma c'è un'altro aspetto che mi interessa: la possibilità di rappresentare graficamente alcuni valori tramite il grafico stesso. Penso sia abbastanza semplice aggiungere un grafico a barre, magari usando lo spazio presente nella cella con il titolo dei vari post.

Comincio con l'impostare un paio di prop:

```ts
export let chartColumn: string = "";
export let chartValue: string = "";
```

Voglio colorare le righe in maniera proporzionale al valore indicato. Per riuscirci mi serve il valore massimo:

```ts
$: chartListValues = [
  ...rows.map((row) => {
    return row[chartValue];
  }),
];
$: chartMaxValue = Math.max(...chartListValues);
```

Poi una funzione per definire lo stile:

```ts
function chartStyle(condition, value) {
  if (!condition) {
    return "";
  }
  const left = Math.round((value / chartMaxValue) * 100);
  const result = `background:linear-gradient(to right,#fdba74 ${left}%, transparent ${left}%)`;
  return result;
}
```

Infine modifico il codice HTML delle celle:

```html
<div
  class="chart-bar"
  style={chartStyle(chartColumn === header.key, row[chartValue])}
>
  {convert(header.type, row[header.key])}
</div>
```

Ottengo un risultato simile a questo:

![table-css-grid-06.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-06.gif)

### Scegliere i dati da mostrare

Voglio però rendere personalizzabile la scelta della colonna da usare come fonte del grafico. Per farlo modifico il context menu aggiungendo un altro pulsante:

```html
<script lang="ts">
  export let canChart: boolean = false;
</script>

{#if canChart}
<button
  on:click={() => {
    hide();
    dispatch("chart-this");
  }}><ChartBar /></button
>
{/if}
```

Devo usare qualcosa per segnalare quando mostrare il pulsante perché non tutti i dati posso essere rappresentati in forma grafica. Per esempio le date, o i testi.

Aggiungo quindi una variabile `chartsColumns` con l'elenco delle colonne e la passo al menu contestuale

```svelte
<TableContextMenu
  show={showContextMenu}
  {...posContextMenu}
  on:order-asc={orderAsc}
  on:order-desc={orderDesc}
  on:hide={() => {
    showContextMenu = false;
  }}
  canChart={chartsColumns.includes(cellData?.key)}
/>
```

Poi aggiungo una funzione per selezionare effettivamente i dati:

```svelte
<script lang="ts">
  const chartThis = () => {
    chartValue = cellData.key;
  };
</script>

<TableContextMenu
  show={showContextMenu}
  {...posContextMenu}
  on:order-asc={orderAsc}
  on:order-desc={orderDesc}
  on:hide={() => {
    showContextMenu = false;
  }}
  canChart={chartsColumns.includes(cellData?.key)}
  on:chart-this={chartThis}
/>
```

C'è però un problema di interpretazione: come faccio a sapere quale dato sto visualizzando? Ci possono essere varie strade, per il momento credo sia sufficiente evidenziare la colonna, magari usando un font in grassetto.

```html
<div
  class="cell"
  class:data-charted={chartValue === header.key}
>
  <!--  -->
</div>

<style>
.data-charted {
  font-weight: 700;
}
</style>
```

![table-css-grid-07.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-07.gif)

### Aggiungere i numeri alle righe

Resta un ultimo dettaglio: i numeri delle righe. Basta semplicemente aggiungere un indice al ciclo `#each` di Svelte:

```svelte
<!--  -->
{#each rows as row, index (row.id)}
  <div class="row" style={gridTemplate}>
    <div class="cell"> {index + 1} </div>
<!--  -->
```

Poi modifico la variabile `gridTemplate` per creare la colonna corrispondente:

```js
$: gridTemplate = `grid-template-columns: 4ch ${getWidthColumns(headers)};`;
```

Bastano poche righe di codice per ottenere questo:

![table-css-grid-08.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-08.gif)

### Animare la tabella

Per finire posso aggiungere una animazione per rendere evidente quando ordiniamo la tabella. Per farlo uso la direttiva [animate:fn](https://svelte.dev/docs#template-syntax-element-directives-animate-fn):

```svelte
<script>
  import { flip } from "svelte/animate";
  import { sineOut } from "svelte/easing";
</script>

<!-- -->
<section>
  {#each rows as row, index (row.id)}
    <div
      class="row"
      style={gridTemplate}
      animate:flip={{ duration: 1000, easing: sineOut }}
    >
<!--  -->
```

In questo modo rendo visibile l'operazione di ordine:

![table-css-grid-09.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-09.gif)

Bene, direi che per il momento è tutto. Devo ancora ragionare sul se e come gestire filtri e raggruppamenti. Magari ne parlerò in futuro.

Per quanto riguarda il codice, invece, il repository su cui sto lavorando è [el3um4s/medium-stats](https://github.com/el3um4s/medium-stats). Si tratta di un work in progress, come facilmente intuibile, e il codice è ancora abbastanza sporco. Però può essere utile per vedere l'utilizzo pratico delle varie tecniche che ho usato.

Infine, questi sono gli altri miei articoli legati a Svelte e SvelteKit:

- [Svelte & SvelteKit](https://el3um4s.medium.com/list/svelte-sveltekit-bf5be8834fbf)
