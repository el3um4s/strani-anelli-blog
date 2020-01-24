---
title: "Jekyll e classi"
header:
  miniatura: "classi-css-dentro-markdown.webp"
  immagine_estesa: "classi-css-dentro-markdown.webp"
  immagine_fonte: "Photo credit: [**Caspar Camille Rubin**](https://unsplash.com/@casparrubin)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2020-01-24 23:32"
categories:
  - jekyll
tags:
  - jekyll
  - 100DaysOfCode
---

I primi giorni di questi #100DaysOfCode sono votati alla sistemazione del blog mio e di mia moglie. Sono sempre più convinto che trasferire il tutto da Wordpress a Jekyll sia stata una buona idea anche se richiede alcuni cambi nelle mie abitudini.

Una delle cose che mi ha richiesto un po' di tempo è stato capire come personalizzare l'aspetto di alcuni dialoghi. La soluzione è semplice, dopo aver capito come implementarla: basta inserire alcune classi ad hoc direttamente nel file markdown.

### Come inserire classi CSS dentro Markdown

Allora, se penso a una classe CSS la prima cosa che mi viene in mente è qualcosa del tipo:

~~~css
.rosso {
  color: red;
}
~~~

Bene, adesso che ho una classe `.rosso` non mi resta che inserirla nel testo che sto scrivendo. Come? Semplicemente usando la sintassi liquid:

{% raw %}
~~~
Questo è un paragrafo rosso
{: .rosso}
~~~
{% endraw %}

Il risultato sarà così:

~~~
Questo è un paragrafo rosso
{: .rosso}
~~~

Ovviamente per ottenere il risultato che ci aspettiamo bisogna avere inserito nel progetto un file CSS contente la classe corrispondente. In alternativa è possibile scrivere direttamente, nel file Markdown:

~~~html
<style type="text/css">
    .rosso {
      color: red;
    }
</style>
~~~

Volendo è possibile inserire più classi, così:

~~~
Questa è una frase blu in grassetto{: .blu .grassetto .sfondo-chiaro }
{% raw %}{: .blu .grassetto .sfondo-chiaro }{% endraw %}
~~~

In questi giorni ho imparato anche altri trucchetti interessanti, soprattutto grazie a [stackoverflow.com ](https://stackoverflow.com/). Ho trovato anche molto utile questa [guida sul Markdown](https://about.gitlab.com/handbook/engineering/technical-writing/markdown-guide/) e questa lista di [trucchi e consigli](https://about.gitlab.com/blog/2016/07/19/markdown-kramdown-tips-and-tricks/).


<style type="text/css">
  .rosso {
    color: red;
  }

  .blu {
    color: blue;
  }

  .grassetto {
    font-weight: bold;
  }

  .sfondo-chiaro {
    background-color: #c2c9d4
  }
</style>
