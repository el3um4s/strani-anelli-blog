---
title: "Creare e pubblicare un componente Svelte"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-10-15 10:00"
categories:
  - Svelte
  - TypeScript
  - Jest
  - Tailwind
  - SvelteKit
  - NPM
  - Template
tags:
  - Svelte
  - TypeScript
  - Jest
  - Tailwind
  - SvelteKit
  - NPM
  - Template
---

I miei ultimi articoli sono stati dedicati a come [creare pacchetti NPM](https://blog.stranianelli.com/npm-packages-with-typescript/), integrare [Tailwind e Svelte](https://blog.stranianelli.com/tailwind-and-svelte/) ed eseguire [test con Jest](https://blog.stranianelli.com/test-sveltekit-app-con-jest/). Tutto questo perché? Per arrivare a capire come creare un componente Svelte e come pubblicarlo su NPM come pacchetto. Di seguito, come oramai è mia abitudine, riporto i vari passaggi che ho seguito e il link a un template che dovrebbe semplificare il tutto.

### Creare componenti con SvelteKit

Per prima cosa la tecnologia che uso: [SvelteKit](https://kit.svelte.dev/). Può parere una scelta bizzarra ma alla fine è una diretta conseguenza di una funzione introdotta (recentemente?). Consiglio di leggere la sezione [**packaging**](https://kit.svelte.dev/docs#packaging) della documentazione.

In sintesi, è possibile prendere il contenuto della cartella `src/lib` e salvarlo come pacchetto. È anche possibile pubblicarlo facilmente su NPM. Inoltre si può esportare il contenuto della cartella principale in modo da semplificare la creazione della documentazione legata al componente appena creato.

Lascio da parte la creazione di un componente con SvelteKit e l'integrazione con [Jest](https://jestjs.io/) e [TailwindCSS](https://tailwindcss.com/) (ne ho già parlato negli articoli che citavo all'inizio di questo post). Passo direttamente alle modifiche da fare al file `svelte.config.js`. Aggiungo la voce `package` e imposto la directory verso cui esportare il pacchetto compilato (di default è la cartella `package`)

```js
const config = {
  // ...
	kit: {
		target: '#svelte',
		package: {
			dir: 'package',
			emitTypes: true
		}
	}
  // ...
};
```

Poi scarico e installo [svelte2tsx](https://www.npmjs.com/package/svelte2tsx) per generare file TSX a partire dai file SVELTE.

```bash
npm i svelte2tsx
```

Aggiungo quindi un nuovo script a `package.json`:

```json
"scripts":{
    "package": "svelte-kit package"
}
```

Però se provo ad eseguirlo (con il comando `npm run package`) non ottengo nulla di utile. Perché? Perché manca un file `index.js` da usare come punto di ingresso per il pacchetto. Poiché sto usando TypeScript devo creare il file `src/lib/index.ts`. Inserisco in questo file i componenti che voglio rendere utilizzabili:

```ts
export { default as GridColors } from './GridColors.svelte';
export { default as Slider } from './Slider.svelte'; 
```

Lo so, manca la spiegazione di come creare i vari file Svelte. Ma non è necessario, per il momento, conoscere l'implementazione dei singoli componenti. La cosa importante è ricordarsi di aggiungere un file da usare come entry point per il pacchetto. E aggiornare il contenuto di `package.json` con le informazioni essenziali (nome, github, e così via).

Dopo aver fatto questo eseguo:

```bash
npm run package
```

e ottengo una nuova cartella. Dentro c'è il codice da importare su NPM.

Posso pubblicare subito usando il comando:

```
npm publish ./package --access public
```

Come ho già spiegato in un altro articolo ([questo post](https://blog.stranianelli.com/npm-packages-with-typescript/)) ogni volta che modifico il codice posso aggiornare il numero di versione con il comando

```bash
npm version patch
```

e quindi ripubblicare con

```
npm publish
```

### Come testare in locale un pacchetto NPM

Tutto molto bello e molto veloce. Ma ci possono essere cose che non vanno subito per il verso giusto. Ho trovato delle difficoltà con l'integrazione con TailwindCSS. In fase di test funziona tutto bene ma dopo aver esportato il pacchetto si sono presentati alcuni limiti. Credo sia un limite proprio di Tailwind: per evitare una pletora di classi CSS alcuni comandi vengono ignorati o accorpati. Nel mio caso, nel repository che ho creato come template, Tailwind non è in grado di colorare solo un bordo di una cella di una tabella. Funziona molto bene in fase di test ma dopo aver esportato il tutto no.

Non è la prima volta che mi capita. Per risolvere questo problema ho dovuto testare più volte il pacchetto creato da SvelteKit. Una possibilità è di caricarlo ogni volta online e poi riscaricarlo per testarlo. L'alternativa è usare [`npm-link`](https://docs.npmjs.com/cli/v7/commands/npm-link/). In pratica posso collegare un pacchetto salvato sul mio computer e usarlo come origine per un altro progetto.

Ci sono due comandi da digitare. Il primo nella cartella dove c'è il codice del pacchatto (nel mio caso in `package`):

```bash
npm link
```

Il secondo comando è nel progetto dove intendo usare il mio pacchetto. Invece di usare `npm installe name-package` uso il comando:

```bash
npm link name-package
```

Nel mio caso il comando diventa:

```bash
npm link @el3um4s/svelte-component-package-starter
```

In questo modo posso accedere al codice compilato più recente in automatico senza dover installare ogni volta il pacchetto da npm. Per accedere al componente è sufficiente usare la solita formula:

```html
<script lang="ts">
  import { Slider, GridColors } from "@el3um4s/svelte-component-package-starter";
  let steps = 5;
</script>

<main>
  <Slider label="hello" bind:steps />
  <GridColors bind:steps --border-color="red" />
</main>
```

Dopo aver finito di testare il componente posso eliminare il link usando il comando:

```bash
npm uninstall --no-save name-package
npm install 
```

Posso inoltre eliminare completamente il link global dal pacchetto (così da evitare interferenze future) con il comando

```bash
npm uninstall name-package
```

Consiglio comunque di leggere questi due post per approfondire il modo di utilizzare `npm-link`:

- [Understanding npm-link](https://medium.com/dailyjs/how-to-use-npm-link-7375b6219557)
- [How to NPM Link to a local version of your dependency](https://medium.com/@AidThompsin/how-to-npm-link-to-a-local-version-of-your-dependency-84e82126667a)

### Usare il componente appena creato

Ho già accennato alla cosa ma preferisco scriverla in maniera esplicita. Dopo aver caricato il pacchetto su NPM posso scaricare il mio componente e usarlo negli altri miei progetti. Per scaricarlo il comando è il classico `npm install name-package`:

```bash
npm i @el3um4s/svelte-component-package-starter
```

Dopo averlo installato posso accedervi da qualsiasi file Svelte:

```ts
import { Foo } from 'your-library';
import Foo from 'your-library/Foo.svelte';
```

Che tradotto con il mio template diventa:

```html
<script lang="ts">
  import { GridColors } from "@el3um4s/svelte-component-package-starter";
</script>

<GridColors  />
```

### Come usare il template per creare componenti Svelte

Ovviamente tutto questo lavoro è per creare un template che, nelle mie intenzioni, semplifichi la creazioni di componenti riutilizzabili in più progetti. È possibile scaricare il template usando il comando:

```bash
npx degit el3um4s/svelte-component-package-starter
```

Basta svuotare le cartelle `src/lib` e `src/__tests__` per avere un template pulito.

Per finire, è possibile vedere il codice del repository all'indirizzo [el3um4s/svelte-component-package-starter](https://github.com/el3um4s/svelte-component-package-starter).
