---
title: 3 Ways To Use MS Access (MDB) Files With NodeJS (JavaScript and TypeScript)
published: true
date: 2022-08-03 9:00
categories:
  - Database
  - MS Access
  - Sqlite3
  - TypeScript
  - NodeJS
tags:
  - Database
  - Access
  - Sqlite3
  - TypeScript
  - NodeJS
lang: en
cover: image.webp
description: There is a problem that has been bothering me for some years. I have a few hundred databases in mdb format (Microsoft Access 2000) full of data from a quarter of a century, and I don't want to lose them. This is a complex problem, because it concerns several issues. The databases are still in use, so I can't just replace them. Furthermore, being the result of a ten-year accumulation, they are very spaghetti code. Finally, those who use these databases often know almost nothing about computers.
---

There is a problem that has been bothering me for some years. I have a few hundred databases in mdb format (Microsoft Access 2000) full of data from a quarter of a century, and I don't want to lose them. This is a complex problem, because it concerns several issues. The databases are still in use, so I can't just replace them. Furthermore, being the result of a ten-year accumulation, they are very spaghetti code. Finally, those who use these databases often know almost nothing about computers.

Important: these databases are used by voluntary associations. They often run on old, obsolete, low-memory, low-performance computers. And they are mostly Windows PCs.

Finally, as a last requirement, they must be able to work even in situations where there is no internet connection. Better to be completely offline most of the time. The passage of data from one machine to another must be quick and easy, using USB sticks or CDs.

I've tried various solutions, but couldn't find one that worked.

### MDBTools

One attempt was to use [mdbtools](https://github.com/mdbtools/mdbtools) for linux. However, I ran into limitations in various linux distributions. I also had to look for a version that worked with Windows. I then looked for a way to use mdbtools on both Windows and Linux. After a few tries I have created a packages, N[Node MdbTools](https://github.com/el3um4s/mdbtools) which works quite well. To be able to read an Access file, simply install the package with the command

```bash
npm install @el3um4s/mdbtools
```

Then, I can get the list of tables in an mdb file using a function similar to this:

```ts
const windowsPath = "./mdbtools-win";
const database = "./src/__tests__/fruit.mdb";

const list = await tables({ database, windowsPath });
console.log(list);
// [ "Fruit", "Fruit Salad", "Veggie Salad", "Muffin/Bread", "Dried"]
```

I can query the database to get the data of a specific table:

```ts
const s = "SELECT * FROM Colors WHERE Value > 10;";

const result = await sql({ database, windowsPath, sql: s });
console.log(result);
// [ { Value: 11, Color: "Red" }, { Value: 12, Color: "Green" }, { Value: 13, Color: "Blue" } ]
```

I can also save the query result to a file:

```ts
const file = "./sql result to file.csv";

const q = await sqlToFile({ database, windowsPath, sql: s, file });
console.log(q);
// true
```

Or directly save a table in a csv file

```ts
await tableToCSVFile({
  database,
  windowsPath,
  table,
  file,
  options,
});
```

All very well but, in some cases, it doesn't work. These are quite specific cases, and they concern the particularity of my mother tongue: accents. Some tables use accented characters. And this misleads some exports and some queries.

### NODE ADODB

Another attempt was to use a [Nuintun](https://github.com/nuintun) package called [Node Adodb](https://github.com/nuintun/node-adodb) . The last update dates back to December 2020 and in the meantime some problems have accumulated. I then forked my updated version ([el3um4s/node-adodb](https://github.com/el3um4s/node-adodb)).

I install the package

```bash
npm install @el3um4s/node-adodb
```

I can query a database table with this command:

```ts
import ADODB from "@el3um4s/node-adodb";

const connection = ADODB.open(
  "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=fruit.MDB;"
);

const result = await connection.query("SELECT * FROM Colors WHERE Value > 10");
console.log(result);
```

This package works, but only on Windows. Also, it can be very slow. Yes, it is a good solution for operations to be performed once in a while but not for frequent use.

### NODE MDB

Then, I tried to recreate this repository from scratch, [el3um4s/node-mdb](https://github.com/el3um4s/node-mdb) . To install it just write:

```bash
npm i @el3um4s/node-mdb
```

So to get the list of tables I can use

```ts
import { table } from "@el3um4s/node-mdb";

const database = "./src/__tests__/test.mdb";

const result = await table.list({ database });
console.log(result);
//  ["Attività", "Users", "To Do"]
```

I can query a table by writing queries

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

Can I export the result to a file

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

Or edit the table with queries similar to these:

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

Again, however, the system tends to be slow in some databases. And, anyway, it only works on Windows.

### Conclusion

So what? Well, after trying many solutions, and noticing that there are inconsistencies in behavior on Windows, I decided that perhaps the best way is to try to convert the various databases from MDB to SQLite.

This way I can use a package like [sqlite3](https://www.npmjs.com/package/sqlite3):

```bash
npm i sqlite3
```

I can get the list of tables in a database with a command similar to this

```ts
const database = "test.db";
const db = new sqlite3.Database(database);

db.each("SELECT name FROM sqlite_schema WHERE type='table'", (e, d) =>
  console.log(d)
);

db.close();
```

Or query a database using an sql query similar to this one

```ts
const database = "test.db";
const db = new sqlite3.Database(database);

const r = db.all(`SELECT * FROM [Users] WHERE name like("%à%") ;`);
console.log(r);

db.close();
```

At the moment this is the best solution. But it is not the solution I was looking for and it creates a new problem for me: how do I convert an MDB file to SQLite? Possibly automatically.

I will talk about this in a future post.
