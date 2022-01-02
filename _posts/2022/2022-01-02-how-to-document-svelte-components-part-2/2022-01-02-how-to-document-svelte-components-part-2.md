---
title: "How To Document Svelte Components - Part 2"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Robo Wunderkind**](https://unsplash.com/@robowunderkind)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-01-02 23:20"
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

This post took me longer than expected. A little over a month. The two main repositories took me longer. This is to answer a question: how can I easily document a web component created with Svelte?

### Introduction

Before starting I have to clarify a couple of things. First of all, this post consists of three parts.

The first part takes up the discourse begun with this article:

- [How to Document Svelte Components](https://betterprogramming.pub/how-to-document-svelte-components-ab504661a6fc)

I take up my hypothesis from a month and a half ago and present the two repositories that I will use.

The second part is a review of how to create a blog on GitHub using static pages. It is basically a summary of this piece:

- [How to Use SvelteKit with GitHub Pages](https://javascript.plainenglish.io/sveltekit-github-pages-4fe2844773de)

Finally the third part is about how to use Markdown (`md`) files together with Svelte components.

I'm not starting from a new component but from one I've already created:

- [How to Create and Publish Svelte Components](https://el3um4s.medium.com/how-to-create-and-publish-svelte-components-e770f1e94435)

So with that said, let's get started.

### How to create documents that document themselves

To simplify the creation of the Svelte component documentation I have created 2 NPM packages. The first, [@el3um4s/svelte-get-component-info](https://www.npmjs.com/package/@el3um4s/svelte-get-component-info), has the task of parsing the component and extracting a JSON object with the basic information. The second, [@el3um4s/svelte-component-info](https://www.npmjs.com/package/@el3um4s/svelte-component-info), takes care of transforming this information into a readable format on the screen.

Why did I split the project in two? Because in this way it is possible to create different graphic presentations, if someone wants to do it.

I begin by installing the first one:

```bash
npm i -D @el3um4s/svelte-get-component-info
```

I then create a `getInfoSvelteComponents.js` file that allows me to read all the files in the `src\lib\components` directory. After extracting the data I need, I save it in an `infoSvelteComponents.json` file in the `src\routes` folder:

<script src="https://gist.github.com/el3um4s/79bda3c80b1d50373e5a9c214c2bc4f1.js"></script>

It can also be useful, but not essential, to create a `getInfoSvelteComponents-watcher.js` file to automatically intercept any changes to the component source code:

<script src="https://gist.github.com/el3um4s/419fd8100102cc08039059c9cb923ed1.js"></script>

So I add a couple of scripts to `package.json`:

<script src="https://gist.github.com/el3um4s/07e590dd75f31733a146b720a9e2f290.js"></script>

When I run `npm run get-info-svelte-components` I get a file similar to this:

<script src="https://gist.github.com/el3um4s/0a3dd2492376dba2404339113e2b78dd.js"></script>

For each component in the `lib\components` directory I get an object with 4 properties:

- props
- actions
- slots
- css

I can import this information into the `src\routes\index.svelte`file

<script src="https://gist.github.com/el3um4s/9588bc55901cc1744c4aac019956fcc1.js"></script>

This alone would be enough to create an automatic documentation system: just extract the information contained in `infoSvelteComponents` and that's it.

I preferred to create a specific component, [@el3um4s/svelte-component-info](https://www.npmjs.com/package/@el3um4s/svelte-component-info). I install it with:

```bash
npm i @el3um4s/svelte-component-info
```

I then import the component into the `index.svelte` file:

<script src="https://gist.github.com/el3um4s/5e73061c8243d0c8b7f703224b0a3e0b.js"></script>

I get a page like to this:

![document-svelte-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-12-31-come-documentare-web-component-svelte-parte-2/document-svelte-01.gif)

I add a `slot="demo"` to show a preview of the component:

<script src="https://gist.github.com/el3um4s/ed17486976cc837bee4c549dd7bc6f45.js"></script>

This way I get this:

![document-svelte-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-12-31-come-documentare-web-component-svelte-parte-2/document-svelte-02.gif)

And with this I concluded the first part.

But one question remains: how can I automatically upload pages created by SvelteKit to GitHub?

### How to use SvelteKit with GitHub Pages

I start from the article [How to Use SvelteKit with GitHub Pages](https://javascript.plainenglish.io/sveltekit-github-pages-4fe2844773de) to use markdown as documentation of my components. I install [gh-pages](https://www.npmjs.com/package/gh-pages):

```bash
npm install gh-pages --save-dev
```

and then I add a script to `package.json`:

<script src="https://gist.github.com/el3um4s/5211794a6dbb31895f8049e0c1f22327.js"></script>

I create the `gh-pages.js` file:

<script src="https://gist.github.com/el3um4s/3239adf6c4e4262ad74be0977f026092.js"></script>

Then I add the [adapter-static](https://www.npmjs.com/package/@sveltejs/adapter-static) to get pages ready for GitHub:

```bash
npm i -D @sveltejs/adapter-static@next
```

I update the `svelte.config.js` file:

<script src="https://gist.github.com/el3um4s/d7d7d4b9ed9827921576c23aac0af1fb.js"></script>

I add the `.nojekyll` file to the `static` folder.

Whenever I create a new version of the documentation it is worth cleaning up the `build` folder containing the previous one. I can do this directly from NodeJs, by creating a `clean-build.js` file:

<script src="https://gist.github.com/el3um4s/efbeb42de857b8d939068e19516d7d92.js"></script>

I edit `package.json`:

<script src="https://gist.github.com/el3um4s/d5db41e635fcb79a94917fc6a4997ca2.js"></script>

To upload the documentation to GitHub Pages, simply use the commands:

```bash
npm run build
npm run deploy
```

I get a web page similar to this

- [el3um4s.github.io/svelte-component-package-starter](https://el3um4s.github.io/svelte-component-package-starter/)

As long as it is a single component this is sufficient. However, I prefer to use markdown files.

### How to use Markdown with SvelteKit

I import [mdsvex](https://mdsvex.pngwn.io/):

```bash
npm i -D mdsvex
npx svelte-add@latest mdsvex
npm install
```

And I set the configuration file `mdsvex.config.js`

<script src="https://gist.github.com/el3um4s/9bd7cb1e84aa69f053e1827e228a06c2.js"></script>

Finally I modify `svelte.config.js` to recognize the `md` files

<script src="https://gist.github.com/el3um4s/d3aeab48d629c8ee8811bfbde1b7cc82.js"></script>

Now I can use the `md` files as pages in the `routes` directory. I then rename the `index.svelte` file to `index.md`.

I can create a `slider.md` file to document this component:

<script src="https://gist.github.com/el3um4s/ef45e0e0e56caeb4f302d6b6e3429657.js"></script>

So on page [el3um4s.github.io/svelte-component-package-starter/slider](https://el3um4s.github.io/svelte-component-package-starter/slider) I find something like this:

![document-svelte-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-12-31-come-documentare-web-component-svelte-parte-2/document-svelte-03.gif)

And this is all. The project repository is here:

- [el3um4s/svelte-component-package-starter](https://github.com/el3um4s/svelte-component-package-starter)
