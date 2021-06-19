---
title: "Come creare un menu in c3"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-06-20 15:00"
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

Continua la mia esplorazione di Svelte e mi sono lasciato un po' distrarre. Uno dei motivi, se non il motivo principale, per il quale ho ricominciato ad aggiornare il mio blog è l'obbligarmi a concludere (in qualche forma) i progetti che comincio. Ho la tendenza a tralasciare i miei esperimenti quando sono quasi conclusi, quando mancano i dettagli più noiosi. Quindi ho dovuto sforzarmi per completare questo template. Ma è completato, è utilizzabile e penso che lo userò in qualche altro progetto.

Come dicevo la settimana scorsa il mio scopo è ottenere un metodo semplice per creare dei menù da usare in C3. Per farlo ho creato un componente riutilizzabile con Svelte, l'ho inserito in C3 e ho creato un progetto di Construct 3 per documentarne l'uso,

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-20-how-to-create-menu-in-c3/c3-svelte-menu-10.gif)

In questo post voglio riportare le basi di questo template. Servirà al me futuro per ricordare come creare un menù dinamico in Construct 3.

Per prima cosa mi servono due file: [menu.js](https://raw.githubusercontent.com/el3um4s/construct-demo/master/javascript/012-menu/source/lib-menu/menu.js) e [menu.css](https://raw.githubusercontent.com/el3um4s/construct-demo/master/javascript/012-menu/source/lib-menu/menu.css). Sono due file creati compilati con Svelte e che contengono il codice necessario per gestire il menu.

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-20-how-to-create-menu-in-c3/add-js-and-css.gif)

Dopo averli importati in Construct posso cominciare a impostare il progetto. Il file CSS va caricato una sola volta, all'avvio:

{% include picture img="loader.webp" ext="jpg" alt="" %}

Per quanto riguarda il file JS conviene registrarlo in file con purpose "Imports for Events":

```js
import * as svelte from "./menu.js";
```

Per mostrare il menù è sufficiente una riga di codice:

```js
menuSvelte.visible.true();
```

Allo stesso modo per nasconderlo basta

```js
menuSvelte.visible.false();
```

Nel file di esempio creo diversi menù usando diverse tecniche di conseguenza ogni volta richiamo il comando

```js
menuSvelte.items.clearMenu();
```

per eliminare tutte le voci del menù stesso. Poi uso il comando

```js
menuSvelte.title.setTitle("Main Menu");
```

per personalizzare il titolo del menù. Inoltre, sempre per mostrare le varie possibilità, imposto le colonne da mostrare nel menù:

```js
menuSvelte.columns.setColumns(["icon", "label", "description"]);
```

Ci sono 5 "colonne" disponibili: _icon_, _label_, _description_, _rightIcon_, _rightImage_. Inoltre c'è un contenitore, _textual_, per i componenti testuali.

{% include picture img="schema.webp" ext="jpg" alt="" %}

Per inserire i vari elementi nel menù si possono usare alcuni comandi, che ricalcano in parte quelli già in uso per gli array.

```js
menuSvelte.items.push({
	icon,
	label: "Fonts",
	description: "Choose Font Family for the Menu",
  rightIcon,
  rightImage,
	onClick: "g_runtime.callFunction('showFonts')"
});
```

Il comando `items.push(newItem)` permette di inserire un nuovo elemento nel menù. Aggetta un oggetto le cui proprietà ricalcano le colonne che saranno visualizzate nel menù. Ce ne è una nuova, però: `onClick`. Come è facilmente intuibile dal nome, serve per definire la funzione da eseguire quando clicchiamo sull'elemento.

{% include picture img="show-menu.webp" ext="jpg" alt="" %}

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-20-how-to-create-menu-in-c3/c3-svelte-menu-11.gif)

Ho implementato questi comandi:

- **push**_(item: ItemType)_
- **unshift**_(item: ItemType)_
- **shift**_()_
- **pop**_()_
- **addItemAtIndex**_(index: number, item:ItemType)_
- **updateItemById**_(id:string, item:ItemType)_
- **updateItemByLabel**_(label:string, item:ItemType)_
- **updateItemByIndex**_(index: number, item:ItemType)_
- **removeItemById**_(id: string)_
- **removeItemByLabel**_(label: string)_
- **removeItemByIndex**_(index: number)_
- **loadItemsFromArray**_(arrayItems:ItemType[])_

Un'altra cosa utile è la possibilità di modificare lo stile di molti degli elementi del menù. Per farlo è possibile usare dei comandi simili a questo:

```js
menuSvelte.css.changeStyle("menu-width", "360px");
```

I comandi disponibili sono:

1. **changeStyle**_(style: string, value: string)_
2. **changeFontTitle**_(value: string)_
3. **changeFontItems**_(value: string)_
4. **changeFontTitleAndItems**_(title: string, items: string)_
5. **themeStandard**_(theme:string)_
6. **loadTheme**_(customTheme: Styles, standard:string = "Light")_

I primi 4 servono per modificare solo un singolo aspetto del menù. Per cose un po' più elaborate conviene però usare gli ultimi due comandi.

```js
menuSvelte.css.themeStandard("Dark");
```

`menuSvelte.css.themeStandard(theme)` serve per impostare uno dei temi di colore predefiniti. Posso scegliere tra 9 temi diversi: _Dark_, _Light_, _Bouron_, _Gold Miner_, _Oscar_, _Herrera Yellow_, _Herrera Green_, _Herrera Blue_, _Herrera Magenta_.

{% include picture img="show-menu.webp" ext="jpg" alt="" %}

`menuSvelte.css.loadTheme(customTheme, standard)` serve invece a caricare un tema personalizzato a partire da un file JSON. È possibile, per esempio, creare un tema simile a questo:

```json
{   
	"color-primary": "#2e257d",
    "color-background": "#aaa8bd",

    "font-title": "Roboto, sans-serif",
    "font-items": "Roboto, sans-serif",
    
    "modal-background": "#0f0c45bf",

    "menu-border-radius": "32px 0px 32px 0px",
    "menu-border-style": "solid",
    "menu-border-width": "1px",

    "item-height": "64px",
    "item-icon-size": "48px",
    "item-image-size": "64px"
}
```

e poi applicarlo al tema (in Construct 3) con una funzione simile a questa:

{% include picture img="theme-json.webp" ext="jpg" alt="" %}

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-20-how-to-create-menu-in-c3/c3-svelte-menu-12.gif)

Bene, direi che grosso modo questo è tutto. Riporto qui i link legati a questo progetto:

- [il progetto su GitHub](https://github.com/el3um4s/construct-demo)
- [la demo online](https://c3demo.stranianelli.com/javascript/012-menu/demo/)
- [il file c3p](https://c3demo.stranianelli.com/javascript/012-menu/source/c3p/milan-districts.c3p)
- [menu.js](https://c3demo.stranianelli.com/javascript/012-menu/source/lib-menu/menu.js)
- [menu.css](https://c3demo.stranianelli.com/javascript/012-menu/source/lib-menu/menu.css)
- [Patreon](https://www.patreon.com/el3um4s)