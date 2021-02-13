---
title: "Construct 3 & YouTube"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "construct-youtube"
  immagine_estesa: "construct-youtube"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-01-27 18:00"
categories:
  - Construct 3
  - Template
  - JavaScript
tags:
  - Construct 3
  - JavaScript
  - Template
  - YouTube
---

Il template di oggi riguarda Construct 3 e YouTube. È un progetto molto semplice, pensato con l'unico obiettivo di testare l'integrazione tra questi due mondi. Il risultato è carino e permette di fare delle cose interessanti.

Come ho fatto negli ultimi progetti, sto continuando a integrare la struttura "_event sheets_" di C3 con i "_moduli js_" introdotti con la [release r226](https://www.construct.net/en/make-games/releases/beta/r226) del 24 novembre 2020. Devo ammettere che mi sto trovando bene: posso scrivere funzioni abbastanza comprensibili direttamente sull'editor e nel contempo renderle facilmente utilizzabili tramite alcune funzioni di Construct 3.

{% include picture img="event-sheets.webp" ext="jpg" alt="" %}

Il codice JavaScript è diviso in alcuni moduli:
- [**main.js**](https://github.com/el3um4s/construct-demo/blob/master/javascript/007-youtube/source/files/scripts/main.js)
- [**globals.js**](https://github.com/el3um4s/construct-demo/blob/master/javascript/007-youtube/source/files/scripts/globals.js)
- [**youTube.js**](https://github.com/el3um4s/construct-demo/blob/master/javascript/007-youtube/source/files/scripts/youtube.js)
- [**videoYT.js**](https://github.com/el3um4s/construct-demo/blob/master/javascript/007-youtube/source/files/scripts/videoyt.js)
- [**importForEvents.js**](https://github.com/el3um4s/construct-demo/blob/master/javascript/007-youtube/source/files/scripts/importforevents.js)

`main.js` è molto semplice:

```js
runOnStartup(async runtime => {	globalThis.g_runtime = runtime; });
```

Non ricordo di averne mai parlato, ma questo è un trucco molto semplice per poter accedere a `runtime` da ogni parte di Construct 3: mi serve in praticamente tutti gli script successivi.

C'è una possibile variante, ed è questa:

```js
import * as YouTube from "./youTube.js";

runOnStartup(async runtime => {
  globalThis.g_runtime = runtime;
  await YouTube.LoadAPI();
});
```

Nell'esempio che ho pubblicato su GitHub il comando `await YouTube.LoadAPI();` lo eseguo direttamente dal foglio `Loader`. L'importante è che ci sia, prima o poi, nel progetto. Perché? Perché serve per caricare l'[API di YouTube](https://developers.google.com/youtube/iframe_api_reference).

Il secondo file è `globals.js` e serve per avere delle variabili globali, trasversali a tutto il progetto.

```js
const Globals = {
	ytPlayer: {},
	playlist: {
		askGamdev: ["k2-AfT0-V-c","JF404Smm4Og","MkNHQjBuCcE","F7j5h03W3CA","kFqpgqn1dEk","0V2d2S9j5Og","rzwJZC3cGlw", "oTm5cxZEdmU", "xkH5NemDPSY", "CxI-ptHu3rQ", "wxM7hsydzdQ", "onvs1ib98R"],
		extraCredits: ["z06QR-tz1_o","dHMNeNapL1E","UvCri1tqIxQ","qxsEimJ_3bM","2xfxx27HbM4","rDjrOaoHz9s"]
	}
};

export default Globals;
```

Voglio fare notare `Globals.ytPlayer`: è un oggetto vuoto, verrà riempito più avanti in maniera dinamica, con tanti elementi quanti sono i player YouTube disegnati a schermo.

Il file successivo è quello che permette il collegamento tra YouTube e Construct 3, `youTube.js`, e contiene due funzioni fondamentali: `LoadAPI` e `CreatePlayer`.

```js
export function LoadAPI()
{
	const scriptTag = document.createElement("script");
	scriptTag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);

	return new Promise(resolve =>
	{
		globalThis["onYouTubeIframeAPIReady"] = resolve;
	});
}

export function CreatePlayer(iframeId, eventHandlers)
{
	return new Promise(resolve =>
	{
		if (!eventHandlers)
			eventHandlers = {};		
		eventHandlers["onReady"] = (e => resolve(e.target));
		new globalThis["YT"]["Player"](iframeId, {
			"events": eventHandlers
		});
	});
}
```

La prima, `LoadAPI`, inserisce il collegamento all'API di YouTube direttamente nell'header della pagina. È una funzione asincrona (restituisce una promessa) e può essere utilizzata nel loader per ritardare l'avvio del progetto fino al momento giusto.

La seconda funzione, sempre asincrona, collega un Player YouTube a un Iframe usando come riferimento l'ID dell'elemento nella pagina HTML.

Una volta importato questo nel progetto è finalmente possibile divertirsi un po' implementando i comandi che ci servono. Lo faccio nel file `videoYT.js`

```js
import * as YouTube from "./youTube.js";
import Globals from "./globals.js";

export function initializeVideo(iframeId){
	Globals.ytPlayer[iframeId] = {};
	Globals.ytPlayer[iframeId]["player"] = null;
}

export async function createVideo(iframeId) {
	Globals.ytPlayer[iframeId]["player"] = await YouTube.CreatePlayer(iframeId, {
		"onStateChange": e => { Globals.ytPlayer[iframeId]["state"] = e.data; },
		"onReady": e => {}
	});
	return true;
};

export function cueVideoById(iframeId, videoId) { Globals.ytPlayer[iframeId]["player"].cueVideoById(videoId); }
export function loadVideoById(iframeId, videoId) { Globals.ytPlayer[iframeId]["player"].loadVideoById(videoId); }
export function loadVideoByUrl(iframeId, videoId) {	Globals.ytPlayer[iframeId]["player"].loadVideoByUrl(videoId); }

export function loadPlaylist(iframeId, videoId) { Globals.ytPlayer[iframeId]["player"].loadPlaylist(Globals.playlist[videoId]); }

export function setLoopTrue(iframeId) {	Globals.ytPlayer[iframeId]["player"].setLoop(true); }
export function setLoopFalse(iframeId) { Globals.ytPlayer[iframeId]["player"].setLoop(false); }

export function setShuffleTrue(iframeId) {	Globals.ytPlayer[iframeId]["player"].setShuffle(true); }
export function setShuffleFalse(iframeId) { Globals.ytPlayer[iframeId]["player"].setShuffle(false); }

export function playVideo(iframeId) { Globals.ytPlayer[iframeId]["player"].playVideo(); }
export function pauseVideo(iframeId) { Globals.ytPlayer[iframeId]["player"].pauseVideo(); }
export function stopVideo(iframeId) { Globals.ytPlayer[iframeId]["player"].stopVideo(); }

export function setVolume(iframeId, volume) { Globals.ytPlayer[iframeId]["player"].setVolume(volume); }

export function mute(iframeId) { Globals.ytPlayer[iframeId]["player"].mute(); }
export function unMute(iframeId) { Globals.ytPlayer[iframeId]["player"].unMute(); }

export function lengthPlaylist(iframeId) { return Globals.ytPlayer[iframeId]["player"].getPlaylist().length; }
```

La prima funzione, `initializeVideo(iframeId)` va eseguita una sola volta per elemento e non fa altro che inserire un riferimento al player nella variabile `Globals`.

Anche `createVideo(iframeId)` va lanciata solamente una volta per ogni elemento: crea un player YouTube per ogni elemento, e lo salva dentro `Globals`.

Infine ci sono le varie funzioni, che richiamano quelle ufficiali di YouTube e che possono essere eseguite direttamente da Construct 3. O, meglio, lo potranno dopo aver inserito un altro file, `importForEvents.js`

```js
import Globals from "./globals.js";
import * as YouTube from "./youTube.js";
import * as VideoYT from "./videoYT.js";
```

Questo script è anche l'unico con la proprietà `Purpose` impostata su `Imports for events`.

Basta, questo è tutto. Come ultima cosa i link al progetto:

- [il progetto su GitHub](https://github.com/el3um4s/construct-demo)
- [la demo online](https://c3demo.stranianelli.com/javascript/007-youtube/demo/)
- [Patreon](https://www.patreon.com/el3um4s)
