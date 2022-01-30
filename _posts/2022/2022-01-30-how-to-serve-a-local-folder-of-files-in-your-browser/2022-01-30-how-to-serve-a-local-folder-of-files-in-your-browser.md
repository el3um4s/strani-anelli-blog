---
title: "How To Serve a Local Folder of Files in Your Browser"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**David Bruno Silva**](https://unsplash.com/@brlimaproj)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-01-30 10:00"
categories:
  - Browser
  - Server
  - Folder
tags:
  - Browser
  - Server
  - Folder
---

One of the difficulties I'm encountering working on the [gest-dashboard](https://javascript.plainenglish.io/the-journey-of-a-novice-programmer-82366ec7851a) project is related to how to view folders inside a browser. Or rather, how to use folders containing locally saved HTML files. As long as they are simple files this is not a problem. It gets harder when it comes to more complex web applications. I have tried two solutions. The first involves the use of [http.createServer([options][, requestListener])](https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener) of Node.js. This however adds a level of complexity to my project.

Then, [Ashley Gullen](https://www.construct.net/en/blogs/ashleys-blog-2) posted a very interesting repository: [AshleyScirra/servefolder.dev](https://github.com/AshleyScirra/servefolder.dev):

```
The page at servefolder.dev lets you host a local folder with web development files, such as HTML, JavaScript and CSS, directly in your browser. It works using Service Workers: everything is served from your local system only, nothing is uploaded to a server, and your files are not shared with anybody else.
```

In other words, I create a local server directly in the browser and I can use it to see my folders as if they are online. But without being online.

Starting from this repository I created my version, Svelte Serve Folder:

![server-folder-01.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-28-come-usare-cartelle-e-file-con-chrome/server-folder-01.gif)

Obviously, the original idea isn't mine, and I recommend consulting Ashley's repository directly. Its code is very informative. So instructive that studying it is essential. So, in this article I will report my notes and what I understand. I'll do this by recreating the original repository with just a few changes:

1. I will use code written in [TypeScript](https://www.typescriptlang.org/) whenever possible: I have noticed that consulting TS code is easier for me in the future;
2. when possible, I will use [Svelte](https://svelte.dev/): in this case it is not essential but I plan to reuse what I have learned in other projects with Svelte;
3. I add the ability to see the contents of the folder directly on the main page, via an [iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe): in this case I need to get an idea of ​​how to integrate this technique into [Electron's BrowserView](https://betterprogramming.pub/how-to-use-browserview-with-electron-9998fa834b44)

One thing I won't use is [@rollup/plugin-html](https://github.com/rollup/plugins/tree/master/packages/html) to create an HTML template. But I want to think about it in the next few days.

### JavaScript Service Workers

For the moment I leave out the graphic aspect and focus on the Service Workers. If you've never used them, and this is my case, the first thing to do is understand what they are. Fortunately, on Mozilla.org you can find all the information you need. So, the first thing to do is check out this site:

- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

(After completing this post I also found a nice story by [Bowei Han](https://medium.com/@BoweiHan) on Medium: [How to Make Your Web Apps Work Offline](https://medium.com/swlh/how-to-make-your-web-apps-work-offline-be6f27dd28e))

In summary, the purpose of Service Workers is to create a bridge between the page hosted in the browser and the server from which it is generated. They are generally used to allow a site to work offline and to manage notifications and actions in the background. They do not have direct access to the HTML page (the so-called DOM), they are completely asynchronous and do not work when the browser is in anonymous mode. And they require an HTTPS connection.

The use requires some obligatory steps:

- each service worker must first be registered via the [ServiceWorkerContainer.register()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register) method
- then the service worker is downloaded: it is an automatic process that does not require any action from the user
- after downloading it is time to install it: this action is also automatic but there are cases in which it is better to force it. In this project Ashley uses the [ServiceWorkerGlobalScope.skipWaiting()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting and [Clients.claim()](https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim) methods, and it's a good solution
- and finally there is the [activate](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/activate_event) event (that can be intercepted and managed)

### How to Install a Service Worker in JavaScript

A little bit of code. Registering a service worker in JavaScript is simple:

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

It is a good idea to keep the `sw.js` file (the one with the service worker code) in the root folder: this makes your life a lot easier.

In `sw.js` I add an installation triggered event:

```js
// Install & activate
self.addEventListener("install", (e) => {
  console.log("[SW] install");

  // Skip waiting to ensure files can be served on first run.
  e.waitUntil(Promise.all([self.skipWaiting()]));
});
```

And then another triggered by activation:

```js
self.addEventListener("activate", (event) => {
  console.log("[SW] activate");

  // On activation, claim all clients so we can start serving files on first run
  event.waitUntil(clients.claim());
});
```

So I installed the service workers. But how to use them?

### Use the File System Access API to select a folder

Well, that's the idea. Instead of saving the site code offline (or just the site code) it is possible to store the contents of a local folder in memory. This way when we try to access it, it appears as if it were a file on a virtual server. In simpler words: we can convince the browser that that folder is not locally but a remote folder saved by local service workers.

Can I have a web app in a completely offline environment:

![server-folder-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-28-come-usare-cartelle-e-file-con-chrome/server-folder-02.gif)

Obviously we need a way to allow files to pass from disk to service workers. In this case, the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) is excellent. I talked about it in depth about a year ago:

- [The File System Access API](https://el3um4s.medium.com/the-file-system-access-api-385379cd16f6)

I then create a `pickFolder` function to select a folder on the pc.

```ts
const pickFolder = async (): Promise<FileSystemDirectoryHandle> => {
  const folderHandle: FileSystemDirectoryHandle = await window[
    "showDirectoryPicker"
  ]();
  return folderHandle;
};
```

After getting the folder I need a way to notify the service workers of the choice. I use a `postToSW` function:

```ts
const postToSW = (o) => {
  navigator.serviceWorker.controller.postMessage(o);
};
```

Now I can send a message from the HTML page to the service worker. But I need to add a function to the `sw.js` file:

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

But what if the service worker hasn't been initialized yet?

Ashley came up with an elegant solution, and it took me some time to figure it out. It consists of two functions. The first is to create a timer to wait the necessary time:

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

Then I need the [ServiceWorkerContainer.oncontrollerchange](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/oncontrollerchange) property to intercept when a service worker receives a new active worker:

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

Now I have all the tools to create a function to select a folder from the pc and notify the service worker:

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

Later you can use all of this in an HTML page. In my case I create the `App.svelte` file:

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

### Open the folder as if it were on a server

In summary, at the moment I can choose a folder from the pc and then notify the service workers. But what happens next? Well, I need a `StartHost(e)` function:

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

This allows me to reply to the HTML page by handing over the host name and client id. I can use this information to create a button:

```html
<button
  on:click={() => {
    globalThis.open(`${swScope}${hostName}/`, "_blank");
  }}>Open in new tab</button
>
```

When I click on the button a new page opens. But obviously the page has nothing. I need to add a specific function in `sw.js`:

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

Now I have to go back to the main page. I add an event listener for the `fetch` event

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

Then I create the `handleFetch` function:

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

The `generateDirectoryListing` function creates an HTML page containing the list of files and folders.

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

Ashley Gullen's function is quite basic. In my version I changed it a bit but they are details.

### Show the result in an iframe

The original version of this repository is to open the uploaded folder in another browser tab. In my version I have added the ability to see the content directly on the same page. Just use an `iframe` element and enter the corresponding url:

```svelte
<iframe
  title={folderHandle?.name}
  width="100%"
  height="100%"
  src={`${swScope}${hostName}/`}
/>
```

Well, that's all for now. There are many other interesting details but these are the basic concepts. I recommend, again, to consult the original repository:

- [AshleyScirra/servefolder.dev](https://github.com/AshleyScirra/servefolder.dev)

My version:

- [el3um4s/svelte-server-folder](https://github.com/el3um4s/svelte-server-folder)

Finally, I added a list on Medium with my articles on Svelte:

- [Svelte & SvelteKit](https://el3um4s.medium.com/list/svelte-sveltekit-bf5be8834fbf)
