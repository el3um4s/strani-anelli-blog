---
title: "Electron seamless titlebar with Svelte and Tailwind (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-10-02 22:00"
categories:
  - Svelte
  - Tailwind
  - GitHub
  - TypeScript
tags:
  - NPM
  - GitHub
  - TypeScript
  - Svelte
  - Tailwind
---

After some testing I decided not to use the windows that Electron creates by default. I decided to create my own titlebar, with Windows-style control buttons. There are many tutorial guides on the internet. I was inspired by a [Ronnie Dutta](https://github.com/binaryfunt/electron-seamless-titlebar-tutorial) project.

### Update the dependencies

A little note before starting with this post. I'm not starting from scratch but I still use my [el3um4s/memento-svelte-electron-typescript](https://github.com/el3um4s/memento-svelte-electron-typescript) template. At first, as usual, I make sure I have all the dependencies updated to the latest version:

```bash
npm run check-updates
```

### Create a window without a titlebar

First I create a window without a titlebar by setting the `frame` property to `false`:

<script src="https://gist.github.com/el3um4s/6443efe4986b3aeff54f6446c2aa7d23.js"></script>

### Add basic styles

For aesthetic reasons I add some basic styles to the `tailwind.pcss` file:

<script src="https://gist.github.com/el3um4s/37a699789d5dbb514f0cc08b34107fcb.js"></script>

The only odd class is `overflow-y-hidden`. It is used to hide the scrollbar from the Electron window. I'll be using a custom scrollbar attached to the main section of the page.

When I start the app (with `npm run dev`) I get a window like this:

{% include picture img="first-test.webp" ext="jpg" alt="" %}

What's the problem? A window without a titlebar has no close buttons and cannot be moved. It's time to add a custom titlebar.

### Add a custom titlebar

Doing some testing the best way seems to be to create a component `src/frontend/Componentes/MainWithTitlebar.svelte` in which to insert both the titlebar and the main section of the page.

I write the basic code:

<script src="https://gist.github.com/el3um4s/8afe3657895cc7fa87a48cab6feb6bd8.js"></script>

Then I add the component to `App.svelte`:

<script src="https://gist.github.com/el3um4s/59aa957fc312b83c4b82d7a2502f3e02.js"></script>

Obviously this does not cause any visible changes. I need to add some styles to my component:

<script src="https://gist.github.com/el3um4s/4e1888d74c346b43d5a39d3942527956.js"></script>

I set the header height to 32px using Tailwind's `h-8` class and set the underlying page height accordingly:

<script src="https://gist.github.com/el3um4s/7e5e07aaf82a40b4ce523d1248d5d7f2.js"></script>

{% include picture img="first-test.webp" ext="jpg" alt="" %}

It is not enough to set a titlebar to be able to move a window. Fortunately, Electron allows you to enable this possibility quite easily. Just add the CSS style `-webkit-app-region: drag`:

<script src="https://gist.github.com/el3um4s/2f420e9c3ad3a368a3f2201ddc08500d.js"></script>

### Add window control buttons

Now the window can move. But I also want to be able to close, minimize and zoom it. I need some buttons:

<script src="https://gist.github.com/el3um4s/0708583f337002113aa71cadb4fa916c.js"></script>

I set the button area as `no-drag` to make it easier to click on the buttons. And speaking of buttons, in the code above I used some writing but maybe it's better to use icons. Tailwind allows you to easily use [heroicons](https://heroicons.com/) icons. I take advantage of it and create some Svelte components to display the icons. This, for example, is the `IconClose.svelte` component:

<script src="https://gist.github.com/el3um4s/585ba2db41b66483c229beaebb507ecc.js"></script>

After creating the icons I insert them in the titlebar:

<script src="https://gist.github.com/el3um4s/23b0c576a7616c3b728d352ccd9a8053.js"></script>

### Add the title to the window

There can be several ways to add the title to a window. A simple way is this:

<script src="https://gist.github.com/el3um4s/2be19e12115b56017b6004f3c349ee08.js"></script>

{% include picture img="3-test.webp" ext="jpg" alt="" %}

### Customize the scrollbar

Electron shows the Chrome scrollbar by default. I can change its style with some CSS code:

<script src="https://gist.github.com/el3um4s/674dc3de7b48a7f4d1a407f9fe8c610a.js"></script>

This is the result:

{% include picture img="4-test.webp" ext="jpg" alt="" %}

### Enable buttons

Nothing happens if I click on the buttons, also because I haven't added any functions. I resolve immediately:

<script src="https://gist.github.com/el3um4s/f783ec055881af05c72acd6a23b4ba74.js"></script>

Obviously the functions must be filled with code. What can I use? I need to use a specific API. I create the `src/electron/IPC/windowControl.ts` file:

<script src="https://gist.github.com/el3um4s/d6c2266faeaf0f1f0bf68a7be3107a3b.js"></script>

Register the new API on `src/electron/preload.ts`:

<script src="https://gist.github.com/el3um4s/baae5866ca09494ebff6bc628b67dd9e.js"></script>

Finally I allow the main Electron window to use the API. I edit the `src/electron/index.ts` file:

<script src="https://gist.github.com/el3um4s/2029d942a156f2e4ab4819bbd7a98414.js"></script>

This allows me to go back to the component I'm working on (`MainWithTitlebar.svelte`) and add the missing functions:

<script src="https://gist.github.com/el3um4s/7f7f446baa1d4629c890fa90232c89cb.js"></script>

Now I can use the various buttons to minimize, maximize and close the window.

### Reset the window size

However, there is an anomalous behaviour. When I maximize the window I would like to replace the `maximize` icon with another one. And maybe when I click I can restore the original window size.

To achieve this I can take advantage of the [`<svelte:window>`](https://svelte.dev/docs#svelte_window) element. By inserting it into my Svelte component I can intercept some events related to the window without leaving the component itself.

Why do I have to do this? Because I haven't found an easier way to tell when the window is full screen. Then I have to use a trick: I check the size of the window. If the window is at least as big as the screen then I assume it is maximized. Otherwise no.

<script src="https://gist.github.com/el3um4s/7ee2c2a7e78cbd004f58bb1a1a93e479.js"></script>

In Svelte, [`$:` marks a statement as reactive](https://svelte.dev/docs#3_$_marks_a_statement_as_reactive): this greatly simplifies the necessary code.

Now I just have to add the function:

<script src="https://gist.github.com/el3um4s/506e4d6db1ce281247dca055d4d002e9.js"></script>

and then:

<script src="https://gist.github.com/el3um4s/3892de7afe77ec25a704903db7b8db52.js"></script>

### Link

That's all. Finally some useful links:

- the project on GitHub: [el3um4s/memento-svelte-electron-typescript](https://github.com/el3um4s/memento-svelte-electron-typescript)
- my Patreon: [patreon.com/el3um4s](https://patreon.com/el3um4s)
- [Svelte](https://svelte.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [ElectronJS](https://www.electronjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
