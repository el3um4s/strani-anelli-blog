---
title: "Construct 3: come caricare un dictionary da file"
published: true
date: 2020-02-28 17:00
categories:
  - Construct 3
tags:
  - Construct
  - construct-3-come-caricare-un-dictionary-da-file
  - plugins-for-construct-3-risistemato
  - e-ora-di-ragionare-sulle-cose-vecchie-parte-2
cover: cover.webp
lang: it
description: "Dopo aver completato la risistemazione dei miei plugin per Construct 3 ho ricevuto alcuni feedback. E una domanda, su Twitter: è possibile caricare un file dictionary (C3) usando il plugin Drag and Drop? La risposta è: sì. Vediamo come."
---

Dopo aver completato la [risistemazione dei miei plugin per Construct 3](https://blog.stranianelli.com/plugins-for-construct-3-risistemato/) ho ricevuto alcuni feedback. E una domanda, su [Twitter](https://twitter.com/el3um4s): è possibile caricare un file dictionary (C3) usando il plugin [Drag and Drop](https://c3plugins.stranianelli.com/drag-drop-files/)? La risposta è: **sì**. Vediamo come.

Questo plugin funziona semplicemente come interfaccia per permettere il trascinamento nel gioco di un file esterno. Era nato come aiuto per un [vecchio progetto, l'_esploratore di pianeti_](https://blog.stranianelli.com/e-ora-di-ragionare-sulle-cose-vecchie-parte-2/), progetto mai concluso. L'idea era, ed è quella che è rimasta, di avere un modo semplice per importare file da processare poi con Construct 3. Quindi il plugin fa "solo" questo. Tutto il lavoro duro, ovvero la lettura del file caricato, viene svolta da un altro plugin, incluso nella versione ufficiale di C3: [AJAX](https://www.construct.net/en/make-games/manuals/construct-3/plugin-reference/ajax). Basta un evento:

![Immagine](./drag-and-drop-dictionary.webp)

In soldoni, si usa _drag'n'drop_ per ricavare un'_url_ da passare ad _AJAX_ per richiedere il file. Dopo di che si aspetta la fine dell'operazione e si usa l'azione "_load from JSON string_" per caricare il dictionary dentro il gioco.

Ovviamente ho creato anche una demo per mostrare praticamente il funzionamento.

![animazione](./2020-02-28-construct-3-come-caricare-un-dictionary-da-file-demo.gif)

Nella [pagina ufficiale del plugin Drag And Drop Construct 3](https://c3plugins.stranianelli.com/drag-drop-files/) è possibile scaricare sia il codice dell'esempio che un (piccolo) dictionary da usare come test.

<iframe src="https://c3plugins.stranianelli.com/drag-drop-files/demo/dictionary/" width="600" height="400" scrolling="no" noresize="noresize" title="Esempio Construct 3"/>
