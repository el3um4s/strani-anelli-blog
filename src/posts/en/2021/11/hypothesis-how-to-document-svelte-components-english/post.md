---
title: How to Document Svelte Components
published: true
date: 2021-11-14 12:00
categories:
  - Svelte
  - JavaScript
  - TypeScript
tags:
  - Svelte
  - hypothesis-how-to-document-svelte-components
  - JavaScript
  - TypeScript
lang: en
cover: cover.webp
description: "For the past two weeks, I have focused on how to quickly create documentation for my Svelte components. I don't want to repeat my classic mistake: creating some interesting little things but then not being able to keep the documentation updated. I need a way to write and keep the documentation in sync with the code. I tried to figure out how to get Svelte to take care of it himself. I have not completely succeeded, but I think I have set the general procedure."
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

```ts
import { existsSync, readFileSync  } from 'fs';
import { toTry } from "@el3um4s/to-try";
import { Content } from "./interfaces";

function readFileSvelte(nameFile:string) {
    const content:Content = {
        error: {
            status: true,
            content: "file not read" },
        content: {
            status: false,
            content: "" }
    };

    if (checkFileExist(nameFile)) {
        const [result, error] = toTry(() => readFileSync(nameFile));
        if (!error && result) {
            const contentString = result.toString();
            content.error = {
                status: false,
                content: "" };
            content.content = {
                status: true,
                content: contentString };
        }
    } else { content.error.content = `File "${nameFile}" not exist`;  }  
    return content;
}

function checkFileExist(nameFile:string):boolean { return existsSync(nameFile); }

export {readFileSvelte, checkFileExist};
```

I use the NodeJS [readFileSync](https://nodejs.org/api/fs.html#fsreadfilesyncpath-options) API. After getting the contents of the file I start looking for what interests me. To extract the props of a component I can limit my search to the [script block](https://svelte.dev/docs#script):

```ts
import type { Reading } from "./interfaces";

const regex = {
        script: /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
};

function hasScript (component:string): Reading {
    const script = component.match(regex.script);
    const content = script == null ? "": script[0].replace(/<script[\s\S]*?>/gi, "").replace(/<\/script>/gi, "");
    const result: Reading = {
        status: script == null ? false : true,
        content
    };
    return result;
}

export { hasScript };
```

I use a regex `/<script[\s\S]*?>[\s\S]*?<\/script>/gi` expression with [string.match(regex)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) to get a string. I use this result to look up all `let` variables exported by the component and save them in an array. The regex expression I use is `/export let [\s\S]*?;/gi`:

```ts
const regex = /export let [\s\S]*?;/gi

function getProps_asInFile (component:string): Array<string> {
    const content = component.match(regex);
    return content != null ? content : [];
}

export { getProps_asInFile };
```

### Get the properties of the props

Now I can start looking up the names of the props, again using a regex (`/(?<=let )(.*?)(?=\s|;|=|:)/`):

```ts
onst regex = {
        name: /(?<=let )(.*?)(?=\s|;|=|:)/
};
                         
function getPropName(s:string):string {
    const nameRegex = s.match(regex.name);
    const nameWithDelimiters = nameRegex ? nameRegex[0] : "";
    const name = nameWithDelimiters.replace("let","").replace(/[:|;|=]/gi,"").trim();
    return name;
}
```

The next step is to extract the types of the variables. In this case the regex I use is `/(?<=let [:]|[:])(.*?)(?=;|=)/`:

```ts
const regex = {
  type: /(?<=let [:]|[:])(.*?)(?=;|=)/
};
                      
function getPropType(s:string):string|undefined {
  const typeRegex = s.match(regex.type);
  const positionEquals = s.indexOf("=");
  const positionSemicolon = s.indexOf(";");
  const firstDelimiters:number = positionEquals > -1 ? positionEquals : positionSemicolon;
  const positionRegex:number = typeRegex?.index ? typeRegex.index : -1;
  const type:string|undefined = positionRegex < firstDelimiters && typeRegex ? typeRegex[0].trim() : undefined;
  return type;
}
```

Getting the default value of the variables is more complex. I can't use a regex expression, there are too many possible ambiguous cases. I can use a trick thanks to a choice I made at the beginning, when I saved each let variable as an element of an array. In this way I can consider as default value everything that appears between the equal symbol (`=`) and the last character of the string (which should be the semicolon `;`).

```ts
function getPropDefaultValue(s:string):string|undefined {
  const positionEquals = s.indexOf("=");
  const positionSemicolon = s.lastIndexOf(";");
  const defaultValue:string|undefined = positionEquals < 0 ? undefined : s.substring(positionEquals+1, positionSemicolon).trim();
  const result: string|undefined= defaultValue && isStringType(defaultValue) ? getStringWithoutQuote(defaultValue) : defaultValue;
  return result;
}
```

When the default is a string, the quotes must be removed. To do this I used the `isStringType` and `getStringWithoutQuote` functions:

```ts
function isStringType(s:string):boolean {
  const startString: string = s.trim();
  const firstChar: string = startString.charAt(0);
  const lastChar: string = startString.charAt(startString.length-1);
  const charIsQuote = firstChar === `"` || firstChar ===`'` || firstChar === "`";
  const result = charIsQuote && firstChar === lastChar;
  return result;
}

function getStringWithoutQuote(s:string):string {
  const startString: string = s.trim();
  const result: string = startString.substring(1,startString.length-1);
  return result;
}
```

### Create an object with info

Now that I have all the pieces I can start putting it all together. I write a function that gets `name`, `type` and `defaultValue`:

```ts
function getPropInfo(s:string):Prop {
  const name:string = getPropName(s);
  const type:string|undefined = getPropType(s);
  const defaultValue:string|undefined = getPropDefaultValue(s);
  return {name, type, defaultValue};
}
```

Then I create a function that reads the file, extracts the values and returns them as an object:

```ts
import { readFileSvelte } from "./readFileSvelte";
import { getProps_asInFile } from "./parseFileSvelte";
import { getPropInfo } from "./parseProps";
import { Content, Prop, SvelteInformations } from "./interfaces";

function getInfo(source: string):SvelteInformations {
  const file:Content = readFileSvelte(source);
  const propsAsInFile = getProps_asInFile(file.content.content);
  const props:Array<Prop> = [];
  propsAsInFile.forEach(p => props.push(getPropInfo(p)));
  return { props };
}

export {getInfo};
```

### The Svelte component

After extracting all the values I have to figure out how to display them. To make things easier I am creating a Svelte component ([el3um4s/svelte-component-info](https://github.com/el3um4s/svelte-component-info)). I want something like this:

![Immagine](./demo.webp)

The first thing is create a `SvelteInfo.svelte` component and decide which props I need:

```html
<script lang="ts">
  import type { SvelteInformations } from '@el3um4s/svelte-get-component-info';
  
  export let name: string;
  export let description: string = '';
  export let info: SvelteInformations;
  export let urlPackage: string = '-';
  
  const brackesOpen: string = '<';
  const brackesClose: string = '>';
  const bracesOpen: string = '{';
  const bracesClose: string = '}';
</script>
```

I need the component name, the package name (to automatically insert the code to download it from npm) and of course all the information I can get using the code I created earlier.

Using this information I can automatically create a section that explains how to import the component into a project:

```html
{#if urlPackage !== '-'}
  <div>To import the package in a project:</div>
  <div class="code details">npm i -D {urlPackage}</div>
{/if}
```

And how to use the component:

```html
<div class="code details">
  {#if urlPackage !== '-'}
    <div>
      {brackesOpen}script{brackesClose}
      <p>import {bracesOpen} {name} {bracesClose} from "{urlPackage}"</p>
      {brackesOpen}/script{brackesClose}
    </div>
  {/if}
  <div>
    {brackesOpen}{name}
    {#each info.props as prop}
      <ul>
        <li>{prop.name}</li>
      </ul>
    {/each}{brackesClose}
    {brackesOpen}/{name}{brackesClose}
  </div>
</div>
```

I can also automatically create a table with all the necessary information about the props:

```html
{#if info.props.length > 0}
  <section class="details">
    <div class="title">Props</div>
    <div class="table">
      <span class="table-header">Name</span>
      <span class="table-header">Type</span>
      <span class="table-header">Default</span>

      {#each info.props as prop}
        <span>{prop.name}</span>
        <span class={prop.type ? '' : 'undefined'}>{prop.type}</span>
        <span class={prop.defaultValue ? '' : 'undefined'}>{prop.defaultValue}</span>
      {/each}
    </div>
  </section>
{/if}
```

### Use it all

Now that I have all the various pieces I can put them together to make it easier to create a component's documentation. I start from a component that I have already created and start with installing what I need:

```shell
npm i @el3um4s/svelte-get-component-info @el3um4s/svelte-component-info
```

So I create a file to manage the creation of the `infoSvelteComponents.json` file with the information:

```js
import {
  writeFileSync
} from 'fs';
import glob from 'glob';
import {
  getInfo
} from "@el3um4s/svelte-get-component-info";

const basePath = "src/lib/components/"

const listFile = glob.sync(`${basePath}**/*.svelte`);

let infoFiles = {}
listFile.forEach(file => {
  const prop = getInfo(file);
  const fileName = file.substring(basePath.length);
  infoFiles[fileName] = prop;
});

let data = JSON.stringify(infoFiles);
writeFileSync('./src/routes/infoSvelteComponents.json', data);
```

I update the `package.json` file by adding a few scripts:

```json
{
  "scripts": {
    "dev": "npm run get-info-svelte-components && svelte-kit dev",
    "build": "npm run get-info-svelte-components && npm run clean && svelte-kit build",
    "get-info-svelte-components": "node getInfoSvelteComponents.js",
  }
}
```

I edit the component documentation page by importing `InfoSvelte.svelte` and the json file. Then I add the component:

```html
<script lang="ts">
	import { SvelteInfo } from '@el3um4s/svelte-component-info';
	import infoSvelteComponents from './infoSvelteComponents.json';
</script>

<SvelteInfo
  name="SvelteTitlebar"
  urlPackage="@el3um4s/svelte-titlebar"
  info={infoSvelteComponents['TitleBar.svelte']}
  description="A Titlebar component for Svelte Projects"
/>
```

And then… nothing, that's all. Just import the component and the JSON file and nothing else. From now on, whenever I create component documentation using `npm run build` I will automatically import all updated information.

As I said the two repositories are still a work in progress. I plan to update them in the next few days but for the moment I wanted to put in order the various steps taken up to here.
