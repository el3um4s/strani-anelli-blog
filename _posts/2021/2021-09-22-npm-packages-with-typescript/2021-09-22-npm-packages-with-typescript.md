---
title: "Creare NPM Package con TypeScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Paul Esch-Laurent**](https://unsplash.com/@pinjasaur)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-09-22 13:00"
categories:
  - NPM
  - GitHub
  - TypeScript
tags:
  - NPM
  - GitHub
  - TypeScript
---

Man mano che faccio i miei esperimenti mi sto accorgendo di avere alcuni pezzi di codice ripetuti spesso. Francamente inizia ad essere complicato tenere sincronizzato tutto. Ho deciso perciò di cominciare a centralizzare su [NPM](https://www.npmjs.com/) alcune funzioni che uso di puù. Ma come posso creare un package NPM usando TypeScript? Beh, ho dovuto unire un po' di guide e fare un po' di prove. Questi sono i passaggi che ho seguito.

### Inizializzo il pacchetto e installo TypeScript

Creo il file `package.json`, per il momento con valori predefiniti:

```bash
npm init -y
```

Poi aggiungo la cartella `node_modules` tra i percorsi da ignorare in `.gitignore`.

Comincio installando TypeScript:

```bash
npm install --save-dev typescript
```

Per compilare i file mi serve configurare il file `tsconfig.json`

```json
{
    "compilerOptions": {
        "outDir": "./lib",
        "module": "ES2020", // or commonjs
        "target": "ES2019",
        "lib": [
            "ES2019",
            "DOM",
            "ES2020"
        ],
        "declaration": true,
        "strict": true
    },
    "include": ["src"],
    "exclude": ["node_modules", "**/__tests__/*"]
}
```

Creo una cartella `src` in cui inserire il codice di partenza. Aggiungo quindi il file `index.ts`:

```ts
const myCustomFunction = (name: string):string => `Hello ${name}`;
function ciao(name: string): string {
    return `Ciao ${name}`;
}

export { myCustomFunction, ciao};
```

Per compilare il file aggiungo uno script a `pagkage.json`:

```json
{
//...
  "scripts": {
    "build": "tsc"
  }
//...
}
```

Quindi uso il comando:

```bash
npm run build
```

Dopo aver eseguito il comando posso vedere una nuova cartella: `lib`. Al suo interno ci sono 2 file: `index.js` con il codice compilato e `index.d.ts` con le type definitions.

In genere non ci interessa confrontare i file generati automaticamente. Aggiungo la cartella `lib` a `.gitignore`:

```
node_modules
/lib
```

Per i pacchetti NPM voglio il contrario. Voglio rendere visibili solo i file compilati e non i file sorgenti. Per fare questo aggiungo a `package.json`:

```json
{
  // ...
  "files": [
    "lib/**/*"
  ]
}
```

### Aggiungo ESLint

Per tenere ordinato il codice aggiungo [ESLint](https://www.npmjs.com/package/eslint)

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Aggiungo quindi il file `.eslintrc`:

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ]
}
```

Imposto i file da ignorare nel file `.eslintignore`

```
node_modules
/lib
```

Adesso per controllare il mio codice posso usare:

```bash
npm run lint
```

### Imposto gli Script per pubblicare su NPM

Per pubblicare su NPM mi conviene aggiungere alcuni script specifici:

- **prepare**: viene eseguito _prima_ di impacchettare e pubblicare il pacchetto (quando c'è il comando: `npm install`)
- **prepublishOnly**: viene eseguito _prima_ di preparare il pacchette e _solo_ al comando `npm publish`
- **preversion**: viene eseguito _prima_ di caricare una nuova versione del pacchetto
- **version**: viene eseguito _dopo_ che la nuova versione è stata caricata
- **postversion**: viene eseguito _dopo_ che è stata caricata una nuova versione.

Aggiungendo questi script il file `package.json` diventa simile a questo:

```json
"scripts": {
  "build": "tsc",
  "lint": "eslint . --ext .ts",
  "test": "echo \"Error: no test specified\" && exit 1",
  "prepare" : "npm run build",
  "prepublishOnly" : "npm run lint",
  "preversion" : "npm run lint",
  "version" : "git add -A src",
  "postversion" : "git push && git push --tags"
}
```

### Imposto le informazioni per NPM

Prima di pubblicare il package su NPM devo aggiornare e aggiungere alcune informazioni su `package.json`:

```json
{
  "name": "@el3um4s/typescript-npm-package-starter",
  "version": "0.0.1",
  "description": "Typescript NPM Package Starter",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "keywords": ["typescript", "npm", "template", "ts"],
  "license": "MIT",
}
```

Ho deciso di aggiungere uno [_scope_](https://docs.npmjs.com/cli/v7/using-npm/scope) al nome del repository per poter usare il nome che mi interessa senza incorrere in conflitti con altri pacchetti.

### Pubblico il pacchetto

Per pubblicare il pacchetto su NPM mi serve un account (mi sono iscritto nella [pagina di signup](https://www.npmjs.com/signup)). Dopo averlo creato posso loggarmi direttamente dalla console:

```bash
npm login
```

Quindi posso pubblicare su NPM con il comando

```bash
npm publish --access public
```

Adesso il pacchetto è disponibile all'indirizzo [@el3um4s/typescript-npm-package-starter](https://www.npmjs.com/package/@el3um4s/typescript-npm-package-starter).

### Provo il mio package

Dopo aver caricato su NPM, posso usare il mio codice in ogni progetto usando il comando

```bash
npm i @el3um4s/typescript-npm-package-starter
```

Passo quindi a importare in un file la funzione che mi interessa:

```ts
import { ciao } from "@el3um4s/typescript-npm-package-starter";

const b = ciao("mondo");
console.log(b);
```

### Aggiungo dei test

È buona pratica aggiungere sempre dei test ai progetti. In questo modo possiamo essere sicuri di non rompere niente per sbaglio.

Onestamente questo è un punto su cui sono abbastanza scarso, quindi mi limito a seguire i consigli trovati in rete.

Comincio con installare [Jest](https://jestjs.io/)

```bash
npm install --save-dev jest ts-jest @types/jest
```

Creo quindi un file di configurazione `jestconfig.json`:

```json
{
  "transform": {
    "^.+\\.(t|j)sx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"]
}
```

e sostituisco lo script di test di `package.json` con

```json
"test": "jest --config jestconfig.json",
```

Inserisco i test nella cartella `src/__tests__`. Posso chiamare i vari file come preferisco, l'importante è che abbiano l'estensione `.test.ts`. Creo il file `Ciao.test.ts` e aggiungo i primi test:

```ts
import { Greeter } from '../index';
test('My Greeter', () => {
  expect(Greeter('Carl')).toBe('Hello Carl');
});
```

Eseguo per verificare il codice.

```bash
npm test
```

Aggiorno quindi lo script _prepublishOnly_ per eseguire automaticamente i test prima di caricare una nuova versione.

```json
"prepublishOnly" : "npm test && npm run lint"
```

### Test Coverage

Un'altra buona pratica è misurare quanto codice viene coperto dai test. Posso ottenere automaticamente un report dopo ogni test aggiungendo queste righe a `jestconfig.json`

```json
"collectCoverageFrom": ["src/**/*.{ts,tsx}"],
"collectCoverage":true
```

In questo modo ogni volta che eseguo dei test viene creata una cartella `coverage\lcov-report` con all'interno un file `index.html` da consultare per verificare la copertura dei test.

### Aggiorno il mio pacchetto

Dopo aver fatto queste modifiche posso aggiornare il pacchetto su NPM direttamente da riga di comando. Per prima cosa aumento il numero di versione con il comando:

```bash
npm version patch
```

Quindi pubblico nuovamente su NPM con

```bash
npm publish
```

### Link utili

Per scrivere questo post ho attinto a diverse guide, post e repository. Riporto i link a quelli che ho trovato più utili:

- [Step by step: Building and publishing an NPM Typescript package.](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)
- [npm - Understanding Scoped Packages](https://nitayneeman.com/posts/understanding-scoped-packages-in-npm/)
- [How to use ESLint with TypeScript](https://khalilstemmler.com/blogs/typescript/eslint-for-typescript/)

Per finire:

- il progetto su GitHub: [el3um4s/typescript-npm-package-starter](https://github.com/el3um4s/typescript-npm-package-starter)
- il progetto su NPM: [@el3um4s/typescript-npm-package-starter](https://www.npmjs.com/package/@el3um4s/typescript-npm-package-starter)
- il mio Patreon: [patreon.com/el3um4s](https://patreon.com/el3um4s)
