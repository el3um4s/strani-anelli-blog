---
title: "A beginner's guide to setting up and using SQLite 3 in a browser-based application"
subtitle: "SQLite 3 and WebAssembly: The perfect pair for offline web apps"
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

A few months ago a version of SQLite 3 compiled for WebAssembly was released. What does it mean? It means being able to use SQLite 3 natively in a browser. In other words, we have at our disposal the power and ease of use of one of the best relational databases directly from the browser. I started experimenting with this possibility, and created a page to test the basic operations. In this post I will report my notes on the basic steps to follow.

![test-sqlite.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2023/2023-01-20-js-wasm-sqlite3-01-italiano/test-sqlite.gif)

### SQLite 3

{% include picture img="cabinet-01.webp" ext="jpg" alt="little kawai cute office filing cabinet, beautiful light, soft colour scheme, manga style" %}

But first, what is SQLite 3? SQlite is a relation database, saved in a file, lightweight and free. Unlike other databases, SQLite does not require any servers. In this respect it is very reminiscent of MS Access. And these are the two characteristics that are driving me to deepen this technology:

- It's free
- it is open source
- can work locally

This allows you to create applications that can work completely offline.

You can find all the documentation, information and downloads of SQLite 3 on the official site: [sqlite.org](https://sqlite.org/index.html)..

### WebAssembly

{% include picture img="image-01.webp" ext="jpg" alt="a Kawai cute little cartoon cat character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

What's the problem? That until now it was not possible to use SQLite directly within a WEB page. Or rather, it was possible but only through some independent projects. To solve this problem (and, I suspect, also to accommodate some requests from Google), a version of SQLite 3 compiled for WebAssembly was created.

Again you can find all the documentation and information on [the official site](https://sqlite.org/wasm/doc/trunk/index.md).

### How to Use SQLite 3 in a Browser

{% include picture img="image-02.webp" ext="jpg" alt="a Kawai cute little cartoon cat character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

Having said that let's move on to the most interesting part: how can we use SQLite 3 in a browser?

First we need to download some files from the site. We look for the [sqlite-wasm-XXXX.zip](https://sqlite.org/download.html) file (where `XXXX` is the version of SQLite 3 we want to use) and download it. Inside we find the folder `jswasm` containing the files we need:

- `sqlite3.js`
- `sqlite3.wasm`

Plus other files:

- `sqlite3-opfs-async-proxy.js`
- `sqlite3-worker1.js`
- `sqlite3-worker1-promiser.js`

We can create a folder in the project and add the reference to these files:

```html
<head>
  <!-- ... -->
  <script src="jswasm/sqlite3.js"></script>
  <!-- ... -->
</head>
```

You only need to import once `sqlite3.js` to load `sqlite3.wasm`. But before we can actually use SQLite 3 we need to initialize the library. Let's create a function that can help us:

```js
const initSqlite3 = async () => {
  const sqlite3 = await self["sqlite3InitModule"]();
  self["sqlite3"] = sqlite3;
  return sqlite3;
};
```

This way we can happen to SQLite 3 via `self["sqlite3"]`, from anywhere in the code.

We can verify that everything works correctly:

```js
initSqlite3().then((s) => {
  sqlite3 = s;
  console.log("sqlite3:", sqlite3);
  console.log("sqlite3", self["sqlite3"]);
  console.log("sqlite3 version", sqlite3.capi.sqlite3_libversion());
});
```

### How to Create a Database with SQLite 3

{% include picture img="image-03.webp" ext="jpg" alt="a Kawai cute little cartoon dog character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

Now that we have initialized SQLite 3 we can create a database. First let's create a function to help us:

```js
export const createDatabase = (filename = ":memory:", flags = "c") =>
  new self["sqlite3"].oo1.DB({ filename, flags });
```

In this case we use the constructor [`oo1.DB`](https://sqlite.org/wasm/doc/trunk/api-oo1.md#db-ctor). It is worth mentioning the meaning of the flags:

- `c`: create if it does not exist, else fail if it does not exist. Implies the `w` flag.
- `w`: write. Implies `r`: a db cannot be write-only.
- `r`: read-only if neither `w` nor `c` are provided, else it is ignored.
- `t`: enable tracing of SQL executed on this database handle, sending it to `console.log()`.

Another mention deserves the parameter `filename`. There are some reserved words:

- `:memory:`: create an in-memory database
- `""`: create a temporary database
- `:localStorage:`: create a database in the browser's local storage
- `:sessionStorage:`: create a database in the browser's session storage

That said, to create the database you just need to:

```js
const db = createDatabase("xyz.sqlite3", "ct");
console.log("db", db.filename); // xyz.sqlite3
```

### How to Add a Table to a SQLite 3 Database

{% include picture img="image-04.webp" ext="jpg" alt="a Kawai cute little cartoon elephant character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

An empty database is not very useful. So let's move on to creating a table using the method [`exec`](https://sqlite.org/wasm/doc/trunk/api-oo1.md#db-exec):

```js
const createTable = (db, tableName) =>
  db.exec({
    sql: `CREATE TABLE IF NOT EXISTS "${tableName}"(a,b)`,
  });
```

We can use the method `exec` to perform multiple operations at once:

```js
db.exec(["create table t(a);", "insert into t(a) ", "values(10),(20),(30)"]);
```

### How To Insert Data into a Table

{% include picture img="image-05.webp" ext="jpg" alt="a Kawai cute little cartoon elephant character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

Of course we have to enter values ​​into a table. Also in this case we can use the method `exec`:

```js
const insertData = (db, tableName, data) =>
  db.exec({
    sql: `INSERT INTO "${tableName}" VALUES(?,?)`,
    bind: data,
  });
```

We use a function to generate random numbers:

```js
const rand = (max) => Math.floor(Math.random() * max);
```

And let's create a loop to insert some values:

```js
const addFakeData = (tableName) => {
  let i = 0;
  for (i = 20; i <= 25; ++i) {
    insertData(db, tableName, [rand(100), rand(100)]);
  }
};
```

There are various methods of adding data to a table. We can also try other options:

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

### Read Data from a SQLite 3 Database

{% include picture img="image-06.webp" ext="jpg" alt="a Kawai cute little cartoon elephant character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

The next step is to understand how to read the data contained in a table. Again we use the method `exec`. Let's add two options:

- `rowMode`: `array` or `object` specifies the format of the data returned and passed to the function `callback`
- `callback`: a function that is called for each row returned by the sql query

```js
const readData = (db, tableName, callback) =>
  db.exec({
    sql: `SELECT * FROM "${tableName}"`,
    rowMode: "array",
    callback,
  });
```

That is, in our case:

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

We can also simplify the code by setting `returnValue` equal to `resultRows`:

```js
const getFakeData = (db, tableName) =>
  db.exec({
    sql: `select a as aa, b as bb from "${tableName}" order by aa limit 10`,
    rowMode: "object",
    returnValue: "resultRows",
  });
```

### How to Save a SQLite 3 Database to a File

{% include picture img="image-06.webp" ext="jpg" alt="a Kawai cute little cartoon elephant character, a office filing cabinet, 9:5, beautiful light, soft colour scheme, crayon" %}

Finally, the last problem we need to solve is figuring out how to save the SQLite database on your computer. To do this we have to use the [C-style API](https://sqlite.org/wasm/doc/trunk/api-c-style.md) and the [sqlite3_js_db_export()](https://sqlite.org/wasm/doc/trunk/api-c-style.md#sqlite3_js_db_export) method.

```js
const byteArray = self["sqlite3"].capi.sqlite3_js_db_export(db.pointer);
```

The method `sqlite3_js_db_export()` returns a `Uint8Array`. We can use it to get a `Blob`:

```js
const blob = new Blob([byteArray.buffer], {
  type: "application/x-sqlite3",
});
```

To simplify the code we can use a function:

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
