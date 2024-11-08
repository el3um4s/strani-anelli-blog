---
title: Achieving 100% Child Div Height Without Specifying Parent's
description: Flexbox Techniques for Responsive Height in Nested Divs.
published: true
date: 2023-12-08 23:30
categories:
  - CSS
tags:
  - CSS
lang: en
cover: image.webp
---

A brief note to remind my future self how to use CSS to make an element occupy all available vertical space without having (or being able) to set the size of the parent element.In other words, given an element `main` with unknown dimensions, make the `div` height 100% of `main`.

![Immagine](./schema.webp)

```css
main {
  display: flex;
  /* align-content: center;
  justify-content: center; */
  flex-direction: column;
  align-items: stretch;
}

div {
  height: 100%;
}
```

This is the expected outcome:

![c3 gif](./c3.gif)

And these are the styles used (with a touch of TailwindCSS):

```css
main {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  align-items: stretch;
}

.card {
  padding: 2rem;
  top: 0;
  left: 0;
  padding: 2em;
  height: 100%;
}

button {
  width: 100%;
  height: 100%;
  @apply border rounded-full border-indigo-600 relative items-center justify-center overflow-hidden bg-slate-100 text-lg font-medium text-indigo-900 shadow;
}

button:hover {
  @apply border-amber-600 delay-150 duration-500 bg-amber-200 text-amber-800 ease-in-out;
}

button:active {
  @apply shadow animate-ping;
}
```
