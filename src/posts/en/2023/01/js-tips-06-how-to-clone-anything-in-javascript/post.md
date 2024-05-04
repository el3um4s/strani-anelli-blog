---
title: "JS Tips #6: How to clone anything in JavaScript"
published: true
date: 2023-01-05 14:00
categories:
  - JavaScript
  - TypeScript
tags:
  - JavaScript
  - TypeScript
cover: image.webp
lang: en
description: "A few days ago, I read an article by Flavio Copes (who is always a treasure trove of information). Flavio reports on a very rapid and powerful method for cloning anything in JavaScript: the `structuredClone()` method. And in doing so, I spoiled the end of this post. But now let's take things in order and start from the beginning."
---

A few days ago, I read an article by [Flavio Copes](https://flaviocopes.com/how-to-clone-javascript/) (who is always a treasure trove of information). Flavio reports on a very rapid and powerful method for cloning anything in JavaScript: the `structuredClone()` method. And in doing so, I spoiled the end of this post. But now let's take things in order and start from the beginning.

The beginning is the problem of using variables in JavaScript. When we use primitive variables (i.e. strings, numbers, booleans, etc.), we don't have problems because they are passed by value. But when we use objects, arrays, dates, anything, we have problems because they are passed by reference. And this means that if I modify an object, I also modify the original object. To understand:

```js
const a = { name: "John" };
const b = a;
b.name = "Jane";
console.log(a.name); // Jane
```

But with a primitive variable:

```js
const a = "John";
const b = a;
b = "Jane";
console.log(a); // John
```

When we want to work with a copy of an object, we have to do something different. Some methods are usually recommended.

### Spread operator (`...`)

![Immagine](./image-02.webp)

We can usw the spread operator `...` to create a new object that has the same properties and values as the original object. This is a shallow copy, which means that if the original object has nested objects, the copy will still contain references to the original nested objects. Here is an example:

```js
const a = { name: "John", age: 30 };
const b = { ...a };
b.name = "Jane";
console.log(a.name); // John

const c = { name: "John", age: 30, address: { city: "Rome" } };
const d = { ...c };
d.address.city = "Milan";
console.log(c.address.city); // Milan
```

### Object.assign()

![Immagine](./image-03.webp)

We can also use the `Object.assign()` method. It works similarly to the spread operator, but it is a bit more complicated. And it has the same problems: if there are nested objects within the original object, the copy will retain the references. As in this example:

```js
const a = { name: "John", age: 30 };
const b = Object.assign({}, a);
b.name = "Jane";
console.log(a.name); // John

const c = { name: "John", age: 30, address: { city: "Rome" } };
const d = Object.assign({}, c);
d.address.city = "Milan";
console.log(c.address.city); // Milan
```

### JSON.parse(JSON.stringify())

![Immagine](./image-04.webp)

To solve the problem, we (or rather, we used to) have to resort to a combination of methods. We can use `JSON.stringify()` to convert the object into a JSON string. Then I take the JSON string and convert it back into an object with `JSON.parse()`. To understand, like this:

```js
const a = { name: "John", age: 30 };
const b = JSON.parse(JSON.stringify(a));
b.name = "Jane";
console.log(a.name); // John

const c = { name: "John", age: 30, address: { city: "Rome" } };
const d = JSON.parse(JSON.stringify(c));
d.address.city = "Milan";
console.log(c.address.city); // Rome
```

This method works, but it is a bit slow.

### structuredClone()

![Immagine](./image-05.webp)

And that's where the [`structuredClone()`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) method comes into play. The syntax is very simple:

```js
structuredClone(value);
structuredClone(value, options);
```

And the use is even simpler:

```js
const a = { name: "John", age: 30 };
const b = structuredClone(a);
b.name = "Jane";
console.log(a.name); // John

const c = { name: "John", age: 30, address: { city: "Rome" } };
const d = structuredClone(c);
d.address.city = "Milan";
console.log(c.address.city); // Rome
```

Well, I would say that the best method for copying an object in JavaScript is definitely `structuredClone()`.
