---
title: "SvelteKit: routing from other folders"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Bogdan Karlenko**](https://unsplash.com/@bogdan_karlenko)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-07-26 18:00"
categories:
  - SvelteKit
  - GitHub Pages
tags:
  - SvelteKit
  - GitHub Pages
---

I am continuing to explore [Svelte](https://svelte.dev/), [SvelteKit](https://kit.svelte.dev/) and [GitHub Pages](https://pages.github.com/). It's pretty easy to create a blog and use mdsvex to process markdown files. But I think that the imposed folder structure is limiting.

In SvelteKit the blog pages must be in a `blog` folder (or `post`, or any other name). The post url will look something like:

```
blog.stranianelli.com/2021/2021-07-26-sveltekit-routing-from-other-folders
```

Instead I prefer a simpler url:

```
blog.stranianelli.com/sveltekit-routing-from-other-folders
```

Partly because I write a few posts, partly for personal taste. I know that it is not a widespread practice but mine _sine qua non_ condition to switch from Jekyll to Svelte is the possibility of use the same url structure.

There is another important condition: I want to keep post images in the same folder with the `.md` file. I prefer to keep everything together, it makes my life easier when I write.

I had to search a bit, but combining various pieces and trying and trying again I managed to get something working.

Before starting a few links:

- [Building a Better Svelte Data Flow](https://www.ryanfiller.com/blog/building-a-better-svelte-data-flow): it's for [Sapper](https://sapper.svelte.dev/) but still useful
- [Vite - Glob Import](https://vitejs.dev/guide/features.html#glob-import)
- [Sveltekit Markdown Blog](https://www.youtube.com/playlist?list=PLm_Qt4aKpfKgonq1zwaCS6kOD-nbOKx7V)

The trick is to "map" all blog posts and keep them as "modules". Then I use [Vite](https://vitejs.dev/) to dynamically import the modules into the blog. To test I don't create a new repository. I continue modifying the [MEMENTO SvelteKit & GitHub Pages](https://github.com/el3um4s/memento-sveltekit-and-github-pages): I add a `src/news` folder to insert the various posts.

I use a structure similar to the one I will need in my blog. So the posts will be divided by year but not by month. Each post will stay in a folder whose first few characters represent the publication date. Inside the folder I will put the images I will need and an `index.md` file with the post. I think in the future I will have to add the ability to use markdown files with other names. That's enough for the moment.

Every post will be in a path similar to:

```
root: /src/news/2021/2021-07-26-sveltekit-routing-from-other-folders/index.md
```

Also, I want to index the various posts. I change the `src/routes/index.svelte` file.

### index.svelte

First, I need the list of all markdown files contained in the `news` folder. I use a function of Vite, `globEager`:

<script src="https://gist.github.com/el3um4s/b5e8ab0db2833d6b4d68debbd9c49c34.js"></script>

With this code I get all the `md` files as modules. Then I go through every post I've just found and I extract some data

<script src="https://gist.github.com/el3um4s/26a10d80b9b580712916c9420242e671.js"></script>

I need the post module

<script src="https://gist.github.com/el3um4s/02c2cec62e832e1d5e8567e90d73ca53.js"></script>

And I need the metadatas (extracted from the markdown frontmatter):

<script src="https://gist.github.com/el3um4s/6336abb291e4453265eb3c2165368124.js"></script>

I put all in an array (`body = []`). Then I pass `body` to the page with a `load()` function:

<script src="https://gist.github.com/el3um4s/43887df50e4ca4eaf0dd3927f049f613.js"></script>

Now I add the html side in `index.svelte`:

<script src="https://gist.github.com/el3um4s/9a12af4e1ae887c7d3fe96b1021a3014.js"></script>

I can also play with frontmatter. I can use the folder name if I don't define a slug in the frontmatter. I extract the name of the folder minus the date:

<script src="https://gist.github.com/el3um4s/0a7b44c979479b7ccc4b296fa41c3651.js"></script>

Then I define the helper function:

<script src="https://gist.github.com/el3um4s/7e91fff628349c031e7ed05271110877.js"></script>

And I change the html code:

<script src="https://gist.github.com/el3um4s/a914ec7a88abbb33cb7393c28310e92f.js"></script>

### [slug].svelte

Once I fix the home page, I have to understand how to access the various posts using a simplified slug. I need a [dynamic parameter](https://kit.svelte.dev/docs#routing-pages). So I create the `src/routes/[slug].svelte` component.

I have to import the various posts. But this time I also import the modules of the various posts:

<script src="https://gist.github.com/el3um4s/229b3f4ef9d28747a34e0d69d1adb110.js"></script>

Now I filter the various posts to extract what I want to show:

<script src="https://gist.github.com/el3um4s/dcdc5be1e2a3e811b7f785b733e7466d.js"></script>

The component itself is very simple:

<script src="https://gist.github.com/el3um4s/33d095e0ecc59614f9b9369f516c21c5.js"></script>

After that, I can build the static site with:

```bash
npm run build
```

Now I can upload to GitHub:

```bash
npm run deploy
```

That's all for today. The code is available on GitHub:

- [MEMENTO - SvelteKit & GitHub Pages](https://github.com/el3um4s/memento-sveltekit-and-github-pages)

The blog is visible at the address: [el3um4s.github.io/memento-sveltekit-and-github-pages](https://el3um4s.github.io/memento-sveltekit-and-github-pages/).

And this is my Patreon:

- [Patreon](https://www.patreon.com/el3um4s)
