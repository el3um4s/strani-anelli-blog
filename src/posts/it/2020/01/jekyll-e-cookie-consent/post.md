---
title: Jekyll e Cookie Consent
date: 2020-01-23 13:13
categories:
  - Jekyll
tags:
  - jekyll-e-cookie-consent
  - Jekyll
cover: cover.webp
published: true
lang: it
description: Dover rinunciare ai plugin è sia frustrante che interessante. Frustrante perché a volte è rilassante cliccare un pulsante e lasciare che la macchina faccia tutto da sola. Però trovare la soluzione a un problema è sempre una sfida interessante, anche quando il problema è piccino come il dover impostare un cookie banner per rispettare la GDPR.
---
Dover rinunciare ai plugin è sia frustrante che interessante. Frustrante perché a volte è rilassante cliccare un pulsante e lasciare che la macchina faccia tutto da sola. Però trovare la soluzione a un problema è sempre una sfida interessante, anche quando il problema è piccino come il dover impostare un cookie banner per rispettare la GDPR.

L'ho implementato seguendo un articolo di [Jekyll Codex](https://jekyllcodex.org/without-plugin/cookie-consent/). Riassumendo, si tratta di:

1. scaricare il file [_cookie-consent.html_](https://raw.githubusercontent.com/jhvanderschee/jekyllcodex/gh-pages/_includes/cookie-consent.html)
2. salvare il file nella cartella _\_includes_ del sito
3. inserire nel layout _default_ il codice:


```html
...
{% include cookie-consent.html %}
</body>
</html>
```
