---
title: "SQLite 3 in azione: come aprire un DataBase Locale"
subtitle: ""
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2023-01-24 16:00"
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

Continuo con la mia esplorazione di SQLite 3 per browser. Ovvero la versione JavaScript che permette di usare il codice compilato in WebAssembly. Qualche giorno fa ho pubblicato i miei appunti su come creare un database, aggiungere tabelle e dati, e come estrarre dati da una tabella. Oggi riporto i miei appunti su come leggere un database salvato in locale, come ricavare l'elenco delle tabelle presenti e, infine, come capire quali sono le colonne di una tabella.

![test-sqlite.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2023/2023-01-24-js-wasm-sqlite3-02-italiano/test-sqlite-2.gif)

### Come aprire un database

{% include picture img="image-01.webp" ext="jpg" alt="a Kawai cute little cartoon employee character, database, 9:5, beautiful light, soft colour scheme, watercolor, happy" %}

Per aprire un database mi serve un modo per passarlo alla pagina web. Il modo più semplice è farlo utilizzando un elemento `input` con `type="file"`.

```html
<input type="file" bind:files />
```

In questo modo, quando l'utente seleziona un file, il suo contenuto viene salvato in una variabile `files` che è un array di `File` (vedi [File](https://developer.mozilla.org/en-US/docs/Web/API/File)). Il primo elemento di questo array è il file selezionato.

```js
$: if (files) {
  const file = files[0];
  console.log(file.name, file.size);
}
```

Però mi serve una funzione per leggere il contenuto del file. Creo una funzione specifica, `readDatabase`:

```js
const readDatabase = (file) => {
    const r = new FileReader();
    r.addEventListener("load", function () {
      const arrayBuffer = this.result as ArrayBuffer;
      let bytes = new Uint8Array(arrayBuffer);
      const p = sqlite3.wasm.allocFromTypedArray(bytes);
      const db = new sqlite3.oo1.DB();
      let rc = sqlite3.capi.sqlite3_deserialize(
        db.pointer,
        "main",
        p,
        bytes.length,
        bytes.length,
        0
      );
      const dbName = file.name;
      return db;
    });
    r.readAsArrayBuffer(file);
  };
```

Andando a scomporre il codice, mi serve un evento che intercetti il file e lo legga come fosse un ArrayBuffer:

```js
const readAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.addEventListener("load", () => resolve(r.result as ArrayBuffer));
    r.addEventListener("error", reject);
    r.readAsArrayBuffer(file);
  });
};
```

Dopo che ho letto il file lo converto in un array di byte:

```js
const arrayBufferToBytes = (arrayBuffer) => {
  return new Uint8Array(arrayBuffer);
};
```

In questo modo posso usare il metodo [sqlite3_deserialize](https://sqlite.org/wasm/doc/trunk/api-c-style.md#sqlite3_deserialize)

```js
const deserialize = (db, bytes) => {
  const p = sqlite3.wasm.allocFromTypedArray(bytes);
  let rc = sqlite3.capi.sqlite3_deserialize(
    db.pointer,
    "main",
    p,
    bytes.length,
    bytes.length,
    0
  );
  return db;
};
```

Quindi mettendo insieme i pezzi posso scrivere la funzione `readDatabase`:

```js
const readAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.addEventListener("load", () => resolve(r.result as ArrayBuffer));
    r.addEventListener("error", reject);
    r.readAsArrayBuffer(file);
  });
};

const readDatabase = (arrayBuffer) => {
  const sqlite3 = self["sqlite3"];
  let bytes = new Uint8Array(arrayBuffer);
  const p = sqlite3.wasm.allocFromTypedArray(bytes);
  const db = new sqlite3.oo1.DB();
  let rc = sqlite3.capi.sqlite3_deserialize(
    db.pointer,
    "main",
    p,
    bytes.length,
    bytes.length,
    0
  );
  return db;
};

let db;
let dbName;

$: if (files) {
  readAsArrayBuffer(files[0]).then((r) => {
    db = readDatabase(r);
    dbName = files[0].name;
    files = null;
    getTableList();
  }).catch((e) => {
    console.log(e);
  });
}
```

### Estrarre l'elenco delle tabelle

{% include picture img="image-02.webp" ext="jpg" alt="a Kawai cute little cartoon employee character, database, 9:5, beautiful light, soft colour scheme, watercolor, happy" %}

Adesso che ho aperto il database, posso estrarre l'elenco delle tabelle. Ci sono due modi possibili. Il primo, quello che ho utilizzato, è quello di interrogare la tabella `sqlite_master` oppure la tabella [`sqlite_schema`](https://www.sqlite.org/schematab.html):

```js
const getTableList = (db) => {
  let listTable = [];
  db.exec({
    sql: `select name from sqlite_master where type='table'`,
    rowMode: "array", // 'array' (default), 'object', or 'stmt'
    callback: function (row) {
      console.log("row ", ++this.counter, "=", row);
      listTable = [...listTable, row[0]];
    }.bind({ counter: 0 }),
  });
  return listTable;
};
```

Ho già spiegato come usare [`exec`](https://sqlite.org/wasm/doc/trunk/api-oo1.md#db-exec) nell'altro post. Semplifico il codice eliminando il `callback` e utilizzando `returnValue`. Aggiungo quindi il metodo flat per convertire l'array di array in un array semplice:

```js
const getTableList = (db) =>
  db
    .exec({
      sql: `select name from sqlite_master where type='table'`,
      returnValue: "resultRows",
    })
    .flat();
```

### Estrarre i nomi delle colonne di una tabella

Il secondo modo per ricavare l'elenco dei nomi delle tabelle di un database prevede l'utilizzo dei [PRAGMA Statements](https://www.sqlite.org/pragma.html). Non sono altro che delle aggiunte alla sintassi SQL che permettono di interrogare il database. Per esempio, il comando `PRAGMA table_list` restituisce l'elenco delle tabelle contenute nel database. Invece il comando `PRAGMA table_info(table_name)` restituisce le informazioni sulle colonne di una tabella. In questo modo posso estrarre l'elenco dei nomi delle colonne di una tabella:

```js
let idInfo = 0;

const getTableInfo = (tableName) => {
  let infoTable = [];
  idInfo++;
  db.exec({
    sql: `PRAGMA table_info("${tableName}")`,
    rowMode: "object",
    callback: function (row) {
      console.log("row ", ++this.counter, "=", JSON.stringify(row));
      infoTable = [...infoTable, row];
    }.bind({ counter: 0 }),
  });
  tableInfo = [...tableInfo, { infoTable, tableName, idInfo }];
};
```

Anche in questo caso, semplifico il codice eliminando il `callback` e utilizzando `returnValue`:

```js
const getTableColumns = (db, tableName) => [
  {
    tableName,
    id: Math.random(),
    columns: db.exec({
      sql: `PRAGMA table_info("${tableName}")`,
      rowMode: "object",
      returnValue: "resultRows",
    }),
  },
];
```

E con questo per oggi è tutto.
