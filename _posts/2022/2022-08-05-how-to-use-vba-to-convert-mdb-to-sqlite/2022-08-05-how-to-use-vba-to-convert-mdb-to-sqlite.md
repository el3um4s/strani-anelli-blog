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

```vb
Private Sub Form_Open(Cancel As Integer)
    Forms!Menu!tableList.RowSource = ""
    Forms!Menu!logExport = ""
    pathOriginal
End Sub
```

I empty the list of tables to export by setting the RowSource field to empty.

```vb
Forms!Menu!tableList.RowSource = ""
```

I also empty the log of export operations by setting the logExport field to empty.

```vb
Forms!Menu!logExport = ""
```

I simplify by always using the same source database. I put the database in the same folder as the main program. I derive the location of the application using `CurrentProject.path`

```vb
Public Function pathOriginal() As String
    Dim result As String
    result = CurrentProject.path & "\NewSQLiteDB.db"

    Forms!Menu!pathOriginalSQLiteDB = result

    pathOriginal = result
End Function
```

### Choose the file to export

By clicking on _Choose Database_ I choose the MDB file to export. After choosing the file I show the list of tables and select them all (generally I want to export a whole database). Finally I use the source database name to set the target database name:

```vb
Private Sub btnChooseDatabase_Click()
    SelectDatabase
    nameNewDatabaseFromOriginalPath
    ShowListTable
    SelectAllTables
End Sub
```

The function to select a file seems simple enough but it is not:

```vb
Public Function SelectDatabase() As String
    Dim path As String
    path = GetOpenFile()

    Forms!Menu!pathDatabase = path

    SelectDatabase = path
End Function
```

The problem is that MS Access 2000 doesn't have an easy way to select a file. To do this you need a special function `GetOpenFile()`. I'm not reporting the code here, it's about 300 lines, but on GitHub I uploaded the [GetFile.bas](https://github.com/el3um4s/how-to-export-mdb-to-sqlite-3/blob/main/src/GetFile.bas). The code is not mine, it was created a few decades ago by Ken Getz, himself the result of code dating [back to 1998](http://vbnet.mvps.org/index.html?code/callback/browsecallback.htm).

Anyway, after figuring out how to select the database I can get the name of the target database:

```vb
Public Function nameNewDatabaseFromOriginalPath() As String
    Dim strFullPath As String
    strFullPath = Forms!Menu!pathDatabase

    Dim nameWithExtension As String
    nameWithExtension = Right(strFullPath, Len(strFullPath) - InStrRev(strFullPath, "\"))

    Dim name As String
    name = Left(nameWithExtension, Len(nameWithExtension) - 3) & "db"

    Forms!Menu!nameNewDatabase = name

    nameNewDatabaseFromOriginalPath = name
End Function
```

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

```vb
Public Function ShowListTable() As Boolean
  Forms!Menu!tableList.RowSource = ""
  Dim database As String
  database = Forms!Menu!pathDatabase

  Dim db As DAO.database
  Dim tdf As DAO.TableDef

  Set db = OpenDatabase(database, False)

  For Each tdf In db.TableDefs
      If Not (tdf.name Like "MSys*" Or tdf.name Like "~*") Then
          If Forms!Menu!tableList.RowSource = "" Then
              Forms!Menu!tableList.RowSource = tdf.name
          Else
              Forms!Menu!tableList.RowSource = Forms!Menu!tableList.RowSource & ";" & tdf.name
          End If
      End If
  Next
  ShowListTable = True
End Function
```

To select all the tables in the list box I use a function written by [Allen Browne](http://allenbrowne.com/)

```vb
Public Function SelectAllTables() As Boolean
  ListBoxSelectAll Forms!Menu!tableList
  SelectAllTables = ListBoxSelectAll(Forms!Menu!tableList)
End Function

Public Function ListBoxSelectAll(ByVal lst As ListBox) As Boolean
  Dim lngRow As Long

  If lst.MultiSelect Then
      For lngRow = 0 To lst.ListCount - 1
          lst.Selected(lngRow) = True
      Next
      ListBoxSelectAll = True
  End If

  ListBoxSelectAll = True
End Function
```

### Choose the destination folder

Even choosing the destination folder seems a simple thing, except that it is not. Or at least it wasn't in the late 1990s.

```vb
Private Sub btnDestinationFolder_Click()
  SelectDestinationFolder
End Sub

Public Function SelectDestinationFolder() As String
  Dim path As String
  path = BrowseFolder("Select destination folder")

  Forms!Menu!destinationFolder = path

  SelectDestinationFolder = path
End Function
```

The function `BrowseFolder` is a function that takes care of opening a dialog box to select a folder. The original codex is by [Terry Kreft](http://access.mvps.org/access/api/). On GitHub I uploaded the [GetFolderName.bas](https://github.com/el3um4s/how-to-export-mdb-to-sqlite-3/blob/main/src/GetFolderName.bas) file with a copy of the code.

### Create the SQLite database

The export involves two distinct operations:

```vb
Private Sub btnExportTo_Click()
  createNewDatabase
  exportSelectedTables

  MsgBox "COMPLETED"
End Sub
```

First I create a new SQLite database, and then I fill it with Microsoft Access tables.

The simplest way to create a new SQLite database is to start from an existing empty one, copy it to the destination folder and rename it.

```vb
Public Function createNewDatabase() As Boolean
  Dim originalDB As String
  originalDB = Forms!Menu!pathOriginalSQLiteDB

  Dim newNameDB As String
  newNameDB = Forms!Menu!nameNewDatabase

  Dim destinationFolder As String
  destinationFolder = Forms!Menu!destinationFolder

  CreateFolder destinationFolder

  Dim destinationFile As String
  destinationFile = destinationFolder & "\" & newNameDB

  CopyAFileDeletingOld originalDB, destinationFile

  createNewDatabase = DoesFileExist(destinationFile)
End Function
```

To copy a file, I must first verify that it exists. To do this I use a simple function:

```vb
Public Function DoesFileExist(ByRef filePath) As Boolean
  DoesFileExist = Dir(filePath) <> ""
End Function
```

The same thing for folders; I have to make sure that a destination folder exists. The function `CreateFolder` takes care of this:

```vb
Public Function DoesFolderExist(ByRef folderPath As String) As Boolean
  DoesFolderExist = Dir(folderPath, vbDirectory) <> ""
End Function

Public Function CreateFolder(ByRef folderPath As String) As Boolean
  If Not DoesFolderExist(folderPath) Then
    MkDir folderPath
  End If
  CreateFolder = DoesFolderExist(folderPath)
End Function
```

To copy a file I can use `FileCopy filePath, destinationFile`. To delete any previous file with the same name I can instead use `Kill destinationFile`. By merging these snippets I can create the function `CopyAFileDeletingOld`:

```vb
Public Function CopyAFileDeletingOld(ByRef filePath As String, ByRef destinationFile As String) As Boolean
  If DoesFileExist(filePath) Then
    If DoesFileExist(destinationFile) Then
        Kill destinationFile
    End If
    FileCopy filePath, destinationFile
  End If

  CopyAFileDeletingOld = Dir(destinationFile) <> ""
End Function
```

### Export the tables

The function that deals with exporting the tables is this:

```vb
Public Function exportSelectedTables() As Boolean

  Dim dbAccess As String
  dbAccess = Forms!Menu!pathDatabase

  Dim newNameDB As String
  newNameDB = Forms!Menu!nameNewDatabase

  Dim destinationFolder As String
  destinationFolder = Forms!Menu!destinationFolder

  Dim destinationFile As String
  destinationFile = destinationFolder & "\" & newNameDB

  updateMessage "START"

  Dim t As Variant
  For Each t In Forms!Menu!tableList.ItemsSelected()
    Dim nameTable As String
    nameTable = Forms!Menu!tableList.Column(0, t)

    Dim message As String
    message = Forms!Menu!logExport
    updateMessage nameTable & ": EXPORT" & vbCrLf & message

    ExportFromOtherDatabaseToSQLite dbAccess, nameTable, destinationFile

    updateMessage nameTable & ": OK" & vbCrLf & message
  Next

  exportSelectedTables = True
End Function
```

The function `updateMessage` is a function that updates the log message and does not contribute to the export:

```vb
Public Function updateMessage(ByVal message As String) As String
  Application.Echo False

  Forms!Menu!logExport = message
  Forms!Menu!logExport.Requery

  Application.Echo True

  updateMessage = message
End Function
```

The important part is `ExportFromOtherDatabaseToSQLite dbAccess, nameTable, destinationFile`. This function accepts as input the location of the source database, the name of the table to be exported and the location of the target database.

```vb
Public Function ExportFromOtherDatabaseToSQLite(ByVal dbAccess As String, ByVal table As String, ByVal dbSQLite As String) As Boolean

  Dim db As DAO.database
  Set db = OpenDatabase(dbAccess, False)

  DoCmd.TransferDatabase acImport, "Microsoft Access", dbAccess, acTable, table, table, False

  ExportToSQLite table, dbSQLite

  DoCmd.DeleteObject acTable, table
  db.Close

  ExportFromOtherDatabaseToSQLite = True
End Function
```

To make things easier I import the tables which I then have to export using:

```vb
DoCmd.TransferDatabase acImport, "Microsoft Access", dbAccess, acTable, table, table, False
```

Then, after finishing the export, I delete the table with

```vb
DoCmd.DeleteObject acTable, table
```

The function `ExportToSQLite table, dbSQLite` looks for the table `table` and exports it to `dbSQLite`:

```vb
Public Function ExportToSQLite(ByVal table As String, ByVal database As String) As Boolean

  DoCmd.TransferDatabase acExport, "ODBC", "ODBC;DSN=SQLite3 Datasource;Database=" & database & ";StepAPI=0;SyncPragma=NORMAL;NoTXN=0;Timeout=100000;ShortNames=0;LongNames=0;NoCreat=0;NoWCHAR=0;FKSupport=0;JournalMode=;OEMCP=0;LoadExt=;BigInt=0;JDConv=0;", acTable, table, table, False

  ExportToSQLite = True
End Function
```

Well, that's it with that. This project was very interesting because it required me to do research on some issues of a few decades ago. I found it very instructive to confront some limitations of MS Access. And, to be honest, it's also very frustrating to have to look for workarounds to solve things that I take for granted today.
