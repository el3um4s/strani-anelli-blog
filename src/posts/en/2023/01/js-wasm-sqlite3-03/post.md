---
title: "SQLite 3 in action: how to use the File System Access API to open and save a SQLite 3 database in a browser"
description: After understanding how to create, modify and load a SQLite 3 database in the browser, today I want to try to understand how to open, read and modify a locally saved database. I'm interested in emulating the behavior of a desktop application that saves data to a SQLite 3 database. To do this I will once again use the SQLite 3 version in JavaScript, compiled in WebAssembly. Also I will be using the File System Access API. To handle the graphics I will use Svelte.
published: true
date: 2023-01-26 16:30
categories:
  - Database
  - JavaScript
  - Sqlite3
tags:
  - Database
  - JavaScript
  - Sqlite3
lang: en
cover: image.webp
---

After understanding how to create, modify and load a SQLite 3 database in the browser, today I want to try to understand how to open, read and modify a locally saved database. I'm interested in emulating the behavior of a desktop application that saves data to a SQLite 3 database. To do this I will once again use the SQLite 3 version in JavaScript, compiled in WebAssembly. Also I will be using the [File System Access API](https://developer.chrome.com/articles/file-system-access/). To handle the graphics I will use [Svelte](https://svelte.dev/).

But first I recommend reading the first and second part of this series:

- [SQLite 3 in Action: A Beginner’s Guide to Using a Relational Database in the Browser](https://javascript.plainenglish.io/a-beginners-guide-to-setting-up-and-using-sqlite-3-in-a-browser-based-application-9e60cefe75ce)
- [SQLite 3 in Action: How to Open a Local Database With JavaScript and WebAssembly](https://el3um4s.medium.com/sqlite-3-in-action-how-to-open-a-local-database-with-javascript-and-webassembly-d766d0743a79)

### How to open a local database

Unlike the post from a few days ago, I intend to use the File System Access API. This way I can access a local file, read it, modify it and then save it. The end result is an experience very similar to that of a desktop application.

First I need a function that can open a local file. This function is very simple:

```js
let fileHandle;

const openFile = async () => {
  [fileHandle] = await globalThis.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.arrayBuffer();
};
```

Basically the `showOpenFilePicker` function opens a dialog that allows you to select a file. Once selected, a `FileHandle` object is returned. This object contains the selected file. To read the file, I use the `getFile` method and then `arrayBuffer` to get the contents of the file. In addition to `arrayBuffer`, there are also the `text` and `stream` methods, which return the file contents as a string and as a `ReadableStream`, respectively.

To get the database from the file I can reuse the `readDatabase()` function:

```js
const readDatabase = (arrayBuffer) => {
  const sqlite3 = self["sqlite3"];
  let bytes = new Uint8Array(arrayBuffer);
  const p = sqlite3.wasm.allocFromTypedArray(bytes);
  let db = new sqlite3.oo1.DB();
  let rc = sqlite3.capi.sqlite3_deserialize(
    db.pointer,
    "main",
    p,
    bytes.length,
    bytes.length,
    sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE |
      sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE
  );
  db.checkRc(rc);

  return db;
};
```

In this way I get:

```js
let fileHandle;

const openFile = async () => {
  [fileHandle] = await globalThis.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.arrayBuffer();
  const db = readDatabase(contents);
  return db;
};
```

I keep the fileHandle variable out of the function because I use it to save the file. Now I can create a specific button to open the file:

```html
<button
  on:click={async () => {
      db = await openFile();
      listTable = [...getTableList(db)];
    }}
  >Open File</button>
```

### How to save SQLite database 3

To save the SQLite 3 database I use the File System Access API again. First I fetch the file handle and make it writable:

```js
const writable = await handle.createWritable();
```

I use the [`sqlite3_js_db_export`](https://sqlite.org/wasm/doc/trunk/api-c-style.md#sqlite3_js_db_export) method to get a byte array:

```js
const byteArray = self["sqlite3"].capi.sqlite3_js_db_export(database.pointer);
```

Finally I create a blob and write it to the file:

```js
const blob = new Blob([byteArray.buffer], {
  type: "application/x-sqlite3",
});

await writable.write(blob);
await writable.close();
```

The final result is:

```js
const saveFile = async (handle, database) => {
  const writable = await handle.createWritable();
  const byteArray = self["sqlite3"].capi.sqlite3_js_db_export(database.pointer);

  const blob = new Blob([byteArray.buffer], {
    type: "application/x-sqlite3",
  });

  await writable.write(blob);
  await writable.close();
};
```

Now I can add a button to save the file:

```html
<button on:click={async () => await saveFile(fileHandle, db)}
  >Save File</button
>
```

### How to save SQLite 3 database to a new file

I can save the SQLite 3 database in a new file. To do this, I use the File System Access API once again. I can also use the `saveFile` function I defined earlier, but I need a new file handle first:

```js
const showSaveFilePicker = async () => {
  const options = {
    types: [
      {
        description: "SQLite 3",
        accept: {
          "application/x-sqlite3": [".sqlite", ".sqlite3", ".db"],
        },
      },
    ],
  };
  const handle = await globalThis.showSaveFilePicker(options);
  return handle;
};
```

So I add a button:

```html
<button
  on:click={async () => {
    const handle = await showSaveFilePicker();
    await saveFile(handle, db);
  }}>Save File As</button
>
```

And that's all, at least for today.
