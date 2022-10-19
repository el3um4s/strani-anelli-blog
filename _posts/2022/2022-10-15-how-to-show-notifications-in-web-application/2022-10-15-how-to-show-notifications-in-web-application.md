---
title: "How To Show Notifications in Web Application"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Volodymyr Hryshchenko**](https://unsplash.com/@lunarts)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-10-15 14:00"
categories:
  - javascript
  - svelte
  - typescript
  - html
  - css
tags:
  - javascript
  - svelte
  - typescript
  - html
  - css
---

In the last month I worked on my side project, a web application that allows you to encrypt and decrypt text messages ([DoCrypt.org](https://docrypt.org/)). It's still a work in progress, but I've already implemented some features I'd like to share. I think it's an interesting project, and I intend to dedicate a few posts to it. For now, I want to focus on one feature I've recently implemented: notifications.

### The issue

I want to visually confirm the success of some operations. In particular, the action of "copying to the device clipboard" of the encrypted text. This is a feature I have implemented to allow users to copy ciphertext to an external application, such as a text message. For this reason, I decided to implement a notification confirming the copy to the device clipboard.

Visually, this is the result I want to achieve:

![copied-to-clipboard.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-10-15-how-to-show-notifications-in-web-application/copied-to-clipboard.gif)

As you can see, the notification is a small bar that appears at the top right. The bar is green, and contains a text message. The bar remains visible for a short time, and then disappears. The interesting thing is that I can use the same method to show different notifications, of different colors and with different messages.

### I create a notification store

To solve this problem I used a [Svelte](https://svelte.dev/) component. The idea behind it is not mine, I was inspired by this [@kevmodrome](https://twitter.com/kevmodrome) [repl](https://svelte.dev/repl/2254c3b9b9ba4eeda05d81d2816f6276). I customized everything according to my needs.

I need two things: an html element to use on the screen to show notifications, and something that keeps track of the notifications themselves and their life cycle. I begin with this aspect. And to solve it I use a [store](https://svelte.dev/docs#run-time-svelte-store).

I create the `Notification.ts` file and start by setting up some interfaces and creating a simple store:

<script src="https://gist.github.com/el3um4s/8f2eebac72046fdfbf0afe7e45bd108b.js"></script>

As you can see, I have created a `Msg` interface which represents a notification. The notification has a type, which can be `default`, `danger`, `warning`, `info` or `success`. The type of notification determines the color of the bar. The message is the text that is shown in the bar. Finally, the timeout is the time that the notification remains visible. If not specified, the default is 3000 milliseconds.

For each notification I assign an ID; I need a unique identifier to be able to interact with the notification itself at a later time. I cannot use a counter based on the length of the array, because I could cancel a notification and then the counter would no longer be valid. For this reason, I use the `idGenerator()` function to generate a unique ID.

<script src="https://gist.github.com/el3um4s/71144d816514601942c9bd2682307eaf.js"></script>

So I need a method to add notifications to the store:

<script src="https://gist.github.com/el3um4s/43b3c019d993ad2ac43a6bc65e32fa81.js"></script>

I use the store's `update()` method to add a new notification to the array. The `update()` method accepts a function that receives the current state of the store, and returns the updated state. In this case, I add a new notification to the array.

I am interested in passing the id explicitly because there may be cases in which I am interested in accessing the notification from outside the component. If instead I choose not to pass the id, then I generate it internally.

Now I need a method to remove a notification from the store:

<script src="https://gist.github.com/el3um4s/9576f7ec03368172dab28d362b0121b1.js"></script>

I use the `update()` method, combined with the [filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method, to remove the notification from the array.

To manage the disappearing notifications I need a timer, or something similar. I use [SetTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) method:

<script src="https://gist.github.com/el3um4s/4c8ace0a52917a09be9c256048727210.js"></script>

Combining it all I get the complete `Notification.ts` file:

<script src="https://gist.github.com/el3um4s/27248af596212619ba145e828d306ba7.js"></script>

Having fixed the store part, I move on to the component part.

### I create a component for display notifications

I create the `Notification.svelte` file and start importing the store:

<script src="https://gist.github.com/el3um4s/c2148b0894fba6bec33824a751e437e4.js"></script>

To access the store values ​​I can use the [reactive `$store` syntax](https://svelte.dev/docs#component-format-script-4-prefix-stores-with-$-to-access-their-values). Also to show all the values ​​contained in the store, I use [`{#each...}`](https://svelte.dev/docs#template-syntax-each):

<script src="https://gist.github.com/el3um4s/f67d7ecba184c9d8f6a88932d441d3a2.js"></script>

As you can see, I use the `each` method to iterate over all the store values. For each value, I create a div with the notification text.

The per component is complete, but I'm interested in adding some style to make it juicier.

<script src="https://gist.github.com/el3um4s/d99310c202efc6a855301cf7c196be58.js"></script>

This way I show the notifications at the top right of the screen, one above the other.

But how do I show the notifications in a different color depending on the type? To do this, I add a class to the `toast` div based on the notification type and an object to use as a color reference:

<script src="https://gist.github.com/el3um4s/45c50a99dd198ef1fe1aa336d2f41c16.js"></script>

I can make it more beautiful by adding an animation to highlight the appearance and disappearance of notifications. To do this I use [svelte/transition](https://svelte.dev/docs#run-time-svelte-transition) and [svelte/animate](https://svelte.dev/docs#run-time-svelte-animate):

<script src="https://gist.github.com/el3um4s/705a7300461a0015e31a946aeb80e905.js"></script>

By combining it all I finally get my `Notification.svelte` component:

<script src="https://gist.github.com/el3um4s/39a3dc7d34ee48f65da9d0ade990c9ab.js"></script>

Now all that remains is to use it in our app.

### I add the component to the pages

To add the component to the pages, I need to import it into the `App.svelte` file:

<script src="https://gist.github.com/el3um4s/64eda6fe1caad25268e57bf5d1e5fcbf.js"></script>

I only need to import it once, on the main page of the app. This way I can show a notification starting from any page of the app.

For example, to show a notification when I have copied the ciphertext, I add the following code to the component:

<script src="https://gist.github.com/el3um4s/6edde7ccdf5658e10c2c9f1b7f085553.js"></script>

![copied-to-clipboard.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-10-15-how-to-show-notifications-in-web-application/password-deleted.gif)

Or, if I want to show a notification of a different color, I just need to change the `type` of the message:

<script src="https://gist.github.com/el3um4s/07a41311e7ba58dd9668b519d5a3e0c2.js"></script>

Well, that's all for now. If you want to see the full code, you can find it on [GitHub](https://github.com/el3um4s/docrypt). The application is available on [docrypt.org](https://docrypt.org/).
