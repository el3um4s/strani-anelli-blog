---
title: "Construct 3: come personalizzare l'esportazione in HTML"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "head"
  immagine_estesa: "head"
  immagine_fonte: "Photo credit: [**Raja V**](https://unsplash.com/@rajavijayaraman)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2020-02-29 14:30"
categories:
  - 100DaysOfCode
  - Construct 3
tags:
  - 100DaysOfCode
  - Construct 3
  - JavaScript
---

Risistemando i miei plugin mi sono imbattuto in un limite di Construct 3: non è possibile personalizzare il file HTML. Il che non è un gran problema, a dire il vero, perché si può sempre editare con un qualsiasi editor. Però, soprattutto in fase di sviluppo, diventa una faccenda noiosa e anche ripetitiva. Per fortuna è possibile automatizzare il tutto.

Per farlo è sufficiente utilizzare un semplice script JS:

~~~js
const configJSON = await runtime.assets.fetchJson("config.json");

Object.entries(configJSON).forEach(([tag, value]) => {
	value.forEach(el => {
    	let stringHTML = `<${tag} ` ;
        Object.entries(el).forEach(([k, v]) => {
			stringHTML += ` ${k}='${v}'`;
        });
        stringHTML += ` />`;
        document.head.insertAdjacentHTML('beforeend', stringHTML);
     });
});
~~~

Cosa fa?

Allora, vediamo le cose principali:

~~~js
const configJSON = await runtime.assets.fetchJson("config.json");
~~~

Carica il contenuto del file `config.json` dentro una variabile di tipo `CONST`.

~~~js
Object.entries(oggettoJSON).forEach( ([chiave, valore]) ==> {
  console.log(chiave, valore);
});
~~~

Questo pezzetto di codice scorre tutto l'oggetto JSON e permette di lavorare su ogni chiave dell'oggetto.

~~~js
document.head.insertAdjacentHTML('beforeend', stringHTML);
~~~

Con questo inserisco una stringa html subito prima del tag di chiusura dell'elemento selezionato (nel DOM); in questo caso prima di chiudere l'`HEAD`.

Unendo questi tre pezzetti si può ottenere, in pratica, un semplice codice che scorre un file `config.json` scritto nella forma:

~~~json
{
	"meta": [
		{
			"name": "description",
			"content": "Demo Plugin - Construct 3"
		},
		{
			"name": "author",
			"content": "Strani Anelli"
		}
	],
	"base": [
		{
			"href": "https://c3plugins.stranianelli.com/"
		}
	]
}
~~~

per inserire dentro l'head

~~~html
<meta name="description" content="Demo Plugin - Construct 3">
<meta name="author" content="Strani Anelli">
<base href="https://c3plugins.stranianelli.com/">
~~~

Ovviamente questo permette di modificare il file HTML durante l'esecuzione del progetto (non necessariamente un gioco). Questo è il suo limite principale, perché impedisce di usare con efficacia questa tecnica per aggiungere elementi [Open Graph](https://ogp.me/).

Ovviamente, questo è il [link al file C3P con un progetto demo](https://blog.stranianelli.com/c3p/custom-head-web.c3p).
