---
title: "SQLite 3 in Action: How to Open a Local Database"
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

I continue with my exploration of SQLite 3 for browsers. That is, the JavaScript version that allows you to use code compiled in WebAssembly. A few days ago I posted my notes on [how to create a database](https://medium.com/javascript-in-plain-english/a-beginners-guide-to-setting-up-and-using-sqlite-3-in-a-browser-based-application-9e60cefe75ce), add tables and data, and how to extract data from a table. Today I report my notes on how to read a database saved locally, how to obtain the list of tables present and, finally, how to understand which are the columns of a table.

![test-sqlite.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2023/2023-01-24-js-wasm-sqlite3-02-italiano/test-sqlite-2.gif)

### How to open a database

{% include picture img="image-01.webp" ext="jpg" alt="a Kawai cute little cartoon employee character, database, 9:5, beautiful light, soft colour scheme, watercolor, happy" %}

To open a database I need a way to pass it to the web page. The easiest way is to do this using an element `input` with `type="file"`.

```html
<input type="file" bind:files />
```

This way, when the user selects a file, its contents are saved in a variable `files` which is an array of `File` (see [`Files`](https://developer.mozilla.org/en-US/docs/Web/API/File) ).

```js
$: if (files) {
  const file = files[0];
  console.log(file.name, file.size);
}
```

But I need a function to read the contents of the file. I create a specific function, `readDatabase`:

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

Going to break down the code, I need an event that intercepts the file and reads it as an ArrayBuffer:

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

After I read the file I can convert it to a byte array:

```js
const arrayBufferToBytes = (arrayBuffer) => {
  return new Uint8Array(arrayBuffer);
};
```

This way I can use the [sqlite3_deserialize](https://sqlite.org/wasm/doc/trunk/api-c-style.md#sqlite3_deserialize) method:

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

So putting the pieces together I can write the function `readDatabase`:

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

### Extract the list of tables

{% include picture img="image-02.webp" ext="jpg" alt="a Kawai cute little cartoon employee character, database, 9:5, beautiful light, soft colour scheme, watercolor, happy" %}

Now I can extract the table list. There are two possible ways. The first one, the one I used, is to query the table `sqlite_master` or the table [`sqlite_schema`](https://www.sqlite.org/schematab.html):

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

I already explained how to use [`exec`](https://sqlite.org/wasm/doc/trunk/api-oo1.md#db-exec). I simplify the code by eliminating the `callback` and using `returnValue`. I then add the `flat` method to convert the array of arrays to a plain array:

```js
const getTableList = (db) =>
  db
    .exec({
      sql: `select name from sqlite_master where type='table'`,
      returnValue: "resultRows",
    })
    .flat();
```

### Extract column names from a table

The second way to obtain the list of table names in a database involves the use of [PRAGMA Statements](https://www.sqlite.org/pragma.html). They are nothing more than additions to the SQL syntax that allow you to query the database. For example, the command `PRAGMA table_list` returns the list of tables contained in the database. Instead the command `PRAGMA table_info(table_name)` returns information about the columns of a table. This way I can extract the list of column names of a table:

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

Again, I simplify the code by eliminating the `callback` and using `returnValue`:

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

And that's all for today.
