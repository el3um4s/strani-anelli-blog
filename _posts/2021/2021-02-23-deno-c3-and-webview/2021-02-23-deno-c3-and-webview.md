---
title: "Deno, C3 & WebView"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-02-23 18:00"
categories:
  - Construct 3
  - TypeScript
  - JavaScript
  - Deno
tags:
  - Construct 3
  - JavaScript
  - TypeScript
  - Deno
---

Nelle ultime due settimane ho sperimentato con [Deno](https://deno.land), [Construct 3](https://www.construct.net) e [Microsoft Edge WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/). Sono tornato a un mio vecchio, vecchissimo progetto e ho fatto alcuni passi in avanti grazie alla combinazione di queste 3 tecnologie. Come al solito, ho caricato [il progetto su GitHub](https://github.com/el3um4s/DenoC3Webview2).

Oggi voglio riportare alcuni appunti su come far comunicare questi tre strumenti. Il progetto di esempio fa una sola cosa: esegue delle operazioni a caso. Non ha nessuna utilità pratica se non mostrare come creare un server locale (con Deno), aprire un'applicazione Windows (via WebView2) e usare C3 per ottenere il risultato.

Comincio dalla parte "facile": il progetto in Construct 3.

{% include picture img="c3-project.webp" ext="jpg" alt="" %}

Rispetto ai miei ultimi template la struttura è molto più lineare e semplice:

- 1 layout
- 1 event sheet
- 4 file js, di cui 2 sono gli standard [`main.js`](https://github.com/el3um4s/DenoC3Webview2/blob/main/source/files/scripts/main.js) e [`importforevents.js`](https://github.com/el3um4s/DenoC3Webview2/blob/main/source/files/scripts/importforevents.js)


In compenso ho preferito inserire direttamente del codice JavaScript nell'event sheet

{% include picture img="code.webp" ext="jpg" alt="" %}

per mostrare esplicitamente la tecnica che ho usato. Ovviamente sarebbe più sensato fare un bel refractoring del codice ed eliminare il codice duplicato. Ma per il momento limitiamoci ad osservare come funziona:

```js
const responses = await fetch(`http://localhost:8081/addition/?a=1&b=10`);
const results = await responses.json();
const resultRounded = roundResult(results);

log("OperationResult", resultRounded);
log("ResultTestB", `${results.operation}(${results.a}; ${results.b}) = ${resultRounded}`);
```

Allora, tramite questo pezzetto di js interroghiamo il server per fargli eseguire l'operazione `1+10` e poi scriviamo il risultato nella casella di testo `ResultTestB`. Il comando `log` non è nativo di C3 ma è una semplice funzione inserita nel file [`utils.js`](https://github.com/el3um4s/DenoC3Webview2/blob/main/source/files/scripts/utils.js).

Nel file di esempio ([scaricabile dal repository su github](https://github.com/el3um4s/DenoC3Webview2/tree/main/source/c3p)) ci sono alcuni altri utilizzi dello stesso pattern. Uno, interessante, è inserito all'avvio del layout

```js
window.addEventListener('beforeunload', async (e) => {
	e.preventDefault();
	await fetch(`http://localhost:8081/close`);
});
```

A cosa serve? A chiudere automaticamente il server alla chiusura della finestra del browser. Ovviamente questo ha un senso se abbiamo intenzione di usare questa tecnica per un'applicazione da usare solo in locale. E a proposito di questo, passiamo alla seconda tecnologia, **Microsoft Edge WebView2**, e nella fattispecie il wrapper di Construct (quello presentato [in questo forum](https://www.construct.net/en/forum/construct-3/general-discussion-7/experimental-new-lightweight-158536)).

Non serve codice, basta scaricare il file presente nel forum, estrarlo e poi copiare nella cartella **www** il progetto C3, ovviamente dopo averlo esportato come **Web (HTML5)**. Poi si esegue il file **WebView2Wrapper.exe** e, voilà, ecco il nostro esempio funzionare su Windows senza dover passare per una nuova finestra del browser. Beh, funzionare è una parola grossa, perché se proviamo a cliccare uno qualsiasi dei pulsanti non succede niente. Per far avvenire la magia occorre prima avviare un server locale, configurarlo e capire come gestire le varie richieste provenienti da Construct. Ed è qui che ci viene in aiuto **Deno**.

Deno è un runtime per JavaScript e TypeScripe. Ha alcune caratteristiche molto interessati, e che mi fanno ben sperare per il futuro. Meglio, per la possibilità, in futuro, di poter sviluppare alcune mie vecchie idee. Ne riparlerò, prima o poi. Tralascio la parte dedicata all'installazione e alla presentazione delle sue caratteristiche, che tanto sono ben spiegate su [Deno.land](https://deno.land/).

Passiamo invece alla struttura del progetto.

{% include picture img="deno-project.webp" ext="jpg" alt="" %}

Nel repository ci sono varie cartelle, ma quella con il progetto vero e proprio si chiama `app`. Dentro troverete tre cartelle:

- controllers
- lib
- www

In più ci sono alcuni file:

- deps.ts
- mod.ts
- api.ts

**deps.ts** contiene l'elenco delle dipendenze esterne del progetto. Poiché è abbastanza semplice, ce ne basta solamente una:

```ts
export {
  Application,
  Context,
  helpers,
  Router,
} from "https://deno.land/x/oak/mod.ts";
```

Ovvero il middleware framework per server http [**oak**](https://deno.land/x/oak@v6.5.0).

**mod.ts** è il nostro punto d'ingresso per il programma e contiene il codice per lanciare il server

```ts
const app = new Application();
const port = 8081;

app.use((ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  return next();
});

app.listen({
  port: port,
});
```

per impostare il router:

```ts
app.use((ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  return next();
});

app.use(api.routes());
app.use(api.allowedMethods());
```

per gestire la chiusura del server dall'applicazione C3

```ts
const { signal } = controller;
app.listen({
  port: port,
  signal,
});
```

e infine per lanciare WebView

```ts
Deno.run({ cmd: ["./wv.exe"] });
```

Dopo aver impostato il server è il momento di passare alle API. E, indovina un po', sono codificate nel file **api.ts**:

```ts
import { Context, Router } from "./deps.ts";
import * as words from "./controllers/words.ts";
import * as calculator from "./controllers/calculator.ts";

export const controller: AbortController = new AbortController();
export const api: Router = new Router();

api.get("/close", (ctx: Context) => {
  controller.abort();
});

api.get("/", words.message);
api.get("/random-operation", calculator.randomOperation);
api.get("/calc/:operation/", calculator.calc);
api.get("/addition/", calculator.addition);
api.get("/subtraction/", calculator.subtraction);
api.get("/multiplication/", calculator.multiplication);
api.get("/division/", calculator.division);
api.get("/remainder/", calculator.remainder);
api.get("/exponent/", calculator.exponent);
```

Sostanzialmente imposto un controller `AbortController` per dire a Deno di chiudere il server quando viene interrogato l'indirizzo `http://localhost:8081/close`. Le API restanti richiamano alcuni funzioni presenti nei file **words.ts** e **calculator.ts**. Vediamo cosa succede quando interroghiamo l'indirizzo del primo esempio, `http://localhost:8081/addition/?a=1&b=10`.

```ts
export function addition(ctx: Context) {
  const results: Results = calculateFromContextWithOperation(ctx, "addition");
  ctx.response.body = results;
}
```

Per prima cosa viene lanciata la funzione `calculateFromContextWithOperation(ctx, operation)` che restituisce un risultato. Questo risultato viene quindi inviato alla pagina web dell'applicazione, ovvero al nostro progetto Construct 3. C3 riceve il risultato dell'operazione lo utilizza per mostrarlo a schermo.

Ma cosa fa `calculateFromContextWithOperation`?

```ts
export function calculateFromContextWithOperation(
  ctx: Context,
  operation: string,
): Results {
  const params: APIParams = helpers.getQuery(ctx, { mergeParams: true });
  const paramWithoutOperation: APIcalculator = sanitizeParams(params);
  const param = addOperation(operation, paramWithoutOperation);
  const results: Results = calculateFromAPIcalculator(param);
  return results;
}
```

Sostanzialmente prende i parametri passati attraverso la richiesta, cioè `?a=1&b=10`. In pratica estrae `a = 1` e `b = 10`. Poi attraverso la funzione `sanitizeParams(params)` esegue alcuni controlli. Infine `calculateFromAPIcalculator` si occupa dei conti veri e propri:

```ts
function calculateFromAPIcalculator(param: APIcalculator): Results {
  const results: Results = {
    results: "",
    ok: false,
    operation: param.operation,
    a: param.a,
    b: param.b,
};

  if (param.aPresent && param.bPresent && param.operationPresent) {
    const result: number = utils.calc({
      operation: param.operation,
      a: param.a,
      b: param.b,
    });
    results.results = `${result}`;
    results.ok = true;
  }

  return results;
}
```

Le interfacce usate sono definite in **interface.ts**

```ts
export interface APIParams {
  operation?: string;
  a?: string;
  b?: string;
  first?: string;
  second?: string;
}

export interface APIcalculator {
  operationPresent: boolean;
  operation: string;
  aPresent: boolean;
  a: string;
  bPresent: boolean;
  b: string;
}

export interface Results {
  results: string;
  ok: boolean;
  operation: string;
  a: string;
  b: string;
}
```

Bene, questa è il funzionamento, in sintesi, dell'intero progetto. Adesso si tratta solo di lanciarlo da riga di comando con il codice:

```cmd
deno run --allow-run --allow-read --allow-net mod.ts
```

Ma non è finita qui. Manca ancora un passaggio per ottenere un progetto completamente stand-alone. Possiamo scegliere due alternative, o compilare il progetto o scaricare le librerie esterne senza doverle richiamare da internet.

Per compilare il progetto occorre usare il comando [compile](https://deno.land/manual@v1.7.5/tools/compiler)

```cmd
deno compile --allow-run --allow-read --allow-net --unstable --output run.exe mod.ts
```

Questo ci permette di ottenere il file **run.exe**, che è tutto quello che ci serve per lanciare il programma. Come distribuirlo? Basta creare un archivio ZIP, e inserire dentro i file _run.exe_, il file _wv.exe_ (è il file WebView2Wrapper.exe rinominato), il file _WebView2Loader.dll_ e la cartella _www_:

{% include picture img="c3_and_deno.webp" ext="jpg" alt="" %}

Nel repository, nella [sezione Releases](https://github.com/el3um4s/DenoC3Webview2/releases) c'è un file ZIP di esempio.

Il secondo metodo richiede di scaricare tutti i file necessari e di dire a Deno di usare quelli. In Windows è utile usare un file bat (vedi [`run-deno-dir.bat`](https://github.com/el3um4s/DenoC3Webview2/blob/main/source/batch/run-deno-dir.bat)):

```bat
echo OFF
SET position=%~dp0%
ECHO %position%
echo Set DENO_DIR position
set DENO_DIR=%position%deno_dir
@deno.exe "info" %*
echo Version
@deno.exe "--version" %*
echo Launch server
@deno.exe "run" "--allow-run" "--allow-read" "--allow-net" "mod.ts" %*
```

In pratica eseguo una prima volta questo file per scaricare tutte le dipendenze nella cartella **deno_dir**. Poi zippo tutto il contenuto della cartella **app** e posso distribuire il programma.

{% include picture img="c3_and_deno_dir.webp" ext="jpg" alt="" %}

Però, ed è un però grande come una casa, l'applicazione potrà essere eseguita solamente da chi ha Deno installato nel proprio computer.

Per finire un confronto tra le dimensioni dei diversi modi di distribuire il nostro programma:

{% include picture img="size.webp" ext="jpg" alt="" %}

Il file più pesante è di circa 8 MB: decisamente meno dei quasi 100 MB richiesti da Node per lo stesso programma. Gli altri due file sono ancora più leggeri, rendendo ancora più interessante questo mix.

Ok, fine. Ricordo solo l'indirizzo del progetto e del mio Patreon:

- [il progetto su GitHub](https://github.com/el3um4s/DenoC3Webview2)
- [Patreon](https://www.patreon.com/el3um4s)
