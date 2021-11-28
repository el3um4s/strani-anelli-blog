---
title: "How to Create an Accordion Element with Svelte and Tailwind"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Yan Krukov**](https://www.pexels.com/@yankrukov)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-11-28 20:00"
categories:
  - Svelte
  - SvelteKit
  - Components
  - Documentation
tags:
  - Svelte
  - SvelteKit
  - Components
  - Documentation
---

Sooner or later I will have to find the time to report what I am learning in these months. For example, that it is very difficult to predict how long it will take to complete a task.

My last idea (creating an automatic system to document Svelte components) is longer than I expected. The technique is not very complicated but there are too many details that I had not foreseen. Also my desire to understand how things work is leading me to take a long time to recreate some basic elements. The last in chronological order is the **accordion**: an element that you can be open and close with a click.

### What I want to build

![accordion-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-11-27-how-to-create-an-accordion-element/accordion-01.gif)

Something simple, which does not depend on other libraries. Something which is quite light and customizable. [Svelte](https://svelte.dev/) makes it very easy to create. And [TailwindCSS](https://tailwindcss.com/) allows you to manage CSS styles.

### Let's start from the structure

<script src="https://gist.github.com/el3um4s/de7f80d943110abd719863ac17e68adf.js"></script>

The basic structure is very simple, there are only 2 parts:

- one to use as the component **header** to insert the section title;
- the other is a simple **slot**: you can hide and show the content.

Of course, without adding any CSS styles or actions, the result is quite disappointing:

{% include picture img="accordion-02.webp" ext="jpg" alt="" %}

### Let's add some styles

I add some styles to highlight the title of the element and its margins. For this component I want to use a monochrome style. I am attracted to this kind of use of colors, but that's another story.

So I start by coloring the title:

<script src="https://gist.github.com/el3um4s/009e1229a41ae198d1b5b49c90e081a7.js"></script>

{% include picture img="accordion-03.webp" ext="jpg" alt="" %}

I can't add a css style to the _slot_. But I can put it in a _div_ and stylize that:

<script src="https://gist.github.com/el3um4s/87b74358db16d1a18a06be7f3d02d80a.js"></script>

{% include picture img="accordion-04.webp" ext="jpg" alt="" %}

### Open and close

Svelte allows you to hide and display an element of the page in a very simple way. Using a simple `if...then...else` condition tied to a _prop_ I can check its status:

<script src="https://gist.github.com/el3um4s/fe918e7fed23086238b6d4c54726ae54.js"></script>

{% include picture img="accordion-05.webp" ext="jpg" alt="" %}

### Let's add a rotating icon

I need a way to open the element with a click. To do this, I need a button and an animation to highlight the click. I found the video by [Johnny Magrippis](https://magrippis.com/) ([How to: Svelte Hamburger Menu Animation 🍔](https://www.youtube.com/watch?v=fWzKPUUQdQY)):

<iframe width="560" height="315" src="https://www.youtube.com/embed/fWzKPUUQdQY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I recommend watching the video. To begin with, I need another component, Chevron.svelte, in which to insert an `svg` image:

<script src="https://gist.github.com/el3um4s/a9803acb87f1027a836679544a656d57.js"></script>

I'd like to add a few styles to integrate it into the title of the main component:

<script src="https://gist.github.com/el3um4s/6e222eb8feec49b106e70e35b72085b5.js"></script>

{% include picture img="accordion-06.webp" ext="jpg" alt="" %}

The purpose of this icon is to be a button: when clicked, it opens or closes the underlying part of the accordion. So I put it in a `button` element and add two `props` to it:

<script src="https://gist.github.com/el3um4s/4a3f04f1df52f50a53810d5fe3e0095a.js"></script>

I use the `open` prop as a CSS class. In this way, when the element is open, I can change the icon. I want to rotate it 180 degrees. So I add some CSS styles useful for this purpose:

<script src="https://gist.github.com/el3um4s/6909f222a7b35278668bc8a30553d1e6.js"></script>

![accordion-07.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-11-27-how-to-create-an-accordion-element/accordion-07.gif)

### Let's add an action to the component

Now that the icon does its job I can go back to the main component and insert an action:

<script src="https://gist.github.com/el3um4s/73e14a761de4a3a24718b9784a7fe347.js"></script>

By clicking on the icon, I can finally open and close the accordion:

![accordion-08.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-11-27-how-to-create-an-accordion-element/accordion-08.gif)

### Let's add a transition

The component works but it is not very nice to see a part of the page suddenly appear and disappear. To fix this I can use one of Svelte's features, the [transitions](https://svelte.dev/docs#svelte_transition):

<script src="https://gist.github.com/el3um4s/0aaaa88a775a787c1662c8686200a4db.js"></script>

And here is the final result:

![accordion-09.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-11-27-how-to-create-an-accordion-element/accordion-09.gif)

As always, the code is available and downloadable from GitHub:

- [el3um4s/svelte-component-info](https://github.com/el3um4s/svelte-component-info)
