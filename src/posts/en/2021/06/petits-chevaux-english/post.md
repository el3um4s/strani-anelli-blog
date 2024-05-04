---
title: Petit Chevaux (English)
published: true
date: 2021-06-07 11:30
categories:
  - Construct 3
  - JavaScript
  - Svelte
  - TypeScript
tags:
  - Construct
  - JavaScript
  - Svelte
  - TypeScript
  - petits-chevaux
cover: cover.webp
lang: en
description: This week I completed the Svelte course. Now I can start experimenting. I'd like to recode my blog and my template repository with SvelteKit. However, there are some problems related to the folders structure. For the moment I have not decided yet.
---

This week I completed the Svelte course. Now I can start experimenting. I'd like to recode my blog and [my template repository](https://github.com/el3um4s/construct-demo) with [SvelteKit](https://kit.svelte.dev/). However, there are some problems related to the folders structure. For the moment I have not decided yet.

![animation](./showcase-c3-projects.gif)

Better to start with a more limited project. I wanted to understand how to make an html page communicate with a Construct 3 project inserted in the page itself. My idea is to explore the possibility of transparently integrating small games into a larger project using C3 for the dynamic part and Svelte for data management. To test my idea I chose a very simple game, **Petits Chevaux**:

![animation](./animation.gif)

As seen in the GIF, the app consists of two different parts. The central part, the one with the concentric circles and the spinning balls, is created with C3. But the button on the right and the table on the left are in HTML. Data is passed to and from C3 via the [Window.postMessage() API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

I start with the Construct 3 code. In the `main.js` file I insert the `attachListeners` function

```js
import { attachListeners } from "./postMessage.js";

runOnStartup(async runtime => {
	globalThis.g_runtime  =  runtime;
	runtime.addEventListener("beforeprojectstart", () => attachListeners());
});
```

I use this function to create an interface to allow communication to and from the page hosting the game.

The `postMessage.js` file contains some functions. The main ones are 3:

- `attachListeners`
- `getMessage`
- `sendMessage`

`attachListeners` adds a simple observer to the `message` event

```js
function attachListeners() {
	if (globalThis.addEventListener) {
		globalThis.addEventListener("message", getMessage, false);
	} else {
		globalThis.attachEvent("onmessage", getMessage);
	}
}
```

When the page receives a `message` event it executes the `getMessage` function:

```js
function getMessage(e) {
	if( !trustedOrigin.includes(e.origin)) {
		console.log("Error, wrong origin");
	} else {
		const message = e.data;
		const messageType = message.type;
		const messageContent = message.content;

		match(messageType)
      .on(t => t.toLowerCase() === "set", () => getMessageSet(messageContent))
		  .on(t => t.toLowerCase() === "status", () => getMessagePlay(messageContent))
      .otherwise(t => () => 0);
	}
}
```

The event contains a lot of information, the most useful in this case are `event.origin` and `event.data`.

`event.origin` allows us to control the page that originated the message. If it is a trusted page then we read the content of the message and decide what to do. The message is contained in  `event.data`. To make it easier, I decided to use a standard for sent and received messages. They are all objects with `type` and `content` properties.

The third function is `sendMessage`:

```js
function sendMessage(message) {
	const targetWindow = globalThis.parent;
	targetWindow.postMessage(message, "*");
}
```

Through this function we can send a message to another page, to another window or to an iFrame element. Since I will be using the game inside an iFrame I send the message to `Window.parent`.  `Window.parent` is the page that contains the iFrame with the game code. However, it is advisable to use [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) to ensure greater compatibility with the Construct 3 features.

Once the C3 code has been fixed, it's time to move on to the page that will host the game. The code is basically the same with one small difference: `sendMessage` will send the message to an iFrame instead to the parent.

```ts
export interface Message {
    type: string;
    content: string;
}

export function sendMessage(iframe: HTMLIFrameElement, 
                            message: Message, 
                            targetOrigin: string = "*") {
    iframe.contentWindow.postMessage(message, targetOrigin);
}
```

Because I am using Svelte I have created a `Construct.svelte` component:

```html
<script lang="ts">
    export let construct3: HTMLIFrameElement;
    const src = "./c3/game.html"
</script>

<iframe title="C3" bind:this="{construct3}" {src} scrolling="no" noresize="noresize" /> 
```

To allow the application to read the iFrame I have inserted a `construct3` prop. In `App.svelte` I write:

```html
<script lang="ts">
  import { onMount } from "svelte";
  import { attachListeners, sendMessage } from "./PostMessage/postMessage";

  import Construct from "./Construct/Construct.svelte";

  let construct3: HTMLIFrameElement;

  onMount(() => {
    attachListeners();
  });
</script>

<Construct bind:construct3 />
```

This way the `construct3` variable is linked to the iFrame of the game. I can use it to send commands. I can, for example, make a new spin of the wheel by pressing a button using a code similar to this:

```html
<script>
  function spin() {
    sendMessage(construct3, {
      type: "status",
      content: "SPIN"
    }, "*");
  }
</script>

<button  on:click={spin}>Spin</button>
```

To show the complete code I created a new repository ([el3um4s/petits-chevaux](https://github.com/el3um4s/petits-chevaux)) and a page on [Itch.io](https://el3um4s.itch.io/petits-chevaux).

The Construct 3 file code is also uploaded to the usual GitHub repository:

- [the project on GitHub](https://github.com/el3um4s/construct-demo)
- [la demo online](https://el3um4s.github.io/petits-chevaux/)
- [the online demo](https://www.patreon.com/el3um4s)