---
title: "SQLite 3 in azione: come utilizzare il database relazionale direttamente dal browser con WebAssembly"
subtitle: ""
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2023-01-20 10:00"
categories:
  - js
  - ts
  - javascript
  - typescript
tags:
  - js
  - ts
  - javascript
  - typescript
---

Qualche mese fa è stata pubblicata una versione di SQLite 3 compilata per WebAssembly. Cosa significa? Significa poter usare nativamente SQLite 3 in un browser. In altre parole, abbiamo a nostra disposizione la potenza e la facilità d'uso di uno dei migliori database relazionali direttamente dal browser. Ho cominciato a sperimentare questa possibilità, e ho creato una pagina per testare le operazioni di base. In questo post riporterò i miei appunti sui passaggi fondamentali da seguire.

![test-sqlite.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2023/2023-01-20-js-wasm-sqlite3-01-italiano/test-sqlite.gif)

### SQLite 3

{% include picture img="cabinet-01.webp" ext="jpg" alt="little kawai cute office filing cabinet, beautiful light, soft colour scheme, manga style" %}

Ma prima di tutto, cos'è SQLite 3? SQlite è un database relazione, salvato in un file, leggero e gratis. A differenza di altri database, SQLite non richiede alcun server. Sotto questo aspetto ricorda molto MS Access. E sono proprio queste le due caratteristiche che mi stanno spingendo ad approfondire questa tecnologia:

- è gratis
- è open source
- può funzionare in locale

Questo permette di creare delle applicazioni in grado di funzionare completamente offline.

È possibile trovare tutta la documentazione, le informazioni e i download di SQLite 3 sul sito ufficiale: [sqlite.org](https://sqlite.org/index.html).

### WebAssembly

{% include picture img="image-01.webp" ext="jpg" alt="a Kawai cute little cartoon cat character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

Il problema qual è? Che finora non era possibile usare SQLite direttamente all'interno di una pagina WEB. O, meglio, era possibile ma solo tramite alcuni progetti indipendenti. Per risolvere questo problema (e, sospetto, anche per venire incontro ad alcune richieste di Google), è stata creata una versione di SQLite 3 compilata per WebAssembly.

Anche in questo caso è possibile trovare tutta la documentazione e le informazioni sul sito ufficiale: [sqlite-wasm](https://sqlite.org/wasm/doc/trunk/index.md).

### Come usare SQLite 3 in un browser

{% include picture img="image-02.webp" ext="jpg" alt="a Kawai cute little cartoon cat character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

Detto questo passiamo alla parte più interessante: come possiamo usare SQLite 3 in un browser?

Per prima cosa dobbiamo scaricare alcuni file dal sito. Cerchiamo il file [sqlite-wasm-XXXX.zip](https://sqlite.org/download.html) (dove `XXXX` è la versione di SQLite 3 che vogliamo usare) e lo scarichiamo. Dentro troviamo la cartella `jswasm` contente i file che ci servono:

- `sqlite3.js`
- `sqlite3.wasm`

Più altri file:

- `sqlite3-opfs-async-proxy.js`
- `sqlite3-worker1.js`
- `sqlite3-worker1-promiser.js`

Possiamo creare una cartella nel progetto e aggiungere il riferimento a questi file:

```html
<head>
  <!-- ... -->
  <script src="jswasm/sqlite3.js"></script>
  <!-- ... -->
</head>
```

È sufficiente importare una sola volta `sqlite3.js` per caricare `sqlite3.wasm`. Però prima di poter effettivamente usare SQLite 3 dobbiamo inizializzare la libreria. Creiamo una funzione che ci possa aiutare:

```js
const initSqlite3 = async () => {
  const sqlite3 = await self["sqlite3InitModule"]();
  self["sqlite3"] = sqlite3;
  return sqlite3;
};
```

In questo modo possiamo accadere a SQLite 3 tramite `self["sqlite3"]`, da qualsiasi parte del codice.

Possiamo verificare che tutto funzioni correttamente:

```js
initSqlite3().then((s) => {
  sqlite3 = s;
  console.log("sqlite3:", sqlite3);
  console.log("sqlite3", self["sqlite3"]);
  console.log("sqlite3 version", sqlite3.capi.sqlite3_libversion());
});
```

### Creare un database

{% include picture img="image-03.webp" ext="jpg" alt="a Kawai cute little cartoon dog character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

Ora che abbiamo inizializzato SQLite 3 possiamo creare un database. Per prima cosa creiamo una funzione che ci aiuti:

```js
export const createDatabase = (filename = ":memory:", flags = "c") =>
  new self["sqlite3"].oo1.DB({ filename, flags });
```

In questo caso usiamo il costruttore [`oo1.DB`](https://sqlite.org/wasm/doc/trunk/api-oo1.md#db-ctor). Vale la pena di riportare il significato delle flags:

- `c`: create if it does not exist, else fail if it does not exist. Implies the `w` flag.
- `w`: write. Implies `r`: a db cannot be write-only.
- `r`: read-only if neither `w` nor `c` are provided, else it is ignored.
- `t`: enable tracing of SQL executed on this database handle, sending it to `console.log()`.

Un'altra menzione merita il parametro `filename`. Ci sono alcune parole riservate:

- `:memory:`: create an in-memory database
- `""`: create a temporary database
- `:localStorage:`: create a database in the browser's local storage
- `:sessionStorage:`: create a database in the browser's session storage

Detto questo, per creare il database è sufficiente:

```js
const db = createDatabase("xyz.sqlite3", "ct");
console.log("db", db.filename); // xyz.sqlite3
```

### Creare una tabella

{% include picture img="image-04.webp" ext="jpg" alt="a Kawai cute little cartoon elephant character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

Un database vuoto non è molto utile. Passiamo quindi a creare una tabella usando il metodo [`exec`](https://sqlite.org/wasm/doc/trunk/api-oo1.md#db-exec):

```js
const createTable = (db, tableName) =>
  db.exec({
    sql: `CREATE TABLE IF NOT EXISTS "${tableName}"(a,b)`,
  });
```

Possiamo usare il metodo `exec` per eseguire più operazioni in una volta:

```js
db.exec(["create table t(a);", "insert into t(a) ", "values(10),(20),(30)"]);
```

### Inserire dati

{% include picture img="image-05.webp" ext="jpg" alt="a Kawai cute little cartoon elephant character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

Ovviamente dobbiamo inserire dei valori in una tabella. Anche in questo caso possiamo usare il metodo `exec`:

```js
const insertData = (db, tableName, data) =>
  db.exec({
    sql: `INSERT INTO "${tableName}" VALUES(?,?)`,
    bind: data,
  });
```

Usiamo una unzione per generare numeri casuali:

```js
const rand = (max) => Math.floor(Math.random() * max);
```

E creiamo un ciclo per inserire dei valori:

```js
const addFakeData = (tableName) => {
  let i = 0;
  for (i = 20; i <= 25; ++i) {
    insertData(db, tableName, [rand(100), rand(100)]);
  }
};
```

Ci sono vari metodi per aggiungere dati a una tabella. Possiamo anche provare altre opzioni:

```js
const addFakeData = (tableName) => {
  let i = 0;
  for (i = 20; i <= 25; ++i) {
    insertData(db, tableName, [rand(100), rand(100)]);
    db.exec({
      sql: `insert into "${tableName}"(a,b) values (?,?)`,
      bind: [rand(100), rand(100)],
    });
    db.exec({
      sql: `insert into "${tableName}"(a,b) values ($a,$b)`,
      bind: { $a: rand(100), $b: rand(100) },
    });
  }
};
```

### Leggere i dati di una tabella

{% include picture img="image-06.webp" ext="jpg" alt="a Kawai cute little cartoon elephant character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

Il passo successivo è capire come leggere i dati contenuti in una tabella. Anche in questo caso usiamo il metodo `exec`. Aggiungiamo due opzioni:

- `rowMode`: `array` o `object`, specifica il formato dei dati restituiti e passato alla funzione `callback`
- `callback`: una funzione che viene chiamata per ogni riga restituita dalla query sql

```js
const readData = (db, tableName, callback) =>
  db.exec({
    sql: `SELECT * FROM "${tableName}"`,
    rowMode: "array",
    callback,
  });
```

Ovvero, nel nostro caso:

```js
const getFakeData = (db, tableName) => {
  let result = [];
  db.exec({
    sql: `select a as aa, b as bb from "${tableName}" order by aa limit 10`,
    rowMode: "object",
    callback: function (row) {
      console.log("row ", ++this.counter, "=", JSON.stringify(row));
      result = [...result, row];
    }.bind({ counter: 0 }),
  });

  return result;
};
```

Possiamo anche semplificare il codice impostando `returnValue` uguale a `resultRows`:

```js
const getFakeData = (db, tableName) =>
  db.exec({
    sql: `select a as aa, b as bb from "${tableName}" order by aa limit 10`,
    rowMode: "object",
    returnValue: "resultRows",
  });
```

### Salvare il database

{% include picture img="image-06.webp" ext="jpg" alt="a Kawai cute little cartoon elephant character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

Infine l'ultimo problema che dobbiamo risolvere è capire come salvare il database SQLite sul proprio computer. Per farlo dobbiamo ricorrere alle [C-style API](https://sqlite.org/wasm/doc/trunk/api-c-style.md) e al metodo [sqlite3_js_db_export()](https://sqlite.org/wasm/doc/trunk/api-c-style.md#sqlite3_js_db_export).

```js
const byteArray = self["sqlite3"].capi.sqlite3_js_db_export(db.pointer);
```

Il metodo `sqlite3_js_db_export()` restituisce un `Uint8Array`. Possiamo usarlo per ottenere un `Blob`:

```js
const blob = new Blob([byteArray.buffer], {
  type: "application/x-sqlite3",
});
```

Per semplificare l'uso il codice possiamo usare una funzione:

```js
const downloadDB = (db) => {
  const byteArray = self["sqlite3"].capi.sqlite3_js_db_export(db.pointer);

  const blob = new Blob([byteArray.buffer], {
    type: "application/x-sqlite3",
  });
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.href = window.URL.createObjectURL(blob);
  a.download = db.filename.split("/").pop() || db.name;
  a.addEventListener("click", function () {
    setTimeout(function () {
      console.log("Exported (possibly auto-downloaded) database");
      window.URL.revokeObjectURL(a.href);
      a.remove();
    }, 500);
  });
  a.click();
};
```
