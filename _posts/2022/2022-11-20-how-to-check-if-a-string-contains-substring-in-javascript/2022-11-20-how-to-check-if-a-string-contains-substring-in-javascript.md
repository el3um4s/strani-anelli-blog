---
title: "How To Check If A String Contains Substring In JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-11-20 17:45"
categories:
  - javascript
tags:
  - javascript
---

One of the funniest things about programming is finding all the available ways to solve a problem. Today I want to find 10 methods to check if a string contains a substring in JavaScript.

### String.prototype.includes()

Let's start with the best solution, the [`String.prototype.includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes) method. This method allows you to check if a string contains a substring, and returns a boolean value.

```js
const string = "Hello World!";

console.log(string.includes("Hello")); // true
console.log(string.includes("!")); // true
console.log(string.includes("Hello World!")); // true

console.log(string.includes("Hello World!!")); // false
```

Its main limitation is that it is case-sensitive, so it doesn't work with strings that contain uppercase and lowercase characters.

```js
const string = "Hello World!";
console.log(string.includes("hello")); // false
```

We can fix this by making the string lowercase before performing the check.

```js
const string = "Hello World!";
const substring = "HeLLo";
console.log(string.toLowerCase().includes(substring.toLowerCase())); // true
```

### String.prototype.indexOf()

A second method uses [`String.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf). This method returns the index of the first occurrence of a substring within a string, or -1 if not found. I can then convert the index to a boolean value.

```js
const string = "Hello World!";

console.log(string.indexOf("Hello") !== -1); // true
console.log(!string.indexOf("Hello")); // true
```

Again, the method is case-sensitive.

```js
const string = "Hello World!";
const substring = "HeLLo";

console.log(!string.indexOf(substring)); // false

console.log(!string.toLowerCase().indexOf(substring.toLowerCase())); // true
```

### Polyfill

If I have to use a legacy browser (I sometimes do), it is still possible to create a polyfill to add the `String.prototype.includes()` method. To do this I use `String.prototype.indexOf()` again but hide it in an `includes()` method.

```js
if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    "use strict";
    if (typeof start !== "number") {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}
```

### Knuth–Morris–Pratt algorithm

Another solution is to use the [Knuth–Morris–Pratt](https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm). This algorithm, from the 1970s, allows very fast searching, and is often used as a basis for other string search algorithms. This is[Nayuki](https://www.nayuki.io/res/knuth-morris-pratt-string-matching/kmp-string-matcher.js)'s version

```js
function kmpSearch(pattern, text) {
  if (pattern.length == 0) return 0; // Immediate match

  // Compute longest suffix-prefix table
  var lsp = [0]; // Base case
  for (var i = 1; i < pattern.length; i++) {
    var j = lsp[i - 1]; // Start by assuming we're extending the previous LSP
    while (j > 0 && pattern[i] !== pattern[j]) j = lsp[j - 1];
    if (pattern[i] === pattern[j]) j++;
    lsp.push(j);
  }

  // Walk through text string
  var j = 0; // Number of chars matched in pattern
  for (var i = 0; i < text.length; i++) {
    while (j > 0 && text[i] != pattern[j]) j = lsp[j - 1]; // Fall back in the pattern
    if (text[i] == pattern[j]) {
      j++; // Next char matched, increment position
      if (j == pattern.length) return i - (j - 1);
    }
  }
  return -1; // Not found
}

console.log(kmpSearch("ays", "haystack") != -1); // true
console.log(kmpSearch("asdf", "haystack") != -1); // false
```

### Other solutions

But these are not the only paths we can take. There are other possibilities, as long as you push JavaScript a bit. I don't recommend using them, but they are interesting to understand how JavaScript works.

In the next examples I will use two variables, `string` and `substring`, which will contain respectively the string and the substring to search for.

```js
const string = "Hello World!";
const substring = "Hello";
```

I can use [`String.prototype.match()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) to match the result of a regular expression search. If the search finds nothing, it returns `null`. I then convert the result into a boolean value.

```js
console.log(!!string.match(substring)); // true
```

Similarly [`String.prototype.search()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search) returns `-1` if the search finds nothing. So I just check that the result is greater than or equal to zero.

```js
console.log(string.search(substring) >= 0); // true
```

Another method can be to replace the substring with an empty value and check that the length of the string has changed. Or I can also simply verify that it is not equal to itself. To do this I use the [`String.prototype.replace()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) method

```js
console.log(string.replace(substring, "") != string); // true
console.log(string.replace(substring, "").length != string.length); // true
```

### startWith() and endsWith()

Finally, if I want to check only the start or end I can use [`String.prototype.startsWith()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith) and [`String.prototype.endsWith()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)

```js
const string = "Hello World!";

console.log(string.startsWith("Hello")); // true
console.log(string.endsWith("!")); // true
```

These two methods can be useful in particular cases, and it may happen that you have to use them more than you might think. But if you want to do a generic search, it's better to use another solution.

### Conclusions

Well, I would say that these ten solutions are enough. Beyond the entertainment related to this specific case, it is always worth dedicating some time to explore the various solutions available. The first idea is not always the best. And, in general, it's a good way to learn more about a topic and improve your skills.
