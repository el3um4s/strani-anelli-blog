---
title: "New Post"
header:
  miniatura: "image.webp"
  immagine_estesa: "image.webp"
  immagine_fonte: "Photo credit: [**CreditImageNome**](CreditImageURL)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2020-01-03 18:16"
---


~~~html
<noscript>
    <link rel="stylesheet" href="{{ '/assets/css/strani_anelli_css.css' | absolute_url  }}">
</noscript>


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
