---
title: "Using Tailwind With Svelte and Construct 3"
subtitle: "A Step-by-Step Guide to Tailwind CSS Integration in Svelte Projects."
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2023-12-10 22:45"
categories:
  - css
  - construct
  - typescript
  - svelte
tags:
  - css
  - construct
  - typescript
  - svelte
---

After resuming playing with Svelte, TypeScript, and Construct 3, it's time to add [Tailwind CSS](https://tailwindcss.com/) to my test project. I've previously covered this topic in 2021 ([Tailwind CSS & Svelte](https://blog.stranianelli.com/tailwind-and-svelte/)), but a few years have passed since then. There's a LogRocket tutorial ([How to use Tailwind CSS with Svelte](https://blog.logrocket.com/how-to-use-tailwind-css-svelte/)) updated in July 2023, but in my opinion, it doesn't present the best solution. Consequently, here are my notes on how to add Tailwind CSS to a Svelte project.

I resume the project from a few days ago ([this one](https://blog.stranianelli.com/using-typescript-and-svelte-in-construct/)) and navigate to the folder with the Svelte code using the terminal. I enter the following command in the terminal:

```bash
npm install -D tailwindcss@latest postcss@latest
```

This command adds Tailwind and [PostCSS](https://postcss.org/) packages to Svelte. Then I add [Autoprefixer](https://www.npmjs.com/package/autoprefixer):

```bash
npm install -D autoprefixer@latest
```

And finally, I can initialize Tailwind with the command:

```bash
npx tailwindcss init -p
```

{% include picture img="npx-tailwind-init.webp" ext="jpg" alt="npx-tailwind-init" %}

This command creates two files:

- `tailwind.config.js`
- `postcss.config.js`

I start by modifying `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
  content: ["./index.html", "./src/**/*.{svelte,js,ts}"], //for unused css
};
```

I add some elements to `content` to remove unused CSS styles from the project.

I also modify the `postcss.config.js` file:

```js
import tailwind from "tailwindcss";
import tailwindConfig from "./tailwind.config.js";
import autoprefixer from "autoprefixer";

export default {
  plugins: [tailwind(tailwindConfig), autoprefixer],
};
```

I have two ways to allow Svelte to use Tailwind styles. The first is to create a `TailwindCSS.svelte` component:

```html
<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
```

And import it into `App.svelte`:

```html
<script>
  import TailwindCss from "./lib/TailwindCSS.svelte";
</script>

<TailwindCss />
```

However, while effective, this is not my preferred method. I prefer creating a separate file and importing it directly as a stylesheet. To do this, I create the `tailwind.pcss` file (I save it in the `css` folder for convenience):

```css
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

Then I import the file in `App.svelte`:

```html
<script lang="ts">
  import "./css/tailwind.pcss";
</script>
```

{% include picture img="svelte-app-and-tailwind.webp" ext="jpg" alt="svelte-app-and-tailwind" %}

No need to import anything into the various components. I can add styles directly in the component

{% include picture img="counter.webp" ext="jpg" alt="counter" %}

To preview the page, I use the command:

```bash
npm run dev
```

![c3 gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2023/2023-12-10-using-tailwind-with-svelte-it/preview.gif)

And to obtain compiled files, I use the command:

```bash
npm run build
```

I can also delete the `app.css` file and remove the reference from `main.ts`:

```ts
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
```
