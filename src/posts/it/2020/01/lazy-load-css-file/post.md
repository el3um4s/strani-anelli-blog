---
title: Lazy Load di file CSS in Jekyll
date: 2020-01-31 18:16
cover: cover.webp
categories:
  - Jekyll
  - CSS
  - JavaScript
published: true
description: Non tutte le cose che si imparano sono immediatamente utili. Me ne sono ricordato poco fa, dopo aver modificato il tema di Tra Musica E Parole per permettere il caricamento lento dei file CSS. Perché farlo?
lang: it
tags:
  - lazy-load-css-file
  - Jekyll
  - CSS
  - JavaScript
---

Non tutte le cose che si imparano sono immediatamente utili. Me ne sono ricordato poco fa, dopo aver modificato il tema di [Tra Musica E Parole](https://www.tramusicaeparole.com/) per permettere il caricamento lento dei file CSS.

Perché farlo? Per velocizzare, soprattutto su smartphone, l'apertura dei vari post. Perché non farlo? Beh, prima di tutto perché uno dei due file CSS è talmente piccolo da non richiedere un'operazione del genere. E in secondo luogo perché, facendolo con il file principale, ne risultava un bruttissimo effetto lampeggiante man mano che si caricavano i vari stili. Ho deciso di soprassedere. Ma mi segno qui, come riferimento per il me futuro, la strada da seguire per ottenere il lazy loading di file CSS. Sai mai che in futuro non mi possa servire.

Quindi, per prima cosa nell'`head` del file inserisco il tag `NOSCRIPT` con il link al file CSS da caricare:

~~~html
<noscript>
    <link rel="stylesheet" href="{{ '/assets/css/strani_anelli_css.css' | absolute_url  }}">
</noscript>
~~~

In questo modo posso caricare immediatamente il file nel caso il browser abbia JS disattivato.

Poi, in fondo alla pagina, inserisco questa funzione

~~~html
<script>
    (function() {

      let strani_anelli_css = document.createElement('link');
      strani_anelli_css.type = 'text/css';
      strani_anelli_css.rel = 'stylesheet';
      strani_anelli_css.href = "{{ '/assets/css/strani_anelli_css.css' | absolute_url  }}";

      let inserisci_strani_anelli = document.getElementsByTagName('link')[0];
      inserisci_strani_anelli.parentNode.insertBefore(strani_anelli_css, inserisci_strani_anelli);
      })();
</script>
~~~

che non fa altro che iniettare il link al foglio CSS nella pagina HTML.

E poi basta: è tutto qui, semplice e veloce.
