---
title: "File System Access API"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Shubham Bombarde**](https://unsplash.com/@shubhambombarde)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-02-07 20:00"
categories:
  - Construct 3
  - Template
  - JavaScript
tags:
  - Construct 3
  - JavaScript
  - Template
  - Text
  - Editor
  - File System
  - API
---

Questa settimana ho sperimentato con il recente `File System Access API`: è una tecnologia che permette di creare delle web app in grado di di interagire con i file su un device locale (per esempio il PC o lo smartphone). Questo permette, in potenza, di creare video e foto editor, IDE, editor di testo e molto altro: è possibile leggere e modificare direttamente file e cartelle sul dispositivo dell'utente come se si stesse utilizzando un programma "classico".

Ho deciso di provare a ricreare con Construct 3 un editor di testo con funzionalità simili a quello sviluppato da [Google Chrome Labs](https://github.com/GoogleChromeLabs) ([questo qui](https://googlechromelabs.github.io/text-editor/)). Ho anche seguito alcune delle indicazioni date da web.dev nell'articolo _[The File System Access API: simplifying access to local files](https://web.dev/file-system-access/)_.

Ovviamente ho anche condiviso il tutto su GitHub:
- [il progetto su GitHub](https://github.com/el3um4s/construct-demo)
- [la demo online](https://c3demo.stranianelli.com/javascript/008-text-editor/demo/)

e nei prossimi giorni anche su [Patreon](https://www.patreon.com/el3um4s).

Detto questo, cominciamo con la struttura del progetto:

{% include picture img="struttura-app.webp" ext="jpg" alt="" %}

Per il momento tralascio alcuni aspetti "marginali" rispetto all'utilizzo del `File System Access API` e mi concentro su due moduli: [`manageFiles.js`](https://github.com/el3um4s/construct-demo/blob/master/javascript/008-text-editor/source/files/scripts/managefiles.js) e [`fileSystemAccess.js`](https://github.com/el3um4s/construct-demo/blob/master/javascript/008-text-editor/source/files/scripts/filesystemaccess.js). Proprio in quest'ultimo possiamo trovare alcune funzioni:

- openFile
- write
- saveAs
- saveFile
- loadFromFile
- getNewFileHandle

Vediamole una per una.

### openFile

```js
export async function openFile({description = "Text Files", accept = {'text/plain': ['.txt', '.md']}} = {}) {
	const options = {types:[{description, accept}]};
	 try {
	 	[Globals.fileHandle] = await window.showOpenFilePicker(options);
		const filePicked = await Globals.fileHandle.getFile();
		const contents = await filePicked.text();
		return {ok: true, filePicked: filePicked, contents: contents};
	 } catch (err) {
		return {ok: false, filePicked: null, contents: null};
	 }
}
```

Tralascio per semplicità, qui e poi, la spiegazione della gestione degli errori tramite `try...catch` e mi concentro sulla prima operazione: [`window.showOpenFilePicker()`](https://wicg.github.io/file-system-access/#api-showopenfilepicker). Questa funzione permette di aprire una finestra di dialogo da cui scegliere uno o più file su disco. Viene quindi restituito un array contente i riferimenti a tutti i file selezionati. È possibile passare come argomento un oggetto in cui impostare alcune opzioni. Di default viene selezionato un solo file, e questo è proprio quello che ci serve.

Eseguendo quindi 

```js
	[Globals.fileHandle] = await window.showOpenFilePicker(options);
```

assegno a `Globals.fileHandle` un array di [`FileSystemFileHandle`](https://wicg.github.io/file-system-access/#filesystemfilehandle), in questo caso composto da un solo elemento contente metodi e proprietà per interagire con il file selezionato.

Nota: non ho ancora implementato un metodo per tenere traccia di tutti i file aperti, ma solamente di uno solo. Però farlo permetterebbe di implementare una lista di _file recenti_ da usare come scorciatoia per aprire gli ultimi file su cui abbiamo lavorato.

Comunque, dall'handle possiamo accedere direttamente al [`file`](https://w3c.github.io/FileAPI/) tramite

```js
const filePicked = await Globals.fileHandle.getFile();
```

e quindi ottenere il testo contenuto nel file stesso usando

```js
const contents = await filePicked.text();
```

### write

```js
export async function write(contents) {
	try {
		const writable = await Globals.fileHandle.createWritable();
		await writable.write(contents);
		await writable.close();
		return {ok: true}
	} catch (err) {
		return {ok: false}
	}	
}
```

La seconda funzione, `write` permette di salvare le modifiche apportate al testo direttamente sul file. Per farlo usiamo l'interfaccia [`FileSystemWritableFileStream`](https://wicg.github.io/file-system-access/#api-filesystemwritablefilestream) e apriamo un collegamento con il file tramite

```js
const writable = await Globals.fileHandle.createWritable();
```

Fatto questo è possibile scrivere nel file tramite

```js
await writable.write(contents);
```

Infine chiudiamo il collegamento usando `await writable.close()`.

**Attenzione!** È importante chiuderlo perché il file verrà scritto sul disco solamente al momento della chiusura.

### saveAs

```js
export async function saveAs(contents, {description = "Text Files", accept = {'text/plain': ['.txt', '.md']}} = {} ) {
	const handle = await getNewFileHandle({description, accept});
	if (handle.ok){
		Globals.fileHandle = handle.handle;
		try {
			const writable = write(contents);
			return {ok: writable.ok };
		} catch (err) {
			return {ok: false};
		}
	} else {
		return {ok: false};
	}
}
```

Da adesso in poi è tutto concettualmente più semplice: la funzione per _Salvare con nome_ un file richiede semplicemente di aprire una nuova finestra di dialogo per identificare nome e posizione del file da salvare. Per farlo richiamo `getNewFileHandle()` e quindi `write()`.

Cosa è `getNewFileHandle`? È semplicemente una funzione che richiama `window.showOpenFilePicker(options)`, con però in aggiunta un messaggio di errore personalizzato per avvisare se qualcosa va storto nel salvataggio del file.

### saveFile

```js
export async function saveFile(contents, {description = "Text Files", accept = {'text/plain': ['.txt', '.md']}} = {} ) {
	if (Globals.fileHandle  == null ) {
		await saveAs(contents, {description, accept});
	} else {
		await write(contents);
	}
}
```

`saveFile` è ancora più semplice perché non fa altro che controllare se esiste un riferimento al file. Se esiste salva direttamente su disco, altrimenti significa che stiamo lavorando su un file nuovo: in questo caso verrà usata la funzione `saveAs`.

### loadFromFile

```js
export async function loadFromFile() {
	try {
		const filePicked = await Globals.fileHandle.getFile();
		const contents = await filePicked.text();
		return {ok: true, filePicked: filePicked, contents: contents};
	} catch (err) {
		return {ok: false, filePicked: null, contents: null};
	}
}
```

Anche questa funzione è davvero facile: ricarica il contenuto del file originale, eliminando di fatto tutte le modifiche non salvate. È sufficiente riaprire il file, usando come handle quello che abbiamo salvato all'inizio.

Con questo la struttura base è completata. Manca però un metodo semplice per integrare tutto questo con il nostro editor. Per farlo ci serve un nuovo modulo: `manageFiles.js`.

### ManageFiles.js

```js
import Globals from "./globals.js";
import * as FileSystemAccess from "./fileSystemAccess.js";

function insertText(text = "") {
	g_runtime.objects.TextInput.getFirstInstance().text = text;
}

function getText() {
	return g_runtime.objects.TextInput.getFirstInstance().text;
}

export function newFile() {
	insertText("");
	Globals.fileHandle = null;
}

export async function openFile() {
	const contents = await FileSystemAccess.openFile();
	if (contents.ok) { 
		const text = contents.contents;
		insertText(text);
	}
}

export async function saveFile() {
	const text = getText();
	await FileSystemAccess.saveFile(text);
}

export async function saveAs(){
	const text = getText();
	await FileSystemAccess.saveAs(text);
}

export async function reloadFile(){
	const contents = await FileSystemAccess.loadFromFile();
	if (contents.ok) { 
		const text = contents.contents;
		insertText(text);
	}
}
```

Mi concentro solamente su due funzioni, `insertText` e `getText`. Entrambe utilizzano 

```js
g_runtime.objects.TextInput.getFirstInstance().text
```

per accedere alla casella di testo in Construct 3. La prima ne modifica il testo contenuto, la seconda lo legge. Questo è necessario per permettere a C3 di mostrare correttamente il contenuto dell'elemento.

Le funzioni successive non fanno altro che richiamare quelle del modulo `FileSystemAccess` collegandole all'editor vero e proprio.

Detto questo, come al solito potete trovare tutto qui:
- [il progetto su GitHub](https://github.com/el3um4s/construct-demo)
- [la demo online](https://c3demo.stranianelli.com/javascript/008-text-editor/demo/)
- e nei prossimi giorni anche su [Patreon](https://www.patreon.com/el3um4s)