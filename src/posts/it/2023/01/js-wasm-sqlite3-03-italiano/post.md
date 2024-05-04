---
title: "SQLite 3 in azione: come usare le File System Access API per aprire e salvare un database SQLite 3 in un browser"
published: true
date: 2023-01-26 16:00
lang: it
cover: image.webp
description: Dopo aver capito come creare, modificare e caricare un database SQLite 3 in browser, oggi voglio provare a capire come aprire, leggere e modificare un database salvato in locale. Mi interessa emulare il comportamento di un'applicazione desktop che salva i dati in un database SQLite 3. Per farlo userò ancora una volta la versione SQLite 3 in JavaScript, compilata in WebAssembly. Inoltre userò le File System Access API. Per gestire la parte grafica userò Svelte.
categories:
  - Sqlite3
  - Database
  - JavaScript
tags:
  - Sqlite3
  - Database
  - JavaScript
---

Dopo aver capito come creare, modificare e caricare un database SQLite 3 in browser, oggi voglio provare a capire come aprire, leggere e modificare un database salvato in locale. Mi interessa emulare il comportamento di un'applicazione desktop che salva i dati in un database SQLite 3. Per farlo userò ancora una volta la versione SQLite 3 in JavaScript, compilata in WebAssembly. Inoltre userò le [File System Access API](https://developer.chrome.com/articles/file-system-access/). Per gestire la parte grafica userò [Svelte](https://svelte.dev/).

Prima però consiglio di leggere la prima e la seconda parte di questa serie di post:

- [SQLite 3 in Action: A Beginner’s Guide to Using a Relational Database in the Browser](https://javascript.plainenglish.io/a-beginners-guide-to-setting-up-and-using-sqlite-3-in-a-browser-based-application-9e60cefe75ce)
- [SQLite 3 in Action: How to Open a Local Database With JavaScript and WebAssembly](https://el3um4s.medium.com/sqlite-3-in-action-how-to-open-a-local-database-with-javascript-and-webassembly-d766d0743a79)

### Come aprire un database locale

A differenza del post di qualche giorno fa, intendo usare le File System Access API. In questo modo posso accedere a un file locale, leggerlo, modificarlo e poi salvarlo. Il risultato finale è un'esperienza molto simile a quella di un'applicazione desktop.

Per prima cosa mi serve una funzione in grado di aprire un file locale. Questa funzione è molto semplice:

```js
let fileHandle;

const openFile = async () => {
  [fileHandle] = await globalThis.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.arrayBuffer();
};
```

Sostanzialmente la funzione `showOpenFilePicker` apre una finestra di dialogo che permette di selezionare un file. Una volta selezionato, viene restituito un oggetto `FileHandle`. Questo oggetto contiene il file selezionato. Per leggere il file, uso il metodo `getFile` e poi `arrayBuffer` per ottenere il contenuto del file. Oltre ad `arrayBuffer`, esistono anche i metodi `text` e `stream`, che restituiscono rispettivamente il contenuto del file come stringa e come `ReadableStream`.

Per ricavare il database dal file posso riutilizzare la funzione `readDatabase()`:

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

In questo modo ottengo:

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

Tengo la variabile fileHandle fuori dalla funzione perché la userò per salvare il file. Ora posso creare un pulsante specifico per aprire il file:

```html
<button
  on:click={async () => {
      db = await openFile();
      listTable = [...getTableList(db)];
    }}
  >Open File</button>
```

### Come salvare il database SQLite 3

Per salvare il database SQLite 3 utilizzo ancora una volta le File System Access API.

Per prima cosa recupero l'handle del file e lo rendo scrivibile:

```js
const writable = await handle.createWritable();
```

Uso il metodo [`sqlite3_js_db_export`](https://sqlite.org/wasm/doc/trunk/api-c-style.md#sqlite3_js_db_export) per ottenere un array di byte:

```js
const byteArray = self["sqlite3"].capi.sqlite3_js_db_export(database.pointer);
```

Infine creo un blob e lo scrivo sul file:

```js
const blob = new Blob([byteArray.buffer], {
  type: "application/x-sqlite3",
});

await writable.write(blob);
await writable.close();
```

Il risultato finale è:

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

Ora posso aggiungere un pulsante per salvare il file:

```html
<button on:click={async () => await saveFile(fileHandle, db)}
  >Save File</button
>
```

### Come salvare il database SQLite 3 in un nuovo file

Infine posso salvare il database SQLite 3 in un nuovo file. Per farlo, uso ancora una volta le File System Access API. Posso usare anche la funzione `saveFile` che ho definito prima, ma prima mi serve un nuovo file handle:

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

Quindi aggiungo un pulsante:

```html
<button
  on:click={async () => {
    const handle = await showSaveFilePicker();
    await saveFile(handle, db);
  }}>Save File As</button
>
```

E con questo è tutto, almeno per oggi.
