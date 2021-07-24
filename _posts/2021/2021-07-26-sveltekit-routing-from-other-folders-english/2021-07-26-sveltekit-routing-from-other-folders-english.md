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


The trick is to "map" all blog posts and keep them as "modules". Then I use [Vite](https://vitejs.dev/) to dynamically import the modules into the blog. To test I don't create a new repository. I continue modifying the [MEMENTO SvelteKit & GitHub Pages](https://github.com/el3um4s/memento-sveltekit-and-github-pages): I add a `src/news` folder in which to insert the various posts.

I use a structure similar to the one I will need in my blog. So the posts will be divided by year but not by month. Each post will stay in a folder whose first few characters represent the publication date. Inside the folder I will put the images I will need and an `index.md` file with the post. I think in the future I will have to add the ability to use markdown files with other names. That's enough for the moment.

Every post will be in a path similar to:

```
root: /src/news/2021/2021-07-26-sveltekit-routing-from-other-folders/index.md
```

Also, I want to index the various posts. I change the `src/routes/index.svelte` file.

### index.svelte

First, I need the list of all markdown files contained in the `news` folder. I use a function of Vite, `globEager`:

```js
const allPosts = import.meta.globEager(`../news/**/*.md`);
```

With this code I get all the `md` files as modules. Then I go through every post I have found and I extract some data

``` js
for (let path in allPosts) {
    // ...
}
```

I need the post module

```js
const post = allPosts[path];
```

And I need the metadatas (extracted from the markdown frontmatter):

```js
const metadata = post.metadata;
```

I put all in an array (`body = []`). Then I pass `body` to the page with a `load()` function:

```html
<script context="module">
    const allPosts = import.meta.globEager(`../news/**/*.md`);
    let body = [];
    for (let path in allPosts) {
        const post = allPosts[path];
        const metadata = post.metadata;
        const p = {
            path, metadata
        }
        body.push(p); 
    }

    export const load = async () => {
        return { props: {posts: body} }
    }
</script>
```

Now I add the html side in `index.svelte`:

```html
<script lang="ts">
    import { base } from '$app/paths';
    export let posts;
</script>

<h1>News</h1>

<ul>
    {#each posts as {slugPage, metadata: {title, slug}} }
        <li>
            <a href={`${base}/${slug}`} >{title}</a>
        </li>
    {/each}
</ul>
```

I can also play with frontmatter. I can use the folder name if I don't define a slug in the frontmatter. I extract the name of the folder minus the date:

```js
    for (let path in allPosts) {
      //...
        const namePage = path.split('/');
        const slugPage = namePage[namePage.length-2].slice(11);
        const p = {
            path, metadata, slugPage
        }
        body.push(p); 
    }
```

Then I define the helper function:

```js
function linkSlug(s:string | undefined, p: string): string {
    let result = "";
    if ( !s) {
        result = p
    } else {
        result = s;
    }
    return result;
}
```

And I change the html code:

```html
<a href={`${base}/${linkSlug(slug, slugPage)}`} sveltekit:prefetch >{title}</a>
```

### [slug].svelte

Once I have fixed the home page, I have to understand how to access the various posts using a simplified slug. I need a [dynamic parameter](https://kit.svelte.dev/docs#routing-pages). So I create the `src/routes/[slug].svelte` component.

I have to import the various posts. But this time I also import the modules of the various posts:

```js
    export const ssr = false;
    const allPosts = import.meta.globEager(`../news/**/*.md`);
    let body = [];

    for (let path in allPosts) {
        const post = allPosts[path];
        const metadata = post.metadata;
        const pathArray = path.split('/');
        const slugPage = pathArray[pathArray.length-2].slice(11);

        const p = {post, slugPage, metadata };

        body.push(p);
    }
```

Now I filter the various posts to extract what I want to show:

```js
export const load = ({page}) => {
    const posts = body;
    const { slug } = page.params;

    const filteredPosts = posts.filter( (p) => {
        const slugPost = p.metadata.slug;
        const slugToCompare = !slugPost ? p.slugPage : slugPost;
        return slugToCompare.toLowerCase() === slug.toLowerCase();
    } );

    return {
        props: {
            page: filteredPosts[0].post.default,
        }
    }
}
```

The component itself is very simple:

```html
<script>
    export let page;
</script>

<svelte:component this={page}/>
```

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

