---
title: "How To Convert MDB Files To SQLite Database"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-08-04 9:00"
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

So how can I convert an MDB file to a SQLite database? At the end of the day the easiest way is to create an MDB database to semi-automatically convert the other MDB files. I want to get a mask similar to this:

{% include picture img="ExportMDBtoSQLite3.webp" ext="jpg" alt="" %}

But before I can get to this I have to configure the PC. I start with downloading SQLite. I can do this pretty quickly using the precompiled files on [sqlite.org](https://www.sqlite.org/download.html). For Windows I download **sqlite-tools-win32-x86**. After unpacking the folder I have 3 files available:

- sqlite3.exe
- sqldiff.exe
- sqlite3_analyzer.exe

I can use **sqlite3.exe** from terminal to create an empty database:

{% include picture img="Crea Nuovo Database SQLite - 02.webp" ext="jpg" alt="" %}

Microsoft Access doesn't natively recognize SQLite files, I need drivers. There only two alternatives:

- [ODBC Driver for SQLite](https://www.devart.com/odbc/sqlite/) by devart. But it costs $ 170.
- [SQLite ODBC Driver](https://www.sqlitetutorial.net/download-install-sqlite/) by Christian Werner. But it's stuck at SQLite version 3.32.3

For me the free drivers is enough. Then I install the **SQLite ODBC Driver**.

{% include picture img="04 - Installa DRIVER - 04.webp" ext="jpg" alt="" %}

After creating an empty SQLite database I can start exporting the various tables of an MS Access database. I open the file with Access, go to the list of tables, select the table to export. I then click with the right mouse button and select the **Export** option.

{% include picture img="06 - Esporta da Access - 01.webp" ext="jpg" alt="" %}

As file type I choose **ODBC Databases ()** as file type

{% include picture img="07 - Esporta da Access - 02.webp" ext="jpg" alt="" %}

Then I decide the name to assign to the exported table:

{% include picture img="08 - Esporta da Access - 03.webp" ext="jpg" alt="" %}

Then I select the driver to use for export. In my case _SQLite3 Datasource_ is fine .

{% include picture img="09 - Esporta da Access - 04.webp" ext="jpg" alt="" %}

Then I select the SQLite database (using the _Browse..._ button ), I set the parameters and then click _OK_ to complete the export of the table from Access to SQLite.

{% include picture img="10 - Esporta da Access - 05.webp" ext="jpg" alt="" %}

As long as it's a handful of databases, and a few tables, it's possible to do everything manually. But when things get bigger, when there are tens, hundreds or even thousands of tables, you need to use a more automatic solution. For this reason, I have created a solution that allows me to export an MS Access database to a SQLite database. I uploaded the code to GitHub in the [el3um4s/how-to-export-mdb-to-sqlite-3](https://github.com/el3um4s/how-to-export-mdb-to-sqlite-3) repository .

Download to PC two files:

- [ExportMDBToSQLite3.mdb](https://github.com/el3um4s/how-to-export-mdb-to-sqlite-3/raw/main/export-mdb-to-sqlite3/ExportMDBToSQLite3.mdb)
- [NewSQLiteDB.db](https://github.com/el3um4s/how-to-export-mdb-to-sqlite-3/raw/main/export-mdb-to-sqlite3/NewSQLiteDB.db)

For simplicity I put them in the same folder. Then I open the mdb file:

{% include picture img="ExportMDBtoSQLite3.webp" ext="jpg" alt="" %}

I can select the source database, the destination folder, the tables to export and the destination file. Clicking the _Export database to_ button starts the export of the selected tables. Depending on the amount of data in the database, and the processor of the PC used, it can take a few minutes for each database. But it's still easier and faster than doing it by hand table by table.

To automate even more, you can write your own code. But I will talk about this in the next article, where I will go a little deeper into the VBA (Visual Basic for Applications) part of this application.
