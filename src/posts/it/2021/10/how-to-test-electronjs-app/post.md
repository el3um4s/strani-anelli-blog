---
title: Testare app ElectronJS
published: true
date: 2021-10-28 10:00
categories:
  - TypeScript
  - Electron
  - JavaScript
tags:
  - TypeScript
  - Electron
  - JavaScript
  - how-to-test-electronjs-app
lang: it
cover: cover.webp
description: "Gli ultimi miei articoli hanno parlato di come testare componenti e pacchetti npm. Ma il mio viaggio non è ancora concluso: mi manca da capire come testare applicazioni Electron. Il problema è nato dal mio tentativo di mantenere aggiornato il mio template MEMENTO - Svelte, TailwindCSS, Electron and TypeScript. E sopratutto dalla mia volontà di aggiungere alcuni dettagli: dopo un aggiornamento ha smesso di funzionare e ho fatta molta fatica a capire dove fosse il problema. Aggiungere vari test ai componenti mi è stato utile. Come si sta rivelando utile aggiungere dei test automatici ad Electron."
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

```json
"scripts": {
  "test": "npx playwright test"
}
```

### Creo il primo test: Electron si avvia

Fatto questo posso cominciare a creare il primo test. Creo una cartella `test` e al suo interno il file `base.test.ts`. La prima cosa che voglio verificare è che l'app Electron si avvii e mostri una finestra.

Spulciando nella documentazione di Playwright saltano fuori due classi sperimentali: [Electron](https://playwright.dev/docs/api/class-electron/) ed [ElectronApplication](https://playwright.dev/docs/api/class-electronapplication). Mi serviranno entrambe ma per il primo test è sufficiente la prima.

Mi serve inoltre la classe [Test](https://playwright.dev/docs/api/class-test/), per eseguire i vari test e indicare cosa mi aspetto di ottenere.

```ts
import { _electron as electron } from "playwright";
import { test, expect } from "@playwright/test";
```

Il test che devo scrivere è asincrono: l'apertura di Electron non è sempre immediata quindi devo assicurarmi di eseguire le varie operazioni solo quando sono effettivamente possibili. La prima cosa da fare è avviare Electron:

```ts
test("Launch electron app", async () => {
  const electronApp = await electron.launch({ args: ["."] });
});
```

Dopo aver avviato l'app intercetto se esiste una finestra visibile. Per farlo uso [`electronApplication.evaluate(pageFunction[, arg])`](https://playwright.dev/docs/api/class-electronapplication#electron-application-evaluate)

```ts
const windowState = await electronApp.evaluate(async ({ BrowserWindow }) => {
  const mainWindow = BrowserWindow.getAllWindows()[0];

  const getState = () => ({
    isVisible: mainWindow.isVisible(),
    isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
    isCrashed: mainWindow.webContents.isCrashed(),
  });

  return new Promise((resolve) => {
    if (mainWindow.isVisible()) {
      resolve(getState());
    } else {
      mainWindow.once("ready-to-show", () =>
        setTimeout(() => resolve(getState()), 0)
      );
    }
  });
});
```

In questo modo mi ritrovo con un oggetto `windowState` contenente lo stato della finestra di Electron. Quello che mi aspetto è che la finestra si visibile, la finestra di sviluppo sia chiusa e che l'app non sia in crash. Tradotto in codice:

```ts
expect(windowState.isVisible).toBeTruthy();
expect(windowState.isDevToolsOpened).toBeFalsy();
expect(windowState.isCrashed).toBeFalsy();
```

Per finire dopo aver eseguito i test chiudo Electron:

```ts
await electronApp.close();
```

Adesso metto tutto assieme e questo è il mio primo test:

```ts
import { _electron as electron } from "playwright";
import { test, expect } from "@playwright/test";

test("Launch electron app", async () => {
  const electronApp = await electron.launch({ args: ["."] });

  const windowState: {
    isVisible: boolean;
    isDevToolsOpened: boolean;
    isCrashed: boolean;
  } = await electronApp.evaluate(async ({ BrowserWindow }) => {
    const mainWindow = BrowserWindow.getAllWindows()[0];

    const getState = () => ({
      isVisible: mainWindow.isVisible(),
      isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
      isCrashed: mainWindow.webContents.isCrashed(),
    });

    return new Promise((resolve) => {
      if (mainWindow.isVisible()) {
        resolve(getState());
      } else {
        mainWindow.once("ready-to-show", () =>
          setTimeout(() => resolve(getState()), 0)
        );
      }
    });
  });

  expect(windowState.isVisible).toBeTruthy();
  expect(windowState.isDevToolsOpened).toBeFalsy();
  expect(windowState.isCrashed).toBeFalsy();

  await electronApp.close();
});
```

Per eseguirlo uso il comando:

```bash
npm run test
```

### Controllo il contenuto della finestra

Bene, l'app si avvia. Il controllo successivo è verificare il contenuto. Poiché eseguirò più test in sequenza sulla stessa pagina uso `test.describe`

```ts
test.describe("Check Man Page", async () => {
  let electronApp: ElectronApplication;
  let firstWindow: Page;

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ["."] });
    firstWindow = await electronApp.firstWindow();
  });

  // ...

  test.afterAll(async () => {
    await electronApp.close();
  });
});
```

Posso interagire con i vari elementi della pagina e verificare il loro contento. Per esempio, posso assicurarmi che il titolo della pagina sia quello che voglio io:

```ts
test("Check title", async () => {
  const title = await firstWindow.title();
  expect(title).toBe("MEMENTO - Svelte, TailwindCSS, Electron and TypeScript");
});
```

Oppure controllare che il numero di versione dell'app sia effettivamente visualizzato:

```ts
test("Check version number: APP", async () => {
  const versionNumberApp = await firstWindow.innerText(
    "data-testid=version-number-app"
  );
  expect(versionNumberApp).not.toBe("-");
  const isValidNumberApp = semver.valid(semver.coerce(versionNumberApp));
  expect(semver.valid(isValidNumberApp)).not.toBeNull();
});
```

### Verifico la grafica dell'applicazione

Al di là del contenuto, una cosa che mi è utile è la possibilità di verificare l'aspetto grafico di Electron. Per farlo devo scattare degli screenshot della finestra e confrontarli con un'immagine di riferimento.

```ts
test("Check Screenshot", async () => {
  await firstWindow.screenshot({ path: "tests/screenshot/firstWindow.png" });
  expect(await firstWindow.screenshot()).toMatchSnapshot("firstWindow.png");
});
```

Ogni volta che eseguo il test Playwright confronta lo screenshot della finestra (salvato in `tests/screenshot/firstWindow.png`) con quello di riferimento. L'immagine di riferimento viene creata al primo avvio del test ed è immutabile a meno di non indicare esplicitamente di volerla aggiornare.

Per cambiare le immagini di riferimento aggiungo uno script a `package.json`:

```json
"scripts": {
  "test:update-screenshot": "npx playwright test --update-snapshots"
}
```

### Personalizzo Playwright

Posso configurare il comportamento complessivo di Playwright creando un file `playwright.config.ts`. A me interessa personalizzare la sensibilità di `toMatchSnapshot`, quindi scrivo:

```ts
import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  expect: {
    toMatchSnapshot: { threshold: 0.2 },
  },
};

export default config;
```

### Registro i test

Un'altra funzione utile di Playwright è la possibilità di registra i vari test e di riprodurli a video. Può servire per verificare il comportamento dell'applicazione e sopratutto capire cosa non sta funzionando. Mi serve la classe [Tracing](https://playwright.dev/docs/api/class-tracing). Con `start` avvio la registrazione, con `stop` la blocco:

```ts
let context: BrowserContext;

test.beforeAll(async () => {
  electronApp = await electron.launch({ args: ["."] });
  context = electronApp.context();
  await context.tracing.start({ screenshots: true, snapshots: true });
  firstWindow = await electronApp.firstWindow();

  await firstWindow.screenshot({ path: "tests/screenshot/firstWindow.png" });
  expect(await firstWindow.screenshot()).toMatchSnapshot("firstWindow.png");
});

// ...

test.afterAll(async () => {
  await context.tracing.stop({ path: "tests/tracing/trace.zip" });
  await electronApp.close();
});
```

La registrazione viene salvata in un file `zip`. Per poterlo aprire con semplicità aggiungo uno script a `package.json`:

```json
"scripts": {
  "test:show-trace": "npx playwright show-trace tests/tracing/trace.zip"
}
```

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
