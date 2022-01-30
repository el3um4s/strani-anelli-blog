---
title: "Come aprire cartelle e file con Chrome"
title_eng: "How To Serve a Local Folder of Files in Your Browser"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**David Bruno Silva**](https://unsplash.com/@brlimaproj)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-01-28 17:00"
categories:
  - Browser
  - Server
  - Folder
tags:
  - Browser
  - Server
  - Folder
---

Una delle difficoltà che sto incontrando lavorando sul progetto [gest-dashboard](https://javascript.plainenglish.io/the-journey-of-a-novice-programmer-82366ec7851a) è legato a come visualizzare cartelle dentro un browser. O, meglio, a come usare cartelle contenenti file HTML salvati in locale. Finché sono file semplici non è un problema. Diventa più difficile quando si tratta di applicazioni web più complesse. Ho provato due soluzioni. La prima prevede l'utilizzo di [http.createServer([options][, requestListener])](https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener) di Node.js. Funzione, però aggiunge un livello di complessità al mio progetto.

Poi, dopo un po' di esperimenti, [Ashley Gullen](https://www.construct.net/en/blogs/ashleys-blog-2) ha pubblicato un repository molto interessante: [AshleyScirra/servefolder.dev](https://github.com/AshleyScirra/servefolder.dev):

```
The page at servefolder.dev lets you host a local folder with web development files, such as HTML, JavaScript and CSS, directly in your browser. It works using Service Workers: everything is served from your local system only, nothing is uploaded to a server, and your files are not shared with anybody else.
```

In altre parole, creo un server locale direttamente nel browser e posso usarlo per vedere le mie cartelle come se fossero online. Ma senza essere online.

Partendo da questo repository ho creato la mia versione, Svelte Serve Folder:

![server-folder-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-28-come-usare-cartelle-e-file-con-chrome/server-folder-01.gif)

Ma, ovviamente, l'idea originale non è mia, e consiglio di consultare direttamente il repository di Ashley. Il suo codice è molto istruttivo. Talmente istruttivo che studiarlo è fondamentale. Quindi, in questo articolo riporterò i miei appunti e quello che ho capito. Lo farò ricreando il repository originale apportando solamente alcune modifiche:

1. userò codice scritto in [TypeScript](https://www.typescriptlang.org/), quando possibile: ho notato che consultare codice TS è più semplice per il me futuro rispetto al codice in JavaScript;
2. userò, quando possibile, [Svelte](https://svelte.dev/): in questo caso non è fondamentale ma conto di riutilizzare quanto appreso in altri progetti con Svelte;
3. aggiungo la possibilità di vedere il contenuto della cartella direttamente nella pagina principale, tramite un [iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe): in questo caso mi serve per avere un'idea di come integrare questa tecnica in nelle [BrowserView di Electron](https://betterprogramming.pub/how-to-use-browserview-with-electron-9998fa834b44)

Una cosa che non farò, non in questo post, è di usare [@rollup/plugin-html](https://github.com/rollup/plugins/tree/master/packages/html) per creare un unico file HTML da usare come template per la lista dei file. Voglio però ragionarci sopra nei prossimi giorni.

### JavaScript Service Workers

Tralascio, per il momento, l'aspetto grafico e mi concentro sui Service Worker. Se non li abbiamo mai usati, ed è questo il mio caso, la prima cosa da fare è capire cosa sono. Per fortuna su Mozilla.org è possibile trovare tutte le informazioni che servono. Quindi, la prima cosa da fare è consultare questo sito:

- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

(Dopo aver completato questo post ho trovano anche una bella storia di [Bowei Han](https://medium.com/@BoweiHan) su Medium che vale la pena di leggere: [How to Make Your Web Apps Work Offline](https://medium.com/swlh/how-to-make-your-web-apps-work-offline-be6f27dd28e))

Riassumendo, lo scopo dei Service Worker è di creare un ponte tra la pagina ospitata nel browser e il server da cui è generata. Vengono usati generalmente per permettere a un sito di funzionare anche offline e per gestire notifiche e azioni in background. Non hanno accesso diretto alla pagina HTML (il così detto DOM), sono completamente asincroni e non funzionano quando il browser è in modalità anonima. E richiedono una connessione HTTPS.

L'utilizzo richiede alcuni passaggi obbligati:

- ogni service worker per funzionare deve prima di tutto essere registrato tramite il metodo [ServiceWorkerContainer.register()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register)
- quindi il service worker viene scaricato: è un processo automatico che non richiede azioni da parte dell'utente
- dopo averlo scaricato è il momento di installarlo: anche questa azione è automatica ma ci sono casi in cui conviene forzarla. In questo progetto Ashley usa i metodi [ServiceWorkerGlobalScope.skipWaiting()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting) e [Clients.claim()](https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim), ed è una buona soluzione
- e infine c'è l'evento [activate](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/activate_event) che può essere intercettato e gestito

### Come Installare un Service Worker in JavaScript

Un po' di codice. Registrare un service worker in JavaScript è tutto sommato semplice:

```ts
const registerSW = async () => {
  console.log("Registering service worker...");

  try {
    const reg = await navigator.serviceWorker.register("sw.js", {
      scope: "./",
    });
    console.info("Registered service worker on " + reg.scope);
  } catch (err) {
    console.warn("Failed to register service worker: ", err);
  }
};
```

Conviene mantenere il file `sw.js` (quello con il code dei service worker) nella cartella principale: questo semplifica di molto la vita.

E proprio in `sw.js` aggiungo un evento attivato dall'installazione:

```js
// Install & activate
self.addEventListener("install", (e) => {
  console.log("[SW] install");

  // Skip waiting to ensure files can be served on first run.
  e.waitUntil(Promise.all([self.skipWaiting()]));
});
```

E quindi un altro dall'attivazione:

```js
self.addEventListener("activate", (event) => {
  console.log("[SW] activate");

  // On activation, claim all clients so we can start serving files on first run
  event.waitUntil(clients.claim());
});
```

Così ho installato i service workers. Ma come usarli?

### Usare File System Access API per selezionare una cartella

Beh, l'idea è questa. Invece di salvare offline il codice del sito (o solamente il codice del sito) è possibile conservare in memoria il contenuto di una cartella locale. In questo modo quando proviamo a accedervi appare come se fosse un file su un server virtuale. In parole più semplici: possiamo convincere il browser che quella cartella non è in locale ma una cartella remota salvata dai service worker in locale. E che come tale va trattata.

In pratica posso avere una web app complessa online dentro un ambiente completamente offline:

![server-folder-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-28-come-usare-cartelle-e-file-con-chrome/server-folder-02.gif)

Ovviamente serve un modo per permettere il passaggio dei file dal disco ai service worker. In questo caso sono ottime le [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API). Ne ho parlato in maniere approfondita circa un anno fa:

- [The File System Access API](https://el3um4s.medium.com/the-file-system-access-api-385379cd16f6)

Creo quindi una funzione `pickFolder` per selezionare una cartella del pc.

```ts
const pickFolder = async (): Promise<FileSystemDirectoryHandle> => {
  const folderHandle: FileSystemDirectoryHandle = await window[
    "showDirectoryPicker"
  ]();
  return folderHandle;
};
```

Dopo aver preso la cartella mi serve un modo per avvisare i service worker della scelta. Uso una funzione `postToSW`:

```ts
const postToSW = (o) => {
  navigator.serviceWorker.controller.postMessage(o);
};
```

Adesso posso spedire un messaggio dalla pagina HTML al service worker. Devo però aggiungere una funzione al file `sw.js`:

```ts
// Listen for messages from clients
self.addEventListener("message", (e) => {
  console.log(`The client sent me a message`, e.data);

  switch (e.data.type) {
    case "host-start":
      // e.waitUntil(StartHost(e)); ... TO DO
      break;
    case "host-stop":
      // ...to do
      break;
    default:
      console.warn(`[SW] Unknown message '${e.data.type}'`);
      break;
  }
});
```

Più tardi andrò a completare i pezzi mancanti.

Prima c'è un altro problema da risolve: cosa succede se il service worker non è stato ancora stato inizializzato?

Ashley ha trovato una soluzione elegante, e che mi ha richiesto un po' di tempo prima di comprenderla. È composta da due funzioni. La prima serve per creare un timer per attendere il tempo necessario:

```ts
function rejectAfterTimeout(ms, message) {
  let timeoutId = -1;
  const promise = new Promise((resolve, reject) => {
    timeoutId = self.setTimeout(() => reject(message), ms);
  });
  const cancel = () => self.clearTimeout(timeoutId);
  return { promise, cancel };
}
```

Poi mi serve la proprietà [ServiceWorkerContainer.oncontrollerchange](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/oncontrollerchange) per intercettare quando un service worker riceve un nuovo worker attivo:

```ts
const waitForSWReady = async () => {
  // If there is no controller service worker, wait for up to 4 seconds for the Service Worker to complete initialisation.
  if (navigator.serviceWorker && !navigator.serviceWorker.controller) {
    // Create a promise that resolves when the "controllerchange" event fires.
    const controllerChangePromise = new Promise((resolve) =>
      navigator.serviceWorker.addEventListener("controllerchange", resolve, {
        once: true,
      })
    );
    // Race with a 4-second timeout.
    const timeout = rejectAfterTimeout(4000, "SW ready timeout");
    await Promise.race([controllerChangePromise, timeout.promise]);
    // Did not reject due to timeout: cancel the rejection to avoid breaking in debugger
    timeout.cancel();
  }
};
```

Adesso ho tutti gli eventi che mi servono per creare una funzione utile per selezionare una cartella dal pc e avvisare il service worker:

```ts
import { SW } from "./serviceWorker";

const init = async (): Promise<FileSystemDirectoryHandle> => {
  const folderHandle: FileSystemDirectoryHandle = await pickFolder();
  await SW.waitForReady();
  SW.postToSW({
    type: "host-start",
  });
  return folderHandle;
};
```

Successivamente è possibile usare tutto questo in una pagina HTML. Nel mio caso creo il file `App.svelte`:

```html
<script lang="ts">
  import { onMount } from "svelte";
  import { SW } from "./sw/serviceWorker";
  import { FolderHandle } from "./sw/folderHandler";

  let folderHandle = null;

  onMount(async () => {
    await SW.register();
  });
</script>

<button
  on:click={async () => {
    folderHandle = await FolderHandle.init();
  }}>Pick Folder</button
>
```

### Aprire la cartella come se fosse su un server

Riassumendo, al momento posso scegliere una cartella dal pc e poi avvisare i service worker. Ma cosa succede dopo? Beh, mi serve un funzione `StartHost(e)`:

```ts
async function StartHost(e) {
  const hostName = `host`;
  const clientId = e.source.id;

  // Tell client it's now hosting.
  e.source.postMessage({
    type: "start-ok",
    hostName,
    clientId,
    scope: self.registration.scope,
  });
}
```

Questo mi permette di rispondere alla pagina HTML consegnando il nome dell'host e l'id del client. Posso usare queste informazioni per creare un pulsante:

```html
<button
  on:click={() => {
    globalThis.open(`${swScope}${hostName}/`, "_blank");
  }}>Open in new tab</button
>
```

Quando clicco sul pulsante si apre una nuova pagina. Ma ovviamente la pagina non ha nulla. Devo aggiungere una funzione specifica in `sw.js`:

```js
self.addEventListener("fetch", (e) => {
  // Check this is a host URL, e.g. "host/", "host2/"...
  const swScope = self.registration.scope;
  const scopeRelativeUrl = e.request.url.substr(swScope.length);
  const scopeUrlMatch = /^host\d*\//.exec(scopeRelativeUrl);

  // Strip host name from URL and get the URL within the host
  const hostUrl = scopeUrlMatch[0];
  const hostName = hostUrl.substr(0, hostUrl.length - 1);
  const hostRelativeUrl = scopeRelativeUrl.substr(hostUrl.length);

  e.respondWith(HostFetch(hostName, hostRelativeUrl));
});

async function HostFetch(hostName, url) {
  // Look up client from the host name.
  const clientId = storageGetClientId(hostName);
  console.log("HostFetch", clientId);

  const client = await self.clients.get(clientId.clientId);

  // Create a MessageChannel for the client to send a reply.
  // Wrap it in a promise so the response can be awaited.
  const messageChannel = new MessageChannel();
  const responsePromise = new Promise((resolve, reject) => {
    messageChannel.port1.onmessage = (e) => {
      if (e.data.type === "ok") resolve(e.data.file);
      else reject();
    };
  });

  // Post to the client to ask it to provide this file.
  client.postMessage(
    {
      type: "fetch",
      url,
      port: messageChannel.port2,
    },
    [messageChannel.port2]
  );

  try {
    // Wait for the client to reply, and then serve the file it provided.
    // Note ensure caching is disabled; we want to make sure every request
    // is re-loaded from disk.
    const file = await responsePromise;
    return new Response(file, {
      status: 200,
      statusText: "OK",
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return FetchFailedResponse(hostName, url);
  }
}
```

Adesso devo tornare sulla pagina principale. Aggiungo un event listener per l'evento `fetch`

```ts
navigator.serviceWorker.addEventListener("message", (e) => {
  switch (e.data.type) {
    // ...
    case "fetch":
      handleFetch(folderHandle, e);
      break;
    // ...
  }
});
```

Poi creo la funzione `handleFetch`:

```ts
const handleFetch = async (
  folderHandle: FileSystemDirectoryHandle,
  e: MessageEvent<any>
) => {
  let relativeUrl = decodeURIComponent(e.data.url);

  // Strip trailing / if any, so the last token is the folder/file name
  if (relativeUrl.endsWith("/"))
    relativeUrl = relativeUrl.substr(0, relativeUrl.length - 1);

  // Strip query string if any, since it will cause file name lookups to fail
  const q = relativeUrl.indexOf("?");
  if (q !== -1) relativeUrl = relativeUrl.substr(0, q);

  // Look up through any subfolders in path.
  // Note this uses File System Access API methods
  const subfolderArr = relativeUrl.split("/");
  let curFolderHandle = folderHandle;

  for (let i = 0, len = subfolderArr.length - 1 /* skip last */; i < len; ++i) {
    const subfolder = subfolderArr[i];
    curFolderHandle = await curFolderHandle.getDirectoryHandle(subfolder);
  }

  // Check if the name is a directory or a file
  let file = null;
  const lastName = subfolderArr[subfolderArr.length - 1];
  if (!lastName) {
    // empty name, e.g. for root /, treated as folder
    file = await generateDirectoryListing(curFolderHandle, relativeUrl);
  } else {
    try {
      const listHandle = await curFolderHandle.getDirectoryHandle(lastName);
      file = await generateDirectoryListing(listHandle, relativeUrl);
    } catch {
      const fileHandle = await curFolderHandle.getFileHandle(lastName);
      file = await fileHandle.getFile();
    }
  }

  // Post file content back to SW down MessageChannel it sent for response
  e.data.port.postMessage({
    type: "ok",
    file,
  });
};
```

La funzione `generateDirectoryListing` crea una pagina HTML contente l'elenco dei file e delle cartelle.

```js
// For generating a directory listing page for a folder
async function generateDirectoryListing(dirHandle, relativeUrl) {
  // Display folder with / at end
  if (relativeUrl && !relativeUrl.endsWith("/")) relativeUrl += "/";

  let str = `<!DOCTYPE html>
	<html><head>
	<meta charset="utf-8">
	<title>Directory listing for ${relativeUrl || "/"}</title>
	</head><body>
	<h1>Directory listing for ${relativeUrl || "/"}</h1><ul>`;

  for await (const [name, handle] of dirHandle.entries()) {
    // Display folders as "name/", otherwise just use name
    const suffix = handle.kind === "directory" ? "/" : "";
    str += `<li><a href="${name}${suffix}">${name}${suffix}</a></li>`;
  }

  str += `</ul></body></html>`;

  return new Blob([str], { type: "text/html" });
}
```

La funzione di Ashley Gullen è abbastanza basilare. Nella mia versione l'ho un po' modificato ma sono dettagli.

### Mostrare il risultato in un iframe

La versione originale di questo repository prevede di aprire la cartella caricata in un altro tab del mouse. Nella mia versione ho aggiunto la possibilità di vedere il contenuto direttamente nella stessa pagina. Basta usare un elemento `iframe` e inserire l'url corrispondente:

```svelte
<iframe
  title={folderHandle?.name}
  width="100%"
  height="100%"
  src={`${swScope}${hostName}/`}
/>
```

Bene, per il momento è tutto. Ci sono molti altri dettagli interessanti ma i concetti base sono questi. Consiglio, nuovamente, di consultare il repository originale:

- [AshleyScirra/servefolder.dev](https://github.com/AshleyScirra/servefolder.dev)

La mia versione, invece, è all'indirizzo:

- [el3um4s/svelte-server-folder](https://github.com/el3um4s/svelte-server-folder)

Infine, ho aggiunto su Medium una lista con i miei articoli su Svelte:

- [Svelte & SvelteKit](https://el3um4s.medium.com/list/svelte-sveltekit-bf5be8834fbf)
