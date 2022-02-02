---
title: "How to test SvelteKit app with Jest (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-10-09 14:00"
categories:
  - Svelte
  - TypeScript
  - Jest
tags:
  - Svelte
  - TypeScript
  - Jest
---

One of my weaknesses is the lack of discipline when it comes to testing. So I started looking around and figuring out how to do it. There are many frameworks, and frankly I am too ignorant on the subject to decide which one to use. As a result I went absolutely random and decided to use [Jest](https://jestjs.io/). I decided to use Jest with [SvelteKit](https://kit.svelte.dev/). These are my notes.

### Create a new project

Unlike the last posts, today I start with a completely new project. I don't want to deal with old code while learning something new. I create a new SvelteKit based project using the command:

```bash
npm init svelte@next
```

I use these settings:

```bash
Which Svelte app template? » Skeleton project
Use TypeScript? » Yes
Add ESLint for code linting? » Yes
Add Prettier for code formatting? » Yes
```

Then I install the dependencies:

```bash
npm install
```

I check that everything is successful by launching:

```bash
npm run dev -- --open
```

Good. So far the easy part. Now the fun begins.

### Install Jest

As always, I searched the internet. There are many interesting posts

- [Testing and Debugging Svelte](https://svelte-recipes.netlify.app/testing/)
- [Setting up Jest with SvelteKit](https://koenvg.medium.com/setting-up-jest-with-sveltekit-4f0a0e379668)
- [Testing Svelte components with Jest](https://dev.to/jpblancodb/testing-svelte-components-with-jest-53h3)
- [How to test Svelte components](https://timdeschryver.dev/blog/how-to-test-svelte-components)
- [Implementing Test Driven Development in Svelte](https://alfatianisa.medium.com/implementing-test-driven-development-in-svelte-c93aafa6db70)
- [Writing unit tests for Svelte - Series Articles](https://dev.to/d_ir/series/4203)
- [Test Your Svelte Components with uvu and testing-library](https://byderek.com/post/test-your-svelte-components-with-uvu-and-testing-library)
- [Svelte with TypeScript and Jest (Starter Project)](https://daveceddia.com/svelte-typescript-jest/)

I have used many of the tips in these guides to understand how to make my project work.

As recommended in a simple and effective way by [Dave Ceddia](https://daveceddia.com/svelte-typescript-jest/) I need some packages:

- [**jest**](https://jestjs.io/) to run the tests
- [**@types/jest**](https://www.npmjs.com/package/@types/jest) to get TS to stop complaining about Jest’s globals like `expect`
- [**ts-jest**](https://www.npmjs.com/package/ts-jest) to let you write your tests in TypeScript
- [**@testing-library/jest-dom**](https://github.com/testing-library/jest-dom) for handy DOM matcher functions like `toBeInTheDocument`
- [**svelte-jester**](https://www.npmjs.com/package/svelte-jester) to compile Svelte components for Jest, so that Jest can use them
- [**@testing-library/svelte**](https://github.com/testing-library/svelte-testing-library) for some useful functions to test your Svelte components with

It is better to test the compiled component and not the code used for development. Because the code that needs to work is the final one, the compiled code.

I can install everything at once using:

```bash
npm i -D jest @types/jest ts-jest @testing-library/jest-dom svelte-jester @testing-library/svelte
```

There may be problems depending on the different package versions. I did several tests on different days: on some occasions it was useful to use the `npx npm-check-updates` command to update everything to the latest version.

After installing everything I make sure that SvelteKit still works:

```bash
npm run dev -- --open
```

### Configure Jest and Svelte

I add the configuration files. In this case, I used [Koen Van Geert](https://koenvg.medium.com/setting-up-jest-with-sveltekit-4f0a0e379668)'s post. I create the files:

**svelte.config.test.cjs**

<script src="https://gist.github.com/el3um4s/4322d82ccb109ce1af6c91c0b56aa2af.js"></script>

**jest-setup.ts**

<script src="https://gist.github.com/el3um4s/72df1add954a16cdec543c26769dcd74.js"></script>

**jest.config.cjs**

<script src="https://gist.github.com/el3um4s/13113d3616c8a2b6a24cb2100d15a5f7.js"></script>

Finally I add some scripts to **package.json**:

<script src="https://gist.github.com/el3um4s/2e93cd8163fbcc100c775d8cf6f6c33e.js"></script>

I try to run

```bash
npm run test
```

and I get as a result:

```bash
> memento-sveltekit-jest@0.0.1 test
> jest

No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In I:\Repository\Svelte\memento-sveltekit-jest
  17 files checked.
  testMatch: **/__tests__/**/*.[jt]s?(x), **/?(*.)+(spec|test).[tj]s?(x) - 0 matches
  testPathIgnorePatterns: \\node_modules\\ - 17 matches
  testRegex:  - 0 matches
Pattern:  - 0 matches
```

Obviously I haven't written any tests yet. Finally it's time to write my first test.

### Write a simple test

I start with something trivial: I just need to understand if Jest is configured correctly. I simply check for _Welcome to SvelteKit_ text when starting the application.

I will put all the various tests in the `src/__tests__` directory. I create the `Welcome.test.ts` file and start creating a test:

<script src="https://gist.github.com/el3um4s/5bf3ae09d7d753a82dd15951d223a2ff.js"></script>

I import the `index.svelte` file, which is the home of the application. And then the `render` library from [_@testing-library/svelte_](https://github.com/testing-library/svelte-testing-library).

I add a blank test:

<script src="https://gist.github.com/el3um4s/246bb550033bc3b609ce36e659b16b21.js"></script>

Now I have to decide how and what to test. I want to test that there is an element on the page that says `Welcome to SvelteKit`.

<script src="https://gist.github.com/el3um4s/559947025267990f4a19e00496ea9c10.js"></script>

If I run the test now I get:

```bash
> memento-sveltekit-jest@0.0.1 test
> jest

 PASS  src/__tests__/Welcome.test.ts (13.859 s)
  Test if Jest is working
    √ Welcome (58 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        16.903 s
Ran all test suites.
```

Fine.

### Test a Svelte component with Jest

Of course this is only the beginning. I begin to complicate things by adding a new component. First I decide what I want to do, what features it should have and then I move on to implement the necessary tests and code.

I want a component consisting of a button and a text box containing a number. Each time I click the button, the number in the text box increases or decreases by random value. If the value is less than 0 the box will turn red, otherwise it will be green. The button should instead be blue.

I know, it's a weird example but it allows me to create a non-trivial component.

I run the `npm run test:watch` command and start by creating a new test file, `src/__tests__/RandomButton.test.ts`:

<script src="https://gist.github.com/el3um4s/47963882f84eb605821944eb65c66bd9.js"></script>

The test fails. Obviously, because the `RandomButton` component doesn't exist yet. I create it.

<script src="https://gist.github.com/el3um4s/5c0188278f68ca06e168cf5e48b08972.js"></script>

I add a test:

<script src="https://gist.github.com/el3um4s/614cf1bb4d74bcdd3a2b81de797e842f.js"></script>

The next step is to add a box to show a random number. I create the corresponding test and then update the component to be able to pass the test.

<script src="https://gist.github.com/el3um4s/94fef59fab90377d991f422ffd815fd1.js"></script>

<script src="https://gist.github.com/el3um4s/3d3d651720aff8f0195dfe0982a32c92.js"></script>

Well, now I move on to the style of the number. I add a test (which will fail) and then modify the component to pass the test:

<script src="https://gist.github.com/el3um4s/c7b8dce1b43ee4571755df0ca21e00cf.js"></script>

<script src="https://gist.github.com/el3um4s/f84f2f55d886d7b840367c1a86f6459c.js"></script>

The next condition is to color the box green if the number is positive. I write the necessary test and then modify the code:

<script src="https://gist.github.com/el3um4s/6fcccd19d43dd85ba62e8e85d6857906.js"></script>

<script src="https://gist.github.com/el3um4s/d373d918130d0127837a5fc9e319021a.js"></script>

So far I have checked the style of the element. In some cases it may also be useful to check for a class. I write the test to check the color of the button:

<script src="https://gist.github.com/el3um4s/d6d7b5f21500900ea84b420f379be6b0.js"></script>

and then I change the element code:

<script src="https://gist.github.com/el3um4s/66c846792fd336b2bd5205cdd1ae3154.js"></script>

After completing the CSS part I move on to the events. They are two:

1. at the click a random number is generated (integer, positive or negative)
2. the random number is added to the value shown in the text box.

I start by setting up the first test, the one to generate a random number at the click of the button:

<script src="https://gist.github.com/el3um4s/8231ad017df879b2874fd98eee1d44c0.js"></script>

I then correct the component in order to pass the test

<script src="https://gist.github.com/el3um4s/c79c31a3c2d643dd6ec3f02eb86e115e.js"></script>

I pass to the second test:

<script src="https://gist.github.com/el3um4s/b7ead4c3d0255805d3a3b0f65d1cb07f.js"></script>

<script src="https://gist.github.com/el3um4s/f127c5d14c6c314578dc11d73482f495.js"></script>

### Conclusions

That's it, at least for the moment. Obviously this is only a small guide, my knowledge is still limited. But I'm starting to have fun with that.

The code for this project is available on GitHub ([el3um4s/memento-sveltekit-jest](https://github.com/el3um4s/memento-sveltekit-jest)). It can be downloaded with the command:

```bash
npx degit el3um4s/memento-sveltekit-jest
```

And this is my Patreon: [patreon.com/el3um4s](https://patreon.com/el3um4s)
