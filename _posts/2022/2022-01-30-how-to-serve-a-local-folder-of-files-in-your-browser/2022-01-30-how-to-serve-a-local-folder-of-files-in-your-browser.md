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
date: "2022-01-30 11:00"
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

<script src="https://gist.github.com/el3um4s/1a1f6cef74d661e85c5d605664195b7b.js"></script>

It is a good idea to keep the `sw.js` file (the one with the service worker code) in the root folder: this makes your life a lot easier.

In `sw.js` I add an installation triggered event:

<script src="https://gist.github.com/el3um4s/1c97b5e3d0d9e34ea8c48ebfcbcc76f1.js"></script>

And then another triggered by activation:

<script src="https://gist.github.com/el3um4s/458cd0de2f8d2b36c534ea6e98470fe6.js"></script>

So I installed the service workers. But how to use them?

### Use the File System Access API to select a folder

Well, that's the idea. Instead of saving the site code offline (or just the site code) it is possible to store the contents of a local folder in memory. This way when we try to access it, it appears as if it were a file on a virtual server. In simpler words: we can convince the browser that that folder is not locally but a remote folder saved by local service workers.

Can I have a web app in a completely offline environment:

![server-folder-02.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-01-28-come-usare-cartelle-e-file-con-chrome/server-folder-02.gif)

Obviously we need a way to allow files to pass from disk to service workers. In this case, the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) is excellent. I talked about it in depth about a year ago:

- [The File System Access API](https://el3um4s.medium.com/the-file-system-access-api-385379cd16f6)

I then create a `pickFolder` function to select a folder on the pc.

<script src="https://gist.github.com/el3um4s/b935e56c79dc58b9a26731a73ba86814.js"></script>

After getting the folder I need a way to notify the service workers of the choice. I use a `postToSW` function:

<script src="https://gist.github.com/el3um4s/0be028b0d98dafe8dc3262a79bdd680b.js"></script>

Now I can send a message from the HTML page to the service worker. But I need to add a function to the `sw.js` file:

<script src="https://gist.github.com/el3um4s/c62abc2199b4fc456e807219bb68076e.js"></script>

But what if the service worker hasn't been initialized yet?

Ashley came up with an elegant solution, and it took me some time to figure it out. It consists of two functions. The first is to create a timer to wait the necessary time:

<script src="https://gist.github.com/el3um4s/4afadee51b85d27f86690166914fa06e.js"></script>

Then I need the [ServiceWorkerContainer.oncontrollerchange](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/oncontrollerchange) property to intercept when a service worker receives a new active worker:

<script src="https://gist.github.com/el3um4s/9a37c77aa17970a9c7cdac97d5e6c2bb.js"></script>

Now I have all the tools to create a function to select a folder from the pc and notify the service worker:

<script src="https://gist.github.com/el3um4s/7f857703103cf9462c2932b136920f20.js"></script>

Later you can use all of this in an HTML page. In my case I create the `App.svelte` file:

<script src="https://gist.github.com/el3um4s/77c724997b33d3709c43e5d286728554.js"></script>

### Open the folder as if it were on a server

In summary, at the moment I can choose a folder from the pc and then notify the service workers. But what happens next? Well, I need a `StartHost(e)` function:

<script src="https://gist.github.com/el3um4s/ccb6b38fb287cab812d1cf8660649603.js"></script>

This allows me to reply to the HTML page by handing over the host name and client id. I can use this information to create a button:

<script src="https://gist.github.com/el3um4s/7f9765daf1a263a75d996db9a7a5eb10.js"></script>

When I click on the button a new page opens. But obviously the page has nothing. I need to add a specific function in `sw.js`:

<script src="https://gist.github.com/el3um4s/357ee4bb30944da8cc6160aca4b5852c.js"></script>

Now I have to go back to the main page. I add an event listener for the `fetch` event

<script src="https://gist.github.com/el3um4s/4cd16713b041cad97f18cba34c3ca540.js"></script>

Then I create the `handleFetch` function:

<script src="https://gist.github.com/el3um4s/17b25bdd4fb7d23456312e28624148c9.js"></script>

The `generateDirectoryListing` function creates an HTML page containing the list of files and folders.

<script src="https://gist.github.com/el3um4s/7f25092f22b7b67e28b6b13da898da60.js"></script>

Ashley Gullen's function is quite basic. In my version I changed it a bit but they are details.

### Show the result in an iframe

The original version of this repository is to open the uploaded folder in another browser tab. In my version I have added the ability to see the content directly on the same page. Just use an `iframe` element and enter the corresponding url:

<script src="https://gist.github.com/el3um4s/f7830037014eadb6c7d5af09159b7727.js"></script>

Well, that's all for now. There are many other interesting details but these are the basic concepts. I recommend, again, to consult the original repository:

- [AshleyScirra/servefolder.dev](https://github.com/AshleyScirra/servefolder.dev)

My version:

- [el3um4s/svelte-server-folder](https://github.com/el3um4s/svelte-server-folder)

Finally, I added a list on Medium with my articles on Svelte:

- [Svelte & SvelteKit](https://el3um4s.medium.com/list/svelte-sveltekit-bf5be8834fbf)
