---
title: Svelte & GitHub Pages
published: true
date: 2021-06-09 11:00
categories:
  - JavaScript
  - Svelte
  - TypeScript
tags:
  - JavaScript
  - Svelte
  - TypeScript
  - svelte-et-github
lang: it
cover: cover.webp
description: Questo è un semplice post pro memoria. Nelle ultime settimane ho sperimentato con Svelte e mi sono concentrato in particolar modo su come caricare un sito statico su GitHub. Non ho trovato molte guide e tutorial quindi credo vada la pena mettere giù i passaggi che ho seguito. Innanzitutto per me, che ho la memoria di un pesce rosso.
---

Questo è un semplice post pro memoria. Nelle ultime settimane ho sperimentato con [Svelte](https://svelte.dev/) e mi sono concentrato in particolar modo su come caricare un sito statico su GitHub. Non ho trovato molte guide e tutorial quindi credo vada la pena mettere giù i passaggi che ho seguito. Innanzitutto per me, che ho la memoria di un pesce rosso.

Allora, cosa c'è da fare?

Per prima cosa decidiamo il repository dove caricare il sito e creiamo una branch `gh-pages`. Ho notato che conviene caricare le pagine su una branch separata dalla principale. In questo modo il codice utilizzato per lo sviluppo resta separato dalle pagine visibili del sito. Scegliere `gh-pages` ci permette inoltre di usare un package npm specifico (chiamato per l'appunto [gh-pages](https://www.npmjs.com/package/gh-pages)).

Quindi, dopo aver creato il repository e la branch dedicata alla pubblicazione della pagina su GitHub cominciamo a creare il sito vero e proprio. E cominciamo dalla versione più semplice, un sito statico senza nessuna pretesa. Da terminale digitiamo:

```shell
npx degit sveltejs/template my-fantastic-site
```

Quindi entriamo nella cartella `my-fantastic-site`

```shell
cd my-fantastic-site
```

Se vogliamo possiamo anche usare TypeScript ma non è obbligatorio:

```shell
node scripts/setupTypeScript.js
```

Fatto questo installiamo il necessario con

```shell
npm install
```

Adesso è possibile provare il sito usando semplicemente

```shell
npm run dev
```

Tralascio la creazione del sito in sé, sarebbe un argomento troppo vasto e non è quello di cui voglio parlare adesso. Passiamo quindi alla creazione del file compilato eseguendo

```shell
npm run build
```

Dopo aver eseguito questo comando abbiamo una cartella `public` contenente il codice compilato pronto per essere caricato su GitHub. Volendo possiamo fare tutto a mano. È però più comodo usare [`gh-pages`](https://www.npmjs.com/package/gh-pages). Quindi eseguiamo:

```shell
npm install gh-pages --save-dev
```

Aggiungiamo quindi uno script nel file `package.json`:

```json
 "scripts": {
    "deploy": "node ./gh-pages.js"
  }
```

Quindi creiamo il file `gh-pages.js`:

```js
var ghpages = require('gh-pages');

ghpages.publish(
	'public', // path to public directory
	{
		branch: 'gh-pages',
		repo: 'https://github.com/el3um4s/petits-chevaux.git', // Update to point to your repository
		user: {
			name: 'Samuele', // update to use your name
			email: 'samuele@stranianelli.com' // Update to use your email
		},
		dotfiles: true
	},
	() => {
		console.log('Deploy Complete!');
	}
);
```

In alternativa si può anche usare nella forma:

```js
import { publish } from 'gh-pages';

publish(
  // ...
);
```

Adesso ci sono alcuni dettagli da sistemare. Il primo, assicurarsi che il file `.gitignore` non escluda la cartella `public`. È sufficiente commentare la riga corrispondente.

```text
/node_modules/
# /public/build/
```

La seconda cosa è legata al funzionamento di GitHub Pages: funziona tramite Jekyll. In genere non dà particolari problemi ma ho notato che non legge correttamente le cartelle che cominciano con il carattere underscore (`_`). Conviene quindi disabilitarlo creando un file vuoto dal nome `.nojekyll`. Inseriamo anche questo file nella cartella `public`.

Infine il dominio del sito. Quando eseguiremo il deploy del sito sovrascriveremo automaticamente tutto il contenuto della branch `gh-pages` compreso il file `CNAME`. Se ci interessa usare un dominio specifico conviene allora aggiungere il file alla cartella `public`.

Bene, dopo aver fatto tutto questo siamo pronti a caricare il sito. Quindi, prima di tutto lo compiliamo

```shell
npm run build
```

Poi carichiamo sul repository il codice compilato. Io mi trovo bene con la versione desktop di GitHub ma è anche possibile farlo da riga di comando: 

```shell
git add .
git commit -m "descrizione del commit"
git push origin gh-pages
```

Dopo aver caricato il repository possiamo eseguire

```shell
npm run deploy
```

Oppure

```shell
node ./gh-pages.js
```

Con questo è tutto. C'è però ancora una cosa da dire. Se invece di creare un sito con Svelte lo creiamo con [SvelteKit](https://kit.svelte.dev/) dobbiamo fare alcune modifiche a questa procedura.

Per prima cosa dobbiamo installare l'[adapter](https://kit.svelte.dev/docs#adapters) corretto. In questo caso si tratta di [@sveltejs/adapter-static](https://github.com/sveltejs/kit/tree/master/packages/adapter-static). Quindi:

```shell
npm i -D @sveltejs/adapter-static@next
```

Quindi aggiorniamo il file `svelte.config.js`

```js
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		target: '#svelte',
		adapter: adapter({
			pages: 'build',  // path to public directory
			assets: 'build',  // path to public directory
			fallback: null
		})
	}
};

export default config;
```

Ecco, con questo direi che è davvero tutto.
