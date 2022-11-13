---
title: "Indice delle Cose Notevoli #3"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-11-13 9:00"
categories:
  - indice delle cose notevoli
tags:
  - indice delle cose notevoli
---

Qualche mese ho scritto un paio di post riguardo a storie e post interessanti. L'idea originale era di creare una specie di rubrica periodica, con i miei consigli di lettura. Poi, come spesso capita, succedono cose e mi sono fermato. Nell'ultimo periodo sono riuscito a trovare il tempo per scrivere; quindi perché non riprendere con questa idea? Rispetto al primo tentativo voglio però cambiare alcune cose. La cosa principale è il giorno di pubblicazione. Userò la domenica: dalle statistiche di Medium è il giorno meno indicato, quello con meno lettori. Non importa, i primi due post non sono stati calcolati da nessuno, quindi non credo di far torto a qualcuno. In secondo luogo, se i primi due post erano pensati come consigli di lettura, voglio usare questo spazio come blocco notes. Un po' come l'[indice delle cose notevoli](https://www.ilpost.it/robertotallarita/2020/01/29/indice-delle-cose-notevoli-1/) di Roberto Tallarita. Non mi interessa se sarà uno spazio alla rinfusa, con cose contraddittorie, magari anche vecchie.

Detto questo, comincio.

### [Oblique Strategies](https://en.wikipedia.org/wiki/Oblique_Strategies) (sottotitolato Over One Hundred Worthwhile Dilemmas)

{% include picture img="cards.webp" ext="jpg" alt="" %}

GitHub Copilot spiega così:

`Oblique Strategies è un insieme di 114 carte, ognuna delle quali contiene una frase o una domanda che può essere usata come strumento di ispirazione per artisti, scrittori, musicisti, architetti, designer, ingegneri, manager, e chiunque altro abbia bisogno di un po' di aiuto per superare un blocco creativo. Le carte sono state create da Brian Eno e Peter Schmidt nel 1975, e sono state pubblicate per la prima volta nel 1975 da Eno e Schmidt, con il contributo di Peter Gorniak, come parte del progetto Oblique Music. Le carte sono state ristampate in numerose edizioni, e sono state tradotte in numerose lingue.`

In pratica, è un mazzo di carte da usare come fonte di ispirazione. Contiene frasi e domande, spesso assurde e contraddittorie; servono per spingere la mente verso pensieri creativi diversi da quelli che è abituata a fare. Penso che le prenderò, e le proverò. Anche perché mi piacerebbe provare a usarle come prompt con qualche sistema di immaginazione automatica (per esempio Stable Diffusion, o qualcosa del genere).

### [Parole](https://medium.com/mlearning-ai/ai-reimagines-the-worlds-20-most-beautiful-words-cd07090ea59b) ed [Emozioni](https://medium.com/illumination/how-ai-reimages-emotions-618c97cea132) secondo l'AI

{% include picture img="emotions.webp" ext="jpg" alt="" %}

Sempre che [Salvatore Raieli](https://medium.com/@salvatore-raieli) non lo abbia già fatto :D. Ok, a parte gli scherzi, i suoi articoli sono interessanti. Affronta spesso come l'AI può interagire con il mondo dell'arte, da varie angolazioni. Io manco di formazione artistica, quindi non posso dire molto. Ma mi piace il suo approccio, e la sua curiosità. In questo caso, ha usato un modello di AI per creare immagini che rappresentano le parole più belle del mondo, e le emozioni degli esseri umani.

Ammetto che è una fonte di ispirazione, per i miei ben più banali esperimenti.

### [Take Pictures in Browser with JavaScript](https://towardsdev.com/take-pictures-in-browser-with-javascript-10225ec5160d)

{% include picture img="photo.webp" ext="jpg" alt="" %}

Cambiando completamente argomento, questo articolo mi è stato molto utile nello sviluppo della prima beta di [DoCrypt](https://docrypt.org/), la mia web app per spedire messaggi cifrati. E mi tornerà utile ancora, quando troverò il tempo per implementare la possibilità di spedire foto cifrate.

### [How do you make a div "tabbable"?](https://stackoverflow.com/questions/13637223/how-do-you-make-a-div-tabbable)

Questa domanda su StockOverflow è stata nel contempo molto utile e molto distraente. Ho dedicato un po' di tempo per cercare di trovare un modo per passare da un div all'altro dell'interfaccia, e poi permettere di selezionare un'azione con il tasto invio della tastiera.

Che poi si è rivelato essere semplicemente:

```js
  on:keydown={(e) => {
    console.log(e);
    if (e.key === "Enter") {
      e.preventDefault();
      button.click();
    }
  }}
```

Perché distraente? Beh, perché poi mi sono messo in testa di poter usare solo la tastiera per navigare all'interno dell'app. Ci ho dedicato del tempo, mi sono incartato, e alla fine ho rimandato la piena implementazione a un secondo momento. Ma è stato divertente.

### [58 bytes of CSS to look great nearly everywhere](https://medium.com/marketkarma/58-bytes-of-css-to-look-great-nearly-everywhere-befbc1e08b96)

{% include picture img="coding.webp" ext="jpg" alt="" %}

Questo articolo di [Joey Burzynski](https://medium.com/@joeyburzynski) che spiega come usare 58 byte di CSS per ottenere un layout che si adatta a quasi tutti i dispositivi. È una soluzione semplice, elegante e sopratutto versatile.

La prima versione è dell'Aprile del 2019, e anche se adesso è un po' più grande, è comunque un buon esempio di come la semplicità è (a volte) la soluzione migliore.

### [Collection of notable things worth knowing](https://en.wikisource.org/wiki/Collection_of_notable_things_worth_knowing)

{% include picture img="image.webp" ext="jpg" alt="" %}

Prima di finire non può mancare questo libretto del 1828 contente una lista di cose interessanti dal mondo. Si va dalle piramidi alla storia del negoziante che ha aspettato 20 anni per saldare un debito minuscolo con uno sconosciuto. Insomma, un po' di tutto, come in questo mio post.
