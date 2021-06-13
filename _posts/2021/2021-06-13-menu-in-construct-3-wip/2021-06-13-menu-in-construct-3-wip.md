---
title: "Menu in Construct 3 - WIP"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-06-13 15:00"
categories:
  - Construct 3
  - JavaScript
  - Svelte
  - TypeScript
tags:
  - Construct 3
  - JavaScript
  - Svelte
  - TypeScript
---

Durante la settimana ho continuato a lavorare su come integrare Svelte e Construct 3. Il primo tentativo è finito in nulla. Come mai? Beh, volevo creare una specie di calcolatrice scientifica ma le mie conoscenze di matematica sono piuttosto arrugginite. Dovrò rimettermi sui libri. Di conseguenza mi sono buttato sul piano B: un menù per Construct 3. Il primo test è stato promettente:

![primo test](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-13-menu-in-construct-3-wip/start.gif)

Partendo da questo ho deciso di continuare su questa strada. La mia idea è di ottenere un qualcosa che mi permetta di inserire menù di questo tipo nei miei progetti senza dover stare a faticare troppo. Anche se, a dire il vero, la strada più veloce sarebbe stata usare il progetto di [Aekiro](https://aekiro.itch.io/), [Pro UI - UI Components](https://aekiro.itch.io/proui). Ma perché scegliere la strada facile quando posso inerpicarmi per quella lunga e difficile?

Comunque, partendo da quella prova ho cominciato a creare un template e ad aggiungere cose. Ho impostato un meccanismo per cambiare il template del menù:

![templates](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-13-menu-in-construct-3-wip/templates.gif)

Un altro per scegliere i fonts

![fonts](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-13-menu-in-construct-3-wip/fonts.gif)

E ovviamente un'interfaccia per gestire in maniera dinamica le varie voci

![items](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-13-menu-in-construct-3-wip/events.gif)

Mancano ancora un paio di cose. Mi piacerebbe aggiungere la possibilità di abilitare e disabilitare le varie voci. E in seconda battuta aggiungere alcuni stili predefiniti.

E poi manca ovviamente un progetto in C3 per mostrare come usare il tutto. Per finirlo devo definire alcuni dettagli sui comandi da usare.

{% include picture img="api.webp" ext="jpg" alt="" %}

Penso che questa sintassi si presti bene: la variabile globale `menuSvelte` gestisce tutte le proprietà del menù. Al momento ho aggiunto

- `items`
  - _pushItem (item:ItemType)_
  - _unshiftItem (item:ItemType)_
  - _addItemAtIndex (index:number, item:ItemType)_
  - _updateItemById (id:string, item:ItemType)_
  - _updateItemByLabel (label:string, item:ItemType)_
  - _updateItemByIndex (index:number, item:ItemType)_
  - _shiftItem ()_
  - _popItem ()_
  - _removeItemById (id:string)_
  - _removeItemByLabel (label:string)_
  - _removeItemByIndex (index:number)_
  - _loadItemsFromArray (arrayItems:ItemType[])_
- `columns`
  - _allColumns ()_
  - _setColumns (array:string[])_
- `title`
  - _setTitle (title:string)_
  - _reset ()_
  - _clear ()_
- `visible`
  - _true ()_
  - _false ()_
- `CSSVarStyle`
  - _init ()_
  - _changeStyle (style: string, value: string)_
  - _changeFontTitle (value: string)_
  - _changeFontItems (value: string)_
  - _changeFontTitleAndItems (title: string, items: string)_

Ho ancora un paio di questioni tecniche da chiarire e da chiarirmi. La prima riguarda la possibilità o meno di usare sprites come icone. Ci sono alcuni limiti legati a C3 che non so se vale la pena cercare di aggirare. La seconda è come distribuire tutto questo.

{% include picture img="files.webp" ext="jpg" alt="" %}

Tutto quello che serve sono due file:

- `menu.js`
- `menu.css`

Dopo averli importati dentro Construct 3 è possibile creare dei menù personalizzati. Non so però se posso partire da questo per creare un plugin o se distribuire direttamente i due file.

Ci penserò, ma non oggi e domani. Oggi è (finalmente) il mio turno per il vaccino e domani sarà una giornata lunga la lavoro. Tenevo però a parlare di questo progetto perché ne sono abbastanza orgoglioso. E se piace anche a voi, ricordo la mia pagina su [Patreon: patreon.com/el3um4s](https://www.patreon.com/el3um4s)