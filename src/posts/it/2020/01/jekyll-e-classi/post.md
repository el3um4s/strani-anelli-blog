---
title: Jekyll e classi
date: 2020-01-24 23:32
categories:
  - Jekyll
tags:
  - jekyll-e-classi
  - Jekyll
cover: cover.webp
published: true
description: "I primi giorni di questi #100DaysOfCode sono votati alla sistemazione del blog mio e di mia moglie. Sono sempre più convinto che trasferire il tutto da Wordpress a Jekyll sia stata una buona idea anche se richiede alcuni cambi nelle mie abitudini."
lang: it
---
I primi giorni di questi #100DaysOfCode sono votati alla sistemazione del blog mio e di mia moglie. Sono sempre più convinto che trasferire il tutto da Wordpress a Jekyll sia stata una buona idea anche se richiede alcuni cambi nelle mie abitudini.

Una delle cose che mi ha richiesto un po' di tempo è stato capire come personalizzare l'aspetto di alcuni dialoghi. La soluzione è semplice, dopo aver capito come implementarla: basta inserire alcune classi ad hoc direttamente nel file markdown.

### Come inserire classi CSS dentro Markdown

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

Allora, se penso a una classe CSS la prima cosa che mi viene in mente è qualcosa del tipo:

```css
.rosso {
  color: red;
}
```

Bene, adesso che ho una classe `.rosso` non mi resta che inserirla nel testo che sto scrivendo. Come? Semplicemente usando la sintassi liquid:


```
Questo è un paragrafo rosso
{: .rosso}
```


Il risultato sarà così:

<span style="color:red;">Questo è un paragrafo rosso</span>

Ovviamente per ottenere il risultato che ci aspettiamo bisogna avere inserito nel progetto un file CSS contente la classe corrispondente. In alternativa è possibile scrivere direttamente, nel file Markdown:

```html
<style type="text/css">
    .rosso {
      color: red;
    }
</style>
```

Volendo è possibile inserire più classi, così:

```text
Questa è una frase blu in grassetto {: .blu .grassetto .sfondo-chiaro}
```


<span style="color: blue;font-weight: bold;background-color: #c2c9d4;">Questa è una frase blu in grassetto</span> 


In questi giorni ho imparato anche altri trucchetti interessanti, soprattutto grazie a [stackoverflow.com ](https://stackoverflow.com/). Ho trovato anche molto utile questa [guida sul Markdown](https://about.gitlab.com/handbook/engineering/technical-writing/markdown-guide/) e questa lista di [trucchi e consigli](https://about.gitlab.com/blog/2016/07/19/markdown-kramdown-tips-and-tricks/).
