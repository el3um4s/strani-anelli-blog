---
title: "Medium Stats With JavaScript and Svelte - Part 2"
published: false
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Chris Liverani**](https://unsplash.com/@chrisliverani)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-01-16 12:30"
categories:
  - Svelte
  - Components
  - Documentation
  - Medium
tags:
  - Svelte
  - Components
  - Documentation
  - Medium
---

It's time to understand how to analyze the earnings of the various posts. So I'm going back to the [first article of this series](https://blog.stranianelli.com/medium-stats-with-javascript-and-svelte-part-1/), but focusing on the `postAmounts` property. For the moment I am interested in focusing only on a few values:

- `totalAmountPaidToDate`, all that the story has earned
- `amount`, the earnings in the current month
- `post.id`, the identifying `ID` of the story
- `firstPublishedAt`, the date of the first publication (for the moment I decide to ignore the date of the last modification)
- `post.title`, the title of the story
- `post.virtuals.wordCount`, the number of words in the post
- `post.virtuals.readingTime`, the estimated reading time
- `post.homeCollectionId`, the ID of the publication hosting the story

### Show story data

First I load the data into the page. To do this I use the `loadDashboardJSON()` function

<script src="https://gist.github.com/el3um4s/23176172d22b1aa10992d4b334c0d6e5.js"></script>

I need to add a specific function to load each post's data into a separate object. I create the `getListStories()` function:

<script src="https://gist.github.com/el3um4s/8df8518e9ee282b9caf2ffb668864311.js"></script>

There is a problem with this way of saving `firstPublishedAt`: it could create complications when I want to filter and sort the different posts. To avoid this, I break down the date into several parts. I modify `getDate()` by adding the [Date.prototype.getDate()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate) method:

<script src="https://gist.github.com/el3um4s/080e983706ddd5aac58b27d57f8b2636.js"></script>

And accordingly I correct `getListStories()`:

<script src="https://gist.github.com/el3um4s/9496949b16d873ef55e49f9c47ef6e56.js"></script>

I modify the `Load dashboard.json` button to save everything in the `listStories` array:

<script src="https://gist.github.com/el3um4s/4a73598e5022882c5b550041efd2ab03.js"></script>

Now that I have my data, how to show them?

### Create a table with CSS Grid

I decided to create a table using the [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout). During the first draft of this piece I wrote a long explanation on how to do it. But it is long and off topic. However, I have created a guide with my notes on how to create a table using CSS Grid Layout. You can read it here:

- [How To Create Responsive Data Tables With CSS Grid](https://betterprogramming.pub/how-to-create-responsive-data-tables-with-css-grid-9e0a37394450)

So, now I have an array with the stats of my stories. I need a second array containing the information about the columns:

<script src="https://gist.github.com/el3um4s/996ca253a154a1098e8052d92d45bcfd.js"></script>

I add the `Table` component to my page:

<script src="https://gist.github.com/el3um4s/3e06359a59643f05136cd4f62b8c99ba.js"></script>

It is convenient to display the total of the columns: I use the props `totals`. First I define a function that calculates the sum of the various values:

<script src="https://gist.github.com/el3um4s/d09fee9f825ab6e4e3431f9d60149d7e.js"></script>

Then I edit the `App.svelte` file:

<script src="https://gist.github.com/el3um4s/ceaaeceba2cc1e70fe49680895568251.js"></script>

And here is the table with the statistics of the various articles.

{% include picture img="table-01.webp" ext="jpg" alt="" %}

### Add sort functions

Another useful thing is the ability to sort the stories by date, title, earnings and word count. To do this I use a context menu and the `ordersTable` variable;

<script src="https://gist.github.com/el3um4s/8dc4f496ce884da596d149cad9886e85.js"></script>

I edit the HTML part

<script src="https://gist.github.com/el3um4s/586c90b5e02337359efef18c1044168c.js"></script>

And I get a list similar to this:

![table-css-grid-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-14-come-scaricare-le-statistiche-di-medium-part-2/table-css-grid-01.gif)

### Add a bar chart

The list is not enough. I want to add something graphic to have a better eye view. I then add a bar chart in my table.

Basically I want to use the widest column as an area to draw my bar graphs. First I define which columns can become the source of the graph:

<script src="https://gist.github.com/el3um4s/63ec7a384657d6665bca91f3aea7cfb9.js"></script>

Then I add the corresponding props

<script src="https://gist.github.com/el3um4s/6bf11b700ae87e26a19c46cc359104bb.js"></script>

And finally I get the list with the earnings of the various posts:

![table-css-grid-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-14-come-scaricare-le-statistiche-di-medium-part-2/table-css-grid-02.gif)

### Let's make a summary

Every day I fill in by hand, in excel, a scheme similar to this:

{% include picture img="sintesi-01-excel.webp" ext="jpg" alt="" %}

As long as I have a few articles it's simple. But if I continue to write on Medium it is foreseeable that the matter will get complicated. This is why I want to make the collection and analysis of Medium's statistics as automatic as possible.

I can start by creating a simplified version of this summary. The simplest version is for the current month. But first a clarification.

As I already explained in the first article of this series, I am using TypeScript. Or rather, so far I've only used JavaScript. But from now on, things get complicated. So, to make development easier, I start introducing some types. And the first concerns the data I need to create the summary:

<script src="https://gist.github.com/el3um4s/a29f4701a02647ca4cf93540531d71ae.js"></script>

Then I create the component. Or, better, I start by creating a very simplified version:

<script src="https://gist.github.com/el3um4s/8ed05694b516e1f6093f2a9706bae59e.js"></script>

I import the component into `App.svelte`:

<script src="https://gist.github.com/el3um4s/137d5d7a17f05a2f25498401d784e349.js"></script>

Obviously I don't get anything because I haven't created the functions to extract the data. The simplest thing to calculate is the number of articles published and their earnings:

<script src="https://gist.github.com/el3um4s/ca626d84801fbd3c0ea64238931ff0ca.js"></script>

It's just as quick to figure out which is the story with the most earnings in the month:

<script src="https://gist.github.com/el3um4s/5843b70900b1feb50d795883c6e75563.js"></script>

Things get a little more complicated when I have to divide the data for the stories of the current month and those of the previous months.

There are various ways to do this. Perhaps the smartest one is to use another json file. I can download the [stats.json](https://medium.com/me/stats?format=json&count=1000) file and extract the firstPublishedAtBucket property from there. But that's not what I'm going to do, not now. Later I will use this new file to get more data: `views`, `reads`, `claps` and `fans`.

Today I just use what I already have. So how do I divide the various posts by month and year of publication?

When I created the `StoryAmountStats` interface I also saved the` firstPublishedAt` property of type `CustomDateTime`:

<script src="https://gist.github.com/el3um4s/13f691a15f0dce4beae7c5088df8c5ed.js"></script>

Well, that's all I need to get started.

How do I understand which month we are in? I can calculate the system date with [Date.now()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now). Then I extract the number of the month and year and use it as a filter.

<script src="https://gist.github.com/el3um4s/72be5684147d0bd51f75b4aedcc7562a.js"></script>

To calculate the data of the previous articles I can make a subtraction. Or I can create a function. I think a specific function is more suitable, also because I will need it later:

<script src="https://gist.github.com/el3um4s/dca2c9ff2d188d1c1a1fb552b9df0e24.js"></script>

Now I just have to put it all together:

<script src="https://gist.github.com/el3um4s/133eedc098c5d65b7495e06d8ce1c318.js"></script>

After adding a few CSS styles I finally get a summary of the month:

{% include picture img="sintesi-02-svelte.webp" ext="jpg" alt="" %}

### Where are we

I'll stop here for today. There are still some problems to be solved. And especially the one that started all this: how can I view the same data but for several months in a row? I'll talk about this in a future post.

So far we have created a page that shows the overall performance of the various months, the performance of the individual stories and a brief summary of the current month:

![medium-stats-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-14-come-scaricare-le-statistiche-di-medium-part-2/medium-stats-01.gif)

As for the first part of this article, you can read it here:

- [How to Get Medium Stats With JavaScript and Svelte](https://blog.stranianelli.com/medium-stats-with-javascript-and-svelte-part-1/)

On Medium there is a list with my posts on Svelte and SvelteKit:

- [Svelte & SvelteKit](https://el3um4s.medium.com/list/svelte-sveltekit-bf5be8834fbf)

This is the repository with the code:

- [el3um4s/medium-stats](https://github.com/el3um4s/medium-stats)

Obviously it's still a work in progress, so there are still some functions to fix and some code to clean up.
