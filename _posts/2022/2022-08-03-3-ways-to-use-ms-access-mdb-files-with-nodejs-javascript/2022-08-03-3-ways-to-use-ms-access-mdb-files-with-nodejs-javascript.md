---
title: "3 Ways To Use MS Access (MDB) Files With NodeJS (JavaScript and TypeScript)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Shubham Dhage**](https://unsplash.com/@theshubhamdhage)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-08-03 9:00"
categories:
  - Database
  - MS Access
  - Sqlite3
  - MDB
  - DB
tags:
  - Database
  - MS Access
  - Sqlite3
  - MDB
  - DB
---

There is a problem that has been bothering me for some years. I have a few hundred databases in mdb format (Microsoft Access 2000) full of data from a quarter of a century, and I don't want to lose them. This is a complex problem, because it concerns several issues. The databases are still in use, so I can't just replace them. Furthermore, being the result of a ten-year accumulation, they are very spaghetti code. Finally, those who use these databases often know almost nothing about computers.

Important: these are databases used by voluntary organizations. They often run on old, obsolete, low-memory, low-performance computers. And they are mostly Windows PCs.

Finally, as a last requirement, they must be able to work even in situations where there is no internet connection. Better to be completely offline most of the time. The passage of data from one machine to another must be able to take place quickly and easily, using USB sticks or CDs.

I've tried various solutions, but couldn't find one that worked.

### MDBTools

One attempt was to use [mdbtools](https://github.com/mdbtools/mdbtools) for linux. However, I ran into limitations in various linux distributions. I also had to look for a version that worked with Windows. I then looked for a way to use mdbtools on both Windows and Linux. After a few tries I have created a packages, N[Node MdbTools](https://github.com/el3um4s/mdbtools) which works quite well. To be able to read an Access file, simply install the package with the command

```bash
npm install @el3um4s/mdbtools
```

I can then get the list of tables in an mdb file using a function similar to this:

<script src="https://gist.github.com/el3um4s/95644c78a6a6c6a66e9787be1d9db5b8.js"></script>

I can query the database to get the data of a specific table:

<script src="https://gist.github.com/el3um4s/765269c4b949b1fbb8157fa315be28b0.js"></script>

I can also save the query result to a file:

<script src="https://gist.github.com/el3um4s/dbb46c2ff2a2ddc7e0ab8c602c3970cf.js"></script>

Or directly save a table in a csv file

<script src="https://gist.github.com/el3um4s/c0d63cf981a449bdb49bff4fd2d0c427.js"></script>

All very nice except that in some cases it doesn't work. These are quite specific cases, and they concern the particularity of my mother tongue: accents. Some tables use accented characters. And this misleads some exports and some queries.

### NODE ADODB

Another attempt was to use a [Nuintun](https://github.com/nuintun) package called [Node Adodb](https://github.com/nuintun/node-adodb) . The last update dates back to December 2020 and in the meantime some problems have accumulated. I then forked my updated version ([el3um4s/node-adodb](https://github.com/el3um4s/node-adodb)).

I install the package

```bash
npm install @el3um4s/node-adodb
```

I can query a database table with this command:

<script src="https://gist.github.com/el3um4s/da1f7ee4cbe64f6a1a13430a83c54c27.js"></script>

This package works, but only on Windows. Also it can be very slow. Yes, it is a good solution for operations to be performed once in a while but not for frequent use.

### NODE MDB

I then tried to recreate this repository from scratch, [el3um4s/node-mdb](https://github.com/el3um4s/node-mdb) . To install it just write:

```bash
npm i @el3um4s/node-mdb
```

So to get the list of tables I can use

<script src="https://gist.github.com/el3um4s/6858563d81f03325520e8b49cc39c73d.js"></script>

I can query a table by writing queries

<script src="https://gist.github.com/el3um4s/9a8929f6d83dd5a06d2d2ed5e68f45ab.js"></script>

Can I export the result to a file

<script src="https://gist.github.com/el3um4s/beb0709881265f4ab6dd85e87af6c62f.js"></script>

Or edit the table with queries similar to these:

<script src="https://gist.github.com/el3um4s/c989c2a54abd9d548985bf724a727abb.js"></script>

Again, however, the system tends to be slow in some databases. And anyway, it only works under Windows.

### Conclusion

So what? Well, after trying various solutions, and noticing that there are inconsistencies in behavior under Windows, I have decided that perhaps the best way is to try to convert the various databases from MDB to SQLite.

This way I can use a package like [sqlite3](https://www.npmjs.com/package/sqlite3):

```bash
npm i sqlite3
```

I can get the list of tables in a database with a command similar to this

<script src="https://gist.github.com/el3um4s/c43e2a4e4f19692b1bbf5d1475b6beaa.js"></script>

Or query a database using an sql query similar to this one

<script src="https://gist.github.com/el3um4s/8a25f17f0690d4ed492a64a28ed36b76.js"></script>

At the moment this is the best solution. But it is not the solution I was looking for and it creates a new problem for me: how do I convert an MDB file to SQLite? Possibly automatically.

I will talk about this in a future post.
