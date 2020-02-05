---
title: "Jekyll: Custom Scrollbar, Nanobar e Percentage Scroll Bar"
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "linee-astratte"
  immagine_estesa: "linee-astratte"
  immagine_fonte: "Photo credit: [**Stock Photography**](https://unsplash.com/@aplaceforcreation)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2020-01-30 23:59"
categories:
  - jekyll
  - 100DaysOfCode
tags:
  - jekyll
  - 100DaysOfCode
---

[Tra Musica e Parole](https://www.tramusicaeparole.com/) è ora online nella sua nuova casa: un bel repository su GitHub unito a un dominio acquistato su Google. E, onestamente, sono un po' geloso del blog di mia moglie, è più bello del mio e ha alcune funzioni in più. Ma presto aggiornerò anche il codice di questo qui.

Le ultime cose che ho aggiunto, subito dopo aver completato il trasloco, sono per lo più miglioramenti estetici. Partendo da un [articolo di WebJeda](https://blog.webjeda.com/top-bar-website/) ho aggiunto una barra in alto per mostrare l'avanzamento del caricamento delle pagine, una riga in basso che mostra l'avanzamento della lettura della pagina stessa e, ultimo, ho personalizzato la scrollbar laterale del sito colorandola. Comincio dalla cosa più semplice, la scrollbar colorata.

### Come colorare la scrollbar

{% include picture img="modifiche-estetiche-tramusicaeparole" ext="jpg" alt="" %}

Questa è stata la parte più semplice, è stato sufficiente usare un po' di CSS. Per prima cosa sistemo la larghezza della barra laterale in modo da farla un po' più grossa e, a mio parere, più bellina

~~~css
body::-webkit-scrollbar { width: 1em; }
~~~

Subito dopo sistemo il colore della barra armonizzandola con il colore primario del blog. E già che ci sono arrotondo i gli angoli.

~~~css
body::-webkit-scrollbar-thumb {
  background-color: #639497;
  outline: 1px solid #639497;
  border-radius: 4px;
}
~~~

Infine scurisco leggermente rispetto allo sfondo la colonna dove scorre la barra: è un effetto che ho visto in più siti e mi piace.

~~~css
body::-webkit-scrollbar-track { background-color: #1a1d24; }
~~~

### Aggiungere una riga in alto

La seconda cosa che ho voluto aggiungere è una linea colorata in alto alla pagina. Riga che parte corta e che cresce man mano che la pagina si carica. Perché? Perché è un effetto carino e rende anche un po' più dinamico il caricamento stesso del sito. Per ottenere questo effetto ho usato [nanobar](http://nanobar.jacoborus.codes/), una libreria Javascript. Consiglio di usare la versione [minified](https://github.com/jacoborus/nanobar/archive/master.zip).

Ho quindi creato un file `nanobar.html` (in _\_includes_) dentro cui ho inserito il codice che mi serve a partire dal comando per importare la libreria JS

{% raw %}
~~~html
<script src="{{ '/assets/js/nanobar/nanobar.min.js' | absolute_url }}"></script>
~~~
{% endraw %}

Poi imposto alcune opzioni che mi permetteranno successivamente di personalizzare la barra

~~~html
<script>
var options = {
  classname: 'nanobar_custom',
  id: 'nanobar_top'
};
var nanobar = new Nanobar( options );
nanobar.go( 30 );
nanobar.go( 76 );
nanobar.go(100);
</script>
~~~

Ora è il momento di aggiungere alcuni stili per personalizzare il colore e, se vogliamo, la dimensione:

~~~html
<style>
.nanobar_custom .bar {
  background: #639497;
}
</style>
~~~

Ora non resta che inserire il tag corrispondente per fare apparire l'elemento nella pagina:

~~~html
<div class="nanobar nanobar_custom" id="nanobar_top" style="position: fixed;">
  <div class="bar"></div>
</div>
~~~

L'ultima cosa da fare è inserire il tutto nel layout `default.html` (oppure solamente in quelli che ci interessano):

{% raw %}
~~~html
{% include nanobar.html %}
~~~
{% endraw %}

### Una barra che si allunga man mano che si procede con la lettura

La terza cosa che ho aggiunto è una barra in fondo alla pagina. Lo scopo è indicare visivamente il procedere della lettura. Si allungherà quindi man mano che si procede con la lettura.

Anche qui comincio con lo creare un file `percentage_scroll_bar.html` dentro la cartella _\_includes_.

Per prima cosa inserisco lo stile che voglio applicare alla barra:

~~~html
<style>
.progress-bar {
    background: linear-gradient(to right, #639497 var(--scroll), transparent 0);
    background-repeat: no-repeat;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 4px;
    z-index: 1;
}
</style>
~~~

Poi tocca all'elemento stesso:

~~~html
<div class="progress-bar"></div>
~~~

Infine la parte "_magica_"

~~~html
<script>
var element = document.documentElement,
  body = document.body,
  scrollTop = 'scrollTop',
  scrollHeight = 'scrollHeight',
  progress = document.querySelector('.progress-bar'),
  scroll;

document.addEventListener('scroll', function() {
  scroll = (element[scrollTop]||body[scrollTop]) / ((element[scrollHeight]||body[scrollHeight]) - element.clientHeight) * 100;
  progress.style.setProperty('--scroll', scroll + '%');
});
</script>
~~~

Come ultima cosa non resta che inserire

{% raw %}
~~~html
{% include percentage_scroll_bar.html %}
~~~
{% endraw %}

nel layout che ci interessa.
