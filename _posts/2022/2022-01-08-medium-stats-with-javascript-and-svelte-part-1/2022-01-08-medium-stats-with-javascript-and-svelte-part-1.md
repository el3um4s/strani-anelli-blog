---
title: "Medium Stats With JavaScript and Svelte - Part 1"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Justin Morgan**](https://unsplash.com/@justin_morgan)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-01-08 13:30"
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

It is quite common knowledge that Medium does not provide in-depth stats. It is not a problem but I am used to recording some data on what I write and program. So I'm looking for an easy way to keep basic information.

There are some interesting posts. Of all the most interesting is [How to Get Medium Story Stats with 3 Lines of Python Code](https://python.plainenglish.io/how-to-get-medium-story-stats-with-3-lines-of-python-code-c28df3501392) by [Saul Dobilas](https://solclover.com/). I started from here to understand how to download and analyze Medium's stats.

### Partner Dashboard

First of all: to download the various statistics you must first be logged into Medium. After that you can download some JSON files with some data.

Saul recommends [medium.com/me/stats?format=json&count=100](https://medium.com/me/stats?format=json&count=100). From that page you can download a JSON file with data from the last 30 days. But I prefer a slightly different approach.

Forcing the reasoning, the only truly objective parameter of Medium is related to monetization. The views, reads, claps and so on also count. A number is enough for me: how much has each story monetized?

Yes, I know, it sounds like a venal speech. And what's more, my "earnings" are small, indeed very small. But I want to start from here.

To do this I need a JSON file containing the earnings data. To obtain it, I use the address: [medium.com/me/partner/dashboard?format=json](https://medium.com/me/partner/dashboard?format=json).

This file is interesting, it contains some useful data.
First of all, the first letters must be eliminated:

```js
])}while(1);</x>
```

This string is the remnant of an old problem now solved. There is an article from over ten years ago that explains it well: [JSON Hijacking](http://haacked.com/archive/2009/06/25/json-hijacking.aspx/).

The JSON file consists of several parts:

<script src="https://gist.github.com/el3um4s/470b8dbff5a617c97c0b6dc7e4502ba4.js"></script>

I don't care about everything, of course. What interests me is this:

<script src="https://gist.github.com/el3um4s/5238992397d8761648c8ecad679d280f.js"></script>

### Current Month Amount

`currentMonthAmount` contains the current month's data:

<script src="https://gist.github.com/el3um4s/86f97392c7879e96879d4930e8829819.js"></script>

I'm not sure what the last three items mean, but the first ones are dates that identify the reference period.

To convert a timestamp into a more readable format just use [Date.prototype.toDateString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toDateString):

<script src="https://gist.github.com/el3um4s/5eb526a484a1a86a74fd09926c51bb5e.js"></script>

`amount` instead represents the total "earned" during the month. Of course, it's cents, not whole dollars.

### Completed Monthly Amounts

`completedMonthlyAmounts` contains the data for the completed months. It's an array with an object for each previous month:

<script src="https://gist.github.com/el3um4s/93d9558c57a00ce9f533543d38bfc6e3.js"></script>

In addition to the previous data, some additional information is saved: the user ID and the time when the data is consolidated. I don't know what is meant by `state`.

### Post Amounts

`postAmounts` is an array containing some interesting data for each published post:

<script src="https://gist.github.com/el3um4s/23dc6fc24c5249a8c7c7625aa3fa775a.js"></script>

I am not examining all the items, also because I have not copied them all. However, there are some data on which I want to emphasize:

- `totalAmountPaidToDate`: is how much a story has earned since the day it was published
- `totalAmountInCents`: is the earning of the story in the current month
- `post.id`: is the `id` that uniquely identifies a story within Medium. I can access the post with the story using an address like `https://medium.com/story/id`. For example, my latest post can be reached via the address [medium.com/story/9db50dff8f38](https://medium.com/story/9db50dff8f38)
- `post.homeCollectionId` is the `id` that identifies the publication hosting a story.
- `post.title`, `post.virtuals.wordCount` and `post.virtuals.readingTime` contain some of the title of the story, the word count and an estimate of the reading time

With this information I can begin to create something to download, store and analyze my story data on Medium.

### How to download Medium stats

So, in summary, I go to [medium.com/me/partner/dashboard?format=json](https://medium.com/me/partner/dashboard?format=json) and save the page. Just use the right mouse button and choose `Save As...`. To help me, and to remind me of all the steps, I create a small app. I start from a template with [Svelte](https://svelte.dev/), [Typescript](https://www.typescriptlang.org/) and TailwindCSS already configured: [el3um4s/memento-svelte-typescript-tailwind](https://github.com/el3um4s/memento-svelte-typescript-tailwind):

```bash
npx degit el3um4s/memento-svelte-typescript-tailwind medium-stats
cd medium-stats
npm install
```

So, the first step is to remember to download the most up-to-date stats. I add a link to the page using Svelte:

<script src="https://gist.github.com/el3um4s/5aeb24e85a75de5024512181f4be34b7.js"></script>

![download-stats-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-07-come-scaricare-le-statistiche-di-medium-part-1/download-stats-01.gif)

### Import a JSON file

After downloading the `dashboard.json` file I can import it into my application using the [File System Access API](https://web.dev/file-system-access/). The idea is to upload the file with the statistics and extract only those that interest me. Then, at a later time, and probably in a future post, I'll combine this data to give it the shape I'm interested in.

Let's start with creating a button:

<script src="https://gist.github.com/el3um4s/885a969281e9d10c18794e9fb9ce84e0.js"></script>

I add a function:

<script src="https://gist.github.com/el3um4s/267aa9257c7ae99372266b9095737f3c.js"></script>

I use `showOpenFilePicker()` to open a system window and select the file to use. Then with `getFile()` I load the file into the page. Finally I use `text()` to extract the content and save it in a variable of type string.

With a normal JSON file at this point it would be enough to use [JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) to get an object. But in this case I have to delete the characters])} `])}while(1);</x>` first. I create the `sanitizeOriginalStats()` function:

<script src="https://gist.github.com/el3um4s/0d4640bf4a440135f2dd91fb56d0926e.js"></script>

I add this function to `loadDashboardJSON()`.

<script src="https://gist.github.com/el3um4s/23176172d22b1aa10992d4b334c0d6e5.js"></script>

### Analyze the data

Now that I have my data I can decide how to view them on the screen. As a first test, to test my idea, I decide to limit myself to something simple. I want to create two lists. The first with the proceeds of each month. The second with the progressive revenue of each post.

I start with the monthly proceeds. To get it I use the properties `currentMonthAmount` and `completedMonthlyAmounts`. For both it is sufficient to use `periodStartedAt` and `amount`. I create a function that helps me extract this information:

<script src="https://gist.github.com/el3um4s/08993cad0cb595ca82cbcc1619a75f07.js"></script>

Dates are a difficult type of subject to deal with. To get something readable I have to use some methods:

- [getFullYear()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear)
- [getMonth()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth)
- [toLocaleString()](https://reactgo.com/convert-month-number-to-name-js/)

I create the `getDate()` function:

<script src="https://gist.github.com/el3um4s/c0534d8def09403095686667dc05e168.js"></script>

And I use it in `getMonthStats()`:

<script src="https://gist.github.com/el3um4s/37792267d7ba25ac6e1cdf11d0397242.js"></script>

Now I can extract the data of the current month and those of the previous months with:

<script src="https://gist.github.com/el3um4s/4dcff6b06b2b0284837e2fdafef5577a.js"></script>

I modify the button and add a list in which to show the various values:

<script src="https://gist.github.com/el3um4s/251a8aab2cbc20967a11b8c177ed1295.js"></script>

So on the screen I can see something like this:

{% include picture img="month.webp" ext="jpg" alt="" %}

### Add a chart

The next step is to figure out how to graphically display the values. There are 3 libraries to consider:

- [Layer Cake](https://github.com/mhkeller/layercake)
- [Pancake](https://github.com/Rich-Harris/pancake)
- [Ffoodd Chaarts](https://ffoodd.github.io/chaarts/index.html)

What interests me is quite simple so I create a basic component to draw a histogram.

I start with setting the variables

- `data` for the data to show
- `labels`
- `columns` for the number of vertical bars to show
- `maxData` to scale the bars correctly

<script src="https://gist.github.com/el3um4s/20fbc662da6f939f1a39c03dcae94e66.js"></script>

I also need a way to manage some styles based on the amount of data to show:

<script src="https://gist.github.com/el3um4s/513ce464f27ad5d37b1cbdb6861a68b5.js"></script>

I add the `html` part:

<script src="https://gist.github.com/el3um4s/46f0aab95530b2cd52ebfa1a714533d5.js"></script>

To make the graphical representation proportional I use `height:{(d / maxData) * 100}%`.

As for the CSS part I use a [grid](https://css-tricks.com/snippets/css/complete-guide-grid/):

<script src="https://gist.github.com/el3um4s/12a9f12cdcbf2b372cf9559ce2f380b8.js"></script>

I create a helper function to extract the dataset that interests me:

<script src="https://gist.github.com/el3um4s/a910d305f1e918fc065df93a9e4e7a3b.js"></script>

To dynamically manage the graphical representation I use [$](https://svelte.dev/docs#component-format-script-3-$-marks-a-statement-as-reactive):

<script src="https://gist.github.com/el3um4s/bf6a5b5cd63c55e7356b2749abbfcbda.js"></script>

Finally I add the graphic to the main page:

<script src="https://gist.github.com/el3um4s/c880b3b94721e8dcc93e29e720938440.js"></script>

This way I can get something like this:

![download-stats-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-07-come-scaricare-le-statistiche-di-medium-part-1/download-stats-02.gif)

Okay, that's enough for now. There are still things to say: I will write another article on this topic in the near future.
