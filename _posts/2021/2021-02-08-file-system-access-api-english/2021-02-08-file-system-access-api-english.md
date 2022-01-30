---
title: "File System Access API (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Shubham Bombarde**](https://unsplash.com/@shubhambombarde)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-02-08 10:00"
categories:
  - Construct 3
  - Template
  - JavaScript
tags:
  - Construct 3
  - JavaScript
  - Template
  - Text
  - Editor
  - File System
  - API
---

This week I played with the `File System Access API`: this feature allow you to create web apps that can interact with files on the user's local device. After a user grants a web app access, this API allows them to read or save changes directly to files and folders on the user's device.

I want to reproduce with Construct 3 a text editor with similar functionality to the one developed by the [Google Chrome Labs](https://github.com/GoogleChromeLabs) ([text editor](https://googlechromelabs.github.io/text-editor/)). I also followed this guide: _[The File System Access API: simplifying access to local files](https://web.dev/file-system-access/)_.

Of course I also shared the whole thing on GitHub:

- [the project](https://github.com/el3um4s/construct-demo)
- [the online demo](https://c3demo.stranianelli.com/javascript/008-text-editor/demo/)

In the next days I will publish this article also on [Patreon](https://www.patreon.com/el3um4s).

Let's start:

{% include picture img="struttura-app.webp" ext="jpg" alt="" %}

For now, I leave out some "marginal" aspects to using the `File System Access API` and focus on two modules: [`manageFiles.js`](https://github.com/el3um4s/construct-demo/blob/master/javascript/008-text-editor/source/files/scripts/managefiles.js) and [`fileSystemAccess.js`](https://github.com/el3um4s/construct-demo/blob/master/javascript/008-text-editor/source/files/scripts/filesystemaccess.js). In the last you can find some functions:

- openFile
- write
- saveAs
- saveFile
- loadFromFile
- getNewFileHandle

### openFile

<script src="https://gist.github.com/el3um4s/ec078a483d59e59c87f96e0ef007ad46.js"></script>

For simplicity, I leave out the explanation of error handling. The entry point is [`window.showOpenFilePicker()`](https://wicg.github.io/file-system-access/#api-showopenfilepicker). When called, it shows a file picker dialog box, and prompts the user to select a file. After they select a file, the API returns an array of file handles. An optional parameter lets you influence the behavior of the file picker, for example, by allowing the user to select multiple files, or directories, or different file types. Without any option specified, the file picker allows the user to select a single file.

<script src="https://gist.github.com/el3um4s/ef8ab7558bc365ac9174ac8c4965410d.js"></script>

I assign an array of [`FileSystemFileHandle`](https://wicg.github.io/file-system-access/#filesystemfilehandle) to `Globals.fileHandle`. In this case it's a one-element array that contains the properties and methods needed to interact with the file.

Note: I haven't implemented yet a method to keep track of all open files, but only one. However, doing so would allow you to implement a list of _recent files_ to use as a shortcut to open the latest files you worked on.

Now from the handle you can access the [`file`](https://w3c.github.io/FileAPI/) itself via

<script src="https://gist.github.com/el3um4s/70a62bdb7cbf4b44ff7c68fd08a3be78.js"></script>

and then you can read its contents.

<script src="https://gist.github.com/el3um4s/c2c0980f2c0d3ed28f923e0fcbe97eb6.js"></script>

### write

<script src="https://gist.github.com/el3um4s/c4d09f123fb17f6f89e1e917d1ad982f.js"></script>

The second function, `write`, allows you to save text changes directly to the file. To do this you use the [`FileSystemWritableFileStream`](https://wicg.github.io/file-system-access/#api-filesystemwritablefilestream) interface. Then you can create the stream by calling

<script src="https://gist.github.com/el3um4s/371e4789a67557807491a489dc414a64.js"></script>

Now you can write the contents of the file to the stream.

<script src="https://gist.github.com/el3um4s/310470325e340b4ae110530bbc686758.js"></script>

At the end you can close the file and write the contents to disk: `await writable.close()`.

**Caution**: Changes are not written to disk until the stream is closed.

### saveAs

<script src="https://gist.github.com/el3um4s/485b55914a5e127093f8a1b80b58b750.js"></script>

Everything is simpler from now on. _saveAs_ uses `getNewFileHandle()` to get the name and location to save the file to. Then you can call `write()` to... write the file.

### saveFile

<script src="https://gist.github.com/el3um4s/854c53a79a2469c2b3df564f266f8998.js"></script>

`saveFile` is even simpler. If you are editing a file it's call `write`. If you are working on a new file, it's call `saveAs`.

### loadFromFile

<script src="https://gist.github.com/el3um4s/54357fb65ad94c84575c23e10ef7284c.js"></script>

Finally `loadFromFile` reloads the file to the state prior to the last save.

With this I completed the basic structure. However, there is no simple way to integrate all this with our editor. To do this you need a new module: `manageFiles.js`.

### ManageFiles.js

<script src="https://gist.github.com/el3um4s/e2745c7ddc18723ce9884dba504eb3d9.js"></script>

I only focus on two functions, `insertText` and `getText`. They both use

<script src="https://gist.github.com/el3um4s/4fcf82267b95a8e29f22a64f04c8ec26.js"></script>

This code allows you to access the Construct 3 text box. The first modifies the text contained, the second reads it. This is necessary to allow C3 to correctly display the content of the element.

The following functions do nothing but call those of the `FileSystemAccess` module by connecting them to the actual editor.

That said, it's time for links:

- [the project on github](https://github.com/el3um4s/construct-demo)
- [the online demo](https://c3demo.stranianelli.com/javascript/007-youtube/demo/)
- [my Patreon](https://www.patreon.com/el3um4s)
