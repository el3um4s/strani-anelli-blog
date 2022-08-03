---
title: "Usare VBA per convertire MDB in SQLite"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-08-02 9:00"
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

In questo articolo riporto alcune parti del codice che ho usato per creare un'applicazione che converte file MDB (Microsoft Access 2000) in database SQLite. Non penso che sia un problema comune a molti ma penso sia comodo al me del futuro avere degli appunti un po' più in ordine.

{% include picture img="ExportMDBtoSQLite3.webp" ext="jpg" alt="" %}

Tralascio la parte relativa alla creazione dell'interfaccia, penso sia abbastanza semplice da riprodurre anche senza una guida.

### Inizializzo il menu

All'apertura della maschera principale inizializzo alcuni componenti:

```vb
Private Sub Form_Open(Cancel As Integer)
    Forms!Menu!tableList.RowSource = ""
    Forms!Menu!logExport = ""
    pathOriginal
End Sub
```

Svuoto la lista delle tabelle da esportare impostando il campo RowSource a vuoto.

```vb
Forms!Menu!tableList.RowSource = ""
```

Svuoto anche il log delle operazioni di esportazione impostando il campo logExport a vuoto.

```vb
Forms!Menu!logExport = ""
```

Per semplificare le cose uso come database di esportazione un file uguale per tutti e posizionato nella stessa cartella. Ricavo la posizione dell'applicazione usando `CurrentProject.path`

```vb
Public Function pathOriginal() As String
    Dim result As String
    result = CurrentProject.path & "\NewSQLiteDB.db"

    Forms!Menu!pathOriginalSQLiteDB = result

    pathOriginal = result
End Function
```

### Scelgo il file da esportare

Cliccando su _Choose Database_ scelgo il file MDB da esportare. Dopo aver scelto il file mostro l'elenco delle tabelle e le seleziono tutte (in genere voglio esportate tutto un database, quindi per me è più comodo deselezionare). Infine uso il nome del database di partenza per impostare il nome del database di destinazione:

```vb
Private Sub btnChooseDatabase_Click()
    SelectDatabase
    nameNewDatabaseFromOriginalPath
    ShowListTable
    SelectAllTables
End Sub
```

La funzione per selezionare un file pare abbastanza semplice ma non lo è:

```vb
Public Function SelectDatabase() As String
    Dim path As String
    path = GetOpenFile()

    Forms!Menu!pathDatabase = path

    SelectDatabase = path
End Function
```

Il problema è che MS Access 2000 non possiede un metodo semplice per selezionare un file. Per farlo serve una funzione apposita, `GetOpenFile()`. Non riporto qui il codice, sono circa 300 righe, ma su GitHub ho caricato il file [GetFile.bas](https://github.com/el3um4s/how-to-export-mdb-to-sqlite-3/blob/main/src/GetFile.bas). Il codice non è mio, è stato creato qualche decennio fa da Ken Getz, a sua volta frutto di codice [risalente al 1998](http://vbnet.mvps.org/index.html?code/callback/browsecallback.htm).

Comunque, dopo aver capito come selezionare il database posso ricavare il nome del database di destinazione:

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

In questo caso è sufficiente estrarre l'ultima parte dell'indirizzo con `Right(strFullPath, Len(strFullPath) - InStrRev(strFullPath, "\"))` e poi sostituire l'estensione `mdb` con `db` usano un codice simile a questo: `Left(nameWithExtension, Len(nameWithExtension) - 3) & "db"`.

Per mostrare la lista delle tabelle presente nel database di origine devo scomporre il problema in due parti. La prima è capire come leggere il nome delle tabelle, la seconda come mostrare i nomi a schermo.

Per capire come riempire una listbox è stato utile il post [Listbox Add/Remove Item AC2000](https://www.599cd.com/tips/access/listbox-additem-2000/). In sintesi basta passare la lista dei nomi, separati da `;` al controllo tramite la proprietà `RowSource`: `MyList.RowSource = "Table1;Table2;Table3"`.

Invece per leggere i nomi delle tabelle devo stabilire una connessione al database:

```vb
Dim db As DAO.database
Dim tdf As DAO.TableDef

Set db = OpenDatabase(pathDatabase, False)
```

Poi posso usare la [TableDefs collection (DAO)](https://docs.microsoft.com/en-us/office/client-developer/access/desktop-database-reference/tabledefs-collection-dao) per estrarre i nomi delle tabelle:

```vb
For Each tdf In db.TableDefs
  Debug.Print tdf.name
Next
```

Però non mi interessano i nomi delle tabelle di sistema o di quelle temporanee. Per evitare di aggiungere alla lista posso semplicemente filtrarle:

```vb
For Each tdf In db.TableDefs
  If Not (tdf.name Like "MSys*" Or tdf.name Like "~*") Then
    Debug.Print tdf.name
  End If
Next
```

Unendo il tutto ottengo la funzione `ShowListTable`:

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

Per selezionare tutte le tabelle nella list box uso una funzione scritta da [Allen Browne](http://allenbrowne.com/)

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

### Scelgo la cartella di destinazione

Anche scegliere la cartella di destinazione pare una cosa semplice, se non fosse che non lo è. O per lo meno non lo era alla fine degli anni 90.

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

In questo caso la funzione `BrowseFolder` è una funzione che si occupa di aprire una finestra di dialogo per selezionare una cartella. Il codice originale è di [Terry Kreft](http://access.mvps.org/access/api/). Su GitHub ho caricato il file [GetFolderName.bas](https://github.com/el3um4s/how-to-export-mdb-to-sqlite-3/blob/main/src/GetFolderName.bas) con una copia del codice.

### Creare il database SQLite

L'esportazione vera e propria prevede due operazioni distinte:

```vb
Private Sub btnExportTo_Click()
  createNewDatabase
  exportSelectedTables

  MsgBox "COMPLETED"
End Sub
```

Per prima cosa creo un nuovo database SQLite, e poi lo riempio con le tabelle di Microsoft Access.

Il metodo più semplice per creare un nuovo database SQLite è di partire da uno vuoto già esistente, copiarlo nella cartella di destinazione e rinominarlo.

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

Per copiare un file devo prima di tutto verificare che esista. Per farlo uso una funzione semplice:

```vb
Public Function DoesFileExist(ByRef filePath) As Boolean
  DoesFileExist = Dir(filePath) <> ""
End Function
```

La stessa cosa per le cartelle; devo assicurarmi che a cartella di destinazione esista. La funzione `CreateFolder` si occupa di questo:

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

Per copiare un file posso usare `FileCopy filePath, destinationFile`. Per eliminare un eventuale file precedente con lo stesso nome posso invece usare `Kill destinationFile`. Unendo questi pezzi di codice posso creare la funzione `CopyAFileDeletingOld`:

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

### Esportare le tabelle

La funzione che si occupa di esportare le tabelle è questa:

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

La funzione `updateMessage` è solamente una funzione che aggiorna il messaggio di log e non concorre all'esportazione:

```vb
Public Function updateMessage(ByVal message As String) As String
  Application.Echo False

  Forms!Menu!logExport = message
  Forms!Menu!logExport.Requery

  Application.Echo True

  updateMessage = message
End Function
```

La parte importante è `ExportFromOtherDatabaseToSQLite dbAccess, nameTable, destinationFile`. Questa funzione accetta in ingresso la posizione del database di origine, il nome della tabella da esportare e la posizione del database di destinazione.

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

Per semplificare le cose importo le tabelle che devo poi esportare usando:

```vb
DoCmd.TransferDatabase acImport, "Microsoft Access", dbAccess, acTable, table, table, False
```

Poi, dopo aver finito l'esportazione, elimino la tabella con

```vb
  DoCmd.DeleteObject acTable, table
```

La funzione `ExportToSQLite table, dbSQLite` cerca la tabella `table` e la esporta in `dbSQLite`:

```vb
Public Function ExportToSQLite(ByVal table As String, ByVal database As String) As Boolean

  DoCmd.TransferDatabase acExport, "ODBC", "ODBC;DSN=SQLite3 Datasource;Database=" & database & ";StepAPI=0;SyncPragma=NORMAL;NoTXN=0;Timeout=100000;ShortNames=0;LongNames=0;NoCreat=0;NoWCHAR=0;FKSupport=0;JournalMode=;OEMCP=0;LoadExt=;BigInt=0;JDConv=0;", acTable, table, table, False

  ExportToSQLite = True
End Function
```

Bene, con questo è tutto. Questo progetto è stato molto interessante perché mi ha richiesto un lavoro di ricerca su alcune problematiche di qualche decennio fa. Ho trovato molto istruttivo confrontarmi con alcuni limiti di MS Access. E, a dire il vero, anche molto frustante dover cercare dei workaround per risolvere cose che oggi dò per scontate.
