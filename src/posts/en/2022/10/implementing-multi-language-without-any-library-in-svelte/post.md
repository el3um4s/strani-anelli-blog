---
title: Implementing Multi Language Without Any Library in Svelte
published: true
date: 2022-10-18 20:00
categories:
  - TypeScript
  - JavaScript
  - Svelte
tags:
  - TypeScript
  - JavaScript
  - Svelte
  - implementing-multi-language-without-any-library-in-svelte
lang: en
cover: image.webp
description: I continue with my notes regarding my app for encrypting and decrypting text messages (DoCrypt.org). I decided to use two languages, Italian and English. But I intend to add more languages in the future. I have chosen to create a specific component to manage the different languages. I think it's an easy way to build multilingual apps. In this post I talk about how to create a multilingual component with Svelte.
---

I continue with my notes regarding my app for encrypting and decrypting text messages ([DoCrypt.org](https://docrypt.org/)). I decided to use two languages, Italian and English. But I intend to add more languages in the future. I have chosen to create a specific component to manage the different languages. I think it's an easy way to build multilingual apps. In this post I talk about how to create a multilingual component with Svelte.

I use [Svelte](https://svelte.dev/), because it's simple. It can also translate all the components of the application in real time.

The idea is simple: I create a component to display the text in a specific language. To decide in which language, I use a [store](https://svelte.dev/docs#run-time-svelte-store), which is a general variable that I can access from any other component. This way, if I decide to change the language, all the components that show some text update automatically.

```ts
import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

const languageStore: Writable<string> = writable("en");

const lang = {
  subscribe: languageStore.subscribe,
  set: (language: string) => {
    languageStore.set(language);
  },
};

export default lang;
```

This way, I can change the language anywhere in the application, simply by using `lang.set("it")` or `lang.set("en")`.

The second step is to create a dictionary. I can use various techniques, but for a small project one object is enough.

```ts
export const languages = {
  Home: {
    Encrypt: {
      en: "Encrypt",
      it: "Cifra",
    },
    "Encrypt your text": {
      en: "Encrypt your text",
      it: "Cifra un messaggio di testo",
    },
  },
  ManagePassword: {
    "Random Password": {
      en: "Random Password",
      it: "Password Casuale",
    },
    "Generate Random Password": {
      en: "Generate Random Password",
      it: "Crea un password a caso",
    },
  },
};
```

At the first level I enter the name of the page that is displayed (for example, `Home`), at the second level a string that identifies the text I want to show (for example, `Encrypt`), at the third level the translation identified by the language (for example, `en`).

Now I can access the translation of a string on a specific page, using `languages.Home.Encrypt.en` or `languages.Home.Encrypt.it`.

Finally I need a component whose only job is to read the string value and insert it into another component:

```html
<script lang="ts">
  import lang from "./Lang";
  import { languages } from "./Languages";

  export let p: string;
  export let w: string;
</script>

{languages[p][w][$lang]}
```

Instead of `{languages[p][w][$lang]}` I can use `{@html languages[p][w][$lang]}` to use HTML tags in the string. I think it's a good idea to translate some text with some formatting or links. But for simple text such as button labels this is not necessary.

![copied-to-clipboard.gif](./change-lang.gif)

To use this component, I can use code similar to this:

```html
<script lang="ts">
  import Lang from "../../UI/Languages/Lang.svelte";
</script>

<ul>
  <li>
    <Lang p="Home" w="Encrypt" />
  </li>
  <li>
    <Lang p="Home" w="Encrypt your text" />
  </li>
  <li>
    <Lang p="ManagePassword" w="Random Password" />
  </li>
  <li>
    <Lang p="ManagePassword" w="Generate Random Password" />
  </li>
</ul>
```

### Save the settings

The problem is that the user has to manually reset the language each time they visit the site. To fix this, I can save the user's preferred language in the browser. When the user visits the site, he uses his preferred language.

To do this I can use [Jake Archibald](https://github.com/jakearchibald)'s [IDB-Keyval](https://www.npmjs.com/package/idb-keyval) library. This library allows you to save and read values from a local database.

I add the library to my project:

```bash
npm install idb-keyval
```

So I create a new file

```ts
import { get, set, createStore } from "idb-keyval";

import type { LangSupported } from "./Languages";
import { isOfTypeLangSupported } from "./Languages";

const customDbName = "idb-lang";
const customStoreName = "idb-lang-store";

const customStore = createStore(customDbName, customStoreName);

export const setLang = async (l: LangSupported) => {
  await set("lang", l, customStore);
};

export const getLang = async () => {
  const lang = await get("lang", customStore);

  let l = getBrowserLanguage();

  if (lang === undefined) {
    await setLang(l);
    return l;
  }

  return lang;
};

function getBrowserLanguage(): LangSupported {
  const lang = navigator.language.split("-")[0].toLowerCase();
  const result = isOfTypeLangSupported(lang) ? lang : "en";
  return result;
}
```

I use the `setLang` function to set the default language. I also use `getLang` to read the preferred language from the browser memory. If the user has never set a language, the `getLang` function will return the browser language.

Then I modify the Svelte store to apply any changes to the local database:

```ts
const lang = {
  subscribe: languageStore.subscribe,
  set: (language: LangSupported) => {
    languageStore.set(language);
    setLang(language);
  },
};
```

Finally I change the main page of the app to read the preferred language on startup:

```ts
import { onMount } from "svelte";

import lang from "./Components/UI/Languages/Lang";
import { getLang } from "./Components/UI/Languages/IndexDB";

onMount(async () => {
  const langDB = await getLang();
  lang.set(langDB);
});
```

Well, that's all for now. If you want to see the full code, you can find it on [GitHub](https://github.com/el3um4s/docrypt). The application is available on [docrypt.org](https://docrypt.org/).
