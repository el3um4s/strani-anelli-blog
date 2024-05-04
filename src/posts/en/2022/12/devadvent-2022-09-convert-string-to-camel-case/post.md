---
title: "DevAdvent 2022: #9 How To Convert A String To Camel Case In JavaScript"
published: true
date: 2022-12-09 13:00
categories:
  - DevAdvent
  - JavaScript
  - TypeScript
tags:
  - DevAdvent
  - JavaScript
  - TypeScript
cover: image.webp
lang: en
---

Today's De Advent problem requires some knowledge of regular expressions. I admit I'm not very good at this. This problem was interesting because it allowed me to explore my limits a little better.

### The problem

link to the [Kata](https://www.codewars.com/kata/517abf86da9663f1d2000003)

Complete the method/function so that it converts dash/underscore delimited words into camel casing. The first word within the output should be capitalized only if the original word was capitalized (known as Upper Camel Case, also often referred to as Pascal case). The next words should be always capitalized.

Examples

`the-stealth-warrior` gets converted to `theStealthWarrior`
`The_Stealth_Warrior` gets converted to `TheStealthWarrior`

### My solution

![Immagine](./image-2.webp)

As always, a good way to approach a problem is to break it down into smaller pieces. In general it is always a good idea. And it is especially so when you don't know the shortest way.

So, the steps to do are:

1. understand how to identify the characters that divide words (in this exercise they are `_` and `-`)
2. understand how to locate the character following the special character
3. Convert the letter to uppercase
4. remove the special character
5. return the result

My idea is to address all of this with a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions). But unfortunately I don't remember the correct syntax. So I decided to go for a hybrid thing.

I use the [String.split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split) method to split the string into many elements, each containing a word.

With a unique separator it's simple. I can write:

```js
const stringSplitted_A = str.split("-");
const stringSplitted_B = str.split("_");
```

With two or more fonts things can quickly get complicated. For this I use a simple regex to pass two or more different characters:

```js
const stringSplitted = str.split(/[_-]+/g);
```

This regex reads like this:

- `+`: find every relation
- `[ ]` of the characters between the square brackets (in this case `_` and `-`)
- `g` searching throughout the string

This way I get an array containing all the words.

![Immagine](./image-4.webp)

The next step is figuring out how to capitalize the first letter of a word. FreeCodeCamp has published a nice guide on this topic ([link](https://www.freecodecamp.org/news/javascript-capitalize-first-letter-of-word/)).

I use the [String.charAt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt) method to get the first character of the word. Then I use the [String.toUpperCase()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase) method to convert it to uppercase. Finally I use the [String.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice) method to get the rest of the word.

```js
const capitalizeFirstLetter = (w) => w.charAt(0).toUpperCase() + w.slice(1);
```

The next step is to iterate through all the elements of the array. My first idea is to use the [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method:

```js
const camelized = stringSplitted.map((w) => capitalizeFirstLetter(w));
```

But this code has a problem. It also modifies the first letter of the string. The problem, however, requires leaving the first letter in lowercase. Luckily Array.map() allows you to read the index of the element you are working on. Then I add a check on the index and modify only the words following the first one (the one in position `0`)

```js
const camelized = stringSplitted.map((w, i) =>
  i > 0 ? capitalizeFirstLetter(w) : w
);
```

Finally I join the various words again, they use the [Array.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) method.

This is the complete code of my solution:

```js
const capitalizeFirstLetter = (w) => w.charAt(0).toUpperCase() + w.slice(1);

function toCamelCase(str) {
  const stringSplitted = str.split(/[_-]+/g);
  const camelized = stringSplitted.map((w, i) =>
    i > 0 ? capitalizeFirstLetter(w) : w
  );
  return camelized.join("");
}
```

### The smartest solution

![Immagine](./image-3.webp)

One of the most interesting things about CodeWars is the possibility to see the solutions proposed by the other participants. As I suspected, there is a better way to solve the problem of converting a string to Camel Case.

Many have presented a solution similar to this:

```js
const toCamelCase = (s) => s.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
```

In this case I use the [String.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace). One thing I didn't know is the possibility of [using a function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_the_replacement) as an argument of this method.

But I start from the regex. Compared to mine, he adds:

- `( )` which tells the expression to capture any characters between the parentheses
- `.` denoting one (`1`) character

In other words, `[_-](.)` allows you to take only the first character following any of the characters between the square brackets.

The second argument of the replace method is a function. The first argument of this function is the string that matches the regex. The second argument is the first character captured by the regex.

With this I'm done. This problem was particularly interesting because it highlights the potential of regular expressions well. It was also the first one, in this DevAdvent, that got me into trouble in finding the best solution.
