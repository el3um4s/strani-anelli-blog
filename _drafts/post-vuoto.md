---
title: 'Titolo'
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: nome_immagine.webp
  immagine_estesa: nome_immagine.webp
  overlay_filter: rgba(79, 79, 79, 0.5)
  immagine_fonte: 'Photo credit: [**Unsplash**](https://unsplash.com)'
  # overlay_image: /images/unsplash-image-1.jpg
  # overlay_filter: 0.5 # same as adding an opacity of 0.5 to a black background
  # immagine: nome_immagine.webp
  # caption: 'Photo credit: [**Unsplash**](https://unsplash.com)'
categories:
  - Layout
tags:
  - edge case
  - image
  - layout
spotifyplaylist: idplaylist
---

{% post_url 2014-12-01-claudia-falzone %}

{: .align-left}
{: .align-center}

{: .domanda_intervista}

{: .parla .iaia}
{: .parla .iaio}
{: .parla .persona}

{% include picture img="immagine" ext="jpg" alt="" %}
![]({{site.immagini}}{{ page.date | date: "%Y/%Y-%m-%d"}}-{{page.url | remove_first: "/"}}nomeimmagine)

{% include spotifyplaylist.html id=page.spotifyplaylist %}
