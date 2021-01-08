---
title: "Construct 3, Unit Test e JsUnit"
published: false
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "old-unit-test"
  immagine_estesa: "old-unit-test"
  immagine_fonte: "Photo credit: [**Lorenzo Herrera**](https://unsplash.com/@lorenzoherrera)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-01-08 18:00"
categories:
  - Construct 3
tags:
  - Construct 3
  - JavaScript
  - Unit Test
---

Ultimamente, complice anche un libro regalato, sto rivalutando una mia vecchia idea: usare un approccio più **TDD (Test Driven Development)** nei miei esperimenti con **Construct 3**. C'è però un problema: pare non esista qualcosa di precucinato da usare. Questo mi ha costretto a fare alcune ricerche e a ipotizzare una soluzione. Soluzione che non so ancora se e come e quando implementerò.

Comincio con il problema principale. Da quello che ho compreso, tutti i [principali framework per Unit Test in JavaScript](https://en.wikipedia.org/wiki/List_of_unit_testing_frameworks#JavaScript) sono pensati per funzionare con NodeJs, o comunque da locale. Construct 3 è completamente online, e per quanto sia possibile [lavorare su una cartella locale](https://www.construct.net/en/forum/construct-3/general-discussion-7/local-file-folder-saves-chrome-147071) mi piacerebbe avere la possibilità di eseguire i test senza lasciare il browser. Ammesso che sia possibile.

Il primo tentativo è stato riesumare **[Unit.js](https://github.com/unitjs/unit.js)**. Non ci ho dedicato molto tempo, questo è vero, ma integrare una libreria così vecchia in C3 richiederebbe una parziale riscrittura. Onestamente non so se ne vale la pena. Stesso discorso per **[QUnit](https://qunitjs.com/)**. Lo ammetto, non ho nessuna voglia di imbarcarmi in una cosa del genere, sono troppo pigro, ho troppo poco tempo a disposizione e, probabilmente, mi serve uno strumento meno raffinato.

A questo punto della mia ricerca sono incappato in un'interessante articolo su Medium: **[JsUnit(s): The First JavaScript Unit Testing Libraries](https://medium.com/@denny.headrick/jsunit-s-the-first-javascript-unit-testing-libraries-af57d51d6ea1)**. La cosa interessante, al di là dell'excursus storico, è la semplicità del primo tentativo di integrare gli Unit Test in JavaScript: [JSUnit.zip](https://blog.stranianelli.com/zip/jsunit.zip). Sono 6 (sei!) funzioni:

```js
function JSAssert_print() {
	var win=window.open("","_blank","width=400,height=300,toolbar=no,scrollbars=yes");
	win.document.writeln("<TITLE>JSUnit</TITLE><PRE>");
	win.document.writeln(""+this.count+" test(s): "+this.done+" ok, "+this.failed+" failed\n---");
	win.document.writeln(this.text);
	win.document.close();
}

function JSAssert_add(f, t) {
	this.count++;
	if(f) {
		if(this.printall) this.text+=t+": done\n";
		this.done++;
	} else {
		this.text+=t+": failed condition\n";
		this.failed++;
	}
}

function JSAssert(printall) {
	this.printall=printall;
	this.count=0;
	this.failed=0;
	this.done=0;
	this.text="";
	this.add=JSAssert_add;
	this.print=JSAssert_print;
}

function JSTestSuite_add(func) {
	eval("this.func"+this.count+"=func");
	this.count++;
}

function JSTestSuite_run(printall) {
	this.assert=new JSAssert(printall);
	for(var i=0;i<this.count;i++) eval("this.func"+i+"()");
	this.assert.print();
	this.assert=null;
}

function JSTestSuite() {
	this.assert=null;
	this.count=0;
	this.add=JSTestSuite_add;
	this.run=JSTestSuite_run;
}
```

Il file con i test è altrettanto semplice (anche perché vale come esempio):

```js
function test1() {
	this.assert.add(1==1, "1==1");
}

function test2() {
	this.assert.add(1==2, "1==2");
}
```

I test vengono lanciati direttamente dalla pagina HTML:

```HTML
<SCRIPT LANGUAGE="JavaScript" SRC="jsunit.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript" SRC="tests.js"></SCRIPT>

<SCRIPT>
  var suite=new JSTestSuite();
  suite.add(test1);
  suite.add(test2);
  suite.run();
</SCRIPT>
```

Il risultato del test viene mostrato in una nuova finestra del browser:

{% include picture img="test.webp" ext="jpg" alt="" %}

Tutto molto grezzo, ma tutto facile da importare in Construct 3. Talmente facile da permettermi di creare un semplice progetto, progetto che ho salvato come sempre su [GitHub](https://github.com/el3um4s/construct-demo):
- [JsUnit](https://c3demo.stranianelli.com/javascript/006-jsunit/)
- [Demo](https://c3demo.stranianelli.com/javascript/006-jsunit/demo/)
- [jsunit.c3p](https://c3demo.stranianelli.com/javascript/006-jsunit/source/c3p/jsunit.c3p)
