---
title: "How To Interact With Google Chart"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-02-10 11:00"
categories:
  - Charts
  - JavaScript
  - Svelte
  - TypeScript
  - Medium
tags:
  - Charts
  - JavaScript
  - Svelte
  - TypeScript
  - Medium
---

A few days ago [Corey Thompson](https://github.com/thompcd) added events to the charts of my previous tutorial. I admit that I have deliberately left the subject. However, I took advantage of the question to investigate a little deeper on how to make the various graphs more interesting.

First of all, here's what I want to achieve:

![charts-events-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-02-09-aggiungere-eventi-a-google-charts/charts-events-01.gif)

In summary, these are two different actions. The first allows you to change the zoom of the scatter plot using two sliders. The second event allows you to retrieve the data of the selected item and display some additional information. But before you can do this, you need to clean up the code.

### Clean up the code

In this post I continue the tutorial from a few weeks ago:

- [Visualize Your Medium Stats With Svelte and JavaScript](https://betterprogramming.pub/visualize-your-medium-stats-with-svelte-and-javascript-eb1ef7c71a63)

All the code, from this tutorial and the previous ones, is available in the repository

- [el3um4s/medium-stats](https://github.com/el3um4s/medium-stats)

Compared to the first part, I changed the structure of the project to simplify.

First I decided not to pass the data through `props` but to use a [Svelte store](https://svelte.dev/docs#run-time-svelte-store). In this way I can group all methods more logically, simplifying their modification and eliminating duplicates.

I create the `StorePartnerProgram.ts` file and start importing the TS types I need, as well as the `writable` module:

<script src="https://gist.github.com/el3um4s/9e3b5acdee2b08b0594094d812c608d1.js"></script>

I create the store and prepare it for export:

<script src="https://gist.github.com/el3um4s/cf4dc1b5af40f3ebc35b4ab0cea33b34.js"></script>

So I group all the various methods I have already talked about in new files and import them:

<script src="https://gist.github.com/el3um4s/06c6c8281e8eb8d569409f9313e16ad4.js"></script>

Finally I add the various methods to the store:

<script src="https://gist.github.com/el3um4s/a41dd01e6710ba6eea407efaad2015ea.js"></script>

After incorporating the various methods in `partnerProgram` I can call them directly from the various components.

For example, I can get the list of articles of the month by simply writing:

<script src="https://gist.github.com/el3um4s/f9b31ef486c774327b5621a63e21af43.js"></script>

### Change the zoom of the scatter plot

After cleaning up the code I can start thinking about how to improve the various graphics. The first thing I need is something to see in more detail the relationship between the length of the various posts and their yield. I think the best solution may be to add two sliders, one horizontal, the other vertical.

![charts-events-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-02-09-aggiungere-eventi-a-google-charts/charts-events-02.gif)

The first thing is to understand how to create the two sliders. We can have fun creating them from scratch or rely on something ready. For the moment I have chosen the easy way. On the Internet you can find several interesting components. I decided to use [Simon Goellner's Range Slider](https://github.com/simeydotme/svelte-range-slider-pips).

I install the component in my project using:

```bash
npm install svelte-range-slider-pips --save-dev
```

Then I import the component into `GoogleChartScatter.svelte`:

<script src="https://gist.github.com/el3um4s/6c2bfe0bd3aa9bea78993f36dd7275f2.js"></script>

I can use it easily:

<script src="https://gist.github.com/el3um4s/99867c8d49fc96579fbdf5eb8e040821.js"></script>

There are some points to understand. I need to set the range of numbers. It is better to calculate them immediately so that you can return to the original view later:

<script src="https://gist.github.com/el3um4s/d89b7b9d1c8223bdaab67ff6813814c8.js"></script>

The second point concerns how to intercept the two inputs. To do this I create an array with only two elements. The first indicates the smaller value, the second the greater:

<script src="https://gist.github.com/el3um4s/55da329314656d6ee67d30085ea81413.js"></script>

Then I just have to join the pieces, using the [bind:property](https://svelte.dev/docs#template-syntax-element-directives-bind-property) directive to... bind the values:

<script src="https://gist.github.com/el3um4s/4a09a9c765b340b0fb139e11e0a29bcb.js"></script>

This is for the sliders. I have to slightly modify the graph as well. Or, better, the `hAxis` and `vAxis` properties by binding them to the values of the sliders.

<script src="https://gist.github.com/el3um4s/49ef70fb5f6c4cc6dba8cae40e3ba073.js"></script>

### Add an event when we select a value in the chart

The second event allows me to see some additional information when I select an element in a chart. So I switch to the `GoogleChartPie.svelte` chart and start modifying it to get this:

![charts-events-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-02-09-aggiungere-eventi-a-google-charts/charts-events-03.gif)

To generate events within a Svelte component I use [createEventDispatcher](https://svelte.dev/docs#run-time-svelte-createeventdispatcher):

<script src="https://gist.github.com/el3um4s/5b64b16f9b5cff25f1f1707cf3b677be.js"></script>

I can create an event linked to the selection of an element using:

<script src="https://gist.github.com/el3um4s/38b4fdeae28b648ce206e4b18a0fe5dc.js"></script>

I use the Google Chart [select event](https://developers.google.com/chart/interactive/docs/events#the-select-event) to retrieve the values to pass out of the component.

Before going on, a note on the events of Google Charts. There are 3 events that can be called from (almost) any chart:

- `select`
- `error`
- `ready`

But if we want to use other events we have to register them. For example to listen for the `on mouse over` event:

<script src="https://gist.github.com/el3um4s/c4f6180f8d751cc7aec24874a4ca113c.js"></script>

Or the `onmouseout` event:

<script src="https://gist.github.com/el3um4s/5a86bb8e38acc577c5a7607c9cdee57b.js"></script>

### Show a preview of the story

What I want to get is a quick way to figure out which story a data is referring to. To do this, I also pass the ID of the story to the graph:

<script src="https://gist.github.com/el3um4s/fb2594c8f948c2db20d07720ef88b05f.js"></script>

I can then edit the component in the `MonthlyAmounts.svelte` file

<script src="https://gist.github.com/el3um4s/dff5b580dc77efe7c1540ac1040254ab.js"></script>

To get the post data starting from its ID I use the `getStoryById` function:

<script src="https://gist.github.com/el3um4s/4fc5a5eb0ef4204ba46992e67dc2695d.js"></script>

To preview I created a `CardStory.svelte` component:

<script src="https://gist.github.com/el3um4s/6912fb7f84ba0893410f3e621224dd4f.js"></script>

I can use this component on the various pages by simply passing it the history data to show:

<script src="https://gist.github.com/el3um4s/81db024199c2bc28719acdcc11dce3f5.js"></script>

Well, that's it for today.
