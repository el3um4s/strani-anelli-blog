---
title: "Plugins for Construct 3: risistemato!"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "c3plugins"
  immagine_estesa: "c3plugins"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2020-02-21 17:01"
categories:
  - 100DaysOfCode
  - Construct 3
tags:
  - 100DaysOfCode
  - Construct 3
  - Progetti
  - Plugin
---

Ci ho messo 3 giorni, non so quante ore, ma alla fine soro riuscito a [mettere un po' di ordine]({% post_url 2020-02-15-e-ora-di-ragionare-sulle-cose-vecchie-parte-1 %}) nei miei repository. Adesso si può trovare tutti in [un unico repository](https://github.com/el3um4s/construct-plugins-and-addons) e in un unico sito: [c3plugins.stranianelli.com](https://c3plugins.stranianelli.com/).

È stata un'operazione abbastanza lunga anche perché ho reso omogenea la struttura delle cartelle per ogni plugin. Ci sono ancora un po' di cosine da sistemare, per esempio come gestire i file c3IDE, ma posso dire che il grosso è stato fatto. Adesso i miei plugin per Construct3 hanno una loro casa. E, cosa ancora più importante, dovrebbe essere più semplice, per me, tenerli aggiornati o per lo meno sotto controllo.

L'elenco dei singoli plugin non lo riporto qui. Prima di tutto perché adesso sono abbastanza cotto, e in secondo luogo perché nel repository e nel sito ci sono tutte le informazioni.

Giusto un'appunto, a mia memoria, su come ho organizzato le varie cartelle. Ogni plugin, adesso, non ha più un proprio repository indipendente ma è salvato in una cartella all'interno di quello generale. Prendo come esempio il plugin **Drag and Drop Files**: è salvato nella cartella `drag-drop-files`.

Dentro questa directory ci sono 5 altre cartelle:

- **c3ide**: dove vengono salvati i file di sviluppo
- **demo**: per i progetti di esempio pubblicati online. Per ogni plugin c'è almeno un esempio. Per tenere ordinato il tutto la demo principale è contenuta in una cartella dallo stesso nome del plugin. In questo caso quindi c'è una struttura di questo genere: `demo/drag-drop-files`
- **src**: dove sono conservati i file dell'addons. Sono uguali a quelli compressi nel file _c3addon_ ma averli in formato di testo mi permette di consultarli più facilmente senza dover aprire alcun editor o estrarli nuovamenti dal plugin
- **download**: i file che è possibile scaricare. Ci sono 3 cartelle:
  - **current**: con il file più recente del plugin
  - **previous**: con le vecchie versioni del plugin (non necessariamente solo quelli presenti sul [sito di Construct 3](https://www.construct.net/en))
  - **demo**: i file _c3p_ di esempio, da scaricare e da usare come guida per i vari plugin

Oltre a queste cartelle ci sono anche 2 file:

- **README.md** con le istruzioni d'uso
- **icon64.svg**, ovvero il logo del plugin in formato svg, quadrato con lato di 64px

Infine un'ultima nota. I primi plugin sono stati sviluppati usando Atom e il mio [Local Server for Construct 3](https://github.com/el3um4s/local-server-for-construct-3). Per gli ultimi, invece, è stato di grande aiuto [c3IDE di aramandoalonso](https://github.com/armandoalonso/c3IDE).
