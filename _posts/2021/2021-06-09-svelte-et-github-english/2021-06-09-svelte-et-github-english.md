---
title: "Svelte & GitHub Pages (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Ferenc Almasi**](https://unsplash.com/@flowforfrank)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-06-09 15:00"
categories:
  - JavaScript
  - Svelte
  - TypeScript
tags:
  - JavaScript
  - Svelte
  - TypeScript
---

This is a simple reminder post. In the last few weeks I have been experimenting with [Svelte](https://svelte.dev/) and have focused especially on how to upload a static site to GitHub. I haven't found many guides and tutorials. So I decided to keep track of the steps to take. First of all for the future me.

So what should we do?

First we decide the repository where to upload the site. Let's create a `gh-pages` branch in the repository. I noticed that it is better to load the pages on a separate branch from the main one. In this way the code used for development remains separate from the visible pages of the site. Choosing `gh-pages` also allows us to use a specific npm package (named [gh-pages](https://www.npmjs.com/package/gh-pages)).

After doing this we create the site. Let's start with the simplest thing, a site with no ambition. We write on the terminal:

```
npx degit sveltejs/template my-fantastic-site
```

So let's go into the `my-fantastic-site` folder

```
cd my-fantastic-site
```

If we want we can also use TypeScript but it is not mandatory:

```
node scripts/setupTypeScript.js
```

After this we install the packages with the command

```
npm install
```

Now we can try the site using simply

```
npm run dev
```

I omit the creation of the site itself: it would be too large a topic and it is not what I want to talk about now. We then move on to creating the compiled file by executing:

```
npm run build
```

After running this command we have a `public` folder containing the compiled code ready to be uploaded to GitHub. If we want we can do everything by hand. However, it is more convenient to use [`gh-pages`](https://www.npmjs.com/package/gh-pages). So we run:

```
npm install gh-pages --save-dev
```

So let's add a script in the `package.json` file:

```json
 "scripts": {
    "deploy": "node ./gh-pages.js"
  }
```

Then we create the `gh-pages.js` file:

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

Alternatively we can also use:

```js
import { publish } from 'gh-pages';

publish(
  // ...
);
```

Now there are some details to fix. First, we need to make sure that the `.gitignore` file does not exclude the `public` directory. Just comment out the corresponding line.


```
/node_modules/
# /public/build/
```

The second thing is related to how GitHub Pages works: it works through Jekyll. Generally it does not give particular problems but I have noticed that it does not correctly read the directories that begin with the underscore character (`_`). It is therefore convenient to disable it by creating an empty file named `.nojekyll`. We also put this file in the `public` folder.

Finally, the domain of the site. When we deploy the site we will automatically overwrite all the contents of the `gh-pages` branch including the `CNAME` file. If we are interested in using a specific domain then it is better to add the file to the `public` folder.

Well, after all this we are ready to load the site. So, first of all we compile it

```
npm run build
```

Then we upload the compiled code to the repository. I am fine with the desktop version of GitHub but it is also possible to do it from the command line:

```
git add .
git commit -m "commit description"
git push origin gh-pages
```

After loading the repository we can run

```
npm run deploy
```

Or if we prefer:

```
node ./gh-pages.js
```

There is one more thing to say. If instead of creating a site with Svelte we create it with [SvelteKit](https://kit.svelte.dev/) we have to make some changes to this procedure.


First we need to install the correct [adapter](https://kit.svelte.dev/docs#adapters). In this case it is [@sveltejs/adapter-static](https://github.com/sveltejs/kit/tree/master/packages/adapter-static):

```
npm i -D @sveltejs/adapter-static@next
```

Then we update the `svelte.config.js` file

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

Well, that's all for now.