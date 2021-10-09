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
- [**@testing-library/svelte**](https://github.com/testing-library/svelte-testing-library)  for some useful functions to test your Svelte components with

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
```js
const preprocess = require('svelte-preprocess');

module.exports = { preprocess: preprocess() };
```

**jest-setup.ts**
```ts
import '@testing-library/jest-dom';
```

**jest.config.cjs**
```js
module.exports = {
  transform: {
    '^.+\\.svelte$': [
      'svelte-jester',
      { preprocess: './svelte.config.test.cjs' }
    ],
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  moduleNameMapper: {
  '^\\$lib(.*)$': '<rootDir>/src/lib$1',
  '^\\$app(.*)$': [
    '<rootDir>/.svelte-kit/dev/runtime/app$1',
    '<rootDir>/.svelte-kit/build/runtime/app$1'
  ]
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  collectCoverageFrom: ["src/**/*.{ts,tsx,svelte,js,jsx}"]
};
```

Finally I add some scripts to **package.json**:

```json
"scripts": {
  "test": "jest",
  "test:watch": "npm run test -- --watchAll",
  "test:coverage": "jest --coverage"
}
```

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

```ts
/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import Index from '../routes/index.svelte';
import { render } from '@testing-library/svelte';
```

I import the `index.svelte` file, which is the home of the application. And then the `render` library from [_@testing-library/svelte_](https://github.com/testing-library/svelte-testing-library).

I add a blank test:

```ts
describe("Test if Jest is working", () => {
    test('Welcome', () => {});
});
```

Now I have to decide how and what to test. I want to test that there is an element on the page that says `Welcome to SvelteKit`.

```ts
describe("Test if Jest is working", () => {
	test('Welcome', () => {
		const { getByText } = render(Index);
		expect(getByText('Welcome to SvelteKit')).toBeInTheDocument()
	});
});
```

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

```ts
/**
 * @jest-environment jsdom
 */

import RandomButton from '@lib/RandomButton.svelte';
import { render } from '@testing-library/svelte';
```

The test fails. Obviously, because the `RandomButton` component doesn't exist yet. I create it.

```html
<button>Click Me!</button>
```

I add a test:

```ts
test('Button exist', () => {
  const { getByRole}  = render(RandomButton);
  const button = getByRole('button');
  expect(button).toBeVisible();
  }
)
```

The next step is to add a box to show a random number. I create the corresponding test and then update the component to be able to pass the test.

```ts
test('Button and Value are in the document', () => {
  const randomButton = render(RandomButton); 
  
  const button = randomButton.getByRole('button');
  expect(button).toBeVisible();
  
  const textValue = randomButton.getByTestId('value');
  expect(textValue).toBeVisible();
});
```

```html
<div>
	<button>Click Me!</button>
	<span data-testid="value" />
</div>
```

Well, now I move on to the style of the number. I add a test (which will fail) and then modify the component to pass the test:

```ts
test('Color value: red if < 0', () => {
  const randomButton = render(RandomButton, {value: -1});

  const textValue = randomButton.getByTestId('value');
  expect(textValue).toHaveTextContent("-1");

  expect(textValue).toHaveStyle(`
    background-color: red;
    color: white;
`);
})
```

```html
<script lang="ts">
	export let value: number = 0;
</script>

<div>
	<button>Click Me!</button>
	<span data-testid="value" class="red">{value}</span>
</div>

<style>
	.red {
		background-color: red;
		color: white;
	}
</style>
```

The next condition is to color the box green if the number is positive. I write the necessary test and then modify the code:

```ts
test('Color value: green if > 0', () => {
  const randomButton = render(RandomButton, {value: 1});

  const textValue = randomButton.getByTestId('value');
  expect(textValue).toHaveTextContent("1");

  expect(textValue).toHaveStyle(`
    background-color: green;
    color: yellow;
  `);
})
```

```html
<div>
	<button>Click Me!</button>
	<span data-testid="value" class={value < 0 ? 'red' : 'green'}>{value}</span>
</div>

<style>
	.red {
		background-color: red;
		color: white;
	}

	.green {
		background-color: green;
		color: yellow;
	}
</style>
```

So far I have checked the style of the element. In some cases it may also be useful to check for a class. I write the test to check the color of the button:

```ts
test('Button is blue', () => {
  const randomButton = render(RandomButton);
  const button = randomButton.getByRole('button');
  expect(button).toHaveClass('blue');
})
```

and then I change the element code:

```html
<script lang="ts">
	export let value: number = 0;
</script>

<div>
	<button class="blue">Click Me!</button>
	<span data-testid="value" class={value < 0 ? 'red' : 'green'}>{value}</span>
</div>

<style>
	.red {
		background-color: red;
		color: white;
	}

	.green {
		background-color: green;
		color: yellow;
	}

	.blue {
		background-color: blue;
		color: white;
	}
</style>
```

After completing the CSS part I move on to the events. They are two:

1. at the click a random number is generated (integer, positive or negative)
2. the random number is added to the value shown in the text box.

I start by setting up the first test, the one to generate a random number at the click of the button:

```ts
import { render, fireEvent } from '@testing-library/svelte';

test('Random Number on click', async () => {
  const randomButton = render(RandomButton);
  const button = randomButton.getByRole('button'); 
  await fireEvent.click(button);

  const randomNumber = randomButton.getByTestId('random-value');
  expect(randomNumber).toBeInTheDocument();
  expect(randomNumber).not.toBeVisible();
  expect(randomNumber).toHaveTextContent(/(.|\s)*\S(.|\s)*/);    
})
```

I then correct the component in order to pass the test

```html
<script lang="ts">
	export let value: number = 0;

	let randomValue: number = 0;

	function getRandomInt(min: number, max: number) {
		const positive = Math.random() > 0.5 ? 1 : -1;
		return positive * Math.floor(Math.random() * (max - min) + min);
	}

	function addRandomNumber() {
		randomValue = getRandomInt(1, 100);
	}
</script>

<div>
	<button class="blue" on:click={addRandomNumber}>Click Me!</button>
	<span data-testid="value" class={value < 0 ? 'red' : 'green'}>{value}</span>
	<div data-testid="random-value" class="hidden">{randomValue}</div>
</div>

<style>
	.hidden {
		display: none;
	}
</style>
```

I pass to the second test:

```ts
test('Change Value on Click', async () => {
  const randomButton = render(RandomButton);
  const button = randomButton.getByRole('button'); 
  const valueOriginal = parseInt(randomButton.getByTestId('value').textContent);

  await fireEvent.click(button);

  const randomNumber = parseInt(randomButton.getByTestId('random-value').textContent);
  const valueResult = randomButton.getByTestId('value');

  const valueExpected = valueOriginal + randomNumber;

  expect(valueResult).toHaveTextContent(`${valueExpected}`);
})
```

```html
<script lang="ts">
	function addRandomNumber() {
		randomValue = getRandomInt(1, 100);
		value += randomValue;
	}
</script>

<div>
	<button class="blue" on:click={addRandomNumber}>Click Me!</button>
	<span data-testid="value" class={value < 0 ? 'red' : 'green'}>{value}</span>
	<div data-testid="random-value" class="hidden">{randomValue}</div>
</div>
```

### Conclusions

That's it, at least for the moment. Obviously this is only a small guide, my knowledge is still limited. But I'm starting to have fun with that.

The code for this project is available on GitHub ([el3um4s/memento-sveltekit-jest](https://github.com/el3um4s/memento-sveltekit-jest)). It can be downloaded with the command:

```bash
npx degit el3um4s/memento-sveltekit-jest
```

And this is my Patreon: [patreon.com/el3um4s](https://patreon.com/el3um4s)