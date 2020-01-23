---
title: "Jekyll e Cookie Consent"
header:
  miniatura: "cookie-e-jekyll.webp"
  immagine_estesa: "cookie-e-jekyll.webp"
  immagine_fonte: "Photo credit: [**Mollie Sivaram**](https://unsplash.com/@molliesivaram)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2020-01-23 13:13"
categories:
  - jekyll
tags:
  - jekyll
  - 100DaysOfCode
---

Dover rinunciare ai plugin è sia frustrante che interessante. Frustrante perché a volte è rilassante cliccare un pulsante e lasciare che la macchina faccia tutto da sola. Però trovare la soluzione a un problema è sempre una sfida interessante, anche quando il problema è piccino come il dover impostare un cookie banner per rispettare la GDPR.

L'ho implementato seguendo un articolo di [Jekyll Codex](https://jekyllcodex.org/without-plugin/cookie-consent/). Riassumendo, si tratta di:

1. scaricare il file [_cookie-consent.html_](https://raw.githubusercontent.com/jhvanderschee/jekyllcodex/gh-pages/_includes/cookie-consent.html)
2. salvare il file nella cartella _\_includes_ del sito
3. inserire nel layout _default_ il codice:

{% raw %}
```
...
{% include cookie-consent.html %}
</body>
</html>
```
{% endraw %}
