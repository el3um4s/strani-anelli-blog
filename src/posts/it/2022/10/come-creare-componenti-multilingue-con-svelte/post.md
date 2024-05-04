---
title: Come creare componenti multilingue con Svelte
published: true
date: 2022-10-18 17:00
categories:
  - TypeScript
  - JavaScript
  - Svelte
tags:
  - TypeScript
  - JavaScript
  - Svelte
  - implementing-multi-language-without-any-library-in-svelte
lang: it
cover: image.webp
description: Continuo con i miei appunti riguardo la mia app per cifrare e decifrare messaggi di testo (DoCrypt.org). Ho deciso di usare due lingue, l'italiano e l'inglese, lasciandomi aperture per altre lingue in futuro. Ho scelto di creare un componente specifico per gestire questo, nel tentativo di rendere il procedimento il più semplice possibile. In questo post vedremo come creare un componente multilingue con Svelte.
---

Continuo con i miei appunti riguardo la mia app per cifrare e decifrare messaggi di testo ([DoCrypt.org](https://docrypt.org/)). Ho deciso di usare due lingue, l'italiano e l'inglese, lasciandomi aperture per altre lingue in futuro. Ho scelto di creare un componente specifico per gestire questo, nel tentativo di rendere il procedimento il più semplice possibile. In questo post vedremo come creare un componente multilingue con Svelte.

Uso [Svelte](https://svelte.dev/), per semplicità e perché mi permette di tradurre in tempo reale tutta l'applicazione.

L'idea alla base è semplice: creo un componente il cui unico scopo è mostrare del testo in una lingua specifica. Per decidere in quale lingua, uso uno [store](https://svelte.dev/docs#run-time-svelte-store), ovvero una variabile generale a cui posso accedere da ogni altro componente. In questo modo, se decido di cambiare lingua, tutti i componenti che mostrano del testo si aggiornano automaticamente.

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

In questo modo, posso cambiare la lingua in qualsiasi punto dell'applicazione, semplicemente usando `lang.set("it")` o `lang.set("en")`.

Il secondo passo è creare un dizionario. Posso usare varie tecniche, ma per un progetto tutto sommato piccolo penso possa bastare un oggetto.

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

Ho deciso di seguire questa convenzione. Al primo livello inserisco il nome della pagina che viene visualizzata (per esempio, `Home`), al secondo livello una stringa che identifica il testo che voglio mostrare (per esempio, `Encrypt`), al terzo livello la traduzione identificata dalla lingua (per esempio, `en`).

In questo modo posso accedere alla traduzione di una stringa in una pagina specifica, usando `languages.Home.Encrypt.en` o `languages.Home.Encrypt.it`.

Infine mi serve un componente il cui unico compito è leggere il valore della stringa e inserirlo in un altro componente:

```html
<script lang="ts">
  import lang from "./Lang";
  import { languages } from "./Languages";

  export let p: string;
  export let w: string;
</script>

{languages[p][w][$lang]}
```

Invece di `{languages[p][w][$lang]}` posso usare `{@html languages[p][w][$lang]}` per utilizzare dei tag HTML nella stringa. Penso che sia una buona idea per tradurre del testo con della formattazione o dei link. Ma per dei testi semplici come le etichette dei pulsanti non è necessario.

![copied-to-clipboard.gif](./change-lang.gif)

Per utilizzare questo componente, posso usare un codice simile a questo:

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

### Salvare le impostazioni

Il problema principale di questo approccio è che l'utente deve reimpostare manualmente la lingua ogni volta che visita il sito. Per risolvere questo problema, posso salvare la lingua preferita dell'utente nel browser. In questo modo, quando l'utente visita il sito, vedrà la lingua che ha scelto in precedenza.

Per farlo posso usare la libreria [IDB-Keyval](https://www.npmjs.com/package/idb-keyval) di [Jake Archibald](https://github.com/jakearchibald). Questa libreria permette di salvare e leggere valori da un database locale.

Aggiungo la libreria al mio progetto:

```bash
npm install idb-keyval
```

Quindi creo un nuovo file

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

Uso la funzione `setLang` per impostare la lingua predefinita. Uso inoltre `getLang` per leggere dalla memoria del browser la lingua preferita. Se l'utente non ha mai impostato una lingua, la funzione `getLang` restituirà la lingua del browser.

Modifico poi lo store di Svelte per applicare ogni modifica anche al database locale:

```ts
const lang = {
  subscribe: languageStore.subscribe,
  set: (language: LangSupported) => {
    languageStore.set(language);
    setLang(language);
  },
};
```

Infine modifico la pagina principale dell'app per leggere la lingua preferita all'avvio:

```ts
import { onMount } from "svelte";

import lang from "./Components/UI/Languages/Lang";
import { getLang } from "./Components/UI/Languages/IndexDB";

onMount(async () => {
  const langDB = await getLang();
  lang.set(langDB);
});
```

E con questo per oggi ho finito. Se vuoi vedere il codice completo, puoi trovarlo su [GitHub](https://github.com/el3um4s/docrypt). L'applicazione invece è disponibile su [docrypt.org](https://docrypt.org/).
