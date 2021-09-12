---
title: "Some notes about the future and how to use Svelte with Construct 3 (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Adolfo Félix**](https://unsplash.com/@adolfofelix)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-09-12 20:00"
categories:
  - Svelte
  - Construct 3
tags:
  - Svelte
  - Construct 3
---

Last month, August, was quite busy. A few things overlapped, some negative (my wife's grandmother died), others positive: after more than a year I was able to see my parents. And, finally, my wife and I managed to move home, returning to Milan. In addition to the convenience of the City, we will both have more space: we will no longer have to cast lots for who is going to use the mini table :D.

It's September. And for me it's like New Year: it's time for good intentions and to think about what to do. For the past year, I have focused on experimenting. My [Construct Demo repository](https://github.com/el3um4s/construct-demo) has 45 projects, some successful, some not. My goal was to experiment, follow ideas and publish frequently and regularly. I am satisfied: I have grown and improved. For the new year I want to do something different.

I want to focus on something bigger. Instead of publishing something small every week, I want to build something complete and useful. Among my templates there are some projects that I think are interesting:

- [Mesh and Shapes](https://www.patreon.com/posts/47493518)
- [Mermaid](https://www.patreon.com/posts/uml-for-database-51059040)
- [Raccolta di Video di YouTube](https://www.patreon.com/posts/46901116)
- [MS Access, Electron & Construct 3](https://www.patreon.com/posts/ms-access-3-50472226)

I also have the idea of returning to my [One Color Idle Game](https://c3demo.stranianelli.com/template/005-one-color-idle-game), extending the template to make it a real game.

Finally I want (and must) complete the repository restyling. At the end of July I started to modify it, but everything has stopped.

As if that weren't enough, I need to work on a completely offline system to manage issues and suggestions. I think I have to dedicate some time to this matter as well.

In short, there are a few issues to address. And, consequently, the posts I write and the things I talk about will also change.

### Svelte e Construct 3

But before starting to work on future things I want to bring back my notes on how to integrate a component of Svelte with Construct 3.

First I create a new project by importing Svelte:

```bash
npx degit sveltejs/template
node scripts/setupTypeScript.js
npm install
```

Then I install [rollup-plugin-copy](https://www.npmjs.com/package/rollup-plugin-copy):

```bash
npm i rollup-plugin-copy
```

I create a `c3files` folder to save Construct files to use when developing a program.

I create a new C3 project and save it locally in the `c3files` folder (`save as project folder`).

I change the `rollup.config.js` file to copy the Svelte files automatically into the folder with the Construct 3 source files:

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

When I run `npm run build` or `npm run dev` I copy the files I need into the C3 folder. In order to use them I must first import them into C3 (only the first time).

Inside C3 I create a `main.js` file and use it to import the compiled Svelte file:

```js
runOnStartup(async runtime => {
	globalThis.g_runtime = runtime;
	await runtime.assets.loadScripts("svelte.js");
});
```

From the event sheet I import the CSS file:

```
+ System: On start of layout
-> Browser: Load stylesheet from "svelte.css"

+ System: On loader layout complete
-> System: Go to Main
```

To check the Svelte code inside C3 I create a store and a function to initialize the store globally:

```
root
└──src
    ├──Globals
    │   └──CustomSvelte.ts
    └──Stores
        └──CustomStore.ts
```

**CustomStore.ts:**

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

**CustomSvelte.ts:**

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

Then I modify the `App.svelte` file to import the initialization function from the store:

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

I can test the operation by entering some test commands in C3:

```
+ System: Every 0.5 seconds
-> Run JavaScript: customSvelte.cs.false();

+ System: Every 1 seconds
-> Run JavaScript: customSvelte.cs.true();
-> Run JavaScript: customSvelte.print("SVELTE IS TRUE");
```

As usual, I uploaded the code to GitHub: 
- [el3um4s/memento-svelte-construct-3](https://github.com/el3um4s/memento-svelte-construct-3)

It is also possible to download the template directly on PC with:

```bash
npx degit el3um4s/memento-svelte-construct-3
```

Finally, this is my Patreon:
- [patreon.com/el3um4s](https://patreon.com/el3um4s)