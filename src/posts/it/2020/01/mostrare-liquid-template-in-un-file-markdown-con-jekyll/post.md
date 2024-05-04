---
title: Mostrare Liquid Template in un file Markdown con Jekyll
date: 2020-01-25 15:04
categories:
  - Jekyll
tags:
  - mostrare-liquid-template-in-un-file-markdown-con-jekyll
  - jekyll-immagini-nella-stessa-cartella-dei-post
  - Jekyll
cover: cover.webp
published: true
lang: it
description: Non so bene perché, ma quando Jekyll compila i file di un sito processa tutti le doppie parentesi  graffe e le graffe seguite dal percentuale anche se inseriti in un paragrafo di codice.
---
Scrivendo il primo articolo di questi nuovi #100DaysOfCode (quello su [come inserire immagini nella stessa directory del file md](https://blog.stranianelli.com/jekyll-immagini-nella-stessa-cartella-dei-post/)) mi sono trovato ad affrontare un problema curioso: come mostrare un template Liquid in un file Markdown?

Non so bene perché, ma quando Jekyll compila i file di un sito processa tutti le doppie parentesi  graffe (`{{page.graffa}}{`) e le graffe seguite dal percentuale (`{{page.graffa}}%`) anche se inseriti in un paragrafo di codice. Cercando in rete ho trovato due soluzioni, una di [Nate Eagle](https://nateeagle.com/2011/08/31/how-to-output-curly-brackets-in-jekyll/), l'altra di [Ozzie Liu](https://ozzieliu.com/2016/04/26/writing-liquid-template-in-markdown-with-jekyll/). Partiamo dalla seconda.

### Usare il tag RAW

Stando alla [guida di Shopify, il tag raw](https://github.com/Shopify/liquid/wiki/liquid-for-designers#raw) disabilita temporaneamente l'analisi dei tag le file e quindi permette di generare contenuto anche con delle sintassi in conflitto con Liquid. In pratica si tratta di usare il tag `{{page.graffa}}% raw %}` all'inizio del codice da mostrare, e il tag `{{page.graffa}}% endraw %}` alla fine.

Per esempio, posso scrivere

```html
{% raw %}
~~~html
<ul>
{% for tag in site.tags %}
  {% assign name = tag | first %}
  {% assign posts = tag | last %}
  <li>{{ name | camelize | replace: "-", " " }}</li>
{% endfor %}
</ul>
~~~
{% endraw %}
```

Con questo ottengo:

~~~html
<ul>
{% for tag in site.tags %}
  {% assign name = tag | first %}
  {% assign posts = tag | last %}
  <li>{{ name | camelize | replace: "-", " " }}</li>
{% endfor %}
</ul>
~~~

### Usare una variabile

Il secondo metodo è di usare una variabile Jekyll (nella pagina o nel sito) per rompere la successione delle parentesi graffe (`{{` e `{%`) in modo da impedire a Jekyll di processare il contenuto.

Nel _Front Matter_ del post (oppure nel file _\_config.yml_ se preferiamo) aggiungo una variabile `graffa`:

```
---
title: "Mostrare Liquid Template in un file Markdown con Jekyll"
date: "2020-01-25 15:04"
categories:
  - jekyll
tags:
  - jekyll
  - 100DaysOfCode
graffa: "{"
---
```

Quindi nel Markdown posso inserire il codice richiamando la variabile tramite il tag `{{ page.graffa }}` (oppure `{{ site.graffa }}` ):

```html
~~~html
<ul>
{{ page.graffa }}% for tag in site.tags %}
  {{ page.graffa }}% assign name = tag | first %}
  {{ page.graffa }}% assign posts = tag | last %}
  <li>{{ page.graffa }}{ name | camelize | replace: "-", " " }}</li>
{{ page.graffa }}% endfor %}
</ul>
~~~
```

per ottenere a schermo:

~~~html
<ul>
{% for tag in site.tags %}
  {% assign name = tag | first %}
  {% assign posts = tag | last %}
  <li>{{ name | camelize | replace: "-", " " }}</li>
{% endfor %}
</ul>
~~~

Comunque, sì, questo è un discreto pasticcio. Forse la prossima volta mi conviene fare semplicemente uno screenshot del codice che voglio mostrare :wink:.
