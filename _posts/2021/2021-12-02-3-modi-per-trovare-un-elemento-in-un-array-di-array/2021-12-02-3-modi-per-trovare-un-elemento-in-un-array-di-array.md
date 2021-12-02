---
title: "3 Modi per Trovare un Elemento in un Array di Array"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-02 15:00"
categories:
  - dev advent
  - test
  - javascript
  - performance
tags:
  - dev advent
  - test
  - javascript
  - performance
---

Ogni volta che si avvicina il Natale mia moglie comincia il suo _Avvento Perlinoso_. È una cosa che le ho sempre invidiato, la sua costanza e perseveranza. Dietro suo consiglio, e spinto dalla sua insistenza, ho deciso di provare a fare anche io qualcosa di simile. Ovviamente non legata al mondo dei gioielli artigianali (sarebbe un disastro) ma collegata al coding. Fortuna ha voluto che incappassi in un video in cui [Marc Backes](https://www.youtube.com/c/MarcBackesCodes) presenta il suo **Dev Advent Calendar 2021**:

<iframe width="560" height="315" src="https://www.youtube.com/embed/AmtkdsTcHTo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Ovviamente non so ancora se riuscirò a fare i compiti ogni giorno. E men che meno se riuscirò a scrivere un post con la mia soluzione. Non conosco in anticipo i puzzle, e non so se avrò sempre qualcosa di interessante da dire. Per il primo problema sì, ci sono un paio di spunti interessanti.

### Il problema: trova Rudolf

{% include picture img="cover.webp" ext="jpg" alt="" %}

```
Weeks before Christmas, Santa's reindeers start practicing their flying in order to be fit for the big night. Unfortunately, one of them (Rudolf) crashed and landed in the forest 🌲

Now, Santa 🎅 needs YOUR help to find him.
```

In pratica si tratta di risolvere un problema di ricerca in un array di array, ovvero trovare le coordinate di un elemento in una matrice bidimensionale. Per capirci, se ho una matrice di questo tipo:

<script src="https://gist.github.com/el3um4s/992920a21fb0287ded411343889c764b.js"></script>

mi aspetto di trovare la renna Rudolf alle coordinate `(3, 2)`.

Invece in una "foresta" di questo tipo:

<script src="https://gist.github.com/el3um4s/0063b6aaafeb3f2a44ab527d2c400b67.js"></script>

otterrò delle coordinate negative, `(-1, -1)`.

### Come trovare un elemento in una matrice: forEach

Il problema in sè è abbastanza semplice. Lo possiamo risolvere in più modi. Il primo, forse quello più intuitivo, è di scorrere ogni riga della foresta alla ricerca di Rudolf:

<script src="https://gist.github.com/el3um4s/a9f9f9cb35165a7146a45e2b3011368b.js"></script>

Il metodo [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) esegue lo stesso codice per ogni elemento di un array. Il codice è semplicemente una ricerca dell'indice in cui si trova Rudolf (🦌) usando [indexOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf). Se l'indice è negativo Rudolf non è in quella riga. Se invece otteniamo un indice positivo allora abbiamo trovato sia la riga che la colonna dove andarlo a recuperare.

### Come trovare un elemento in una matrice: some

Dopo aver risolto il problema mi sono chiesto se esistesse un metodo più veloce per trovare un elemento in una matrice. Una criticità di **forEach()** è che non c'è modo di interromperlo. Per esempio, se Rudolf è alle coordinate `(0, 0)` non serve andarlo a cercare per tutta la foresta. Ma questo codice fa esattamente questo, continua a cercare anche se è già stata trovata una risposta.

Per risolvere questo problema ho deciso di usare un altro metodo, [Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some). `some()` fa esattamente la stessa cosa di `forEach` ma con una piccola ma sostanziale differenza: ferma il ciclo quando trova l'elemento. O, meglio, quando la condizione definita risulta essere vera.

Riscrivo quindi il codice:

<script src="https://gist.github.com/el3um4s/8e25ac51a92319f52bf68a513ff165a0.js"></script>

In questo caso salvo ogni volta il valore delle coordinate controllate in due variabili, `col` e `row`. Però mi salvo anche una variabile aggiuntiva, `found`, da usare come riferimento per sapere se sono riuscito o meno a trovare Rudolf. Esegui quindi il ciclo per ogni elemento della foresta e lo interrompo quando `r.indexOf("🦌") > -1`, ovvero quando ho trovato il valore "🦌" nell'array.

### Come trovare un elemento in una matrice: flat

Tutto questo è molto bello ma non sono ancora soddisfatto. Mi piacerebbe riuscire a evitare sia `forEach()` che `some()`. Ho deciso quindi di provare un'altra strada. Il presupposto base è che la foresta sia composta da righe tutte della stessa dimensione. Se così è allora posso trasformare la matrice bidimensionale in un array monodimensionale. Poi uso `indexOf("🦌")` per ricavare la posizione di Rudolf. Infine converto quell'indice in una coppia di coordinate bidimensionali. Alla basa di tutto questo ragionamento c'è il metodo [Array.prototype.flat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat). `flat()` permette di ottenere un nuovo array dalla concatenazione di tutti i subarray dell'originale.

Traducendo in codice:

<script src="https://gist.github.com/el3um4s/b022a62dda708f08afd28343764f3eec.js"></script>

### Ok, ma qual è il metodo migliore?

Giunto a questo punto mi sono chiesto: bene, ho tre metodi per trovare un elemento in un array bidimensionale, ma qual è il metodo più efficiente?

Per rispondere a questa domanda sono andato a cercare un qualche metodo furbo per misurare la performance di una funzione. Alla fine però il metodo migliore è usare il metodo più comune: registrare il tempo impiegato dalle varie funzioni per eseguire molte volte la stessa operazione e confrontarli. Nella mia ricerca ho trovato alcune letture molto istruttive. Consiglio di leggere questo post di Zell Liew, [Testing JavaScript Performance](https://zellwk.com/blog/performance-now/). Ovviamente non riporto le sue considerazioni.

Creo una funzione da usare per calcolare il tempo di esecuzione di una singola funzione:

<script src="https://gist.github.com/el3um4s/a0f7f4515d2128e3102dffa3bbc37870.js"></script>

Poi creo un set di foreste casuali in cui cercare la renna. Penso che un campione di 1.000.000 di foreste sia sufficiente per i miei test

<script src="https://gist.github.com/el3um4s/facb059b57e99f32a6f57d7b5d3b4038.js"></script>

E creo delle funzioni per cercare Rudolf in sequenza in ognuna delle foreste:

<script src="https://gist.github.com/el3um4s/9ae689e3ada8dd3ae227409940649680.js"></script>

Infine eseguo un po' di test

<script src="https://gist.github.com/el3um4s/6786197b1486a8ac11afffc917ee1490.js"></script>

Eseguendo i test ottengo qualcosa di simile a questo:

![manuel-test.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-12-02-3-modi-per-trovare-un-elemento-in-un-array-di-array/test-manual-01.gif)

A occhio non pare esserci una predominanza netta di un metodo su un altro. Però per curiosità decido di salvare i valori dei test in un file e provare a vedere se i crudi numeri possono essere d'aiuto. Installo un pacchetto aggiuntivo, [jsonexport](https://www.npmjs.com/package/jsonexport) per aiutarmi con la conversione della variabile `resultGeneral` e creo un file csv:

<script src="https://gist.github.com/el3um4s/8d15d9730a1a7fdb76234d4b98e5dcdb.js"></script>

Dopo aver importato i risultati in Excel ottengo questo grafico:

{% include picture img="graph.webp" ext="jpg" alt="" %}

Beh, che dire? Tanta fatica per nulla: nei miei test la performance di tre metodi è pressoché equivalente. Adesso però è il momento di poggiare la tastiera del pc, di prendere la lanterna e aiutare gli elfi nella foresta a trovare Rudolf.
