---
title: "Come Documentare Componenti Svelte - Parte 2"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Robo Wunderkind**](https://unsplash.com/@robowunderkind)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-31 19:00"
categories:
  - Svelte
  - SvelteKit
  - Components
  - Documentation
  - NPM
  - NodeJS
tags:
  - Svelte
  - SvelteKit
  - Components
  - Documentation
  - NPM
  - NodeJS
---

Ci ho messo un po' più tempo del previsto a scrivere questo post. Un mese, anzi poco più. Un po' per alcuni problemi di salute, un po' perché ha richiesto più tempo di quello che pensavo finire i due repository principali. Quindi, come posso documentare in maniera semplice un web component creato con Svelte?

### Premessa

Prima di cominciare devo precisare un paio di cose. Innanzitutto questo post è composto da tre parti.

La prima riprende il discorso cominciato con questo articolo:

- [How to Document Svelte Components](https://betterprogramming.pub/how-to-document-svelte-components-ab504661a6fc)

Riprendo il ragionamento che ho cominciato un mese e mezzo fa e lo porto a compimento presentando i due repository che userò.

La seconda parte è più un ripasso su come creare un blog su GitHub usando pagine statiche. È sostanzialmente un riassunto di questo pezzo:

- [How to Use SvelteKit with GitHub Pages](https://javascript.plainenglish.io/sveltekit-github-pages-4fe2844773de)

Infine la terza parte riguarda come usare file Markdown (`md`) assieme a componenti Svelte.

Non parto da un componente nuovo ma da uno che ho già creato:

- [How to Create and Publish Svelte Components](https://el3um4s.medium.com/how-to-create-and-publish-svelte-components-e770f1e94435)

Quindi, detto questo, cominciamo.

### Come creare documenti che si documentano da soli

Per semplificare la creazione della documentazione di componenti Svelte ho creato 2 packages NPM. Il primo, [@el3um4s/svelte-get-component-info](https://www.npmjs.com/package/@el3um4s/svelte-get-component-info), ha il compito di analizzare il componente e di estrarre un oggetto JSON con le informazioni basilari. Il secondo, [@el3um4s/svelte-component-info](https://www.npmjs.com/package/@el3um4s/svelte-component-info), si occupa di trasformare queste informazioni in un formato leggibile a schermo.

Come mai ho diviso in due il progetto? Semplicemente perché in questo modo è possibile creare delle presentazioni grafiche diverse, se qualcuno volesse farlo.

Comincio con l'installare il primo:

```bash
npm i -D @el3um4s/svelte-get-component-info
```

Creo poi un file `getInfoSvelteComponents.js` che mi permetta di leggere tutti i file nella cartella `src\lib\components`. Dopo aver estratto i dati che mi servono li salvo in un file `infoSvelteComponents.json` nella cartella `src\routes`:

```js
import { writeFileSync } from "fs";
import glob from "glob";
import { getInfo } from "@el3um4s/svelte-get-component-info";

const basePath = "src/lib/components/";

const listFile = glob.sync(`${basePath}**/*.svelte`);

let infoFiles = {};
listFile.forEach((file) => {
  const prop = getInfo(file);
  const fileName = file.substring(basePath.length);
  infoFiles[fileName] = prop;
});

let data = JSON.stringify(infoFiles);
writeFileSync("./src/routes/infoSvelteComponents.json", data);
```

Può anche essere utile, ma non è indispensabile, creare anche un file `getInfoSvelteComponents-watcher.js` per intercettare automaticamente ogni modifica al codice sorgente del componente:

```js
import { watch } from "fs";

import { exec } from "child_process";

exec("npm run get-info-svelte-components");

watch("./src/lib/components", () => {
  exec("npm run get-info-svelte-components");
});
```

Aggiungo quindi un paio di scripts a `package.json`:

```json
"scripts": {
  "get-info-svelte-components": "node getInfoSvelteComponents.js",
  "get-info-svelte-components-watcher": "node getInfoSvelteComponents-watcher.js",
}
```

Se eseguo `npm run get-info-svelte-components` ottengo un file simile a questo:

```json
{
  "_InputColors.svelte": {
    "props": [
      { "name": "firstColor", "defaultValue": "white" },
      { "name": "secondColor", "defaultValue": "black" }
    ],
    "actions": [],
    "slots": [],
    "css": []
  },
  "GridColors.svelte": {
    "props": [
      { "name": "firstColor", "defaultValue": "#fafa6e" },
      { "name": "secondColor", "defaultValue": "red" },
      { "name": "steps", "defaultValue": "9" }
    ],
    "actions": [],
    "slots": [],
    "css": [{ "name": "--default-color-border" }, { "name": "--border-color" }]
  },
  "Slider.svelte": {
    "props": [
      { "name": "steps", "defaultValue": "9" },
      { "name": "label", "defaultValue": "Steps" }
    ],
    "actions": [],
    "slots": [],
    "css": []
  }
}
```

In pratica per ogni componente nella cartella `lib\components` ottengo un oggetto con 4 proprietà:

- props
- actions
- slots
- css

Posso importare queste informazioni nel file `src\routes\index.svelte`

```html
<script lang="ts">
  import infoSvelteComponents from "./infoSvelteComponents.json";
</script>
```

Già questo sarebbe sufficiente per creare un sistema di documentazione automatico: basta estrarre le informazioni contenute in `infoSvelteComponents` e il gioco è fatto.

Ho però preferito creare un componente specifico, [@el3um4s/svelte-component-info](https://www.npmjs.com/package/@el3um4s/svelte-component-info). Lo installo con:

```bash
npm i @el3um4s/svelte-component-info
```

Importo quindi il componente nel file `index.svelte`:

```svelte
<script lang="ts">
  import infoSvelteComponents from "./infoSvelteComponents.json";
  import { SvelteInfo } from "@el3um4s/svelte-component-info";
</script>

<SvelteInfo
  name="GridColors"
  description="Svelte Component Package Starter"
  info={infoSvelteComponents['GridColors.svelte']}
  urlPackage="@el3um4s/svelte-component-package-starter" />
```

In questo modo ottengo una pagina simile a questa:

![document-svelte-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-12-31-how-to-document-svelte-components-part-2/document-svelte-01.gif)

Aggiungo uno `slot="demo"` per mostrare un'anteprima del componente:

```svelte
<main>
	<SvelteInfo
		name="GridColors"
		description="Svelte Component Package Starter"
		info={infoSvelteComponents['GridColors.svelte']}
		urlPackage="@el3um4s/svelte-component-package-starter"
	>
		<GridColors slot="demo"
      {...settings}
      --border-color="orange"
    />
	</SvelteInfo>
</main>
```

In questo modo ottengo un risultato come questo:

![document-svelte-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-12-31-how-to-document-svelte-components-part-2/document-svelte-02.gif)

E con questo ho concluso la prima parte.

Resta però una domanda: compo posso caricare automaticamente le pagine create da SvelteKit su GitHub? In modo da mantenere la documentazione online.

### Come usare SvelteKit con GitHub Pages

Parto dall'articolo [How to Use SvelteKit with GitHub Pages](https://javascript.plainenglish.io/sveltekit-github-pages-4fe2844773de) per usare markdown come documentazione dei miei componenti. Quindi, usando quell'articolo come canovaccio, comincio con l'installare [gh-pages](https://www.npmjs.com/package/gh-pages)

```bash
npm install gh-pages --save-dev
```

e quindi aggiungo uno script a `package.json`:

```json
"scripts": {
 "deploy": "node ./gh-pages.js"
}
```

Creo il file `gh-pages.js`:

```js
import { publish } from "gh-pages";

publish(
  "build", // path to public directory
  {
    branch: "gh-pages",
    repo: "https://github.com/el3um4s/svelte-component-package-starter.git", // Update to point to your repository
    user: {
      name: "Samuele de Tomasi", // update to use your name
      email: "samuele@stranianelli.com", // Update to use your email
    },
    dotfiles: true,
  },
  () => {
    console.log("Deploy Complete!");
  }
);
```

Aggiungo poi un [adapter-static](https://www.npmjs.com/package/@sveltejs/adapter-static) per poter ottenere delle pagine pronte per GitHub:

```bash
npm i -D @sveltejs/adapter-static@next
```

Aggiorno il file `svelte.config.js`:

```js
import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    preprocess({
      style: "postcss",
      script: "typescript",
      postcss: true,
    }),
  ],

  kit: {
    target: "#svelte",
    package: {
      dir: "package",
      emitTypes: true,
    },
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: null,
    }),
    paths: {
      base: "/svelte-component-package-starter",
    },
  },
};

export default config;
```

Aggiungo il file `.nojekyll` alla cartella `static`.

Ogni volta che creo una nuova versione della documentazione mi conviene ripulire la cartella `build` contenente la precedente. Posso farlo direttamente da NodeJs, creando un file `clean-build.js`:

```js
import { existsSync, rmSync } from "fs";

function deleteFolderRecursive(path) {
  console.log(`Deleting old documents "${path}"...`);
  if (existsSync(path)) {
    rmSync(path, {
      force: true,
      recursive: true,
    });
  }
}

const paths = ["./build"];

paths.forEach((path) => {
  deleteFolderRecursive(path);
});

console.log("Successfully deleted!");
```

Per semplificare l'esecuzione dei vari comandi uso [npm-run-all](https://www.npmjs.com/package/npm-run-all)

```bash
npm i -D npm-run-all
```

Modifico quindi `package.json`:

```json
"scripts": {
  "build": "npm run get-info-svelte-components && npm run clean-build && svelte-kit build",
	"clean-build": "node clean-build.js"
}
```

Per caricare su GitHub Pages la documentazione è sufficiente usare i comandi:

```bash
npm run build
npm run deploy
```

Ottengo una pagina web simile a questa

- [el3um4s.github.io/svelte-component-package-starter](https://el3um4s.github.io/svelte-component-package-starter/)

Finché si tratta di un singolo componente è sufficiente questo. Io però preferisco usare file markdown.

### Come usare Markdown con SvelteKit

Importo [mdsvex](https://mdsvex.pngwn.io/):

```bash
npm i -D mdsvex
npx svelte-add@latest mdsvex
npm install
```

E imposto il file di configurazione `mdsvex.config.js`

```js
const config = {
  extensions: [".svelte.md", ".md", ".svx"],

  smartypants: {
    dashes: "oldschool",
  },

  remarkPlugins: [],
  rehypePlugins: [],
};

export default config;
```

Infine modifico `svelte.config.js` per riconoscere i file `md`

```js
import { mdsvex } from "mdsvex";
import mdsvexConfig from "./mdsvex.config.js";
import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ...mdsvexConfig.extensions],

  preprocess: [
    preprocess({
      style: "postcss",
      script: "typescript",
      postcss: true,
    }),
    mdsvex(mdsvexConfig),
  ],

  kit: {
    target: "#svelte",
    package: {
      dir: "package",
      emitTypes: true,
    },
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: null,
    }),
    paths: {
      base: "/svelte-component-package-starter",
    },
  },
};

export default config;
```

Adesso posso usare i file `MD` come pagine nella cartella `routes`. Rinomino quindi il file `index.svelte` in `index.md`.

Posso creare un file `slider.md` per creare la documentazione di questo componente:

```svelte
<script lang="ts">
	import Slider from '$lib/components/Slider.svelte';
	import infoSvelteComponents from './infoSvelteComponents.json';
	import { SvelteInfo } from '@el3um4s/svelte-component-info';

	let steps = 8;
	let label = "Test";
	$: label = `Test ${steps.toString().padStart(2, "0")}`
</script>

<main>
	<SvelteInfo
		name="Slider"
		description="Svelte Component Package Starter"
		info={infoSvelteComponents['Slider.svelte']}
		urlPackage="@el3um4s/svelte-component-package-starter"
	>
    	<Slider bind:steps {label} slot="demo"/>
    </SvelteInfo>
</main>
```

In questo modo alla pagina [el3um4s.github.io/svelte-component-package-starter/slider](https://el3um4s.github.io/svelte-component-package-starter/slider) trovo qualcosa del genere:

![document-svelte-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-12-31-how-to-document-svelte-components-part-2/document-svelte-03.gif)

E con questo è tutto. Il repository del progetto si può trovare qui:

- [el3um4s/svelte-component-package-starter](https://github.com/el3um4s/svelte-component-package-starter)
