---
title: "Implementing Multi Language Without Any Library in Svelte"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Towfiqu barbhuiya**](https://unsplash.com/@towfiqu999999)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-10-18 20:00"
categories:
  - javascript
  - svelte
  - typescript
  - html
  - css
tags:
  - javascript
  - svelte
  - typescript
  - html
  - css
---

I continue with my notes regarding my app for encrypting and decrypting text messages (DoCrypt.org[DoCrypt.org](https://docrypt.org/)). I decided to use two languages, Italian and English. But I intend to add more languages in the future. I have chosen to create a specific component to manage the different languages. I think it's an easy way to build multilingual apps. In this post I talk about how to create a multilingual component with Svelte.

I use [Svelte](https://svelte.dev/), because it's simple. It can also translate all the components of the application in real time.

The idea is simple: I create a component to display the text in a specific language. To decide in which language, I use a [store](https://svelte.dev/docs#run-time-svelte-store), which is a general variable that I can access from any other component. This way, if I decide to change the language, all the components that show some text update automatically.

<script src="https://gist.github.com/el3um4s/35c364a2044a0419468cfdfd5117bda3.js"></script>

This way, I can change the language anywhere in the application, simply by using `lang.set("it")` or `lang.set("en")`.

In questo modo, posso cambiare la lingua in qualsiasi punto dell'applicazione, semplicemente usando `lang.set("it")` o `lang.set("en")`.

The second step is to create a dictionary. I can use various techniques, but for a small project one object is enough.

<script src="https://gist.github.com/el3um4s/e40ef73c445c5a7df96a4c033630839d.js"></script>

At the first level I enter the name of the page that is displayed (for example, `Home`), at the second level a string that identifies the text I want to show (for example, `Encrypt`), at the third level the translation identified by the language (for example, `en`).

Now I can access the translation of a string on a specific page, using `languages.Home.Encrypt.en` or `languages.Home.Encrypt.it`.

Finally I need a component whose only job is to read the string value and insert it into another component:

<script src="https://gist.github.com/el3um4s/da97bf7c944499f2b0981516a2209c5d.js"></script>

Instead of `{languages[p][w][$lang]}` I can use `{@html languages[p][w][$lang]}` to use HTML tags in the string. I think it's a good idea to translate some text with some formatting or links. But for simple text such as button labels this is not necessary.

![copied-to-clipboard.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-10-18-come-creare-componenti-multilingue-con-svelte/change-lang.gif)

To use this component, I can use code similar to this:

<script src="https://gist.github.com/el3um4s/1c9a47f569b81275daf7176bf1772b66.js"></script>

### Save the settings

The problem is that the user has to manually reset the language each time they visit the site. To fix this, I can save the user's preferred language in the browser. When the user visits the site, he uses his preferred language.

To do this I can use [Jake Archibald](https://github.com/jakearchibald)'s [IDB-Keyval](https://www.npmjs.com/package/idb-keyval) library. This library allows you to save and read values from a local database.

I add the library to my project:

```bash
npm install idb-keyval
```

So I create a new file

<script src="https://gist.github.com/el3um4s/cbeb3bb1bec50a9209a9020ea7dbfbd8.js"></script>

I use the `setLang` function to set the default language. I also use `getLang` to read the preferred language from the browser memory. If the user has never set a language, the `getLang` function will return the browser language.

Then I modify the Svelte store to apply any changes to the local database:

<script src="https://gist.github.com/el3um4s/2e5f8936104fc19620813f0d9b0f7232.js"></script>

Finally I change the main page of the app to read the preferred language on startup:

<script src="https://gist.github.com/el3um4s/310626c7f17a443bdef3f7fc5114b6de.js"></script>

Well, that's all for now. If you want to see the full code, you can find it on [GitHub](https://github.com/el3um4s/docrypt). The application is available on [docrypt.org](https://docrypt.org/).
