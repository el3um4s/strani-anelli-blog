---
title: "How to Document Svelte Components (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Sigmund**](https://unsplash.com/@sigmund)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-11-14 12:00"
categories:
  - Svelte
  - SvelteKit
  - Components
  - Documentation
  - NPM
  - NodeJS
tags:
  - Svelte
  - SvelteKit
  - Components
  - Documentation
  - NPM
  - NodeJS
---

For the past two weeks, I have focused on how to quickly create documentation for my [Svelte](https://svelte.dev/) components. I don't want to repeat my classic mistake: creating some interesting little things but then not being able to keep the documentation updated. I need a way to write and keep the documentation in sync with the code. I tried to figure out how to get Svelte to take care of it himself. I have not completely succeeded, but I think I have set the general procedure.

### The steps

I investigated a few streets, and they mostly turned out to be dead ends. The first attempt was to use [svelte.parse](https://svelte.dev/docs#svelte_parse) - it doesn't serve my purpose. The second attempt was to try some JavaScript parsers, starting with [acorn](https://github.com/acornjs/acorn). Another hole in the water: these tools are too big for my goal. I therefore had to concentrate on starting from a lower level. In order to have Svelte self-document I have to:

1. read the Svelte components not yet compiled, that is the raw **.svelte** files
2. extract the information I need:
   - the **props**, with their name, type and default value
   - the **actions** that can be performed; in this case the name is enough, if it is self-explanatory enough
   - the **slot** names that can be used
   - and, but I'm not entirely sure, the **css variables** used by the component
3. save this information in a **json** file
   - do it automatically, so you don't have to remember it
4. import this information into Svelte
5. use a specific component to read the information and display it automatically

Since information about a component only changes during development it's not a problem if the setup takes a couple of steps. If everything is automated, I can concentrate on the development itself without worrying about the details.

### The general structure

I decided to split the project into two different repositories:

1. [el3um4s/svelte-get-component-info](https://github.com/el3um4s/svelte-get-component-info) to manage the part relating to data extraction
2. [el3um4s/svelte-component-info](https://github.com/el3um4s/svelte-component-info) to simplify the display of the various properties

The two repositories aren't complete yet. I'm interested in keeping track of the steps I've taken and those still to be taken. As soon as the project is mature enough I will integrate it into my [svelte-component-package-starter](https://github.com/el3um4s/svelte-component-package-starter) template

### How to get the list of props of a Svelte component

The problem of getting the list of properties of a Svelte component is roughly similar to a problem of finding a word in a text file. It involves reading a file, extracting its contents and then scrolling through it by extracting the pieces I need.

So I start by creating a function to read a file and return its contents as a text string:

<script src="https://gist.github.com/el3um4s/971052655845fab19be97d4f2312eceb.js"></script>

I use the NodeJS [readFileSync](https://nodejs.org/api/fs.html#fsreadfilesyncpath-options) API. After getting the contents of the file I start looking for what interests me. To extract the props of a component I can limit my search to the [script block](https://svelte.dev/docs#script):

<script src="https://gist.github.com/el3um4s/1103f41f3dbf6cccde09a908ac678b23.js"></script>

I use a regex `/<script[\s\S]*?>[\s\S]*?<\/script>/gi` expression with [string.match(regex)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) to get a string. I use this result to look up all `let` variables exported by the component and save them in an array. The regex expression I use is `/export let [\s\S]*?;/gi`:

<script src="https://gist.github.com/el3um4s/ee611ba2011e24cb037d1bf4f3b15c89.js"></script>

### Get the properties of the props

Now I can start looking up the names of the props, again using a regex (`/(?<=let )(.*?)(?=\s|;|=|:)/`):

<script src="https://gist.github.com/el3um4s/01dd17a385c1ea77241fb7e1079cdc16.js"></script>

The next step is to extract the types of the variables. In this case the regex I use is `/(?<=let [:]|[:])(.*?)(?=;|=)/`:

<script src="https://gist.github.com/el3um4s/e830fcf2f1b0abc4a6f30c73c13ae979.js"></script>

Getting the default value of the variables is more complex. I can't use a regex expression, there are too many possible ambiguous cases. I can use a trick thanks to a choice I made at the beginning, when I saved each let variable as an element of an array. In this way I can consider as default value everything that appears between the equal symbol (`=`) and the last character of the string (which should be the semicolon `;`).

<script src="https://gist.github.com/el3um4s/30dec60df01c35c82c6d6caae48e9576.js"></script>

When the default is a string, the quotes must be removed. To do this I used the `isStringType` and `getStringWithoutQuote` functions:

<script src="https://gist.github.com/el3um4s/11af711c847d40a2c64a8541157bc9a4.js"></script>

### Create an object with info

Now that I have all the pieces I can start putting it all together. I write a function that gets `name`, `type` and `defaultValue`:

<script src="https://gist.github.com/el3um4s/289938f3cb5ebe1b05995172a5f2c6ad.js"></script>

Then I create a function that reads the file, extracts the values and returns them as an object:

<script src="https://gist.github.com/el3um4s/f65c76e6ec7e2d2bc0b9bc511adfe7ae.js"></script>

### The Svelte component

After extracting all the values I have to figure out how to display them. To make things easier I am creating a Svelte component ([el3um4s/svelte-component-info](https://github.com/el3um4s/svelte-component-info)). I want something like this:

{% include picture img="demo.webp" ext="jpg" alt="" %}

The first thing is create a `SvelteInfo.svelte` component and decide which props I need:

<script src="https://gist.github.com/el3um4s/01c06b7e3b8503fd8d1eec2cd0558c99.js"></script>

I need the component name, the package name (to automatically insert the code to download it from npm) and of course all the information I can get using the code I created earlier.

Using this information I can automatically create a section that explains how to import the component into a project:

<script src="https://gist.github.com/el3um4s/7ea7902312e10cc89f6846ae4a58efea.js"></script>

And how to use the component:

<script src="https://gist.github.com/el3um4s/16eac9d3923b5fe527e6bb1ec06b8a89.js"></script>

I can also automatically create a table with all the necessary information about the props:

<script src="https://gist.github.com/el3um4s/4e4c619d53aeb9e2bee03e4125cfff79.js"></script>

### Use it all

Now that I have all the various pieces I can put them together to make it easier to create a component's documentation. I start from a component that I have already created and start with installing what I need:

```bash
npm i @el3um4s/svelte-get-component-info @el3um4s/svelte-component-info
```

So I create a file to manage the creation of the `infoSvelteComponents.json` file with the information:

<script src="https://gist.github.com/el3um4s/a05fe133e2ee88f30cd8aa846f711f37.js"></script>

I update the `package.json` file by adding a few scripts:

<script src="https://gist.github.com/el3um4s/7b33cdc9eacdc45c4687baacbd26721b.js"></script>

I edit the component documentation page by importing `InfoSvelte.svelte` and the json file. Then I add the component:

<script src="https://gist.github.com/el3um4s/00a8a1d9462d7da90b51dff525777020.js"></script>

And then ... nothing, that's all. Just import the component and the JSON file and nothing else. From now on, whenever I create component documentation using `npm run build` I will automatically import all updated information.

As I said the two repositories are still a work in progress. I plan to update them in the next few days but for the moment I wanted to put in order the various steps taken up to here.
