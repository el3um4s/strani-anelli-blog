---
title: "Come Creare Mappe SVG"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-04-20 9:00"
categories:
  - Maps
  - JavaScript
  - Svelte
  - TypeScript
  - NodeJS
  - Shapefile
  - GeoJson
  - CSV
tags:
  - Maps
  - JavaScript
  - Svelte
  - TypeScript
  - NodeJS
  - Shapefile
  - GeoJson
  - CSV
---

Gli ultimi mesi sono stati un po' caotici. Tralasciando alcune questioni personali (e da un certo punto di vista globali) mi sono concentrato su come creare, aggiornare e modificare delle mappe. Lo scopo è ottenere delle mappe in SVG e PDF utilizzabili offline. E, magari, avere un modo per abbinare dei dati a partire da dei file excel (o csv/json).

### Preambolo

Uno dei problemi che mi ritrovo ad affrontare con una certa regolarità riguarda la creazione di mappe tematiche. Per certe ragioni che non sto qui a spiegare preferisco lavorare per quanto possibile offline. Complica le cose ma permette di non dipendere troppo dalla condizione della rete. Nel corso degli anni ho provato varie soluzioni, l'ultima è usare dei file SVG. Il problema è trovare delle mappe ben fatte in questo formato. Per un po' me la sono cavata con alcuni file di [Wikivoyage](https://it.wikivoyage.org/wiki/File:Provinces_and_municipalities_in_Lombardy.svg). Però la realtà ha la pessima abitudine di cambiare in continuazione e quello che era vero un decennio fa può non esserlo più oggi.

Spulciando in rete ho trovato un vecchio articolo di Alessio Cimarelli conservato su archive.org: [Mappe perfette in SVG](https://web.archive.org/web/20180317050240/http://old.dataninja.it/mappe-perfette-in-svg/). Nonostante si parli di una tecnica di oramai dieci anni fa ho trovato la lettura molto interessante. Anzi, più che interessante: mi ha indicato una strada da seguire.

### Il problema principale e la soluzione rapida

Il mio problema è abbastanza specifico ma la procedura per risolverlo credo possa essere facilmente generalizzata. Quindi:

> Come creare dei file GeoJSON partendo da file ShapeFile?
> Come convertire dei GeoJSON in file SVG?

Senza andare nel tecnico, i passi da fare sono sostanzialmente questi:

1. procurarsi i file shapefile
2. estrarre dal file le porzioni di territorio che interessano
3. eventualmente ridurre la precisione del file per ridurne le dimensioni
4. salvare questa selezione come file GeoJSON
5. convertire il file da GeoJSON in SVG
6. infine se serve correggere le dimensioni e l'impaginazione del file SVG

Messi in fila sono dei punti abbastanza semplici. Ma vale la pena di andare un po' più nel dettaglio.

### Scaricare i file shapefile

Ovviamente dipende da quello che ci serve. Nel mio caso vanno bene i [confini amministrativi italiani](https://www.istat.it/it/archivio/222527) dell'ISTAT. Oramai da qualche anno l'ISTAT pubblica gli shapefile dei comuni, delle provincie e delle regioni italiane. Scarico la versione generalizzata (quella più leggera) e estraggo i file in una cartella specifica.

Ancora più nello specifico, per quanto riguarda Milano il comune rilascia alcuni open data in vari formati tramite il sito [dati.comune.milano.it](https://dati.comune.milano.it/dataset). Ci sono molte mappe interessanti, spesso già in GeoJSON. A me interessano questi:

- [Nuclei d'Identità Locale (NIL) VIGENTI - PGT 2030](https://dati.comune.milano.it/dataset/ds964-nil-vigenti-pgt-2030)
- [Numeri civici con coordinate geografiche](https://dati.comune.milano.it/dataset/ds634-numeri-civici-coordinate)
- [ATM - Percorsi linee metropolitane](https://dati.comune.milano.it/dataset/ds539_atm-percorsi-linee-metropolitane)
- [ATM - Fermate linee metropolitane](https://dati.comune.milano.it/dataset/ds535_atm-fermate-linee-metropolitane)
- [Istruzione: localizzazione delle sedi universitarie degli atenei milanesi](https://dati.comune.milano.it/dataset/ds94-infogeo-atenei-sedi-localizzazione)
- [Istruzione: localizzazione delle scuole secondarie di II grado](https://dati.comune.milano.it/dataset/ds78_infogeo_scuole_secondarie_ii_grado_localizzazione_)
- [Trasporto pubblico: localizzazione della rete ferroviaria](https://dati.comune.milano.it/dataset/ds81_infogeo_rete_ferroviaria_localizzazione_)
- [Trasporto pubblico: localizzazione delle stazioni ferroviarie](https://dati.comune.milano.it/dataset/ds80_infogeo_stazioni_ferroviarie_localizzazione_)

Invece riguardo alla regione lombardia è possibile consultare la pagina:

- [Servizio Download Dati Regione Lombardia](https://www.geoportale.regione.lombardia.it/download-ricerca)
- [Scuole in Lombardia](https://www.geoportale.regione.lombardia.it/download-pacchetti?p_p_id=dwnpackageportlet_WAR_gptdownloadportlet&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_dwnpackageportlet_WAR_gptdownloadportlet_metadataid=%7BDDF3E399-2BF1-4A3A-B62A-5255B1D83BC0%7D)

### Salvare e controllare i file shapefile

Dopo aver scaricato i vari file posso cominciare a selezionare le porzioni di territorio che mi interessa analizzare. Per farlo posso usare un software GIS. Ce ne sono molti. Nel tempo ho usato 3 diversi programmi, tutti e 3 gratis:

- [OpenJump](http://www.openjump.org/)
- [QGIS](https://qgis.org/it/site/)
- [qvSIG](http://www.gvsig.com/it/prodotti/gvsig-desktop)

OpenJump l'ho usato un bel po'. Gli altri due meno.

Il procedimento alla base è lo stesso per tutti e 3: si selezionano gli elementi che interessano e li si salva come nuovo file in formato GeoJSON.

Ma prima di tutto occorre controllare che le geometrie siano corrette.

{% include picture img="check-validity.webp" ext="jpg" alt="" %}

Con QGIS è sufficiente andare sul menù `Vector/Geometry Tools/Check Validity`. Può capitare di trovare alcune geometrie con l'errore `Ring Self-intersection`. Per correggerlo è possibile usare `Vector/Geoprocessing Tools/Buffer`

{% include picture img="change-buffer.webp" ext="jpg" alt="" %}

Non sono preoccupato per la perdita di precisione nelle coordinate geografiche: voglio ottenere un file SVG leggero e facile da maneggiare, anche a costo di perdere le coordinate stesse.

### Salvare come GeoJSON

Il prossimo passo è salvare la mappa come GeoJSON. Per farlo mi basta salvare il layer scegliendo il formato che mi interessa. Tra le opzioni disponibili c'è `coordinate_precision`: posso abbassarlo (per esempio da 15 a 6) per ridurre la precisione delle coordinate e quindi la dimensione del file.

{% include picture img="dimension-geojson-precisions.webp" ext="jpg" alt="" %}

Non sono però ancora soddisfatto. Mi serve un file più piccolo, quindi utilizzo `Vector/Geometry Tools/Simplify`

{% include picture img="simplify-menu.webp" ext="jpg" alt="" %}

Per trovare la giusta dimensione vanno fatte un po' di prove.

### Convertire un file da GeoJSON a SVG

La conversione da GeoJSON a SVG presenta due aspetti critici: funziona

- devo mantenere lo stesso aspetto dei diversi componenti
- devo tenere traccia degli attributi che mi serviranno in futuro

Non ho trovato una soluzione pronta per questo problema. Per fortuna ho trovato un repository che mi ha indirizzato:

- [gagan-bansal/geojson2svg](https://github.com/gagan-bansal/geojson2svg)

Partendo da questo repository ho creato uno script:

```js
import * as fs from "fs";
import geojson2svg from "geojson2svg";

const data = fs.readFileSync("./comuni.geojson", {
  encoding: "utf8",
  flag: "r",
});

console.log("convert data to json");

const datajson = JSON.parse(data);

console.log("convert data to svg");

var converter = geojson2svg({
  attributes: [
    "properties.PRO_COM_T",
    "properties.COMUNE",
    "properties.COD_REG",
    "properties.COD_PROV",
  ],
});

var svgStr = converter.convert(datajson);

console.log("svgStr");

fs.writeFileSync("result.svg", parseSVG(svgStr));
console.log("File written successfully\n");

function parseSVG(s) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="210mm"
   height="297mm"
   viewBox="0 0 210 297"
   version="1.1"
   id="svg8">
<style>
g.comuni {
    fill: none;
    stroke-width: 0.01;
    stroke-linecap: square;
    stroke-linejoin: bevel;
    stroke-miterlimit: 3;
    stroke-opacity: 1;
    stroke: #000000;
    fill-opacity:1;
}
</style>
<g id="global">
<g class="comuni" id="comuni">
${s.join("\r\n")}
</g>
</g>
</svg>
`;
}
```
