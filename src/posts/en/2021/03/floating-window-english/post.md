---
title: Floating Window (English)
published: true
date: 2021-03-28 19:00
categories:
  - Construct 3
  - JavaScript
  - Electron
tags:
  - Construct
  - JavaScript
  - floating-window
  - Electron
lang: en
cover: cover.webp
description: "This week I picked up Electron but something didn't work as I expected. The latest updates of Construct 3, NodeJS and Electron have generated a bizarre combination: everything works on the first start, but with each subsequent launch of the program something different breaks. Now I find myself in the position of having to decide whether to publish some things that no longer concern C3. I have to think about it. Today I can talk about my latest template: Floating Window."
---

This week I picked up [Electron](https://www.electronjs.org/) but something didn't work as I expected. The latest updates of Construct 3, NodeJS and Electron have generated a bizarre combination: everything works on the first start, but with each subsequent launch of the program something different breaks. Now I find myself in the position of having to decide whether to publish some things that no longer concern C3. I have to think about it. Today I can talk about my latest template: **Floating Window**.

![floating animation](./animation.gif)

The idea is to create a Chrome window that can move around the PC screen revealing something different depending on the position. As if it were a camera capable of framing a parallel reality. I would like to be able to export it to Windows via WebView2, but there is still some problem in exporting. But the underlying code works. It works and it's very simple:

```js
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

const camera = runtime.objects.Camera.getFirstInstance();
const winX = globalThis.screenX;
const winY = globalThis.screenY;
const x = lerp(winX, camera.x, 0.25);
const y = lerp(winY, camera.y, 0.25);

globalThis.moveTo(x, y);
```

The `lerp` function only serves to make the window movement more juicy. `globalThis.screenX` and `globalThis.screenY` allow you to get the position of the browser window on the screen. `globalThis.moveTo(x, y)` moves the window to the `(x, y)` position of the PC screen.

But what is [`globalThis`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/globalThis)? Let's say it is the quickest way to access the `Window` from C3.

Obviously when something is built, unexpected difficulties always arise. In this case it's "_how do I resize the window to the size I need?_". The simplest answer is by using [`Window.resizeTo()`](https://developer.mozilla.org/docs/Web/API/Window/resizeTo). But that's not enough. This method sets the size of the overall window instead we need the size of the web page to be identical to that of the Construct viewport. The size of the web page can be found via [`Element.clientHeight`](https://developer.mozilla.org/docs/Web/API/Element/clientHeight). In this case the reference element is the entire `HTML`.

```js
const realSize = document.getElementsByTagName("html")[0];
const realSizeHeight = realSize.clientHeight
const realSizeWidth = realSize.clientWidth;
```

After finding the actual size of the window we can calculate how long it takes to reach the exact size:

```js
const targetSize = 256; // runtime.globalVars.TargetSize;
const deltaHeight = targetSize - realSizeHeight;
const deltaWidth = targetSize - realSizeWidth;
```

And then use [`Window.resizeBy()`](https://developer.mozilla.org/docs/Web/API/Window/resizeBy) to resize the browser window:

```js
globalThis.resizeBy(deltaWidth,deltaHeight);
```

![floating animation](./animation-little.gif)


One problem remains: how to open the online demo so that you can test the template? By default Chrome (and I think all browsers) open links either in the same tab or in a new window. But we need to open the template in a popup window:

```js
window.open("https://c3demo.stranianelli.com/template/017-floating-window/demo","test", "width=256,height=256,menubar=false,toolbar=false,location=false,resizable=false,status=false")
```

That’s all. The code for this project is available on GitHub:

- [the project on GitHub](https://github.com/el3um4s/construct-demo)
- [the online demo](https://c3demo.stranianelli.com/template/017-floating-window/demo)
- [Patreon](https://www.patreon.com/el3um4s)
