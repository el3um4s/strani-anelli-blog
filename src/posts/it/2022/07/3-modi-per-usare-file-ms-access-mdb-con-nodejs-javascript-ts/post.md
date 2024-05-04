---
title: 3 Modi Per Usare File MS Access (MDB) Con NodeJS (JavaScript e TypeScript)
published: true
date: 2022-07-31 9:00
categories:
  - MS Access
  - Sqlite3
  - TypeScript
  - NodeJS
  - Database
tags:
  - Access
  - Sqlite3
  - TypeScript
  - NodeJS
  - 3-ways-to-use-ms-access-mdb-files-with-nodejs-javascript
lang: it
cover: image.webp
description: Oramai è da un po' di tempo che sbatto la testa su un problema. Ho qualche centinaio di database in formato mdb (Microsoft Access 2000) pieni di dati relativi a un quarto di secolo, e non voglio che siano persi. Si tratta di un problema complesso, perché interseca diversi aspetti. I database in questione sono ancora in uso, quindi non posso semplicemente sostituirli. Inoltre, essendo frutto di un accumulo decennale sono molto intricati. Infine, le conoscenze di chi li utilizza sono spesso superficiali.
---

Oramai è da un po' di tempo che sbatto la testa su un problema. Ho qualche centinaio di database in formato mdb (Microsoft Access 2000) pieni di dati relativi a un quarto di secolo, e non voglio che siano persi. Si tratta di un problema complesso, perché interseca diversi aspetti. I database in questione sono ancora in uso, quindi non posso semplicemente sostituirli. Inoltre, essendo frutto di un accumulo decennale sono molto intricati. Infine, le conoscenze di chi li utilizza sono spesso superficiali.

Importante, poi, essendo usati da organizzazioni non-profit, le macchine utilizzate sono per lo più vecchie, con processori lenti e performance molto basse. Mi piacerebbe che non fossero legate all'utilizzo di programmi Windows, ma che fossero utilizzabili anche con Linux.

Infine, come ultimo requisito, devono poter funzionare anche in situazioni in cui manca la connessione internet. O, meglio essere completamente offline per la maggior parte dei casi. Il passaggio dei dati da una macchina all'altra deve poter avvenire in modo semplice e veloce, tramite chiavette USB o CD.

Ho provato varie soluzioni, ma non ho trovato una che funzionasse.

### MDBTools

Un tentativo è stato usare gli [mdbtools](https://github.com/mdbtools/mdbtools) per linux. Però mi sono scontrato con dei limiti nelle varie distribuzioni linux. Limiti per lo più miei, ma che mi hanno costretto a cercare una versione funzionante con Windows. Ho quindi cercato un modo per usare gli mdbtools sia su Windows che su Linux. Dopo alcuni tentativi ho creato un packages, [Node MdbTools](https://github.com/el3um4s/mdbtools) che funziona abbastanza bene. Per poter leggere un file Access è sufficiente installare il pacchetto con il comando

```bash
npm install @el3um4s/mdbtools
```

Posso quindi ricavare l'elenco delle tabelle in un file mdb usando una funzione simile a questa:

```ts
const windowsPath = "./mdbtools-win";
const database = "./src/__tests__/fruit.mdb";

const list = await tables({ database, windowsPath });
console.log(list);
// [ "Fruit", "Fruit Salad", "Veggie Salad", "Muffin/Bread", "Dried"]
```

Posso interrogare il database per ottenere i dati di una tabella specifica:

```ts
const s = "SELECT * FROM Colors WHERE Value > 10;";

const result = await sql({ database, windowsPath, sql: s });
console.log(result);
// [ { Value: 11, Color: "Red" }, { Value: 12, Color: "Green" }, { Value: 13, Color: "Blue" } ]
```

Posso anche salvare il risultato della query in un file:

```ts
const file = "./sql result to file.csv";

const q = await sqlToFile({ database, windowsPath, sql: s, file });
console.log(q);
// true
```

Oppure salvare direttamente una tabella in un file csv

```ts
await tableToCSVFile({
  database,
  windowsPath,
  table,
  file,
  options,
});
```

Tutto molto bello se non fosse che in alcuni casi non funziona. Sono casi abbastanza specifici, e che riguardano la particolarità delle lingue diverse da quella inglese: gli accenti. Alcune tabelle usano caratteri accentati. E questo manda in errore alcune esportazioni e alcune query.

### NODE ADODB

Un altro tentativo è stato usare un pacchetto di [Nuintun](https://github.com/nuintun) chiamato [Node Adodb](https://github.com/nuintun/node-adodb). L'ultimo aggiornamento risale al Dicembre 2020 e nel frattempo si sono accumulati un po' di problemi. Ho quindi creato un fork con una mia versione aggiornata ([el3um4s/node-adodb](https://github.com/el3um4s/node-adodb)).

Installo il pacchetto

```bash
npm install @el3um4s/node-adodb
```

Posso interrogare una tabella di un database con questo comando:

```ts
import ADODB from "@el3um4s/node-adodb";

const connection = ADODB.open(
  "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=fruit.MDB;"
);

const result = await connection.query("SELECT * FROM Colors WHERE Value > 10");
console.log(result);
```

Questo pacchetto funziona, ma solamente in Windows. Inoltre può essere molto, troppo lento. Sì, è una buona soluzione per operazioni da eseguire una volta ogni tanto ma non per un utilizzo frequente.

### NODE MDB

Ho quindi provato a ricreare da capo questo repository, e ho ottenuto [el3um4s/node-mdb](https://github.com/el3um4s/node-mdb). Per installarlo è sufficiente scrivere:

```bash
npm i @el3um4s/node-mdb
```

Quindi per ottenere la lista delle tabelle posso usare

```ts
import { table } from "@el3um4s/node-mdb";

const database = "./src/__tests__/test.mdb";

const result = await table.list({ database });
console.log(result);
//  ["Attività", "Users", "To Do"]
```

Posso interrogare una tabelle scrivendo delle query

```ts
import { query } from "@el3um4s/node-mdb";

const database = "./test.mdb";

const sql = `
  SELECT userName, userAge, mail 
  FROM Users 
  WHERE (userName Like '%rossi%');`;
const result = await query.sql({
  database,
  sql,
});
```

Posso esportare il risultato in un file

```ts
await query.sqlToFileCSV({
  database,
  file: "./sqlToFileCSV.csv",
  sql: `
    SELECT userName, userAge, mail 
    FROM Users 
    WHERE (userName Like '%rossi%');`,
});
```

Oppure modificare la tabella con query simili a queste:

```ts
const insert = `
    INSERT INTO [Users](userName, userAge, mail)
    VALUES ("Topo Gigio", 6, "topogigio@test.com");`;
await query.sql({
  database,
  sql: insert,
});

const update = `
    UPDATE [Users]
    SET userAge = 100, mail = "oldTopo@test.com"
    WHERE userName = "Topo Gigio";
    `;
await query.sql({
  database,
  sql: update,
});

const delete = `
    DELETE FROM [Users]
    WHERE userName = "Topo Gigio";`;
await query.sql({
  database,
  sql: delete,
});
```

Anche in questo caso, però, il sistema tende a essere lento in alcuni database. E, comunque, funziona solo sotto Windows.

### Conclusione

E quindi? Beh, dopo aver provato varie soluzioni, e aver notato che ci sono delle inconsistenze nel comportamento sotto Windows, ho deciso che forse la strada migliore è provare a convertire i vari database da MDB a SQLite.

In questo modo posso usare un pacchetto come [sqlite3](https://www.npmjs.com/package/sqlite3):

```bash
npm i sqlite3
```

Posso ottenere l'elenco delle tabelle in un database con un comando simile a questo

```ts
const database = "test.db";
const db = new sqlite3.Database(database);

db.each("SELECT name FROM sqlite_schema WHERE type='table'", (e, d) =>
  console.log(d)
);

db.close();
```

Oppure interrogare un database usando una query sql simile a questa

```ts
const database = "test.db";
const db = new sqlite3.Database(database);

const r = db.all(`SELECT * FROM [Users] WHERE name like("%à%") ;`);
console.log(r);

db.close();
```

Al momento questa soluzione è la migliore. Però non è la soluzione che stavo cercando e mi pone un problema nuovo: come faccio a convertire un file MDB in SQLite? Possibilmente in maniera automatica.

Di questo parlerò in un prossimo post.
