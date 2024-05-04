---
title: How to create and publish Svelte components (English)
published: true
date: 2021-10-15 10:00
categories:
  - Svelte
  - TypeScript
  - Tailwind
  - CSS
  - JavaScript
tags:
  - Svelte
  - TypeScript
  - Tailwind
  - CSS
  - JavaScript
  - how-to-create-svelte-componentes
  - npm-packages-with-typescript
  - tailwind-and-svelte
  - test-sveltekit-app-con-jest
lang: en
cover: cover.webp
description: In my last articles I have mainly talked about how to integrate Svelte, Tailwind, Jest and how to use NPM. Why all this? To get to understand how to create a Svelte component and how to publish it as an NPM package. Below, as is my habit now, I report the various steps I followed and the link to a template that should simplify everything.
---

In my last articles I have mainly talked about how to integrate Svelte, Tailwind, Jest and how to use NPM. Why all this? To get to understand how to create a Svelte component and how to publish it as an NPM package. Below, as is my habit now, I report the various steps I followed and the link to a template that should simplify everything.

### Create components with SvelteKit

First of all the technology: SvelteKit. It may seem like a bizarre choice but I think it's the simplest way. The SvelteKit documentation also has a section dedicated to [**packaging**](https://kit.svelte.dev/docs#packaging).

In short, you can take the contents of the `src/lib` folder and save it as a package. It is also possible to publish it on NPM. In addition, the contents of the main folder can be exported in order to simplify the creation of documentation.

I omit the explanation of how to create a component with SvelteKit and the integration with Jest and TailwindCSS. I've written a couple of articles about it:

- [NPM Packages with TypeScript](https://blog.stranianelli.com/npm-packages-with-typescript-english/)
- [Tailwind CSS & Svelte](https://blog.stranianelli.com/tailwind-and-svelte-english/)
- [How to test SvelteKit app with Jest](https://blog.stranianelli.com/test-sveltekit-app-with-jest-english/)

I go directly to what to change: the `svelte.config.js` file. I add the `package` entry and set the directory to export the compiled package to (by default it is the `package` folder)

```js
const config = {
  // ...
	kit: {
		target: '#svelte',
		package: {
			dir: 'package',
			emitTypes: true
		}
	}
  // ...
};
```

Then I download and install [svelte2tsx](https://www.npmjs.com/package/svelte2tsx) to generate TSX files from SVELTE files.

```shell
npm i svelte2tsx
```

So I add a new script to `package.json`:

```json
"scripts":{
    "package": "svelte-kit package"
}
```

But if I try to run it (with the `npm run package` command) I get nothing. Why? Because an `index.js` file is missing. I need it how the entry point for the package. Since I am using TypeScript I have to create the `src/lib/index.ts` file. I insert in this file the components that I want to make usable:

```ts
export { default as GridColors } from './GridColors.svelte';
export { default as Slider } from './Slider.svelte'; 
```
I know, I'm not explaining how to create the various Svelte files. For now it is not necessary to know the implementation of the individual components. The important thing is to remember to add a file to use as an entry point for the package and update the contents of `package.json` with the essential information (name, github, and so on).

Then I run:

```shell
npm run package
```

and I get a new folder. Inside is the code to import to NPM.

I can publish using the command:

```shell
npm publish ./package --access public
```

As I have already explained in another article ([this post](https://blog.stranianelli.com/npm-packages-with-typescript-english/)) every time I change the code I can update the version number with the command:

```shell
npm version patch
```

and then republish with

```shell
npm publish
```

### How to use an NPM package locally

All of this is very fast. But there may be things that don't work after publication. I found some problems especially with TailwindCSS. In the test phase everything works fine but after exporting the package there were some bugs. I think it is a limitation of Tailwind: to avoid a plethora of CSS classes some commands are ignored or merged. In my case, in the repository I created as a template, Tailwind is not able to color only one border of a table cell. It works very well in testing but after exporting it doesn't.

It is not the first time. To solve this problem I had to test the package created by SvelteKit several times. One option is to upload it online each time and then re-download it to test it. The alternative is to use [`npm-link`](https://docs.npmjs.com/cli/v7/commands/npm-link/). Basically I can link a package saved on my computer and use it as a source for another project.

There are two commands to type. The first in the folder where the package code is (in my case in `package`):

```shell
npm link
```

The second command must be used in the project where I intend to use my package. Instead of using `npm install name-package` I use:

```shell
npm link name-package
```

In my example the command becomes:

```shell
npm link @el3um4s/svelte-component-package-starter
```

Now I can access the most recent compiled code without having to install the package from npm every time. To access the component just use the usual formula:

```html
<script lang="ts">
  import { Slider, GridColors } from "@el3um4s/svelte-component-package-starter";
  let steps = 5;
</script>

<main>
  <Slider label="hello" bind:steps />
  <GridColors bind:steps --border-color="red" />
</main>
```

After I finished testing the component I can delete the link using the command:

```bash
npm uninstall --no-save name-package
npm install 
```

I can also completely remove the global link from the package (so as to avoid future interference) with the command

```shell
npm uninstall name-package
```

However, I recommend reading these two posts to learn more about how to use `npm-link`:

- [Understanding npm-link](https://medium.com/dailyjs/how-to-use-npm-link-7375b6219557)
- [How to NPM Link to a local version of your dependency](https://medium.com/@AidThompsin/how-to-npm-link-to-a-local-version-of-your-dependency-84e82126667a)

### Use the newly created component

I have already mentioned this but I prefer to write it explicitly. After uploading the package to NPM I can download my component and use it in my other projects. To download it, the command is the classic `npm install name-package`:

```shell
npm i @el3um4s/svelte-component-package-starter
```

After installing it I can access it from any Svelte file:

```ts
import { Foo } from 'your-library';
import Foo from 'your-library/Foo.svelte';
```

In my example it becomes:

```html
<script lang="ts">
  import { GridColors } from "@el3um4s/svelte-component-package-starter";
</script>

<GridColors  />
```

### How to use the template to create Svelte components

Obviously all this work is to create a template that simplifies the creation of reusable components in multiple projects. You can download the template using the command:

```shell
npx degit el3um4s/svelte-component-package-starter
```

Just empty the `src/lib` and `src/__tests__` directories to get a clean template.

Finally, you can see the repository code at [el3um4s/svelte-component-package-starter](https://github.com/el3um4s/svelte-component-package-starter).
