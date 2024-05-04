---
title: Come Collegare Maschere Tra Database di Microsoft Access
published: true
date: 2022-10-27 15:30
categories:
  - Database
  - MS Access
  - VBA
tags:
  - Database
  - Access
  - VBA
lang: it
cover: image.webp
description: Uno dei problemi che mi sono ritrovato più spesso ad affrontare, con Microsoft Access, è la duplicazione del codice. Intesa non solo come duplicazione di codice VBS, ma anche di query, macro, procedure, ecc. In questo articolo vedremo come collegare maschere tra database di Microsoft Access, in modo da usare la stessa maschera tra più database.
---

Uno dei problemi che mi sono ritrovato più spesso ad affrontare, con Microsoft Access, è la duplicazione del codice. Intesa non solo come duplicazione di codice VBS, ma anche di query, macro, procedure, ecc. In questo articolo vedremo come collegare maschere tra database di Microsoft Access, in modo da usare la stessa maschera tra più database.

Il procedimento, dopo averlo compreso, è abbastanza semplice e intuitivo. Prevede questi passaggi:

1. Creare un database di riferimento, che conterrà le maschere da utilizzare
2. Creare gli altri database
3. Collegare i database al database di riferimento
4. Richiamare le maschere quando servono

### Creare un database di riferimento

In questo post non voglio complicare troppo le cose, quindi creo un database semplice (lo chiamo `notes`). Contiene una sola tabella, `tbNotes` con 2 campi: `ID` e `Note`. Inoltre, contiene due maschere. La prima, `frmNotes`, che permette di inserire le varie note e di eliminarle.

![ms-notes-demo.gif](./ms-notes-demo.gif)

La seconda maschera serve per visualizzare la posizione del database aperto, e quella della maschera collegata.

Per semplicità creo due funzioni:

```vb
Public Function getNameCurrentDB()
    Dim db As DAO.Database
    Set db = CurrentDb()

    Dim name As String
    name = db.name

    Set db = Nothing

    getNameCurrentDB = name
End Function

Public Function getNameFormDB()
    Dim db As DAO.Database
    Set db = CodeDb()

    Dim name As String
    name = db.name

    Set db = Nothing

    getNameFormDB = name
End Function
```

In modo da ottenere qualcosa di simile a questo:

![Immagine](./mainDB.webp)

Mi servono anche due funzioni per aprire le due maschere:

```vb
Public Sub openFormNotes()
    DoCmd.OpenForm "frmNotes"
End Sub

Public Sub openFormInfo()
    DoCmd.OpenForm "frmInfo"
End Sub
```

### Creare gli altri database

Ora che ho il database con le maschere di riferimento posso creare altri database. Creo il database `otherNotes`. Per il momento creo una maschera con due pulsati, ma senza implementare il codice:

![Immagine](./dbMenu.webp)

Per poter effettivamente collegare le maschere devo aggiungere un riferimento al progetto. Vado sull'editor di Visual Basic for Applications (VBA) e clicco su `Tools` > `References`. Da qui posso selezionare il database di riferimento, `notes.mdb`.

Questa è la soluzione più semplice ma preferisco implementare una funzione generale da richiamare all'occorrenza.

```vb
Public Function AddReference(referenceToImport As String, nameDatabase As String)
    Dim reference As reference

    For Each reference In Access.References
        Dim nameReference As String
        nameReference = reference.Name
        If nameReference = referenceToImport Then
            Access.References.Remove reference
        End If
    Next reference

    Set reference = References.AddFromFile(nameDatabase)
End Function
```

Per prima cosa mi assicuro che non esista già lo stesso riferimento. Se c'è lo rimuovo. Poi aggiungo nuovamente il riferimento al database con cui voglio collegarmi.

In questo modo posso collegarmi a più database, senza dover aggiungere manualmente i riferimenti.

Creo alcuni controlli e aggiungo un pulsante

![Immagine](./dbMenuWithLinks.webp)

Implemento quindi una funzione del genere:

```vb
Private Sub linkForms_Click()
    On Error GoTo Err_linkForms_Click

    Dim nameReference As String
    nameReference = Forms![Menu]!NameReference.Value

    Dim nameDatabase As String
    nameDatabase = Forms![Menu]!NameDatabase.Value

    AddReference nameReference, nameDatabase

Exit_linkForms_Click:
    Exit Sub

Err_linkForms_Click:
    Resume Exit_linkForms_Click
End Sub
```

Dopo aver collegato i due database posso richiamare le funzioni per aprire le maschere.

```vb
Public Function openNotes()
    Notes.openFormNotes
End Function

Public Function openInfo()
    Notes.openFormInfo
End Function
```

Il risultato finale è questo:

![ms-notes-demo.gif](./showFormsLinked.gif)

Bene, con questo è tutto. Ho creato un repository con il codice dell'esempio. Lo trovate qui: [el3um4s/how-to-link-forms-in-access](https://github.com/el3um4s/how-to-link-forms-in-access)
