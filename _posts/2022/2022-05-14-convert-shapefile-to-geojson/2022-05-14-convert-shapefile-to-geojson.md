---
title: "How to Convert Shapefiles to GeoJSON"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-05-14 18:00"
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

The last few months have been a bit chaotic. I concentrated on how to create, update and modify maps. The aim is to obtain maps in SVG and PDF that can be used offline. And, perhaps, have a way to match data from excel files (or csv/json).

### Preamble

One of the problems I have is about creating thematic maps. For certain reasons that I am not here to explain, I prefer to work offline as much as possible. It complicates things but allows you not to depend on the condition of the network. Over the years I have tried various solutions, the last one is to use SVG files. The problem is finding well-made maps in this format. For a while I got away with some files from [Wikivoyage](https://it.wikivoyage.org/wiki/File:Provinces_and_municipalities_in_Lombardy.svg). But reality has a nasty habit of constantly changing and what was true a decade ago may no longer be true today.

I found an old article by Alessio Cimarelli preserved on archive.org: [Perfect maps in SVG](https://web.archive.org/web/20180317050240/http://old.dataninja.it/mappe-perfette-in-svg/). Although we are talking about a technique of ten years ago, I found the reading very interesting. Indeed, more than interesting: he showed me a path to follow

### The problem and a quick fix

My problem is quite specific but I think the procedure for solving it can be easily generalized. So:

> How to create GeoJSON files starting from ShapeFile files?
> How to convert GeoJSON to SVG file?

Without going into the technical, the steps to take are basically these:

1. get the shapefile files
2. extract from the file portions of the territory
3. reduce map accuracy to reduce file size
4. save this selection as a GeoJSON file
5. convert the file from GeoJSON to SVG
6. finally correct the size and layout of the SVG file

These are quite simple points. However, it is worth going into a little more detail.

### Download the shapefile files

Of course it depends on what we need. In my case, the [Italian administrative boundaries](https://www.istat.it/it/archivio/222527) by ISTAT are ok. For some years now, ISTAT has published shapefiles of Italian municipalities, provinces and regions. I download the generalized version (the lightest one) and extract the files to a specific folder.

More specifically, the municipality of Milan publishes some open data in various formats through the website [dati.comune.milano.it](https://dati.comune.milano.it/dataset). There are many interesting maps, often already in GeoJSON. I'm interested in these:

- [Nuclei d'Identità Locale (NIL) VIGENTI - PGT 2030](https://dati.comune.milano.it/dataset/ds964-nil-vigenti-pgt-2030)
- House numbers with geographic coordinates](https://dati.comune.milano.it/dataset/ds634-numeri-civici-coordinate)
- [ATM - Underground lines routes](https://dati.comune.milano.it/dataset/ds539_atm-percorsi-linee-metropolitane)
- [ATM - Metro lines stops](https://dati.comune.milano.it/dataset/ds535_atm-fermate-linee-metropolitane)
- [Education: location of the universities of Milan universities](https://dati.comune.milano.it/dataset/ds94-infogeo-atenei-sedi-localizzazione)
- [Education: localization of secondary schools](https://dati.comune.milano.it/dataset/ds78_infogeo_scuole_secondarie_ii_grado_localizzazione_)
- [Public transport: location of the railway network](https://dati.comune.milano.it/dataset/ds81_infogeo_rete_ferroviaria_localizzazione_)
- [Public transport: location of railway stations](https://dati.comune.milano.it/dataset/ds80_infogeo_stazioni_ferroviarie_localizzazione_)

Regarding the Lombardy region, I can consult the page:

- [Lombardy Region Data Download Service](https://www.geoportale.regione.lombardia.it/download-ricerca)
- [Schools in Lombardy](https://www.geoportale.regione.lombardia.it/download-pacchetti?p_p_id=dwnpackageportlet_WAR_gptdownloadportlet&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_dwnpackageportlet_WAR_gptdownloadportlet_metadataid=%7BDDF3E399-2BF1-4A3A-B62A-5255B1D83BC0%7D)

### Save and check shapefile files

After downloading the various files, I can begin to select the portions of the territory that I am interested in analyzing. To do this I can use a GIS software. There are many. Over time I have used 3 different programs, all 3 for free:

- [OpenJump](http://www.openjump.org/)
- [QGIS](https://qgis.org/it/site/)
- [qvSIG](http://www.gvsig.com/it/prodotti/gvsig-desktop)

I've used OpenJump quite a bit. The other two less.

The basic procedure is the same for all 3: select the elements of interest and save them as a new file in GeoJSON format.

But first of all you need to check that the geometries are correct.

{% include picture img="check-validity.webp" ext="jpg" alt="" %}

With QGIS just go to the `Vector/Geometry Tools/Check Validity` menu. It may happen to find some geometries with the `Ring Self-intersection` error. To correct this you can use `Vector/Geoprocessing Tools/Buffer`.

{% include picture img="change-buffer.webp" ext="jpg" alt="" %}

I am not worried about the loss of precision in the geographic coordinates: I want to get a light and easy to handle SVG file, even at the cost of losing the coordinates themselves.

### Save as GeoJSON

The next step is to save the map as GeoJSON. To do this, I just need to save the layer by choosing the format that interests me. Among the options available is `coordinate_precision`: I can lower it (for example from 15 to 6) to reduce the precision of the coordinates and therefore the file size.

{% include picture img="dimension-geojson-precisions.webp" ext="jpg" alt="" %}

However, I am still not satisfied. I need a smaller file, so I use `Vector/Geometry Tools/Simplify`.

{% include picture img="simplify-menu.webp" ext="jpg" alt="" %}

To find the right size, you need to do some tests.

After fixing the GeoJson file it's time to convert it to an SVG file. But this will be the topic of a new post.
