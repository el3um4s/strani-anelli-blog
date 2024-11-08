---
title: Menu for Android (English)
published: true
date: 2021-06-27 21:00
categories:
  - Construct 3
  - JavaScript
tags:
  - Construct
  - JavaScript
  - menu-on-android
lang: en
cover: cover.webp
description: At first, I had decided to skip my weekly article on Construct 3. Then my android app was published on Google Play. What app? I created a demo of my menu for Construct 3 and I share it to the world.
---

At first, I had decided to skip my weekly article on Construct 3. Then my android app was published on Google Play. What app? I created a demo of my menu for Construct 3 and I share it to the world.

I thought I could use the browser version without making any changes but in reality I had to make a change to the code for Android. I have to load the `menu.js` file in the `file` folder and not in that `scripts`. Consequently, the file must be imported manually when starting the compiled app.

```js
runOnStartup(async runtime => {
	globalThis.g_runtime = runtime;
	await runtime.assets.loadScripts("menu.js");
});
```

I had to pay attention on the _touch event_: it's slightly different from _click event_.

![Immagine](./delay.webp)

I had to wait a moment before I can show the menu. Why? Because the touch event triggers the _show event_ in C3 and the _hide event_ in the menu. Waiting for 1/10 second allows Android to distinguish the two events.

![test-electron-reload.gif](./animation.gif)

One last thing before ending this post. I had already tried to publish some android apps a few years ago. Beyond the not exactly exciting result, and my lack of confidence in the result, I remember a difficult procedure. Construct 3, on the other hand, turned out to be a pleasant surprise.

The only thing a bit confusing is what kind of choice to make when exporting to Android.

![Immagine](./settings-android.webp)

I used this settings:

- **Debug APK** for testing purpose (with my smartphone)
- **Signed Android App Bundle** to load the app on Google Play

The other thing that has given me some headaches is how to check the error messages generated by the app. The problem is my poor knowledge of mobile development. It was enough to connect the phone to the PC via a USB cable, enable the "USB Debugging" mode from the "Developer Options" and go to the [chrome://inspect/#devices](chrome://inspect/#devices). page.

Here are the links of the project, starting with the app on Google Play

- [Poemia on Google Play](https://play.google.com/store/apps/details?id=com.stranianelli.menu)
- [the online demo](https://c3demo.stranianelli.com/javascript/013-menu-for-android/demo/)  
- [the project on GitHub](https://github.com/el3um4s/construct-demo)
- [the c3p](https://c3demo.stranianelli.com/javascript/013-menu-for-android/source/c3p/menu-for-android.c3p)
- [menu.js](https://c3demo.stranianelli.com/javascript/012-menu/source/lib-menu/menu.js)
- [menu.css](https://c3demo.stranianelli.com/javascript/012-menu/source/lib-menu/menu.css)
- [Patreon](https://www.patreon.com/el3um4s)