---
published: false
title: "Construct 3 ed Electron: avviare un gioco"
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "electron-e-c3"
  immagine_estesa: "electron-e-c3"
  immagine_fonte: "Photo credit: [**Erik Mclean**](https://unsplash.com/@introspectivedsgn)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2020-02-18 16:00"
categories:
  - 100DaysOfCode
  - Construct 3
tags:
  - 100DaysOfCode
  - Construct 3
  - ElectronJS
---

Come [preannunciato qualche giorno fa]({% post_url 2020-02-15-e-ora-di-ragionare-sulle-cose-vecchie-parte-1 %}) ho deciso di scrivere una breve guida, a mio uso e consumo, su come integrare un gioco creato con [Construct 3](https://www.construct.net/en) ed [Electron](https://www.electronjs.org/). Userò come esempio [KiwyStory](https://www.construct.net/en/free-online-games/kiwis-adventure-1/play) e come guida base il tutorial [Writing Your First Electron App](https://www.electronjs.org/docs/tutorial/first-app). Cominciamo.

### Come esportare un gioco Construct 3

Per poter usare un gioco C3 con Electron occorre esportarlo come HTML. Qui c'è piccolo problema: se scegliamo l'opzione predefinita (Web HTML 5) dobbiamo modificare alcune parti del codice esportato. In compenso è possibile usare l'opzione **Scirra Arcade**:

{% include picture img="esporta-come-scirra-arcade.webp" ext="jpg" alt="Esporta come Scirra Arcade" %}

Ovviamente occorre scaricare il file ZIP ottenuto ed estrarre i vari file lì contenuti. Per il momento è sufficiente salvarli da qualche parte sul PC, serviranno tra poco.

### Inizializzare Electron

Un'applicazione Electron non è nient'altro che una applicazione basata su NodeJS. Quindi, se non lo avessimo già fatto va prima installato NodeJS ([e qui ci sono tutti i file necessari](https://nodejs.org/en/download/)). Fatto questo cominciamo con il creare una nuova cartella. Entriamo quindi nella cartella tramite la linea di comando (io utilizzo la _Windows Power Shell_) e inizializziamo una nuova applicazione con il comando:

~~~
npm init
~~~

Il processo di creazione del file `package.json` è abbastanza banale, basta rispondere alle domande poste. Come processo principale, in questo esempio, uso `index.js` ma è possibile usare anche `main.js`: è una questione di abitudine e di gusto.

Fatto questo va modificato il file `package.json` aggiungendo il comando `start: electron .`. Il mio file, adesso, è simile a questo:

~~~json
{
  "name": "prova-electron-c3",
  "version": "1.0.0",
  "description": "Versione di prova",
  "main": "index.js",
  "scripts": {
    "start": "electron ."
  }
}
~~~

### "Installare" Electron

Ovviamene non basta questo per avere ElectronJS: devo ancora aggiungerlo come dipendenza del progetto. Per farlo eseguo il comando:

~~~
npm install --save-dev electron
~~~

### Inserire il gioco

Per la parte teorica meglio cercare la spiegazione sul sito di Electron. Per quello che serve qui basta sapere due cose:

1. il file `index,js` è fondamentale, serve per avviare una pagina HTML in una sua finestra e gestisce vari compiti
2. serve un file HTML da usare come prima pagina del progetto

È quindi giunto il momento di prendere i file scaricati da Construct 3 e copiarli nella cartella del progetto di Electron. Vanno copiati dentro una nuova cartella chiamata `src`.

{% include picture img="cartelle-c3-ed-electron.webp" ext="jpg" alt="Posizione dei file" %}

È importante mantenere questa struttura per permettere ad Electron di funzionare bene.

Per quanto riguarda il file `index.js`, ecco il codice che ho utilizzato:

~~~js
const electron = require('electron');
const path = require('path');
const url = require('url');

const {
  app,
  BrowserWindow
} = electron;

let mainWindow;

// 426x240
app.on('ready', () => {
	mainWindow = new BrowserWindow({
		width: 426,
		height: 240,
		useContentSize: true,
		center:true,
		show: false,
		backgroundColor: '#420024',
		title: "KiwiStory (C3 & Electronjs)",
		icon: path.join(__dirname, '/src/icons/icon-256.png')
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'src', 'index.html'),
		protocol: 'file:',
		slashes: true
	}))


	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	})

	mainWindow.on('closed', () => {
		mainWindow = null;
	})
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
~~~

Ovviamente è possibile personalizzare i vari aspetti, però per questo esempio è sufficiente.

### Eseguire Electron

Dopo aver completato questi passaggi è possibile avviare il gioco digitando il comando

~~~
npm start
~~~

Ma per creare un file eseguibile? Ne parlerò domani.

Ah, dimenticavo, questi sono i link due file su cui ho lavorato:

* **[index.js]()**
* **[package.json]()**
