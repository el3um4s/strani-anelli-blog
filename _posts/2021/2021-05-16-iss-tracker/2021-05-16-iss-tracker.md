---
title: "ISS Tracker"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-05-16 10:15"
categories:
  - Construct 3
  - JavaScript
tags:
  - Construct 3
  - JavaScript
  - Maps
---

Durante questa settimana ho cominciato a sperimentare con [Svelte](https://svelte.dev/), un compilatore di JavaScript. Con buona probabilità lo userò molto spesso in futuro. Al momento sono però solo all'inizio, e devo capire ancora alcune cose. Oramai si sta profilando l'ipotesi, per me, di combinare assieme Electron, TypeScript, Svelte e Construct 3. Ma è ancora presto, al momento sono ancora in fase di studio. Passo perciò al progetto della settimana, un'applicazione per mostrare in tempo reale la posizione della Stazione Spaziale Internazionale (ISS):

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-05-16-iss-tracker/animation.gif)

L'idea non è mia (anche perché esistono varie implementazioni di questo progetto), mi è stata suggerita da [etowner](https://etowner.itch.io/). Si tratta, in sintesi, di una mappa su cui mostrare in tempo reale la posizione della Stazione Spaziale. Poiché la stazione è in orbita, e poiché la sua velocità relativa alla terra è alta, l'icona della stazione si muoverà in maniera evidente.

Ho già parlato di come [integrare le mappe in Construct 3](https://www.patreon.com/posts/maps-in-3-49027372), non mi ripeterò. Voglio però far notare il sistema che ho usato per ottenere la posizione della stazione su come ho inserito l'icona nella mappa.

```js
export default async function findISS() {
	const issAPI = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
	const data = await issAPI.json();
	
	const lat = data.latitude.toFixed(2);
	const long = data.longitude.toFixed(2);
	const timestamp = new Date(data.timestamp * 1000).toUTCString();
  const speed = data.velocity.toFixed(2);
  const altitude = data.altitude.toFixed(2);
	
	const result = { lat, long, timestamp, speed, altitude };
	return result;
}
```

Ho usato la [**Fetch API**](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) per richiedere la posizione della ISS. Una volta ottenuto il risultato ho estratto i dati che mi interessano (posizione, velocità, distanza dal terreno) e l'orario di rilevazione della posizione. Avendo la posizione è possibile aggiungere un livello alla mappa. Su GitHub è possibile vedere il file [createMap.js](https://github.com/el3um4s/construct-demo/blob/master/mini-template/006-iss-tracker/source/files/scripts/createmap.js) completo, qui riporto solamente la parte di cui sto parlando.

```js
const issPosition = await findISS();
const { lat, long } = issPosition;
		
Globals.iss = new ol.geom.Point(ol.proj.fromLonLat([long, lat]))
	
const feature = new ol.Feature({geometry: Globals.iss})

const vectorSource = new ol.source.Vector({
	features: [feature]
});

const vectorLayer = new ol.layer.Vector({
  source: vectorSource,
});

Globals.map = new ol.Map({
  target: id,
  layers: [
    new ol.layer.Tile({	
      source: new ol.source.OSM()
    }),
    vectorLayer
  ],
  view: new ol.View({
        center: ol.proj.fromLonLat([long, lat]),
        zoom: 1
      })
});
```

Sostanzialmente dopo aver ricavato la posizione della stazione creo un punto sulla mappa e lo uso come base per creare un livello da sovrapporre alle tiles di OpenStreetMap. Ho salvato il riferimento alla mappa e al punto in una variabile globale (nel file [globals.js](https://github.com/el3um4s/construct-demo/blob/master/mini-template/006-iss-tracker/source/files/scripts/globals.js)) in modo da poter modificare in un secondo momento la posizione del punto e il centro della mappa.

Ma avere un punto non è sufficiente, ho dovuto anche aggiungere uno stile per poter visualizzare graficamente la stazione. Per farlo ho importato nel progetto un'immagine (png, 64x64) da usare come marcatore. Dopodiché ho ricavato l'URL dell'immagine stessa:

```js
const iconURL = await g_runtime.assets.getProjectFileUrl(iconName);
```

In questo modo posso assegnare uno stile personalizzato al punto sulla mappa:

```js
feature.setStyle(
  new ol.style.Style({
    image: new ol.style.Icon({
      color: 'rgba(250, 0, 0, 0.9)',
      crossOrigin: 'anonymous',
      src: iconURL,
      scale: 0.4
    })
  })
)
```

Adesso posso creare una mappa dove viene mostrata la posizione della stazione

```js
await createMap("mapid");
```

Ma la posizione resta fissa, a me interessa aggiornarla in tempo reale. Per fare questo mi serve una nuova funzione:

```js
async function updateISSposition() {
	const issPosition = await findISS();
	const { lat, long } = issPosition;
	
  Globals.iss.setCoordinates(ol.proj.fromLonLat([long, lat]));

	const view = Globals.map.getView();
	view.setCenter(ol.proj.fromLonLat([long, lat]));
}
```

Con `setCoordinates()` sposto il punto sulla mappa e con `setCenter()` mi assicuro che la mappa sia sempre centrata sulla stazione spaziale. Infine imposto 

```js
setInterval(updateISSposition, 2000);
```

per aggiornare ogni 2000 millisecondi la posizione.

Questo è tutto, per il momento. Ho caricato il file completo su GitHub, è possibile scaricarlo e vedere il codice originale.

- [il progetto su GitHub](https://github.com/el3um4s/construct-demo)
- [la demo online](https://c3demo.stranianelli.com/mini-template/006-iss-tracker/demo/)
- [Patreon](https://www.patreon.com/el3um4s)