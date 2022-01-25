---
title: "5 Charts Example To Get You Started"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-01-25 10:00"
categories:
  - Svelte
  - Chart
tags:
  - Svelte
  - Chart
---

The numbers explain the reality, but sometimes they are not clear. Series and reports are powerful but not always understandable tools. For this reason, it is often convenient to add a graphic to your pages. But how to do it? Well, today I try to explain the simplest way I have found to add charts to a web page.

### Introduction

Before, here's what I want to create:

![google-charts-with-svelte-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-01.gif)

There are 5 different charts but the procedure is very similar:

- a column chart
- a pie chart
- a treemap chart
- a scatter plot
- a calendar chart

In this tutorial I will be using data from the Medium Partner Program. I already used them a few days ago when I talked about how to [create responsive tables](https://betterprogramming.pub/how-to-create-responsive-data-tables-with-css-grid-9e0a37394450) with CSS. To see how to download and import statistics I recommend this post:

- [How to Get Medium Stats With JavaScript and Svelte](https://javascript.plainenglish.io/how-to-get-medium-stats-with-javascript-and-svelte-part-1-a1d08b96799e)

However, in summary, just go to [medium.com/me/stats?format=json&count=100](https://medium.com/me/stats?format=json&count=100) and download the page. Of course I can create graphs with any data, but to remind me of the process in the future I need some sample data.

### The toolbox

What do I need to easily create graphics with JavaScript, HTML and CSS? On the net you can find various libraries. The simplest one, in my opinion, is [Google Charts](https://developers.google.com/chart). As you can easily guess from the name, it is a Google library. Google defines it like this:

```
Google Charts provides a perfect way to visualize data on your website
```

The [quickstart page](https://developers.google.com/chart/interactive/docs/quick_start) explains how to create a pie chart. It is a good starting point but it is not the path I intend to follow. There is an easier way.

Searching on the net you can find the [Google Charts API web components](https://www.npmjs.com/package/@google-web-components/google-chart). This allows you to create a graph with a syntax similar to this:

<script src="https://gist.github.com/el3um4s/854eb9e50b51ad99b9268172b1832441.js"></script>

I can import the APIs into a project with the command:

```bash
npm i @google-web-components/google-chart
```

The second tool I intend to use is Svelte. [Svelte](https://svelte.dev/) allows you to easily create web apps. And, above all, it allows me to write some example code in a synthetic way.

Of course, it is possible to use any other framework, or even none. But Svelte simplifies the steps.

### How to create a column chart

I start with the first chart:

![google-charts-with-svelte-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-02.gif)

I start by creating a `GoogleChartColumn.svelte` component. First I import `@google-web-components/google-chart`:

<script src="https://gist.github.com/el3um4s/49c767f931dc416f9f85b71c98102ca7.js"></script>

Then I define the props. The [Google documentation](https://developers.google.com/chart/interactive/docs/gallery/columnchart) is well done and allows you to understand what can be used. For the moment I will limit myself to the basics:

- `data`: for the data to be displayed
- `options`: to configure some details of the graph

I am not interested in many options. I just need to be able to customize the title and decide the color of the various columns. Consequently the props become:

<script src="https://gist.github.com/el3um4s/01edbc6ee3567f1a14ecb99ea1b8d55c.js"></script>

The data is of a bizarre kind. Basically they are a matrix where the first row indicates the name and type of the columns:

<script src="https://gist.github.com/el3um4s/95bfbf39306e991229d8ef35ac5f8b1e.js"></script>

The following lines instead contain the actual data:

<script src="https://gist.github.com/el3um4s/20f9c4bb2e6d9f50defe079a5dfaece6.js"></script>

I add a variable for the configuration options:

<script src="https://gist.github.com/el3um4s/ecf943a202996fe47ecee8f3c33cd92e.js"></script>

Since I only use one dataset the legend is useless, so I set it as `none`. I also change the background color so it doesn't detach from the rest of the page (it's `transparent`). Finally I change the formatting of the chart title using the CSS properties.

The complete component code is:

<script src="https://gist.github.com/el3um4s/4fabd098e03ba65f968b4b0a811c15b8.js"></script>

But how can I actually use it in an HTML page? Like this:

<script src="https://gist.github.com/el3um4s/937b17bddb8b84fd141c5b092480a657.js"></script>

To get the data to insert I create the `earningPerMonth` function:

<script src="https://gist.github.com/el3um4s/d119ba276021377fc71ea57672033f36.js"></script>

Obviously this function must be modified according to your data.

### How to create a pie chart

![google-charts-with-svelte-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-03.gif)

Starting from this example it is possible to create other types of graphs. Obviously each has its own particular characteristics. Next is a pie chart.

I create the `GoogleChartPie.svelte` file

<script src="https://gist.github.com/el3um4s/e4df3588a5025bceb43ec336dbc7658a.js"></script>

The pie chart has the data split into two different props: `cols` and `rows`.

It also allows you to pass a numerical value (between 0 and 1) to decide the minimum width of the slices of the cake. For example, if I set `sliceVisibilityThreshold = 0.03` I will only be able to see categories that are at least 3% of the total. The smaller ones are grouped under `Other`.

The JavaScript function to get the data looks like this:

<script src="https://gist.github.com/el3um4s/ace4623349c4dc1f2c1e08a2e8cb9b04.js"></script>

Now I can insert the graphic on the page with:

<script src="https://gist.github.com/el3um4s/e9562420ffc9afbbedb4a8057a501866.js"></script>

Using the same code but changing the values passed to the props I can create different graphs on the same page:

{% include picture img="chart-pie.webp" ext="jpg" alt="" %}

### How to create a treemap chart

![google-charts-with-svelte-04.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-04.gif)

[Wikipedia](https://en.wikipedia.org/wiki/Treemapping) explains well what a treemap is:

```
In information visualization and computing, treemapping is a method for displaying hierarchical data using nested figures, usually rectangles.
```

I think the steps to follow are now clear. I create the `GoogleChartTreemap.svelte` file:

<script src="https://gist.github.com/el3um4s/3e269aeee7562a33f4ae89cb1c64b827.js"></script>

The specific [props](https://developers.google.com/chart/interactive/docs/gallery/treemap) are:

- `maxDepth`: The maximum number of node levels to show in the current view.
- `maxPostDepth`: How many levels of nodes beyond maxDepth to show in "hinted" fashion.
- `minColor`, `midColor` e `maxColor`

The function to extract and prepare the data looks something like this:

<script src="https://gist.github.com/el3um4s/9e6f3c6fc6aed96a278c4ff34df409be.js"></script>

The HTML code is

<script src="https://gist.github.com/el3um4s/7319bbcdce3aaf20a4a7685034ab0083.js"></script>

### How to create a scatter chart

![google-charts-with-svelte-05.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-05.gif)

The scatter plot allows you to see if there is any correlation between two data. In this example I tried to relate the length of the different posts (measured with the number of words) and the revenue from them. Also I have set a custom tooltip when we hover the mouse over the various points.

The code of the `GoogleChartScatter.svelte` component is similar to the above:

<script src="https://gist.github.com/el3um4s/1fd0b424576dccc48858803f88c51f49.js"></script>

There are 2 specific `props` for this graph:

- `axisY`: the title to show on the Y axis
- `axisX`: the title to show on the X axis

I also add the `tooltip: {isHtml: true}` option. What is it for? To be able to customize the tooltip of the various points using HTML and CSS.

The function to get the data for the chart is slightly different from the previous ones:

<script src="https://gist.github.com/el3um4s/3bda277bb09dead474734c9b04df0bc6.js"></script>

I add to the data a string containing some HTML code. This code is then rendered by the component and displayed as an HTML element of the page.

I can insert the graphic into an HTML page using

<script src="https://gist.github.com/el3um4s/2a04e49050b0559bf1698280226ced3e.js"></script>

### How to create a calendar chart

![google-charts-with-svelte-06.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-24-un-modo-semplice-per-creare-grafici-con-svelte/google-charts-with-svelte-06.gif)

The fifth chart is a calendar chart. It is used to view data on a calendar. The color intensity of the individual days indicates the relative amount per day. The classic example is the one shown in the GitHub profile:

{% include picture img="github-calendar.webp" ext="jpg" alt="" %}

Compared to the previous charts this one requires some CSS and a little trick. But first the code base:

<script src="https://gist.github.com/el3um4s/5956304bf471104e348b4ae0efabdd25.js"></script>

In this case I need only one additional props, `colorAxis`. It is an array of colors. By default the lowest value is represented by a white. After importing the component into the page, however, I noticed that it was blending into the background. So I decided to start with a stronger color:

<script src="https://gist.github.com/el3um4s/186f6e8ed23a300e7a2072395c4ea903.js"></script>

The function to prepare the data is similar to the previous ones, with obviously some small differences:

<script src="https://gist.github.com/el3um4s/bbcc4b46a8faadb31407930c85b33f2c.js"></script>

Good but not enough. There remains a problem related to the size of the graph. I don't know why but the component is too short for the calendar length. I then have to force the size using a CSS property:

<script src="https://gist.github.com/el3um4s/266a0b61c99bc1f709658d11578d8168.js"></script>

The height of the graph is also wrong. In this case I have to calculate it based on the number of years I want to show. First I have to figure out the number of years to show

<script src="https://gist.github.com/el3um4s/1b14a9ab8ebc3091279618e70424ecfa.js"></script>

Then I use the [style: property](https://svelte.dev/docs#template-syntax-element-directives-style-property) directive:

<script src="https://gist.github.com/el3um4s/b91dc8d8a84556ed674743a9fc9a9307.js"></script>

By combining the whole the component becomes:

<script src="https://gist.github.com/el3um4s/b575bcda702376174ca4cd4d74659db4.js"></script>

That's all. Obviously this method is not perfect. However, I find it simpler than other implementations I've tried. The code, as usual, is available in the repository on GitHub:

- [el3um4s/medium-stats](https://github.com/el3um4s/medium-stats)

Obviously it's a work in progress, so there are still some details to refine and I will probably change something again over time.

Regarding Svelte, I made a list on Medium with my various posts on this topic:

- [Svelte & SvelteKit](https://el3um4s.medium.com/list/svelte-sveltekit-bf5be8834fbf)
