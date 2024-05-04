---
title: How to test if a DOM element exists in a Svelte component with Jest
published: true
date: 2021-11-17 17:00
categories:
  - Svelte
  - TypeScript
tags:
  - Svelte
  - how-to-test-if-dom-element-exists-with-jest-and-svelte
  - test-sveltekit-app-with-jest
  - TypeScript
lang: en
cover: cover.webp
description: "A quick post about a problem: how to test if an element exists in a component. I omit the part relating to the configuration of Jest with SvelteKit, I talked about it a short time ago. I focus only on this problem."
---

A quick post about a problem: how to test if an element exists in a component. I omit the part relating to the [configuration of Jest with SvelteKit](https://blog.stranianelli.com/test-sveltekit-app-with-jest-english/), I talked about it a short time ago. I focus only on this problem.

I want to run 3 tests:

1. if an element exists within a Svelte component
2. if the element exists and contains a given text
3. if the item does not exist on the page

I use as an example the tests I am implementing for my component [svelte-component-info](https://github.com/el3um4s/svelte-component-info):

```ts
/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/svelte';
import { SvelteInfo } from '../../lib/index';

test('should render component in the page', () => {
    const svelteInfo = render(SvelteInfo, { name:"Hello", info: { props: [], actions: [] } });
    
    expect(svelteInfo.queryByRole("heading")).toBeTruthy();
    
    const title = svelteInfo.getByRole("heading");
    
    expect(title).toBeInTheDocument();
    expect(title).toBeVisible();
    expect(title).toHaveTextContent("Hello");

    expect(svelteInfo.queryByTestId("description")).toBeNull();
});
```

### Check that an element exists in a Svelte component

The first is easy. After creating the component I use [Jest](https://jestjs.io/) to locate the element. In this case, I am looking for an element with tag `H1`:

```ts
expect(svelteInfo.queryByRole("heading")).toBeTruthy();
```

This way Jest checks if the Svelte component contains an element with the ARIA Role `heading`. If it does not find it, the test fails.

### Check that an element has specific text

If I want to check that an element has a specific property I use a different code. First I capture the element

```ts
const title = svelteInfo.getByRole("heading");
```

Then I check the text:

```ts
expect(title).toHaveTextContent("Hello");
```

I recommend consulting the [testing-library/jest-dom](https://github.com/testing-library/jest-dom) repository to know the other options available.

### Check that an item does not exist in Svelte

Finally, the less intuitive thing: how to check that an element **NOT** is present in a WEB page or a Svelte element. In this case, I use code like the first one but instead of using `expect(..).toBeTruthy()` I use `expect(...).toBeNull()`:

```ts
expect(svelteInfo.queryByTestId("description")).toBeNull();
```

That's all. As already mentioned, it's a quick note to remind the future me how to test the existence or not of an element.
