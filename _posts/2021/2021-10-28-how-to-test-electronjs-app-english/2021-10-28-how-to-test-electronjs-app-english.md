---
title: "How to Test Electron Apps"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-10-28 14:00"
categories:
  - ElectronJS
  - TypeScript
  - Template
  - Playwright
tags:
  - ElectronJS
  - TypeScript
  - Template
  - Playwright
---

In my last posts I talked about how to test Svelte components and NPM packages. My journey is not over. I have still to figure out how to test Electron applications.

### The tools available

The main problem with testing Electron apps is the lack of established and updated frameworks. Virtually all guides recommend using [Spectron](https://www.electronjs.org/spectron). However, Spectron only supports Electron versions up to 13: [newer versions do not work](https://github.com/electron-userland/spectron/issues/896). And that makes it useless for my purposes.

The best alternative to Spectron is [Playwright](https://playwright.dev/): a framework created and maintained by Microsoft, and moreover integrated with TypeScript.

### Install Playwright

I keep working on my template, [MEMENTO - Svelte, TailwindCSS, Electron and TypeScript](https://github.com/el3um4s/memento-svelte-electron-typescript). First I add Playwright to the project dependencies:

```bash
npm i -D playwright @playwright/test
```

Since I'm only interested in testing Electron I don't install the other browsers (I don't use `npx playwright install` because I don't need it). But I add a script to `package.json`:

<script src="https://gist.github.com/el3um4s/ca5415e2d4db9121a5bcb4f52fa8dd33.js"></script>

### Create the first test: Electron starts

I start creating the first test. I create a `test` folder and inside it the `base.test.ts` file. The first thing I want to check is that the Electron app starts up and shows a window.

Reading the Playwright documentation, I can find two experimental classes: [Electron](https://playwright.dev/docs/api/class-electron/) and [ElectronApplication](https://playwright.dev/docs/api/class-electronapplication).

I also need the [Test](https://playwright.dev/docs/api/class-test/) class, to run the various tests and indicate what I expect to achieve.

<script src="https://gist.github.com/el3um4s/904abdc16f86a72111d204a320f148f5.js"></script>

The test I have to write is asynchronous: Electron opening is not always immediate so I want to be sure to perform the various operations only when they are actually possible. The first thing to do is to start Electron:

<script src="https://gist.github.com/el3um4s/58467e244c10275479ad931c02e744e0.js"></script>

After starting the app, check if there is a visible window. I use [electronApplication.evaluate(pageFunction[, arg])](https://playwright.dev/docs/api/class-electronapplication#electron-application-evaluate)

<script src="https://gist.github.com/el3um4s/64990fcd4c3dcd5f3f4e1c8be4d428b7.js"></script>

This way I end up with a `windowState` object containing the state of the Electron window. I expect the window to be visible, the development window to be closed and the app not to crash. Translated into code:

<script src="https://gist.github.com/el3um4s/d423ef55326ef6310b2e8ce66833f9e3.js"></script>

To finish after running the tests I close Electron:

<script src="https://gist.github.com/el3um4s/3e1f0fce9a06a4206bea218df568df6d.js"></script>

Now I put it all together and this is my first test:

<script src="https://gist.github.com/el3um4s/9bc6fc06d8726ea9aabb7f570e0332b9.js"></script>

To run it I use the command:

```bash
npm run test
```

### Check the contents of the window

Well, the app starts up. The next check is the content. Since I will be running multiple tests in sequence on the same page I use `test.describe`

<script src="https://gist.github.com/el3um4s/615c5a669d50aa1572d9cb733e13db71.js"></script>

I can interact with the various elements of the page and check their HTML code. For example, I can make sure what the page title is:

<script src="https://gist.github.com/el3um4s/164a153b7097ca53ecd4904e12721bbd.js"></script>

Or I can check that the version number of the app is actually displayed:

<script src="https://gist.github.com/el3um4s/98475c5449875b0a298c70bb2eb97a0e.js"></script>

### Check the graphics

Beyond the content, a useful thing is the ability to check the look and feel of Electron. To do this I have to take screenshots of the window and compare them with a reference image.

<script src="https://gist.github.com/el3um4s/ae44bf6004c2673e770d3a96c5594ab0.js"></script>

Every time I run the test Playwright compares the screenshot of the window (saved in `tests/screenshot/firstWindow.png`) with the reference one. The reference image is created at the first start of the test and is immutable unless you explicitly indicate that you want to update it.

I add a script to `package.json` to change the reference images:

<script src="https://gist.github.com/el3um4s/2037cd67cd89ec88948c647119775551.js"></script>

### Customize Playwright

I can configure the overall behavior of Playwright by creating a `playwright.config.ts` file. I'm interested in customizing the sensitivity of `toMatchSnapshot`, so I write:

<script src="https://gist.github.com/el3um4s/f8b1f510ff9770c962e835ba0a3c3c0d.js"></script>

### Record the tests

Another useful function of Playwright is the ability to record the various tests and play them on the screen. It can be used to check the behavior of the application and above all to understand what is not working. I need the [Tracing](https://playwright.dev/docs/api/class-tracing) class. With `start` and `stop` I can control the recording:

<script src="https://gist.github.com/el3um4s/d16111e7d2112963f38dba7ca76c3577.js"></script>

The recording is saved in a `zip` file. To be able to open it easily I add a script to `package.json`:

<script src="https://gist.github.com/el3um4s/4a4ac6a918fb1d74eb6c04e5bb5a5f32.js"></script>

### Useful links

Obviously this is just an overview of Playwright: I have recently started using this tool, full of options and possibilities. I haven't found much material online, so I recommend starting with the official documentation:

- [Getting started with Playwright](https://playwright.dev/docs/intro/)
- [Playwright: Page](https://playwright.dev/docs/api/class-page)
- [Playwright: Electron](https://playwright.dev/docs/api/class-electron/)
- [Playwright: ElectronApplication](https://playwright.dev/docs/api/class-electronapplication)
- [Playwright: Visual Comparisons](https://playwright.dev/docs/test-snapshots/)

I found these repositories useful:

- [cawa-93/vite-electron-builder](https://github.com/cawa-93/vite-electron-builder/blob/7d2df55fd8a0b3a803963d62558f719c9034ba2a/tests/app.spec.js)
- [microsoft/playwright - tests/electron](https://github.com/microsoft/playwright/tree/master/tests/electron)
- [spaceagetv/electron-playwright-example](https://github.com/spaceagetv/electron-playwright-example)

And then, of course, there's the repository with my template:

- [MEMENTO - Svelte, TailwindCSS, Electron and TypeScript](https://github.com/el3um4s/memento-svelte-electron-typescript)
