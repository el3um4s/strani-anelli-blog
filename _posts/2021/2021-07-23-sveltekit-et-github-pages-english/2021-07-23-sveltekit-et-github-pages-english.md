---
title: "SvelteKit & GitHub Pages (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Kaitlyn Baker**](https://unsplash.com/@kaitlynbaker)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-07-23 15:00"
categories:
  - TypeScript
  - Svelte
  - Electron
tags:
  - TypeScript
  - Svelte
  - Electron
---

I waited a few weeks before writing a new article about how to use Svelte with GitHub Pages. Today I'm interested in testing SvelteKit. This post will take the form of a logbook: I report the various steps as I do them. They are notes, instead of a guide.

### SvelteKit

First I create a new project based on [SvelteKit](https://kit.svelte.dev/) by typing:


```bash
npm init svelte@next my-app
```

I install the various dependencies

```bash
npm i
```

To simplify publishing on GitHub Pages I use [gh-pages](https://www.npmjs.com/package/gh-pages) once again:


```bash
npm install gh-pages --save-dev
```

I add the script on `package.json`:

```json
"scripts": {
 "deploy": "node ./gh-pages.js"
}
```

And then I create the `gh-pages.js` file:

```js
import { publish } from 'gh-pages';

publish(
 'build', // path to public directory
 {
  branch: 'gh-pages',
  repo: 'https://github.com/el3um4s/memento-sveltekit-and-github-pages.git', // Update to point to your repository
  user: {
   name: 'Samuele de Tomasi', // update to use your name
   email: 'samuele@stranianelli.com' // Update to use your email
  },
  dotfiles: true
  },
  () => {
   console.log('Deploy Complete!');
  }
);
```

To publish on GitHub I need the [adapter-static](https://www.npmjs.com/package/@sveltejs/adapter-static):


```bash
npm i -D @sveltejs/adapter-static@next
```

So, I update the `svelte.config.js` file

```js
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
 // Consult https://github.com/sveltejs/svelte-preprocess
 // for more information about preprocessors
 preprocess: preprocess(),

 kit: {
 // hydrate the <div id="svelte"> element in src/app.html
  target: '#svelte',
  adapter: adapter({
    pages: 'build',
    assets: 'build',
    fallback: null
  })
 }
};

export default config;
```

If I run the command

```bash
npm run build
```

I will get a `build` folder in the root of the project. Well, this will be the folder to upload to GitHub Pages. But first I have to configure the repository.

{% include picture img="settings.webp" ext="jpg" alt="" %}

I set the `gh-pages` branch as the site origin and, in case, I set up a custom domain.

Then I need 2 more files, both in the `static` folder:

- `.nojekyll`: prevent Jekyll from managing the pages (see [Bypassing Jekyll on GitHub Pages](https://github.blog/2009-12-29-bypassing-jekyll-on-github-pages/))
- `CNAME`: allow GitHub Pages to use the custom domain I set up.

`.nojekyll` is an empty file. Create it and don't write anything in it.

`CNAME` contains only one line: the domain name, in this format:


```bash
test.stranianelli.com
```

Now I can recompile the site with `npm run build` and then use

```bash
npm run deploy
```

to upload it online.

During development I can use the command

```bash
npm run dev -- --open
```

to see in real time the changes made to the code.

To add a new page (`about.svelte`) I create a new component in the `src\routes` folder.

### How to create a blog with SvelteKit

This can be fine for a static site. What if you want to create something like a blog, instead?

From now on things get complicated. I found some posts and videos on the net:

- [SvelteKit Blog](https://svelteland.github.io/svelte-kit-blog-demo) - thank you John!
- [Sveltekit Markdown Blog](https://www.youtube.com/playlist?list=PLm_Qt4aKpfKgonq1zwaCS6kOD-nbOKx7V)
- [How to Create a Blog with SvelteKit and Strapi](https://strapi.io/blog/how-to-create-a-blog-with-svelte-kit-strapi)
- [How to create a blog with SvelteKit and dev.to API](https://dev.to/ladvace/how-to-create-a-blog-with-sveltekit-and-dev-to-api-5h7e)

And others. I am not satisfied with any of the proposed solutions. But I don't have my proposal yet. I have a special thank to [WebJeda](https://blog.webjeda.com/) for his videos and posts.

I need some other tools. For starters I need [trash-cli](https://github.com/sindresorhus/trash-cli) to clean up the `build` directory before every `npm run build` command.

```bash
npm i -D trash-cli
```

I add a new script to `package.json` and update `build`:

```json
"scripts": {
 "build": "npm run clean && svelte-kit build",
 "clean": "trash build"
},
```

Then I import [mdsvex](https://mdsvex.pngwn.io/) into the project

```bash
npm i -D mdsvex
```

and in succession I use [svelte-add/mdsvex](https://github.com/svelte-add/mdsvex):


```bash
npx svelte-add@latest mdsvex
```

`mdsvex` allows me to use markdown pages as if they were svelte components. Also as pages of a SvelteKit router. There is a configuration file, `mdsvex.config.js`:

```js
const config = {
  "extensions": [".svelte.md", ".md", ".svx"],

  "smartypants": {
    "dashes": "oldschool"
  },

  "remarkPlugins": [],
  "rehypePlugins": []
};

export default config;
```

I change `svelte.config.js` to handle the markdown:

```js
import {
 mdsvex
} from "mdsvex";
import mdsvexConfig from "./mdsvex.config.js";
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
 "extensions": [".svelte", ...mdsvexConfig.extensions],
  preprocess: [preprocess(), mdsvex(mdsvexConfig)],

  kit: {
   target: '#svelte',
   adapter: adapter({
	pages: 'build',
	assets: 'build',
	fallback: null
   })
  }
};

export default config;
```

As a test, I take a few fake blog posts. I create the `src/routes/blog` folder and insert some `.md`. files inside.

```md
---
file: hello-world.md
title: Hello World
---

Hi!
```

After running `npm run dev` again I can see the result at `http://localhost:3000/blog/hello-world`

The interesting thing is that you can use Svelte inside the file. For example, I can set the page title with:

```md
# {title}
```

I can use components defined elsewhere:

```md
<script>
 import Box from "$lib/Box.svelte";
</script>

<Box />
```

Image management is a bit more complicated. I still don't know which is the best method. One plans to put all the images in the static folder and then recall them from there:

```html
<script>
 <img src="image.jpg" />
</script>
```

Otherwise, I can put them in a folder inside `lib` and then import them as components:

```html
<script>
 import ImageSrc from "$lib/assets/drums.png";
</script>

<img src={ImageSrc} />
```

### Create a post index

Another aspect to keep in mind when creating a blog is the home page. I can get something nice by creating a `src/routes/blog/index.svelte` component and using the [load()](https://kit.svelte.dev/docs#loading) function.

I start by importing an array with a reference to all `.md` files in the folder:

```html
<script context="module">
 const allPosts = import.meta.glob("./**/*.md");
</script>
```

I extract the information I need from that array:

- `path` is the location of the file
- `metadata` is the YAML content of the file itself.

```html
<script context="module">
 const allPosts = import.meta.glob("./**/*.md");
 let body = [];
 for (let path in allPosts) {
  body.push(
   allPosts[path]().then( ({metadata}) => {
    return { path, metadata}
   })
  );  
 }
</script>
```

Finally I pass to the component what I need to create the index:

```html
<script context="module">
// ...
 export async function load() {
  const posts = await Promise.all(body);
   return {
    props: {posts}
   }
 }
</script>
```

The rest of the component is quite simple:

```html
<script>
 export let posts;
</script>

<ul>
 {#each  posts as {path, metadata: {title}} }
  <li>
   <a href={`/blog/${path.replace(".md","")}`}>{title}</a>
  </li>
 {/each}
</ul>
```

### SvelteKit and Layouts

[Layouts](https://kit.svelte.dev/docs#layouts) are an interesting possibility. For example, I can create a component `src/routes/blog/__layout.svelte`:

```html
<nav>
    <a sveltekit:prefetch href="./">Blog</a>
	<a sveltekit:prefetch href="../about">About</a>
    <a sveltekit:prefetch href="../">Home</a>
</nav>

<slot></slot>
```

To insert a menu above each blog page.

### Highlighting

Another aspect to fix concerns the code. Or rather, how the code looks. `mdsvx` has the ability to apply styles. I have not found many clear indications on this point. It worked for me to download a style from [prismjs](https://prismjs.com/). Then I copied the css file (which I named `prism.css`) to the `static` folder. Finally I added a stylesheet reference to the `src\app.html`:

```html
<link href="prism.css" rel="stylesheet" />
```

Or I can insert in the layout:

```html
<svelte:head>
    <link href="prism.css" rel="stylesheet" />
</svelte:head>
```

### Configure path.base

There may be another problem when I upload the blog. If I upload it to a single domain, for example on `test.stranianelli.com` then I can access the various pages by going to addresses like `test.stranianelli/blog/first-post`.

But things are different if I upload everything to a non-root folder. To make everything work I have to change the file `svelte.config.js`:

```js
kit: {
		paths: {
			base: '/memento-sveltekit-and-github-pages'
		},
	}
```

This allows me to better configure the links using something like:

```html
<script>
    import { base } from '$app/paths';

    export let posts;
</script>

<ul>
    {#each  posts as {path, metadata: {title}} }
        <li>
            <a href={`${base}/blog/${path.replace(".md","")}`}>{title}</a>
        </li>
    {/each}
</ul>
```

### Add transitions between pages

A nice thing is to add a transition when going from post to post. To do this, follow the advice given by [Evan Winter](https://dev.to/evanwinter/page-transitions-with-svelte-kit-35o6).

I create a `PageTransition.svelte` component:

```html
<script>
  import { fly } from "svelte/transition"
  export let refresh = ""
</script>

{#key refresh}
  <div in:fly={{  x:-5, duration: 500, delay: 500 }}
    out:fly={{ x: 5, duration: 500 }}>
   <slot />
  </div>
{/key}
```

and then I use it in the layout:

```html
<script>
  import PageTransition from "$lib/PageTransition.svelte"
  export let key
</script>

<script context="module">
  export const load = async ({ page }) => ({
    props: {
      key: page.path,
    },
  })
</script>

<div>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>

<PageTransition refresh={key}>
    <slot />
  </PageTransition>
</div>
```

That's all for today. The code is available on GitHub:

- [MEMENTO - SvelteKit & GitHub Pages](https://github.com/el3um4s/memento-sveltekit-and-github-pages)

The blog is visible at the address: [el3um4s.github.io/memento-sveltekit-and-github-pages](https://el3um4s.github.io/memento-sveltekit-and-github-pages/).

I also remember my Patreon:

- [Patreon](https://www.patreon.com/el3um4s)