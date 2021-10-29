---
title: "Testare app ElectronJS"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-10-28 10:00"
categories:
  - ElectronJS
  - TypeScript
  - Template
  - Playwright
tags:
  - ElectronJS
  - TypeScript
  - Template
  - Playwright
---

Gli ultimi miei articoli hanno parlato di come testare componenti e pacchetti npm. Ma il mio viaggio non è ancora concluso: mi manca da capire come testare applicazioni Electron. Il problema è nato dal mio tentativo di mantenere aggiornato il mio template [MEMENTO - Svelte, TailwindCSS, Electron and TypeScript](https://github.com/el3um4s/memento-svelte-electron-typescript). E sopratutto dalla mia volontà di aggiungere alcuni dettagli: dopo un aggiornamento ha smesso di funzionare e ho fatta molta fatica a capire dove fosse il problema. Aggiungere vari test ai componenti mi è stato utile. Come si sta rivelando utile aggiungere dei test automatici ad [Electron](https://www.electronjs.org/).

### Gli strumenti disponibili

Il problema principale di testare app Electron è legato alla mancanza di framework consolidati e, sopratutto, aggiornati. Praticamente tutte le guide che si trovano in rete consigliano di usare [Spectron](https://www.electronjs.org/spectron). Il problema è che Spectron supporta solamente [le versioni di Electron fino alla 13](https://github.com/electron-userland/spectron/issues/896). E questo lo rende sostanzialmente inutile per i miei interessi.

L'alternativa migliore a Spectron è [Playwright](https://playwright.dev/): un framework creato e mantenuto da Microsoft, e per di più integrato con TypeScript.

### Installo Playwright

Continuo a lavorare sul mio template, non mi interessa partire da zero. Per prima cosa aggiungo Playwright alle dipendenze del progetto:

```bash
npm i -D playwright @playwright/test
```

Poiché mi interessa testare solamente Electron non installo gli altri browser (non uso `npx playwright install` perché non mi serve). Però aggiungo uno script a `package.json`:

<script src="https://gist.github.com/el3um4s/ca5415e2d4db9121a5bcb4f52fa8dd33.js"></script>

### Creo il primo test: Electron si avvia

Fatto questo posso cominciare a creare il primo test. Creo una cartella `test` e al suo interno il file `base.test.ts`. La prima cosa che voglio verificare è che l'app Electron si avvii e mostri una finestra.

Spulciando nella documentazione di Playwright saltano fuori due classi sperimentali: [Electron](https://playwright.dev/docs/api/class-electron/) ed [ElectronApplication](https://playwright.dev/docs/api/class-electronapplication). Mi serviranno entrambe ma per il primo test è sufficiente la prima.

Mi serve inoltre la classe [Test](https://playwright.dev/docs/api/class-test/), per eseguire i vari test e indicare cosa mi aspetto di ottenere.

<script src="https://gist.github.com/el3um4s/904abdc16f86a72111d204a320f148f5.js"></script>

Il test che devo scrivere è asincrono: l'apertura di Electron non è sempre immediata quindi devo assicurarmi di eseguire le varie operazioni solo quando sono effettivamente possibili. La prima cosa da fare è avviare Electron:

<script src="https://gist.github.com/el3um4s/58467e244c10275479ad931c02e744e0.js"></script>

Dopo aver avviato l'app intercetto se esiste una finestra visibile. Per farlo uso [electronApplication.evaluate(pageFunction[, arg])](https://playwright.dev/docs/api/class-electronapplication#electron-application-evaluate)

<script src="https://gist.github.com/el3um4s/64990fcd4c3dcd5f3f4e1c8be4d428b7.js"></script>

In questo modo mi ritrovo con un oggetto `windowState` contenente lo stato della finestra di Electron. Quello che mi aspetto è che la finestra si visibile, la finestra di sviluppo sia chiusa e che l'app non sia in crash. Tradotto in codice:

<script src="https://gist.github.com/el3um4s/d423ef55326ef6310b2e8ce66833f9e3.js"></script>

Per finire dopo aver eseguito i test chiudo Electron:

<script src="https://gist.github.com/el3um4s/3e1f0fce9a06a4206bea218df568df6d.js"></script>

Adesso metto tutto assieme e questo è il mio primo test:

<script src="https://gist.github.com/el3um4s/9bc6fc06d8726ea9aabb7f570e0332b9.js"></script>

Per eseguirlo uso il comando:

```bash
npm run test
```

### Controllo il contenuto della finestra

Bene, l'app si avvia. Il controllo successivo è verificare il contenuto. Poiché eseguirò più test in sequenza sulla stessa pagina uso `test.describe`

<script src="https://gist.github.com/el3um4s/615c5a669d50aa1572d9cb733e13db71.js"></script>

Posso interagire con i vari elementi della pagina e verificare il loro contento. Per esempio, posso assicurarmi che il titolo della pagina sia quello che voglio io:

<script src="https://gist.github.com/el3um4s/164a153b7097ca53ecd4904e12721bbd.js"></script>

Oppure controllare che il numero di versione dell'app sia effettivamente visualizzato:

<script src="https://gist.github.com/el3um4s/98475c5449875b0a298c70bb2eb97a0e.js"></script>

### Verifico la grafica dell'applicazione

Al di là del contenuto, una cosa che mi è utile è la possibilità di verificare l'aspetto grafico di Electron. Per farlo devo scattare degli screenshot della finestra e confrontarli con un'immagine di riferimento.

<script src="https://gist.github.com/el3um4s/ae44bf6004c2673e770d3a96c5594ab0.js"></script>

Ogni volta che eseguo il test Playwright confronta lo screenshot della finestra (salvato in `tests/screenshot/firstWindow.png`) con quello di riferimento. L'immagine di riferimento viene creata al primo avvio del test ed è immutabile a meno di non indicare esplicitamente di volerla aggiornare.

Per cambiare le immagini di riferimento aggiungo uno script a `package.json`:

<script src="https://gist.github.com/el3um4s/2037cd67cd89ec88948c647119775551.js"></script>

### Personalizzo Playwright

Posso configurare il comportamento complessivo di Playwright creando un file `playwright.config.ts`. A me interessa personalizzare la sensibilità di `toMatchSnapshot`, quindi scrivo:

<script src="https://gist.github.com/el3um4s/f8b1f510ff9770c962e835ba0a3c3c0d.js"></script>

### Registro i test

Un'altra funzione utile di Playwright è la possibilità di registra i vari test e di riprodurli a video. Può servire per verificare il comportamento dell'applicazione e sopratutto capire cosa non sta funzionando. Mi serve la classe [Tracing](https://playwright.dev/docs/api/class-tracing). Con `start` avvio la registrazione, con `stop` la blocco:

<script src="https://gist.github.com/el3um4s/d16111e7d2112963f38dba7ca76c3577.js"></script>

La registrazione viene salvata in un file `zip`. Per poterlo aprire con semplicità aggiungo uno script a `package.json`:

<script src="https://gist.github.com/el3um4s/4a4ac6a918fb1d74eb6c04e5bb5a5f32.js"></script>

### Link utili

Ovviamente questa è solo una panoramica di Playwright: ho cominciato da poco ad approfondire questo strumento, ricco di opzioni e di possibilità. In rete non ho trovato molto materiale, consiglio quindi di partire dalla documentazione ufficiale:

- [Getting started with Playwright](https://playwright.dev/docs/intro/)
- [Playwright: Page](https://playwright.dev/docs/api/class-page)
- [Playwright: Electron](https://playwright.dev/docs/api/class-electron/)
- [Playwright: ElectronApplication](https://playwright.dev/docs/api/class-electronapplication)
- [Playwright: Visual Comparisons](https://playwright.dev/docs/test-snapshots/)

Ho trovato inoltre utili questi repository:

- [cawa-93/vite-electron-builder](https://github.com/cawa-93/vite-electron-builder/blob/7d2df55fd8a0b3a803963d62558f719c9034ba2a/tests/app.spec.js)
- [microsoft/playwright - tests/electron](https://github.com/microsoft/playwright/tree/master/tests/electron)
- [spaceagetv/electron-playwright-example](https://github.com/spaceagetv/electron-playwright-example)

E poi, ovviamente, c'è il repository con il mio template:

- [MEMENTO - Svelte, TailwindCSS, Electron and TypeScript](https://github.com/el3um4s/memento-svelte-electron-typescript)
