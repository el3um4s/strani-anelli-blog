---
title: "JS Tips #2: Format phone number by template"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-12-29 09:00"
categories:
  - js
  - ts
  - javascript
  - typescript
tags:
  - js
  - ts
  - javascript
  - typescript
---

Today's problem involves formatting a phone number based on a template. It is an interesting puzzle because it is very useful. I had the opportunity, some time ago, to develop a Microsoft Access application to manage lists of phone numbers. One of the most interesting aspects was understanding how to display phone numbers based on the country of the number itself. Or, how to display a phone number based on a template. In this post, I tackle the same problem, but in JavaScript.

### The Problem: Format phone number by template

link to the [kata](https://www.codewars.com/kata/61393fd03e441f001ac9c7d4)

You need to write a function that will format a phone number by a template.

You're given number and string.

If there are more digits than needed, they should be ignored

if there are less digits than needed, should return Invalid phone number

Examples

```
(79052479075, "+# ### ### ## ##") => "+7 905 247 90 75"
(79052479075, "+# (###) ### ##-##") => "+7 (905) 247 90-75"
(79052479075, "+# ### ### ## ##") => "+7 905 247 90 75"
(81237068908090, "+## ### ### ## ##") => "+81 237 068 90 80"
(8123706890, "+## ### ### ##-##") => "Invalid phone number"
(911, "###") => "911"
(112, "+ () -") => "+ () -"
```

### My Solution

{% include picture img="image-2.webp" ext="jpg" alt="a Kawai cute little cartoon vintage telephon character, beautiful light. soft colour scheme, 8 k render, children book illustration, in the style of Jon Klassen" %}

I am quite satisfied with my solution. I decided to use a Regular Expression to solve the problem. I just need a simple RegEx that identifies the hashtags (`#`) in the template:

```ts
const re: RegExp = /#/g;
```

Using this RegEx, I can count all the hashtags in the template. This allows me to understand if the number of digits in the number is sufficient to meet the template.

```ts
const len: number = template.match(re)?.length ?? -1;
```

I cannot use `length` directly on the RegEx because it could be `undefined`. In this case, I return `-1` to indicate that I did not find any hashtags.

To calculate the number of digits in the number, it is sufficient to convert it to a string and count the digits:

```ts
const num: string = number.toString();
```

If the number of digits in the number is less than the number of hashtags, I return `Invalid phone number`.

```ts
if (num.length < len) {
  return "Invalid phone number";
}
```

To replace the hashtags in the template with the digits in the number, I could use a `for` loop. But in this case, I don't need it. I just need to call `replace` on the template string. This way, every time I find a hashtag, I replace the character with the corresponding digit.

```ts
let i = 0;
let result = template.replace(re, () => num[i++]);
```

I had to use a variable external to the `replace` loop to keep track of the index of the current digit. In this way, every time I find a hashtag, I replace the character with the corresponding digit. Additionally, I took advantage of the property of the Increment (`++`) operator:

```
The increment (++) operator increments (adds one to) its operand and returns the value before or after the increment, depending on where the operator is placed.
```

In this way, I increase the index only after the substitution has been made.

Putting everything together, I get the following solution:

```ts
export const formatNumber = (number: number, template: string): string => {
  const re: RegExp = /#/g;
  const num: string = number.toString();
  const len: number = template.match(re)?.length ?? -1;

  let i = 0;
  let result =
    num.length < len
      ? "Invalid phone number"
      : template.replace(re, () => num[i++]);
  return result;
};
```

### A better solution

{% include picture img="image-3.webp" ext="jpg" alt="a Kawai cute little cartoon vintage telephon character, beautiful light. soft colour scheme, 8 k render, children book illustration, in the style of Jon Klassen" %}

But as satisfied as I am with my solution, there is another way to format a phone number based on a template. The solution is not mine, but was proposed by another user. The solution is much more elegant and readable.

```js
export function formatNumber(number: number, template: string): string {
  for (const digit of `${number}`) template = template.replace("#", digit);
  if (template.includes("#")) return "Invalid phone number";
  return template;
}
```

In this case, we use a `for...of` loop to iterate over all the digits in the number. In this way, it is sufficient to replace each hashtag with the corresponding digit.

Even the control condition is relatively simple. If the template still contains hashtags, it means that the number of digits in the number is less than the number of hashtags. In this case, I return `Invalid phone number`.

I can also use this method to check whether the number of digits in the number is sufficient to meet the template. In this way, I can simplify my solution a bit:

```ts
export const formatNumber = (n: number, template: string, i = 0): string => {
  let result: string = template.replace(/#/g, () => `${n}`[i++] ?? "#");
  return result.includes("#") ? "Invalid phone number" : result;
};
```
