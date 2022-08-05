---
title: "How To Use VBA To Convert MDB To SQLite"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-08-05 9:00"
categories:
  - Database
  - MS Access
  - Sqlite3
  - MDB
  - DB
  - VBA
  - Visual Basic for Applications
tags:
  - Database
  - MS Access
  - Sqlite3
  - MDB
  - DB
  - VBA
  - Visual Basic for Applications
---

In this article I report some parts of the code I used to create an application that converts MDB (Microsoft Access 2000) files into SQLite databases. I don't think it's a common problem, but it's convenient for the future me to have notes.

{% include picture img="ExportMDBtoSQLite3.webp" ext="jpg" alt="" %}

I omit the part related to the creation of the interface, I think it is quite simple to reproduce even without a guide.

### Initialize the menu

When opening the main form, I initialize some components:

<script src="https://gist.github.com/el3um4s/c2af28d9f1f96eefc24ee7d40e3741c4.js"></script>

I empty the list of tables to export by setting the RowSource field to empty.

```vb
Forms!Menu!tableList.RowSource = ""
```

I also empty the log of export operations by setting the logExport field to empty.

```vb
Forms!Menu!logExport = ""
```

I simplify by always using the same source database. I put the database in the same folder as the main program. I derive the location of the application using `CurrentProject.path`

<script src="https://gist.github.com/el3um4s/f6e2945df88bcfd4617e27de63bc5f7e.js"></script>

### Choose the file to export

By clicking on _Choose Database_ I choose the MDB file to export. After choosing the file I show the list of tables and select them all (generally I want to export a whole database). Finally I use the source database name to set the target database name:

<script src="https://gist.github.com/el3um4s/594d5bd5f2b807d3f917693c6f2ede36.js"></script>

The function to select a file seems simple enough but it is not:

<script src="https://gist.github.com/el3um4s/98b0f9ecaea0da391a1d674064fcfa80.js"></script>

The problem is that MS Access 2000 doesn't have an easy way to select a file. To do this you need a special function `GetOpenFile()`. I'm not reporting the code here, it's about 300 lines, but on GitHub I uploaded the [GetFile.bas](https://github.com/el3um4s/how-to-export-mdb-to-sqlite-3/blob/main/src/GetFile.bas). The code is not mine, it was created a few decades ago by Ken Getz, himself the result of code dating [back to 1998](http://vbnet.mvps.org/index.html?code/callback/browsecallback.htm).

Anyway, after figuring out how to select the database I can get the name of the target database:

<script src="https://gist.github.com/el3um4s/ca9ef5ecc0164195f62ef9085f891f9a.js"></script>

I extract the last part of the address with `Right(strFullPath, Len(strFullPath) - InStrRev(strFullPath, "\"))` and then replace the extension `mdb` with `db` using a code similar to this `Left(nameWithExtension, Len(nameWithExtension) - 3) & "db"`.

To show the list of tables present in the source database I have to break down the problem into two parts. The first is to understand how to read the name of the tables, the second how to show the names on the screen.

To understand how to fill a listbox, is useful the post [Listbox Add/Remove Item AC2000](https://www.599cd.com/tips/access/listbox-additem-2000/). In summary, just pass the list of names, separated by `;` to the control through the property `RowSource`: `MyList.RowSource = "Table1;Table2;Table3"`.

Instead to read the names of the tables I have to establish a connection to the database:

```vb
Dim db As DAO.database
Dim tdf As DAO.TableDef

Set db = OpenDatabase(pathDatabase, False)
```

Then I can use the [TableDefs collection (DAO)](https://docs.microsoft.com/en-us/office/client-developer/access/desktop-database-reference/tabledefs-collection-dao) to extract the table names:

```vb
For Each tdf In db.TableDefs
  Debug.Print tdf.name
Next
```

But I don't care about the names of the system tables or the temporary ones. To avoid adding to the list I can simply filter them:

```vb
For Each tdf In db.TableDefs
  If Not (tdf.name Like "MSys*" Or tdf.name Like "~*") Then
    Debug.Print tdf.name
  End If
Next
```

By combining everything I get the function `ShowListTable`:

<script src="https://gist.github.com/el3um4s/c1d36f87128618a64172a1c8c2a6f9d1.js"></script>

To select all the tables in the list box I use a function written by [Allen Browne](http://allenbrowne.com/)

<script src="https://gist.github.com/el3um4s/e737ad726017d0096bfab379d2f4b335.js"></script>

### Choose the destination folder

Even choosing the destination folder seems a simple thing, except that it is not. Or at least it wasn't in the late 1990s.

<script src="https://gist.github.com/el3um4s/6798fae650b11daa50dfc8973046bc8c.js"></script>

The function `BrowseFolder` is a function that takes care of opening a dialog box to select a folder. The original codex is by [Terry Kreft](http://access.mvps.org/access/api/). On GitHub I uploaded the [GetFolderName.bas](https://github.com/el3um4s/how-to-export-mdb-to-sqlite-3/blob/main/src/GetFolderName.bas) file with a copy of the code.

### Create the SQLite database

The export involves two distinct operations:

<script src="https://gist.github.com/el3um4s/5fa4bfb98e0966edec415123134a0a7a.js"></script>

First I create a new SQLite database, and then I fill it with Microsoft Access tables.

The simplest way to create a new SQLite database is to start from an existing empty one, copy it to the destination folder and rename it.

<script src="https://gist.github.com/el3um4s/ed6764653b6982339d9433c818e9d492.js"></script>

To copy a file, I must first verify that it exists. To do this I use a simple function:

<script src="https://gist.github.com/el3um4s/442c50c95f387929e1fafdaa0913e307.js"></script>

The same thing for folders; I have to make sure that a destination folder exists. The function `CreateFolder` takes care of this:

<script src="https://gist.github.com/el3um4s/b8c229444745e7733f3959dd61973930.js"></script>

To copy a file I can use `FileCopy filePath, destinationFile`. To delete any previous file with the same name I can instead use `Kill destinationFile`. By merging these snippets I can create the function `CopyAFileDeletingOld`:

<script src="https://gist.github.com/el3um4s/0393de580443506bdc5129611b10c138.js"></script>

### Export the tables

The function that deals with exporting the tables is this:

<script src="https://gist.github.com/el3um4s/990ed147f427a4b6fbcae7ad6c3302fa.js"></script>

The function `updateMessage` is a function that updates the log message and does not contribute to the export:

<script src="https://gist.github.com/el3um4s/1e8cf51933066226d393231a1bd263dc.js"></script>

The important part is `ExportFromOtherDatabaseToSQLite dbAccess, nameTable, destinationFile`. This function accepts as input the location of the source database, the name of the table to be exported and the location of the target database.

<script src="https://gist.github.com/el3um4s/06eb01d330f1e60de43772a27a131632.js"></script>

To make things easier I import the tables which I then have to export using:

```vb
DoCmd.TransferDatabase acImport, "Microsoft Access", dbAccess, acTable, table, table, False
```

Then, after finishing the export, I delete the table with

```vb
DoCmd.DeleteObject acTable, table
```

The function `ExportToSQLite table, dbSQLite` looks for the table `table` and exports it to `dbSQLite`:

<script src="https://gist.github.com/el3um4s/63866ada01ae9f0b2732205661f3a677.js"></script>

Well, that's it with that. This project was very interesting because it required me to do research on some issues of a few decades ago. I found it very instructive to confront some limitations of MS Access. And, to be honest, it's also very frustrating to have to look for workarounds to solve things that I take for granted today.
