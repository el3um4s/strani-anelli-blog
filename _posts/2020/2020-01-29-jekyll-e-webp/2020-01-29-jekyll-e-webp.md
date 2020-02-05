---
title: "Jekyll e WebP"
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "immagini-su-jekyll"
  immagine_estesa: "immagini-su-jekyll"
  immagine_fonte: "Photo credit: [**Héctor J. Rivas**](https://unsplash.com/@hjrc33)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2020-01-29 23:59"
categories:
  - jekyll
  - 100DaysOfCode
tags:
  - jekyll
  - 100DaysOfCode
---

Ho cominciato a risolvere il problema del come usare [immagini WebP con Jekyll]({% post_url 2020-01-28-chi-non-ha-testa-abbia-gambe %}). Sono riuscito a risolvere, forse, il problema. Non ho ancora testato a fondo il processo ma tra poco comincio ad aggiornare e a modificare a fondo [Tra Musica e Parole](https://el3um4s.github.io/tra-musica-e-parole/). Prima però di cominciare mi segno qui alcune cose importanti da ricordare.

### In generale

La cosa fondamentale da sapere è che per gestire le immagini WebP è molto comodo usare il tag `PICTURE`. [Aleksandr Hovhannisyan](https://dev.to/aleksandrhovhannisyan/improve-page-load-speed-in-jekyll-with-the-webp-image-format-1e2a) spiega bene il procedimento generale. In sintesi è sufficiente inserire nella pagina:

~~~html
<picture>
<source srcset="/path/to/image.webp" type="image/webp">
<img src="/path/to/image.jpg" alt="Your alt text" />
</picture>
~~~

per mostrare le immagini WebP se il browser le supporta, altrimenti verrà mostrato automaticamente l'immagine in formato JPG.

Su [CSS-TRICKS](https://css-tricks.com/using-webp-images/) ho trovato un altro suggerimento utile: usare [Modernizr](https://modernizr.com/) per aggiungere automaticamente una classe css `webp` al tag `HTML` se si possono visualizzare le immagini WebP. Se invece non è possibile usare questo formato, viene aggiunta la classe `no-webp`.

### Mostrare le immagini

Unendo queste due informazioni ho creato due file, `picture` e `miniatura`. Che sono molto simili, e che magari in futuro, forse, posso trovare come unirli. Comunque, _miniatura_ mi serve per mostrare le immagini nella home e nei suggerimenti di lettura. _picture_, invece, è pensato per le immagini nei post. Mostro solo quest'ultimo:

{% raw %}
~~~html
{% assign img = include.img %}

{% if page.usa_webp %}
  <picture>
      <source type='image/webp' srcset='{{site.immagini}}{{ page.date | date: "%Y/%Y-%m-%d"}}-{{page.url | remove_first: "/"}}{{ img }}.webp' >
      <img src='{{site.immagini}}{{ page.date | date: "%Y/%Y-%m-%d"}}-{{page.url | remove_first: "/"}}{{ img }}.{{ include.ext }}' alt='{{ include.alt }}' />
  </picture>
{% else %}
  <img src='{{site.immagini}}{{ page.date | date: "%Y/%Y-%m-%d"}}-{{page.url | remove_first: "/"}}{{ img }}.{{ include.ext }}' alt='{{ include.alt }}' />
{% endif %}
~~~
{% endraw %}

Ovviamente il codice è influenzato tantissimo da [come è strutturato il sito]({% post_url 2020-01-22-jekyll-immagini-nella-stessa-cartella-dei-post %}). Dopo aver salvato questo file nella cartella _\_includes_ posso inserire le immagini in questo modo:

{% raw %}
~~~
{% include picture img="nome-immagine" ext="jpg" alt="Descrizione immagine" %}
~~~
{% endraw %}

Cosa significa?

Significa che il browser caricherà l'immagine _"nome-immagine.webp"_ se il browser è in grado di mostrarle. Altrimenti mostrerà l'immagine _"nome-immagine.jpg"_. Ovviamente questo richiede di caricare due copie per ogni immagine, una nel formato WebP, l'altra in un formato più vecchio.

C'è un'altra opzione: _usa_webp_. Si riferisce a una variabile da inserire nel Front Matter del post:

```
title: "Titolo"
date: "2020-01-29"
usa_webp: true
```

Può essere o `true` oppure `false`. Se viene impostata su `false` allora nel post non verranno caricate le immagini in formato WebP ma solo quelle in JPG (o PNG, o GIF, eccetera). In questo modo conto di poter adeguare abbastanza rapidamente i vecchi articoli senza dover subito convertire tutto in WebP.

### L'immagine grande

Cambia anche leggermente la sintassi per inserire le immagini grandi in testa al post. Adesso nel Front Matter va inserita la voce _immagine\_tipo_:

```
title: "Titolo"
date: "2020-01-29"
usa_webp: true
header:
  immagine_tipo: "jpg"
```

In questo modo il browser capisce cosa caricare, se l'immagine WebP oppure quella JPG nei browser più vecchi.
