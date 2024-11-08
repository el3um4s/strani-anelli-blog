---
title: Mostrare playlist Spotify su Jekyll
date: 2020-01-26 23:21
categories:
  - Jekyll
tags:
  - mostrare-playlist-spotify-su-jekyll
  - Jekyll
cover: cover.webp
published: true
lang: it
description: "Continuando la risistemazione del blog di Tra Musica e Parole mi sono imbattuto in altro problema: come faccio a inserire una playlist Spotify in un blog creato con Jekyll e Markdown? Cercando su Github ho trovato la soluzione proposta da Andrian Nur Prabawa un paio d'anni fa."
---
Continuando la risistemazione del blog di [Tra Musica e Parole](https://el3um4s.github.io/tra-musica-e-parole/) mi sono imbattuto in altro problema: come faccio a inserire una playlist Spotify in un blog creato con Jekyll e Markdown?

Cercando su GitHub ho trovato la soluzione proposta da [Andrian Nur Prabawa](https://github.com/andriannp/spotify-embed-on-Jekyll) un paio d'anni fa.

### Spotify Playlist

Per prima cosa si crea il file `spotifyplaylist.html` nella cartella `_includes` contenente questo codice:

~~~html
<div class="embed-spotify">
 <iframe src="https://open.spotify.com/embed/playlist/{{page.graffa}}{ include.id }}"
        width="700"
        height="480"
        frameborder="0"
        allowtransparency="true"
        allow="encrypted-media"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen>
</iframe>
</div>
~~~

Poi in un file `CSS` vanno inseriti questi stili:

~~~css
.embed-spotify {
  position: relative;
  padding-bottom: 100%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
}

.embed-spotify iframe, .embed-spotify object, .embed-spotify embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
~~~

Quindi nel _Front Matter_

~~~html
title: Titolo del Post
spotifyplaylist: id della playlist
~~~

Dove per `id` si intende la parte finale dell'url della playlist. Per esempio, se la playlist si trova all'indirizzo

> https://open.spotify.com/playlist/5Ac7O2ePo0GnsfVP2a6obo

allora l'ID della playlist è

> 5Ac7O2ePo0GnsfVP2a6obo

Per inserire la playlist nella pagina è sufficiente scrivere:

~~~html
{{page.graffa}}% include spotifyplaylist.html id=page.spotifyplaylist %}
~~~

per ottenere questo:

<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/45CY1ew8hhpneWyTyUrOIj?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Spotify"></iframe>