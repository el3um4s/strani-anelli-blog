---
title: "Come testare app SvelteKit con Jest"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-10-08 14:00"
categories:
  - Svelte
  - TypeScript
  - Jest
tags:
  - Svelte
  - TypeScript
  - Jest
---

Mi pare di averlo già accennato, uno dei miei punti deboli è la scarsa disciplina in fatto di test. È una cosa a cui devo metter mano, prima o poi. Meglio prima che poi. E meglio adesso che prima. Ho quindi cominciato a guardarmi attorno e a capire come fare. Ci sono molti framework, e francamente sono stroppo ignorante in materia per decidere quale usare. Di conseguenza sono andato assolutamente a caso e ho deciso di usare [Jest](https://jestjs.io/). Non solo, ho deciso di provare a integrare Jest con [SvelteKit](https://kit.svelte.dev/). Questo è il mio diario di viaggio, e il risultato che ho ottenuto.

### Creo un nuovo progetto

A differenza degli ultimi post oggi comincio con un progetto completamente nuovo. Non voglio trovarmi a gestire dipendenze e strutture vecchie nel momento in cui imparo una cosa completamente nuova. Nuova per me, beninteso. Quindi, creo un nuovo progetto basato su SvelteKit usando il comando:

```bash
npm init svelte@next
```

Uso queste impostazioni:

```bash
Which Svelte app template? » Skeleton project
Use TypeScript? » Yes
Add ESLint for code linting? » Yes
Add Prettier for code formatting? » Yes
```

Quindi installo le dipendenze:

```bash
npm install
```

E come ogni volta verifico che sia andato tutto a buon fine lanciando:

```bash
npm run dev -- --open
```

Bene. Fin qui la parte facile. Adesso comincia il bello.

### Installo Jest

Come sempre ho cercato in rete, e in rete si trovano molte guide:

- [Testing and Debugging Svelte](https://svelte-recipes.netlify.app/testing/)
- [Setting up Jest with SvelteKit](https://koenvg.medium.com/setting-up-jest-with-sveltekit-4f0a0e379668)
- [Testing Svelte components with Jest](https://dev.to/jpblancodb/testing-svelte-components-with-jest-53h3)
- [How to test Svelte components](https://timdeschryver.dev/blog/how-to-test-svelte-components)
- [Implementing Test Driven Development in Svelte](https://alfatianisa.medium.com/implementing-test-driven-development-in-svelte-c93aafa6db70)
- [Writing unit tests for Svelte - Series Articles](https://dev.to/d_ir/series/4203)
- [Test Your Svelte Components with uvu and testing-library](https://byderek.com/post/test-your-svelte-components-with-uvu-and-testing-library)
- [Svelte with TypeScript and Jest (Starter Project)](https://daveceddia.com/svelte-typescript-jest/)

E come sempre ho fatto un lavoro di copia e incolla per trovare la configurazione adatta alle mi esigenze.

Per far funzionare il mio progetto mi servono un po' di pacchetti, come consigliato in maniera semplice ed efficace da [Dave Ceddia](https://daveceddia.com/svelte-typescript-jest/):

- [**jest**](https://jestjs.io/) per eseguire i test
- [**@types/jest**](https://www.npmjs.com/package/@types/jest) per usare TypeScript assieme a Jest
- [**ts-jest**](https://www.npmjs.com/package/ts-jest) per usare TypeScript assieme a Jest
- [**@testing-library/jest-dom**](https://github.com/testing-library/jest-dom) per poter testare più facilmente gli elementi del DOM
- [**svelte-jester**](https://www.npmjs.com/package/svelte-jester) per compilare i componenti di Svelte e farli leggere da Jest
- [**@testing-library/svelte**](https://github.com/testing-library/svelte-testing-library) altre funzioni utili per testare i componenti di Svelte

Va notata una cosa: conviene testare il componente compilato e non il codice utilizzato per lo sviluppo. Perché? Beh, perché il codice che deve funzionare è quello finale, quello che poi viene utilizzato nel progetto.

Posso installare tutto in una volta usando:

```bash
npm i -D jest @types/jest ts-jest @testing-library/jest-dom svelte-jester @testing-library/svelte
```

Qui ci possono essere alcuni problemi, in base alle diverse versioni dei pacchetti. Ho fatto diverse prove in giorni diversi: in alcune occasioni mi è stato utile usare il comando

```bash
npx npm-check-updates
```

per aggiornare tutte le dipendenze alla versione più recente.

Dopo aver installato il tutto mi assicuro che SvelteKit funzioni ancora usando nuovamente

```bash
npm run dev -- --open
```

### Configuro Jest e Svelte

Dopo aver verificato di non aver rotto nulla comincio ad aggiungere un po' di file di configurazione. In questo caso mi sono servito del canovaccio di [Koen Van Geert](https://koenvg.medium.com/setting-up-jest-with-sveltekit-4f0a0e379668). Creo i file seguenti:

**svelte.config.test.cjs**
```js
const preprocess = require('svelte-preprocess');

module.exports = { preprocess: preprocess() };
```

**jest-setup.ts**
```ts
import '@testing-library/jest-dom';
```

**jest.config.cjs**
```js
module.exports = {
  transform: {
    '^.+\\.svelte$': [
      'svelte-jester',
      { preprocess: './svelte.config.test.cjs' }
    ],
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  moduleNameMapper: {
  '^\\$lib(.*)$': '<rootDir>/src/lib$1',
  '^\\$app(.*)$': [
    '<rootDir>/.svelte-kit/dev/runtime/app$1',
    '<rootDir>/.svelte-kit/build/runtime/app$1'
  ]
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  collectCoverageFrom: ["src/**/*.{ts,tsx,svelte,js,jsx}"]
};
```

Infine aggiungo alcuni script a **package.json**:

```json
"scripts": {
  "test": "jest",
  "test:watch": "npm run test -- --watchAll",
  "test:coverage": "jest --coverage"
}
```

Provo a eseguire 

```bash
npm run test
```

e ottengo come risultato:

```bash
> memento-sveltekit-jest@0.0.1 test
> jest

No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In I:\Repository\Svelte\memento-sveltekit-jest
  17 files checked.
  testMatch: **/__tests__/**/*.[jt]s?(x), **/?(*.)+(spec|test).[tj]s?(x) - 0 matches
  testPathIgnorePatterns: \\node_modules\\ - 17 matches
  testRegex:  - 0 matches
Pattern:  - 0 matches
```

Ovviamente non ho ancora scritto nessun test. Finalmente è il momento di scrivere il mio primo test.

### Scrivo un test semplice

Comincio con qualcosa di banale: mi serve solamente per capire se Jest è configurato correttamente. Controllo semplicemente che ci sia la scritta _Welcome to SvelteKit_ all'avvio dell'applicazione.

Inserirò tutti i vari test nella cartella `src/__tests__`. Creo il file `Welcome.test.ts` e inizio a creare un test:

```ts
/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import Index from '../routes/index.svelte';
import { render } from '@testing-library/svelte';
```

Importo il file `index.svelte`, ovvero la home dell'applicazione. E poi la libreria `render` da [_@testing-library/svelte_](https://github.com/testing-library/svelte-testing-library). Avviso inoltre Jest che sto per usare l'environment _jsdom_.

Comincio con aggiungere un test vuoto

```ts
describe("Test if Jest is working", () => {
    test('Welcome', () => {});
});
```

Adesso devo decidere come e cosa testare. Voglio testare che nella pagina ci sia un elemento con scritto `Welcome to SvelteKit`. 

```ts
describe("Test if Jest is working", () => {
	test('Welcome', () => {
		const { getByText } = render(Index);
		expect(getByText('Welcome to SvelteKit')).toBeInTheDocument()
	});
});
```

Se adesso eseguo il test ottengo:

```bash
> memento-sveltekit-jest@0.0.1 test
> jest

 PASS  src/__tests__/Welcome.test.ts (13.859 s)
  Test if Jest is working
    √ Welcome (58 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        16.903 s
Ran all test suites.
```

Bello.

### Aggiungo un componente

Ovviamente questo è solo l'inizio. Un test così è inutile, al momento. Non inutile in senso assoluto, solo in questo esempio. Comincio a complicare un po' le cose aggiungendo un nuovo componente. Per prima cosa decido cosa voglio fare, quali caratteristiche deve avere e poi passo a implementare i test necessari e il codice.

Allora, voglio un componente composto da un pulsante e una casella di testo contente un numero. Ogni volta che clicco il pulsante il numero contenuto nella casella di testo aumenta o diminuisce di valore a caso. Se il valore è inferiore a 0 la casella diventerà rossa, altrimenti sarà verde. Il pulsante dovrà invece essere blu.

Lo so, è un esempio un po' bislacco ma mi permette di creare un componente non banale.

Eseguo il comando `npm run test:watch` e comincio con il creare un nuovo file di test, `src/__tests__/RandomButton.test.ts`:

```ts
/**
 * @jest-environment jsdom
 */

import RandomButton from '@lib/RandomButton.svelte';
import { render } from '@testing-library/svelte';
```

Il test fallisce. Ovviamente, perché non esiste ancora il componente **RandomButton**. Lo creo.

```html
<button>Click Me!</button>
```

Aggiungo quindi un test:

```ts
test('Button exist', () => {
  const { getByRole}  = render(RandomButton);
  const button = getByRole('button');
  expect(button).toBeVisible();
  }
)
```

Il prossimo passo è aggiungere una casella in cui mostrare un numero a caso. Creo il test corrispondente e poi aggiorno il componente per poter superare il test.


```ts
test('Button and Value are in the document', () => {
  const randomButton = render(RandomButton); 
  
  const button = randomButton.getByRole('button');
  expect(button).toBeVisible();
  
  const textValue = randomButton.getByTestId('value');
  expect(textValue).toBeVisible();
});
```

```html
<div>
	<button>Click Me!</button>
	<span data-testid="value" />
</div>
```

Bene, adesso passo allo stile del numero. Aggiungo un test (che fallirà) e poi modifico il componente per superare il test:

```ts
test('Color value: red if < 0', () => {
  const randomButton = render(RandomButton, {value: -1});

  const textValue = randomButton.getByTestId('value');
  expect(textValue).toHaveTextContent("-1");

  expect(textValue).toHaveStyle(`
    background-color: red;
    color: white;
`);
})
```

```html
<script lang="ts">
	export let value: number = 0;
</script>

<div>
	<button>Click Me!</button>
	<span data-testid="value" class="red">{value}</span>
</div>

<style>
	.red {
		background-color: red;
		color: white;
	}
</style>
```

La condizione successiva che mi sono imposto è di colorare di verde la casella se il numero è positivo. Scrivo il test necessario e poi modifico il codice:

```ts
test('Color value: green if > 0', () => {
  const randomButton = render(RandomButton, {value: 1});

  const textValue = randomButton.getByTestId('value');
  expect(textValue).toHaveTextContent("1");

  expect(textValue).toHaveStyle(`
    background-color: green;
    color: yellow;
  `);
})
```

```html
<div>
	<button>Click Me!</button>
	<span data-testid="value" class={value < 0 ? 'red' : 'green'}>{value}</span>
</div>

<style>
	.red {
		background-color: red;
		color: white;
	}

	.green {
		background-color: green;
		color: yellow;
	}
</style>
```

Finora ho controllato lo stile dell'elemento. In alcuni casi può anche essere utile verificare la presenza di una classe. Scrivo il test per verificare il colore del pulsante:

```ts
test('Button is blue', () => {
    const randomButton = render(RandomButton);
    const button = randomButton.getByRole('button');
    expect(button).toHaveClass('blue');
})
```

e quindi modifico il codice dell'elemento:

```html
<script lang="ts">
	export let value: number = 0;
</script>

<div>
	<button class="blue">Click Me!</button>
	<span data-testid="value" class={value < 0 ? 'red' : 'green'}>{value}</span>
</div>

<style>
	.red {
		background-color: red;
		color: white;
	}

	.green {
		background-color: green;
		color: yellow;
	}

	.blue {
		background-color: blue;
		color: white;
	}
</style>
```

Sistemati gli stili passo agli eventi legati al pulsante. Sono sostanzialmente due: 

1. al click viene generato un numero casuale (intero, positivo o negativo)
2. il numero casuale viene aggiunto al valore mostrato nella casella di testo.

Comincio con l'impostare il primo test, quello per generare un numero casuale al click del pulsante:

```ts
import { render, fireEvent } from '@testing-library/svelte';

test('Random Number on click', async () => {
    const randomButton = render(RandomButton);
    const button = randomButton.getByRole('button'); 
    await fireEvent.click(button);

    const randomNumber = randomButton.getByTestId('random-value');
    expect(randomNumber).toBeInTheDocument();
    expect(randomNumber).not.toBeVisible();
    expect(randomNumber).toHaveTextContent(/(.|\s)*\S(.|\s)*/);    
})
```

Correggo quindi il componente per poter superare il test

```html
<script lang="ts">
	export let value: number = 0;

	let randomValue: number = 0;

	function getRandomInt(min: number, max: number) {
		const positive = Math.random() > 0.5 ? 1 : -1;
		return positive * Math.floor(Math.random() * (max - min) + min);
	}

	function addRandomNumber() {
		randomValue = getRandomInt(1, 100);
	}
</script>

<div>
	<button class="blue" on:click={addRandomNumber}>Click Me!</button>
	<span data-testid="value" class={value < 0 ? 'red' : 'green'}>{value}</span>
	<div data-testid="random-value" class="hidden">{randomValue}</div>
</div>

<style>
	.hidden {
		display: none;
	}
</style>
```

Passo al secondo test:

```ts
test('Change Value on Click', async () => {
  const randomButton = render(RandomButton);
  const button = randomButton.getByRole('button'); 
  const valueOriginal = parseInt(randomButton.getByTestId('value').textContent);

  await fireEvent.click(button);

  const randomNumber = parseInt(randomButton.getByTestId('random-value').textContent);
  const valueResult = randomButton.getByTestId('value');

  const valueExpected = valueOriginal + randomNumber;

  expect(valueResult).toHaveTextContent(`${valueExpected}`);
})
```

```html
<script lang="ts">
	function addRandomNumber() {
		randomValue = getRandomInt(1, 100);
		value += randomValue;
	}
</script>

<div>
	<button class="blue" on:click={addRandomNumber}>Click Me!</button>
	<span data-testid="value" class={value < 0 ? 'red' : 'green'}>{value}</span>
	<div data-testid="random-value" class="hidden">{randomValue}</div>
</div>
```

### Conclusioni

Con questo è tutto, almeno per il momento. Ovviamente questo è solamente un assaggio, la mia conoscenza è ancora limitata. Ma sto cominciando a divertirmi anche con questo aspetto.

Il codice di questo progetto è disponibile su GitHub ([el3um4s/memento-sveltekit-jest](https://github.com/el3um4s/memento-sveltekit-jest)). Si può scaricare con il comando:

```bash
npx degit el3um4s/memento-sveltekit-jest
```

Infine ricordo il mio Patreon: [patreon.com/el3um4s](https://patreon.com/el3um4s)

