---
title: "How To Create a Simple YouTube Player With JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-08-27 18:00"
categories:
  - YouTube
  - Construct 3
  - JavaScript
tags:
  - YouTube
  - Construct 3
  - JavaScript
---

One of my most successful open source projects is my collection of templates for Construct 3. Not so much the part dedicated to video games as the one where I experimented with integrating JavaScript and event sheets. I think it might be useful to give some tips on how to create a custom YouTube video player with JavaScript.

First, let's see what I want to achieve:

{% include picture img="schema.webp" ext="jpg" alt="" %}

The interface is quite simple. Most of the screen is taken up by video. At the top there is space for the title, and on the right some buttons to control playback (`Play`,` Pause`, `Stop` and the volume). Still on the right, but further down, some buttons allow you to choose which video to play, and possibly to select others via the YouTube ID.

It is a project designed as a demonstration, so in the code I put the ability to view YouTube videos starting from two separate JSON files. The first with the video IDs, the second with the URLs. Of course, you can choose your own preferred method.

You can also download the code from this link: [simple-youtube-player.c3p](https://blog.stranianelli.com/c3p/simple-youtube-player.c3p).

Running the project the interface looks like this:

{% include picture img="interface.webp" ext="jpg" alt="" %}

### Let's coding

It's time for the most interesting part: how to use Javascript to create a simple YouTube player. First, of course, I recommend consulting the [official documentation](https://developers.google.com/youtube/iframe_api_reference).

I need two functions to run when the page starts. With `LoadAPI` I import the YouTube bees into my project:

<script src="https://gist.github.com/el3um4s/64e67e62d7e00c5d258f8347c79a7e7a.js"></script>

I need another function to actually create the player and assign the events that I am interested in monitoring (i.e. being able to control the execution of the video through custom buttons)

<script src="https://gist.github.com/el3um4s/549a83219a54dd2e93e9be25c6eb8104.js"></script>

Finally I can create the actual video using the `createVideo` function and passing the iFrame ID as argument:

<script src="https://gist.github.com/el3um4s/2e906ff421979b3c29ac9074bc99a7e5.js"></script>

How to use this code depends on the type of project and the framework. In my example project I use this function to pass some information to the main interface:

<script src="https://gist.github.com/el3um4s/e76e8e99b9dd1bedff7ccda3f16959e2.js"></script>

### Create custom commands

Since I have linked the YouTube player to the web page iFrame, I can create custom functions to use in my code. I can also have multiple videos on the same page, as long as they each have a different ID.

### Play a video, pause it and stop it

<script src="https://gist.github.com/el3um4s/64dc8020435eb4bd318f6cd0d6a5338e.js"></script>

### Manage the volume of a YouTube video

<script src="https://gist.github.com/el3um4s/aae5427274626a1f766e165918cbaeef.js"></script>

### Load a video but don't play it automatically

<script src="https://gist.github.com/el3um4s/3435da7afce277b5a88e74db5b683250.js"></script>

### Load a video and play it immediately

<script src="https://gist.github.com/el3um4s/a61027d2c0cf473d78df277ec5324f21.js"></script>

### Load a playlist

<script src="https://gist.github.com/el3um4s/96b70315b10975439ba788b54b4dc244.js"></script>

### Find the duration of a video

<script src="https://gist.github.com/el3um4s/fc0182eec6fe6c702bac564a23f08c62.js"></script>

E così via.

### YouTube without code

As for the JavaScript part, I think I can stop here. For those who want to look at the part inserted in the Event Sheets of the project, it is simply a matter of recalling the corresponding functions.

{% include picture img="eventSheet.webp" ext="jpg" alt="" %}

For example, function C3 is nothing more than this:

<script src="https://gist.github.com/el3um4s/dd0c4b69b14032ef942eb85a2ee743ff.js"></script>

Similarly, to manage video playback I can use JS in a "hidden" way:

{% include picture img="controls.webp" ext="jpg" alt="" %}

Thanks for reading
