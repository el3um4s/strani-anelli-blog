---
title: "Mostrare Liquid Template in un file Markdown con Jekyll"
header:
  miniatura: "liquid.webp"
  immagine_estesa: "liquid.webp"
  immagine_fonte: "Photo credit: [**Paweł Czerwiński**](https://unsplash.com/@pawel_czerwinski)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2020-01-25 15:04"
categories:
  - jekyll
tags:
  - jekyll
  - 100DaysOfCode
graffa: "{"
tilde: "~"
---

Scrivendo il primo articolo di questi nuovi #100DaysOfCode (quello su [come inserire immagini nella stessa directory del file md]({% post_url 2020-01-22-jekyll-immagini-nella-stessa-cartella-dei-post %})) mi sono trovato ad affrontare un problema curioso: come mostrare un template Liquid in un file Markdown?

Non so bene perché, ma quando Jekyll compila i file di un sito processa tutti le doppie parentesi  graffe (`{{page.graffa}}{`) e le graffe seguite dal percentuale (`{{page.graffa}}%`) anche se inseriti in un paragrafo di codice. Cercando in rete ho trovato due soluzioni, una di [Nate Eagle](https://nateeagle.com/2011/08/31/how-to-output-curly-brackets-in-jekyll/), l'altra di [Ozzie Liu](https://ozzieliu.com/2016/04/26/writing-liquid-template-in-markdown-with-jekyll/). Partiamo dalla seconda.

### Usare il tag RAW

Stando alla [guida di Shopify, il tag raw](https://github.com/Shopify/liquid/wiki/liquid-for-designers#raw) disabilita temporaneamente l'analisi dei tag le file e quindi permette di generare contenuto anche con delle sintassi in conflitto con Liquid. In pratica si tratta di usare il tag `{{page.graffa}}% raw %}` all'inizio del codice da mostrare, e il tag `{{page.graffa}}% endraw %}` alla fine.

Per esempio, posso scrivere

```html
{{page.graffa}}% raw %}
{{page.tilde}}~~html
<ul>
{{page.graffa}}% for tag in site.tags %}
  {{page.graffa}}% assign name = tag | first %}
  {{page.graffa}}% assign posts = tag | last %}
  <li>{{page.graffa}}{ name | camelize | replace: "-", " " }}</li>
{{page.graffa}}% endfor %}
</ul>
{{page.tilde}}~~
{{page.graffa}}% endraw %}
```

In questo ottengo:
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

### Usare una variabile

Il secondo metodo è di usare una variabile Jekyll (nella pagina o nel sito) per rompere la successione delle parentesi graffe (`{{page.graffa}}{` e `{{page.graffa}}%`) in modo da impedire a Jekyll di processare il contenuto.

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

Quindi nel markdown posso inserire il codice richiamando la variabile tramite il tag `{{page.graffa}}{ page.graffa }}` (oppure `{{page.graffa}}{ site.graffa }}` ):

```html
{{page.tilde}}~~html
<ul>
{{page.graffa}}{ page.graffa }}% for tag in site.tags %}
  {{page.graffa}}{ page.graffa }}% assign name = tag | first %}
  {{page.graffa}}{ page.graffa }}% assign posts = tag | last %}
  <li>{{page.graffa}}{ page.graffa }}{ name | camelize | replace: "-", " " }}</li>
{{page.graffa}}{ page.graffa }}% endfor %}
</ul>
{{page.tilde}}~~
```

per ottenere a schermo:

~~~html
<ul>
{{ page.graffa }}% for tag in site.tags %}
  {{ page.graffa }}% assign name = tag | first %}
  {{ page.graffa }}% assign posts = tag | last %}
  <li>{{ page.graffa }}{ name | camelize | replace: "-", " " }}</li>
{{ page.graffa }}% endfor %}
</ul>
~~~

Comunque, sì, questo è un discreto pasticcio. Forse la prossima volta mi conviene fare semplicemente uno screenshot del codice che voglio mostrare :wink:.
