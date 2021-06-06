---
title: "Petit Chevaux"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-06-06 23:30"
categories:
  - Construct 3
  - JavaScript
  - Svelte
tags:
  - Construct 3
  - JavaScript
  - Svelte
---

Questa settimana ho completato il corso su [Svelte](https://svelte.dev/) e ho cominciato a sperimentare. Mi piacerebbe convertire questo blog e il repository dei miei template ([questo](https://github.com/el3um4s/construct-demo)) in un sito basato su [SvelteKit](https://kit.svelte.dev/). Ci sono però alcuni problemi legati alla disposizione delle cartelle nel repository. Quindi per il momento non ho ancora deciso come procedere.

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-06-petits-chevaux/showcase-c3-projects.gif)

Allora ho deciso di provare qualcosa di diverso e di provare un progetto più limitato. Ho voluto capire come far comunicare una pagina html con un progetto Construct 3 inserito nella pagina stessa. La mia idea è di esplorare la possibilità di integrare in maniera trasparente dei piccoli giochi all'interno di un progetto più esteso usando C3 per la parte dinamica e Svelte per la gestione dei dati. Per provare la mia idea ho scelto un gioco molto semplice, **Petits Chevaux**:

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-06-petits-chevaux/animation.gif)

La parte centrale, quella con i cerchi concentrici e le palline che girano è creata con C3. Ma il pulsante sulla destra e la tabella sulla sinistra è puro HTML. I dati vengono passati da e verso C3 tramite l'API [Window.postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

Comincio con il codice di Construct 3. Nel file `main.js` inserisco una funzione `attachListeners`

```js
import { attachListeners } from "./postMessage.js";

runOnStartup(async runtime => {
	globalThis.g_runtime  =  runtime;
	runtime.addEventListener("beforeprojectstart", () => attachListeners());
});
```
La funzione serve per creare un'interfaccia per permettere la comunicazione da e per la pagina che ospita il gioco.

Il file `postMessage.js` contiene alcune funzioni. Le principali sono 3:

- `attachListeners`
- `getMessage`
- `sendMessage`

`attachListeners` aggiunge un semplice osservatore all'evento `message`

```js
function attachListeners() {
	if (globalThis.addEventListener) {
		globalThis.addEventListener("message", getMessage, false);
	} else {
		globalThis.attachEvent("onmessage", getMessage);
	}
}
```

Quando la pagina riceve un evento `message` esegue la funzione `getMessage`:

```js
function getMessage(e) {
	if( !trustedOrigin.includes(e.origin)) {
		console.log("Error, wrong origin");
	} else {
		const message = e.data;
		const messageType = message.type;
		const messageContent = message.content;

		match(messageType)
      .on(t => t.toLowerCase() === "set", () => getMessageSet(messageContent))
		  .on(t => t.toLowerCase() === "status", () => getMessagePlay(messageContent))
      .otherwise(t => () => 0);
	}
}
```

L'evento contiene molte informazioni, le più utili in questo caso sono `event.origin` ed `event.data`. `event.origin` ci permette di controllare la pagina che ha originato il messaggio. Se è una pagina considerata attendibile allora leggiamo il contenuto del messaggio e decidiamo cosa fare. Il messaggio è contenuto in `event.data`. Per semplificarmi la vita ho deciso di usare uno standard per i messaggi inviati e ricevuti. Sono tutti degli oggetti con proprietà `type` e `content`. 

La terza funzione è `sendMessage`:

```js
function sendMessage(message) {
	const targetWindow = globalThis.parent;
	targetWindow.postMessage(message, "*");
}
```

Tramite questa funzione possiamo spedire un messaggio a un'altra pagina, a un'altra finestra oppure a un elemento iFrame. Poiché userò il gioco all'interno di un iFrame è sensato spedire il messaggio a `Window.parent`, ovvero la pagina che contiene l'iFrame con il codice del gioco. Conviene però usare [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) per garantire una maggiore compatibilità con le caratteristiche di Construct 3.

Sistemato il codice di C3 è il momento di passare a quello della pagina che ospiterà il gioco. Il codice é sostanzialmente lo stesso con una piccola differenza: `sendMessage` invierà il messaggio a un iFrame.

```ts
export interface Message {
    type: string;
    content: string;
}

export function sendMessage(iframe: HTMLIFrameElement, 
                            message: Message, 
                            targetOrigin: string = "*") {
    iframe.contentWindow.postMessage(message, targetOrigin);
}
```

Poiché sto usando Svelte ho creato un componente `Construct.svelte`:

```html
<script lang="ts">
    export let construct3: HTMLIFrameElement;
    const src = "./c3/game.html"
</script>

<iframe title="C3" bind:this="{construct3}" {src} scrolling="no" noresize="noresize" /> 
```

Per permettere all'applicazione di leggere l'iFrame ho inserito un prop `construct3`. In `App.svelte` scrivo:

```html
<script lang="ts">
  import { onMount } from "svelte";
  import { attachListeners, sendMessage } from "./PostMessage/postMessage";

  import Construct from "./Construct/Construct.svelte";

  let construct3: HTMLIFrameElement;

  onMount(() => {
    attachListeners();
  });
</script>

<Construct bind:construct3 />
```

In questo modo la variabile `construct3` è collegata all'iFrame del gioco e posso usarla per spedire dei comandi. Posso, per esempio, far eseguire un nuovo giro di ruota premendo un pulsante usando un codice simile a questo:

```html
<script>
  function spin() {
    sendMessage(construct3, {
      type: "status",
      content: "SPIN"
    }, "*");
  }
</script>

<button  on:click={spin}>Spin</button>
```

Per mostrare il codice che ho usato ho creato un nuovo repository ([https://github.com/el3um4s/petits-chevaux](github.com/el3um4s/petits-chevaux)) e una pagina su Itch.io ([https://el3um4s.itch.io/petits-chevaux](el3um4s.itch.io/petits-chevaux)).

Il codice del file Construct 3 è caricato anche sul solito repository di GitHub

- [il progetto su GitHub](https://github.com/el3um4s/construct-demo)
- [la demo online](https://el3um4s.github.io/petits-chevaux/)
- [Patreon](https://www.patreon.com/el3um4s)