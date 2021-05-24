---
title: "Chrome Extension, Svelte & Construct 3 (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-05-24 13:00"
categories:
  - Construct 3
  - JavaScript
  - Svelte
tags:
  - Construct 3
  - JavaScript
  - Chrome Extension
  - Svelte
---


This week I went on with the course on [Svelte](https://svelte.dev/). Things are getting interesting and I have decided to test my knowledge by creating an extension for Google Chrome. I chose my old [**Motivational Quotes Plugin**](https://www.construct.net/en/make-games/addons/175/motivational-quotes) and tried to do it all over again.


![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-05-23-svelte-chrome-extension-construct-3/animation.gif)

The purpose of the extension is trivial: a motivational sentence appear every time we open the [Construct 3 editor](https://editor.construct.net/). I also want it to appear in an html element integrated into the editor and to be able to change the sentence by choosing another random one.

I've never created a Chrome extension. So I started from studying the [official examples](https://developer.chrome.com/docs/extensions/mv3/getstarted/) and a [dev.to article](https://dev.to/khangnd/build-a-browser-extension-with-svelte-3135). I then put the information together.


First I downloaded a Svelte template:

```bash
npm degit sveltejs/template chrome-extension
cd chrome-extension
npm install
```

The project has 2 main folders: `src` and `public`. _src_ is where I will actually write the code. The code will be then compiled and saved in `public/build`. Then, at the end of it all, I'll take the content from _public_, compress it, and upload it as a Chrome extension.

The first thing to do is to create the `manifest.json` file inside the `public` folder:

```json
{
  "name": "Motivational Quotes",
  "description": "Get and create motivational quotes",
  "version": "0.1.0",
  "manifest_version": 3
}
```

I decided to split the extension into two parts

1. the `popup` section where to insert an html page to be displayed when I click on the extension icon
2. the `motivational` section to hack the Construct 3 editor and insert a window with the motivational quote

I start by adding an entry to the `manifest.json`:

```json
{
  "action": {
    "default_popup": "popup.html",
  }
} 
```

and rename the `public/index.html` file to `public/popup.html`.

Then I create the `src/popup/Popup.svelte` file with the template to show in the popup window of the extension:

```html
<div class="popup">
  <div class="item title center">
    <h3>Motivational Quotes</h3>
  </div>
  <div class="item info center">
    <p><em>Shows a motivational quote when you launch Construct 3.</em></p>
  </div>
  <hr>
  <div class="item info">
    <p>...info...</p>
  </div>
</div>
```

I also add a few styles to make it look more beautiful. You can see it on the project repository ([el3um4s/svelte-motivational-quotes-for-c3](https://github.com/el3um4s/svelte-motivational-quotes-for-c3)).

To complete the popup, all that remains is to update the `src/App.svelte` file:

```html
<script>
	import Popup from "./popup/Popup.svelte";
</script>

<Popup></Popup>

<style>
:global(html,body){
  width: 256px;
  height: auto;
  font-size: medium;
  padding: 0px;
  margin: 0px;
  background-color: #F4ECE1;
  color: #1F1B0F;
}
:global(body){
  position: absolute;
  height: auto;
}
</style>
```

In this case I have also reported the style because I am interested in pointing out the need to use `:global(selector)` to modify the whole window. After importing the extension we can see something like this:

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-05-23-svelte-chrome-extension-construct-3/chrome-extension-06.gif)

So far the simple part. But to get something similar to my goal I had to modify the `manifest.json` file by adding:

```json
{ 
  "permissions": [
    "activeTab",
    "scripting"
  ],
  "content_scripts": [
    {
      "matches": ["*://editor.construct.net/*"],
      "css": ["/build/motivational.css"],
      "js": ["/build/motivational.js"]
    }
  ]
}
```

I need `permissions` to ask Chrome to give me permissions to change the active tab of the browser and to execute javascript commands. `content_scripts` indicates which files _js_ and _css_ will need the extension. Finally, `matches` indicates which web pages I want to be able to intervene on.

In theory, all that remains is to write the code in  `motivational.js` and we are good to go. But it's not that simple. Because SvelteJS compiles everything into `bundle.js` and `bundle.css`. I need to configure [Rollup](https://rollupjs.org/guide/en/) via the `rollup.config.js` file:

```js
export default [
  {
    // input: 'src/main.js',
    // ...
  },
  {
		input: "src/motivational.js",
		output: {
			sourcemap: true,
			format: "iife",
			name: "motivational",
			file: "public/build/motivational.js"
		},
		plugins: [
			svelte({
				compilerOptions: {
					dev: !production
				}
			}),
			css({
				output: 'motivational.css'
			}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			!production && serve(),
			!production && livereload('public'),
			production && terser()
		],
		watch: {
			clearScreen: false
		}
	  }
  ];
```

This way I can force `motivational.js` to be compiled as a separate file. But what should I write in `motivational.js`?

```js
import Motivational from './motivational/Motivational.svelte';

const motivational = new Motivational({
	target: document.body
});

export default motivational;
```

When the extension notices that it is in the Construct 3 editor tab it executes the contents of the `/build/motivational.js` file. And this file is nothing more than the result of the Svelte compiler: it inserts the `Motivational` component into the `document.body`. Even if said in a convoluted way, it is nothing more and nothing less than the normal functioning of Svelte.

So I switch to  `src/motivational/Motivational.svelte`:

```html
<script>
    import { onMount } from "svelte";
    import importQuotes from "./importQuotes.js";

    import Pane from "./Pane.svelte";
    //...
</script>

<Pane {id} {isVisible} on:newQuote={onNewQuote}>
  <span slot="title">{title}</span>
  <span slot="quote">{quote}</span>
  <span slot="author">{author}</span>
</Pane>
```

This is a classic Svelte file. There is one thing to note: the `Pane` component is made up of some tags taken from the editor page:

```html
<ui-pane>
  <ui-caption>
    <ui-close-button></ui-close-button>
  </ui-caption>
  <ui-body></ui-body> 
</ui-pane>
```

Why did I choose this path? To take advantage of the integrated style sheet management in C3. This way I don't have to recreate the CSS style of each element. And above all I can easily get a component that integrates with the various themes of the editor.

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-05-23-svelte-chrome-extension-construct-3/chrome-extension-04.gif)

To generate the random sentences I used a very simple function:

```js
import words from "./words.js";

export default async function importQuotes(url) {
  try {
    const quotes =  await fetch(url);
    const response = await quotes.json();
    const listQuotes = response.quotes;
    return listQuotes; 
  } catch (error) {
    const listQuotes = words.motivationalQuotes;
    return listQuotes; 
  }
};
```

Compared to the original plugin I have chosen to import the list of phrases directly from the GitHub repository ([../motivational-quotes/default.json](https://raw.githubusercontent.com/el3um4s/svelte-motivational-quotes-for-c3/main/motivational-quotes/default.json)). In theory this should allow me to add new phrases without having to recompile and load the extension again.

Creating, or rather, recreating this plugin was very interesting. Both because I have noticed how my skill has grown over time and because I am really appreciating Svelte very much. But I am not completely satisfied with the result. There is a limit, I think insurmountable: a Chrome extension cannot directly access the content of a C3 project. It would be interesting, for example, to be able to use this technique to enhance the editor. On GitHub there is an interesting repository by [Quentin Goinaud (aka Armaldio)](https://github.com/Armaldio) and [Ossama Jouini (aka Skymen)](https://github.com/skymen): [Refined C3](https://github.com/Armaldio/refined-construct-3). I'm curious to see what will come out of it.


Creare, o meglio, ricreare questo plugin è stato molto interessante. Sia perché ho potuto notare come nel tempo la mia abilità è cresciuta sia perché sto davvero apprezzando molto Svelte. Ma non sono completamente soddisfatto del risultato. C'è un limite, credo insormontabile: un'estensione Chrome non può accedere direttamente al contenuto di un progetto C3. Sarebbe interessante, per esempio, poter usare questa tecnica per potenziare l'editor. Su GitHub c'è un repository interessante di [Quentin Goinaud (aka Armaldio)](https://github.com/Armaldio) e di [Ossama Jouini (aka Skymen)](https://github.com/skymen): [Refined C3](https://github.com/Armaldio/refined-construct-3). Sono curioso di vedere cosa ne uscirà fuori.

From my side, I believe the next attempt will be to test the possibility of recreating this plugin (or another) directly with the [official Construct 3 SDK](https://www.construct.net/en/make-games/manuals/addon-sdk) and Svelte.

That's all, for the moment. I obviously uploaded the complete project to GitHub.

- [the project on GitHub](https://github.com/el3um4s/svelte-motivational-quotes-for-c3)
- [Patreon](https://www.patreon.com/el3um4s)