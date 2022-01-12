---
title: "How To Create Responsive Data Tables with CSS Grid"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-01-12 16:00"
categories:
  - Svelte
  - Components
  - Documentation
  - CSS
  - Tables
  - Tailwind
tags:
  - Svelte
  - Components
  - Documentation
  - CSS
  - Tables
  - Tailwind
---

Tables are quite a complicated thing. They have existed since the dawn of HTML and they bring with them some serious problems. They are great for showing little data but rather complicated when the data grows. I had to investigate this for a recent project of mine (related to [how to use Medium stats](https://javascript.plainenglish.io/how-to-get-medium-stats-with-javascript-and-svelte-part-1-a1d08b96799e). The solution I have chosen involves the use of CSS and the Grid Layout Module. Here are my passages and my arguments.

But before starting an image with the result I want to achieve:

![table-css-grid-00.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-00.gif)

### Introduction

The first step is to look for what already exists. There are some interesting articles worth reading:

- [Responsive data tables with CSS Grid](https://medium.com/evodeck/responsive-data-tables-with-css-grid-3c58ecf04723)
- [How to create responsive tables with pure CSS using Grid Layout Module](https://www.freecodecamp.org/news/https-medium-com-nakayama-shingo-creating-responsive-tables-with-pure-css-using-the-grid-layout-module-8e0ea8f03e83/)
- [Really Responsive Tables using CSS3 Flexbox](https://hashnode.com/post/really-responsive-tables-using-css3-flexbox-cijzbxd8n00pwvm53sl4l42cx)

From this I started to think about how to create my table.

First, of course, I need the data. I decided not to use fictional data for this article simply because the best way to learn is by solving a real problem. My problem is: I have some stats regarding my earnings on Medium. How can I analyze them?

But I won't talk about the data itself. For the moment I just need to know how they are organized. And I decided to organize them into an array, `listStories`. Each element of this array is an object composed of these properties:

<script src="https://gist.github.com/el3um4s/5adab92d70c4cf83a770dfd372b48845.js"></script>

I don't care about showing every single property. And I'm interested in having an easy way to decide which ones to view and order. To do this I need another array, this time made up of objects composed like this:

<script src="https://gist.github.com/el3um4s/104e7a0f5b3f7c23c390ac094df84888.js"></script>

The properties are:

- `key`, the property to show in the table
- `title`, the name of the column
- `type`, the type of data (numeric, date, string, boolean, ...)
- `width`, the width of the column. If not present it is interpreted as `auto`
- `align`, the alignment of the column

### Create a simple table

The table is in CSS. But to use it effectively I need something to automatically insert various data into the table. I decided to use [Svelte](https://svelte.dev/): it allows me to keep the JavaScript code, the HTML5 part and the table styles in a single file. Also to speed up the writing of CSS I use the [Tailwind CSS](https://tailwindcss.com/) classes.

I start by creating the props to import the table data and labels:

<script src="https://gist.github.com/el3um4s/f35ab2b7846ebe189eebbc3f21ca2d69.js"></script>

I write the HTML part:

<script src="https://gist.github.com/el3um4s/b8e55418ff9bee4ead5584f8ec4f5a95.js"></script>

Obviously the result is very bad:

{% include picture img="table-01.webp" ext="jpg" alt="" %}

I need to add some styles to make it presentable. I start by defining everything as a CSS Grid:

<script src="https://gist.github.com/el3um4s/7f4a1fb8396b9f24e76d2daac013f2f8.js"></script>

Then I bold the first row, the one with the names of the various columns:

<script src="https://gist.github.com/el3um4s/46defbab41879d2a8df6fcd7d7ac4031.js"></script>

Finally I add a line to divide each row of the table:

<script src="https://gist.github.com/el3um4s/b6f640b32c0d2f1d84b9361d157f1a96.js"></script>

The result is a little more elegant but still not useful:

{% include picture img="table-02.webp" ext="jpg" alt="" %}

I need to use the [grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns) property to define how many columns there should be.

A little while ago I explained how to create the `headers` prop. Well, the number of columns is simply the number of elements in the array.

<script src="https://gist.github.com/el3um4s/f72281e3b1389d35639eaf81d163cc7f.js"></script>

Finally something like a table appears:

{% include picture img="table-03.webp" ext="jpg" alt="" %}

There's a thing I don't like: the columns are all the same size. It makes more sense to make some columns smaller and leave the one with the article title larger. To do this I use the `width` property of each `label`:

<script src="https://gist.github.com/el3um4s/8e41c0bf61b4e009da0c8f6450dfe84f.js"></script>

Now the table is a little prettier.

{% include picture img="table-04.webp" ext="jpg" alt="" %}

However, some critical issues remain. First, some values do not appear, others are in the wrong format. I add a function to solve them:

<script src="https://gist.github.com/el3um4s/f59a7e650be82f8d9e35f569749ecdfe.js"></script>

I edit the HTML

<script src="https://gist.github.com/el3um4s/ba049f60c6ef5bb6914ef03de4b24806.js"></script>

This fixes the wrong format:

{% include picture img="table-05.webp" ext="jpg" alt="" %}

In a similar way I can correct the alignment of the columns:

<script src="https://gist.github.com/el3um4s/9a521a233b714486c36d7870b7cc2357.js"></script>

### Keep the header visible

This is fine for tables with little data. But there is a problem when there are several rows of data. Scrolling down the header of the columns disappears, making it difficult to read. To keep the first line fixed I have to modify the structure of the HTML part and the CSS style. I start by adding a `header` tag and a `section` tag:

<script src="https://gist.github.com/el3um4s/5ce447ab10792745848c6701fee9a3de.js"></script>

The idea is to set a maximum height for the section with the data lines and then add a side scrollbar to scroll through the data. To do this I first need to change the `display` property of `article`:

<script src="https://gist.github.com/el3um4s/63b2d1d82b34e8af0ec5f2674f165b03.js"></script>

`header` and` section` instead become `grid`:

<script src="https://gist.github.com/el3um4s/80529e96c15a6a76f39e97ec16b867c5.js"></script>

The `section` can have a vertical scrollbar.

To maintain the alignment of the last column, I should customize the scrollbar. For details I recommend reading [CSS Almanac - Scrollbar](https://css-tricks.com/almanac/properties/s/scrollbar/):

<script src="https://gist.github.com/el3um4s/378bb831fb92250286095c781bde3c93.js"></script>

I also shorten the width of the `header`:

<script src="https://gist.github.com/el3um4s/7ab336ee908ed01b2e2e99026effb17e.js"></script>

The result of all this is a table with the first fixed row at the top:

![table-css-grid-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-01.gif)

### Add a row for totals

Another thing I need is a line with the total. Because especially when I add a system of filters it is convenient to immediately see what the value of the selection is. To do this I add a `footer` to the table:

<script src="https://gist.github.com/el3um4s/70e071e45545d2b240094cf02ce0e96a.js"></script>

I know, I haven't defined `totals` yet. But I have to decide where and how to calculate the totals. The simplest way is by adding a third props.

So I define a props of this type:

<script src="https://gist.github.com/el3um4s/65f699b4578dbfc0f855b415d927d272.js"></script>

I correct the HTML code to format the values:

<script src="https://gist.github.com/el3um4s/3458bb196ec0c380b1302bb33dbb4e83.js"></script>

This allows me to get something like this:

{% include picture img="table-06.webp" ext="jpg" alt="" %}

### Sort the data

A useful feature is the ability to sort the data.

There are various ways to achieve this. I can add buttons outside the table, or I can add a mouse-based control. I would like to order in ascending or descending order using a context menu.

Maybe I'll talk about it in more depth in another post, but with Svelte it's quite easy to create a context menu. For the moment I just recommend this repl:

- [Svelte: Context Menu](https://svelte.dev/repl/3a33725c3adb4f57b46b597f9dade0c1?version=3.25.0)

For the moment I create a very simple component. First I need a couple of icons (`SortAscending` and `SortDescending`) to use as buttons.

<script src="https://gist.github.com/el3um4s/d7ead3c288319ccb8cc0c2a2e5285b0c.js"></script>

Then a couple of props to manage the position on the screen:

<script src="https://gist.github.com/el3um4s/f3a28ea45bb6f48745c2e5c529fa444a.js"></script>

It is also necessary to understand when the menu should be displayed and when it shouldn't be:

<script src="https://gist.github.com/el3um4s/23e08c0ff5c5be587623446e535fbe46.js"></script>

I use [createEventDispatcher](https://svelte.dev/docs#run-time-svelte-createeventdispatcher) to set the events I need:

<script src="https://gist.github.com/el3um4s/0295c91c01bfa9aeff382c900875db24.js"></script>

Then I add events to hide the context menu when we click on some other element of the page:

<script src="https://gist.github.com/el3um4s/abcba6b4dbc2bf7c9490e5dc51a494c5.js"></script>

Last, I add some CSS styles:

<script src="https://gist.github.com/el3um4s/ee9becaea697befb671f3ca7e35c09a1.js"></script>

By combining everything I get:

<script src="https://gist.github.com/el3um4s/88c381c72ace0e210e68e6d657700395.js"></script>

Now all that remains is to insert it into the table. I decided to activate the context menu every time you click on a cell, not just in the column headings:

<script src="https://gist.github.com/el3um4s/b6a7d51bf82fe1a72496e7aac22389bb.js"></script>

It's a minimal context menu but it's enough:

![table-css-grid-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-02.gif)

Nothing happens if I click on the icons. Because I haven't linked any functions to the two commands. I need to go back to the table and add another prop:

<script src="https://gist.github.com/el3um4s/d111af618f49387c9d485e8a2b428289.js"></script>

I also need two functions to sort values in ascending and descending order:

<script src="https://gist.github.com/el3um4s/9887976a9f55a550dd1cdcdca3c095d7.js"></script>

Finally I update the HTML code

<script src="https://gist.github.com/el3um4s/4ad6d13b44a71f94b479e375a1d532bb.js"></script>

Now I can sort the various columns:

![table-css-grid-03.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-03.gif)

### Add some colors

As far as it works, there remains a problem. It is not clearly visible which column we have selected, or on which row the mouse is positioned. To solve the problem I can use a few lines of CSS.

Let's start with the lines. I think the quickest way is to add an element which contains all the elements of the row:

<script src="https://gist.github.com/el3um4s/0f2c86841e9b3ef49545f52daf58499f.js"></script>

I adjust the styles to keep the same format:

<script src="https://gist.github.com/el3um4s/9399bf7a29250852fdcde98685c29101.js"></script>

And then, of course, I add a hover effect:

<script src="https://gist.github.com/el3um4s/af756fd2970a23fff5283b61a7d90f38.js"></script>

![table-css-grid-04.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-04.gif)

For columns I use the `cellData` variable to manage styles. First I make sure to avoid unwanted styles when the context menu is not visible:

<script src="https://gist.github.com/el3um4s/f31c77876c2c40d841c0bd78ab6e2556.js"></script>

Then I add a directive [class:name](https://svelte.dev/docs#template-syntax-element-directives-class-name)

<script src="https://gist.github.com/el3um4s/557053563ee90cb3bbd572d7e82e633e.js"></script>

I add the style:

<script src="https://gist.github.com/el3um4s/f2e2e8376f8f5aa4c20e6f99ee4752e2.js"></script>

This allows me to make the context menu effects visible:

![table-css-grid-05.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-05.gif)

### Add a chart

Numbers and words are fine but there is another aspect that interests me: the ability to graphically represent some values. It's simple to add a bar chart. I use the space in the cell with the title.

I start by setting up a couple of props:

<script src="https://gist.github.com/el3um4s/deffecf2e8ae8772f4e874fd7ac06993.js"></script>

I want to color the lines proportionally to the indicated value. To do this, I need the maximum value:

<script src="https://gist.github.com/el3um4s/530e281d267db52557ac51485bc05707.js"></script>

Then I create a function to define the style:

<script src="https://gist.github.com/el3um4s/1121b44d2210696f675ecc545bf8ea8a.js"></script>

Finally I modify the HTML code of the cells:

<script src="https://gist.github.com/el3um4s/752246d2c4f4cd0173b868705c772bc6.js"></script>

I get this:

![table-css-grid-06.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-06.gif)

### Choose the data to show

I want to customize the choice of the column to use in the chart. I modify the context menu by adding another button:

<script src="https://gist.github.com/el3um4s/be9db053b6e6c5383d897ab9f7100938.js"></script>

I have to use something to signal when to show the button because not all data can be represented graphically. For example the dates, or the texts. I add a `chartsColumns` variable with the list of columns

<script src="https://gist.github.com/el3um4s/b4951f11fb865c7e853daa7071302dc3.js"></script>

Then I add a function to select the data:

<script src="https://gist.github.com/el3um4s/d954d57b34d11b149f8f9b02f72df5eb.js"></script>

There is a problem: how do I know which data I am viewing? There can be various ways. For the moment I think it is enough to highlight the column, perhaps using a bold font.

<script src="https://gist.github.com/el3um4s/a58dc9c076b138eb4f2ec20ec9a83343.js"></script>

![table-css-grid-07.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-07.gif)

### Add numbers to lines

One last detail remains: the line numbers. Simply add an index to Svelte's `#each` loop:

<script src="https://gist.github.com/el3um4s/776c36cd4cb1bfb151997434d24ebddb.js"></script>

Then I modify the `gridTemplate` variable to create the corresponding column:

<script src="https://gist.github.com/el3um4s/dad2746d5a1fb578dc1b7fa915cf9629.js"></script>

It only takes a few lines of code to achieve this:

![table-css-grid-08.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-08.gif)

### Animate the table

Finally I can add an animation to make it evident when we sort the table. To do this I use the [animate:fn](https://svelte.dev/docs#template-syntax-element-directives-animate-fn) directive:

<script src="https://gist.github.com/el3um4s/640a600eeeb61d8fe8333d69bb219ecd.js"></script>

In this way I make the order operation visible:

![table-css-grid-09.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-11-come-creare-una-tabella-con-css-grid/table-css-grid-09.gif)

Well, that's all for now. I still have to think about if and how to manage filters and groupings. Maybe I'll talk about it in the future.

As for the code, however, the repository I'm working on is [el3um4s/medium-stats](https://github.com/el3um4s/medium-stats). It is a work in progress and the code is quite dirty. However, it can be useful.

Finally, these are my other articles related to Svelte and SvelteKit:

- [Svelte & SvelteKit](https://el3um4s.medium.com/list/svelte-sveltekit-bf5be8834fbf)
