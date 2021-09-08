---
title: "Alcuni appunti sul futuro e su come usare Svelte con Construct 3"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Adolfo Félix**](https://unsplash.com/@adolfofelix)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-09-10 10:00"
categories:
  - Svelte
  - Construct 3
tags:
  - Svelte
  - Construct 3
---

Il mese scorso, Agosto, è stato abbastanza impegnativo. Si sono accavallate un po' di cose, alcune negative (è morta la nonna di mia moglie), altre positive: dopo più di un anno sono riuscito a vedere i miei genitori. E, finalmente, mia moglie ed io siamo riusciti a cambiare casa, tornando a Milano. Oltre alla comodità della City, avremo entrambi più spazio: non dovremo più tirare a sorte a chi tocca usare il mini tavolo :D.

Detto questo, è anche Settembre. E per me Settembre è come se fosse capodanno: è tempo di bilanci, di buoni propositi e di ragionare su cosa fare. Nell'ultimo anno mi sono concentrato sullo sperimentare. Il mio repository [Construct Demo](https://github.com/el3um4s/construct-demo) ha 45 progetti, alcuni riusciti meglio, altri peggio. Il mio obiettivo era sperimentare, seguire le idee e pubblicare frequentemente e con regolarità. Sono soddisfatto: mi pare di essere cresciuto e migliorato. Per il nuovo anno, quello che in testa mia sta cominciando, voglio fare qualcosa di diverso.

Cosa?

Voglio concentrarmi su qualcosa di più grande. Invece di pubblicare ogni settimana qualcosa di piccolo, voglio costruire qualcosa di completo e di utile. Tra mi miei template ci sono alcuni progetti che credo valga la pena di ampliare:

- [Mesh and Shapes](https://www.patreon.com/posts/47493518)
- [Mermaid](https://www.patreon.com/posts/uml-for-database-51059040)
- [Raccolta di Video di YouTube](https://www.patreon.com/posts/46901116)
- [MS Access, Electron & Construct 3](https://www.patreon.com/posts/ms-access-3-50472226)

Ho anche l'idea di tornare sul mio [One Color Idle Game](https://c3demo.stranianelli.com/template/005-one-color-idle-game), estendendo il template per farlo diventare un vero gioco.

Infine voglio (e devo) completare il restyling del repository stesso. A fine luglio ho cominciato a modificarlo, ma è rimasto tutto fermo.

Come se non bastasse ho bisogno di lavorare su un sistema completamente offline per gestire issue e suggerimenti su alcuni progetti lavorativi. Credo di dover dedicare un po' di tempo anche a questa faccenda.

Insomma, ci sono un po' di questioni da affrontare. E, conseguentemente, cambieranno anche i pezzi che scriverò e le cose di cui parlerò.

### Svelte e Construct 3

Ma prima di cominciare a lavorare sulle cose future voglio riportare i miei appunti su come integrare un componente di Svelte con Construct 3.

Per prima cosa creo un nuovo progetto importando Svelte:

```bash
npx degit sveltejs/template
node scripts/setupTypeScript.js
npm install
```

Poi installo [rollup-plugin-copy](https://www.npmjs.com/package/rollup-plugin-copy):

```bash
npm i rollup-plugin-copy
```

Creo una cartella `c3files` per salvare i file di Construct da usare durante lo sviluppo di un programma.

Creo un nuovo progetto C3 e lo salvo in locale dentro la cartella `c3files`. (`save as project folder`)

Modifico il file `rollup.config.js` per copiare i file di Svelte automaticamente dentro la cartella con i file sorgente di Construct 3: 

```js
//...
import copy from 'rollup-plugin-copy'

export default {
    //...
    plugins: [
        //...
        !production && copy({
			targets: [{
					src: 'public/build/bundle.css',
					dest: ['c3files/files', 'dist'],
					rename: 'svelte.css'
				},
				{
					src: 'public/build/bundle.js',
					dest: ['c3files/files', 'dist'],
					rename: 'svelte.js'
				},
			]
		}),
        // ...
        production && copy({
			targets: [{
					src: 'public/build/bundle.css',
					dest: ['c3files/files', 'dist'],
					rename: 'svelte.css'
				},
				{
					src: 'public/build/bundle.js',
					dest: ['c3files/files', 'dist'],
					rename: 'svelte.js'
				},
			]
		})
    ],
    //...
}
```

In questo modo quando eseguo `npm run build` oppure `npm run dev` copio i file che mi servono dentro la cartella di C3. Per poterli usare devo prima importarli dentro C3 (solamente la prima volta).

Dentro C3 creo un file `main.js` e lo uso per importare il file compilato di Svelte:

```js
runOnStartup(async runtime => {
	globalThis.g_runtime = runtime;
	await runtime.assets.loadScripts("svelte.js");
});
```

Dall'event sheet importo il file CSS:

```
+ System: On start of layout
-> Browser: Load stylesheet from "svelte.css"

+ System: On loader layout complete
-> System: Go to Main
```

Per poter controllare il codice di Svelte dentro C3 creo uno store e una funzione per inizializzare a livello globale lo store:

```
root
└──src
    ├──Globals
    │   └──CustomSvelte.ts
    └──Stores
        └──CustomStore.ts
```

Esempio di CustomStore.ts

```ts
import { writable, Writable} from "svelte/store";

const s:Writable<boolean> = writable(false);

const cs = {
    subscribe: s.subscribe,
    true: () => s.set(true),
    false: () => s.set(false)
}

export default cs;
```

Esempio di CustomSvelte.ts

```ts
import cs from "../Stores/CustomStore";

export default function initializeCustomSvelte() {
    if (!!!globalThis.customSvelte)  { 
        globalThis.customSvelte = { };
    };

    globalThis.customSvelte.cs = cs;
    globalThis.customSvelte.print = print;
}

function print(test: string = "Hello World!"):void {
    console.log(test)
}
```

Poi modifico il file `App.svelte` in modo da importare dallo store la funzione di inizializzazione:

```html
<script lang="ts">
  import initializeCustomSvelte from "./Globals/CustomSvelte";
  import cs from "./Stores/CustomStore";

  initializeCustomSvelte();
  cs.true();
</script>

<div id="page">
  {#if $cs}
    <div>Svelte {$cs}</div>
  {/if}
</div>

<style>
  #page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  }
</style>
```

Posso testare il funzionamento inserendo alcuni comandi di prova in C3:

```
+ System: Every 0.5 seconds
-> Run JavaScript: customSvelte.cs.false();

+ System: Every 1 seconds
-> Run JavaScript: customSvelte.cs.true();
-> Run JavaScript: customSvelte.print("SVELTE IS TRUE");
```

Ho caricato il codice su GitHub: 
- [el3um4s/memento-svelte-construct-3](https://github.com/el3um4s/memento-svelte-construct-3)

È anche possibile scaricare il template direttamente su PC con il comando:

```bash
npx degit el3um4s/memento-svelte-construct-3
```

Per finire ricordo il mio Patreon: 
- [patreon.com/el3um4s](https://patreon.com/el3um4s)