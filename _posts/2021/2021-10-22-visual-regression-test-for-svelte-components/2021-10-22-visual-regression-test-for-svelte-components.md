---
title: "Svelte e Visual Regression Test"
published: false
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-10-22 10:00"
categories:
  - Svelte
  - TypeScript
  - Jest
  - Tailwind
  - SvelteKit
  - NPM
  - Template
  - Puppeteer
tags:
  - Svelte
  - TypeScript
  - Jest
  - Tailwind
  - SvelteKit
  - NPM
  - Template
  - Puppeteer
---

Ammetto di trovarmi sempre più a mio agio con lo sviluppo guidato dai test (che quelli bravi chiamano TDD - [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development)). Anche perché man mano che sorgono i problemi so dove andare a cercarli. Ovviamente sconto ancora una certa inesperienza. E penso di pagare anche una certa ingenuità. Un problema che mi ha fatto sbattere la testa è legato alle modifiche non volute dell'aspetto grafico di una pagina web. Per risolvere questo problema ho dovuto imparare come eseguire dei Visual Regression Test.

### Scelgo che strumenti usare

Per una panoramica generale consiglio di leggere questo articolo di [Leonardo Giroto](https://medium.com/loftbr/visual-regression-testing-eb74050f3366), è di qualche tempo fa ma è scritto bene. Per quello che riguarda il mio problema, invece, ho valutato 3 opzioni. In sintesi, ho preso in considerazione [cypress](https://www.cypress.io/), [Puppeteer](https://pptr.dev/) e [Playwright](https://playwright.dev/). Sono tutti strumenti validi ma solo Playwright permette di interfacciarsi facilmente con [Electron](https://www.electronjs.org/). Lo so, lo so, questa è un'esigenza mia: il progetto che ho in testa prevede una parte costruita con Electron quindi questa caratteristica è fondamentale per me.

Capito questo è il momento di cominciare con il codice. Riprendo quindi in mano il mio template [Svelte Component Package Starter](https://github.com/el3um4s/svelte-component-package-starter) e comincio con aggiungere Playwright:

```bash
npm i -D playwright @playwright/test
```

E poi installo i browser da usare come base per i test

```bash
npx playwright install
```

Per un uso base non mi serve altro ma preferisco continuare a usare [Jest](https://jestjs.io/) anche per questo genere di test. Mi serve però un pacchetto aggiuntivo: [Jest Image Snapshot](https://github.com/americanexpress/jest-image-snapshot):

```bash
npm i --save-dev jest-image-snapshot @types/jest-image-snapshot
```



Ho trovato utile anche il post [Using Jest with Playwright](https://playwright.tech/blog/using-jest-with-playwright) di Max Schmitt. Installo quindi [jest-playwright-preset](https://github.com/playwright-community/jest-playwright):

```bash
npm install -D jest jest-playwright-preset
```

### Metto in ordine i test vecchi

È buona pratica tenere separati i test e2e (End to End). Quindi modifico leggermente la struttura del mio template e creo le due cartelle `src/__tests__/unit` e `src/__tests__/e2e`:

```
src
├── __tests__
│   ├── unit
│   │   ├── ChromaColors.test.ts
│   │   ├── GridColors.test.ts
│   │   └── Slider.test.ts
│   └── e2e
├── lib
├── routes
├── app.css
├── app.html
└── global.d.ts
```

Copio dentro `unit` i test precedenti e lascio vuota, per il momento, `e2e`.

Il primo problema che mi si pone è che eseguendo `npm run test` eseguo sia i test di unità che quelli e2e. Modifico quindi `package.json` in modo da tenere separati i due binari:

```json
{
  // ...
  "scripts": {
    // ...
    "test": "cross-env TAILWIND_MODE=build jest --runInBand ./src/__tests__/unit",
    "test:e2e": "jest --runInBand ./src/__tests__/e2e",
  }
  //...
}
```

### Configuro Jest per fare screenshot

Per utilizzare `Jest-Image-Snapshot` devo prima estendere `expect` per supportare `toMatchImageSnapshot`. Modifico quindi `jest-setup.ts`:

```ts
import '@testing-library/jest-dom';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });
```

### Creo un test di esempio

Come primo test mi serve qualcosa di semplice e banale, giusto per verificare che tutto funzioni a dovere. Creo il file `e2e.test.ts`:

```ts
import { Browser, chromium } from 'playwright';

describe('jest-image-snapshot: test is working', () => {
    let browser: Browser;

    beforeAll(async () => {
      browser = await chromium.launch();
    });
    afterAll(async () => {
      await browser.close();
    });

    test("should work", async () => {
        const page = await browser.newPage();
        await page.goto('https://www.example.com/');
        const image = await page.screenshot();
        expect(image).toMatchImageSnapshot();
    })
})
```

Cosa fa questo test? Usa Playwright per lanciare un browser nascosto, va alla pagina `https://www.example.com`, cattura un'immagine della pagina e la confronta con quella salvata in memoria. Se non esiste un'immagine di riferimento ne crea una nuova nella cartella `__image_snapshots__`. Eseguo 

```bash
npm run test:e2e
```
e ottengo l'immagine:

{% include picture img="regression-test-1.webp" ext="jpg" alt="" %}

Ovviamente questo test è puramente didattico: serve a me per capire come utilizzare questo strumento. Cambio l'indirizzo della pagina da aprire (uso `www.google.com`). Rieseguo il test e ottengo

{% include picture img="regression-test-2.webp" ext="jpg" alt="" %}

È inoltre apparsa una nuova cartella `__diff_output__` al cui interno c'è un'immagine:

{% include picture img="regression-test-3.webp" ext="jpg" alt="" %}

Sono evidenziate in rosso le differenze tra un'immagine e l'altra. Essendo due pagine completamente diverse è quasi tutto rosso. Ma spiega bene il senso di questo tipo di test.

Faccio finta per un momento che la nuova pagina sia corretta e che le differenze siano volute. Per superare il test devo aggiornare lo screenshot. Creo uno script che mi semplifichi il lavoro:

```json
"test:e2e-update": "jest --runInBand --updateSnapshot ./src/__tests__/e2e",
```

e lo eseguo:

```bash
npm run test:e2e-update
```

Adesso la mia pagina di riferimento è diventata:

{% include picture img="regression-test-4.webp" ext="jpg" alt="" %}

Questa volta ripetendo il test `npm run test:e2e` non ottengo errori.

### Creo un test personalizzato

