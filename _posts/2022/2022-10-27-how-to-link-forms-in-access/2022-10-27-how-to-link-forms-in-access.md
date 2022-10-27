---
title: "How To Link Forms in Access"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Sangga Rima Roman Selia**](https://unsplash.com/@sxy_selia)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-10-27 16:30"
categories:
  - ms-access
  - database
  - tutorial
tags:
  - ms-access
  - database
  - tutorial
---

One of the problems I have most often faced with Microsoft Access is code duplication. Intended not only as a duplication of VBS code, but also of queries, macros, procedures, etc. In this article we will see how to link forms between Microsoft Access databases, in order to use the same form between multiple databases.

The procedure, after understanding it, is quite simple and intuitive. It involves these steps:

1. Create a reference database, which will contain the templates
2. Create the other databases
3. Connect the databases to the reference database
4. Call up masks when needed

### Create a reference database

As an example I create a simple database (`notes`). It has a single table, `tbNotes` with 2 fields: `ID` and `Notes`. In addition, it has two forms. The first, `frmNotes`, which allows you to insert the various notes and delete them.

![ms-notes-demo.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-10-27-how-to-link-forms-in-access/ms-notes-demo.gif)

The second form is used to display the position of the open database, and that of the linked form.

I create two functions:

<script src="https://gist.github.com/el3um4s/a26fabfdcdb6697bb7b6c4ce9239eaef.js"></script>

So you get something like this:

{% include picture img="mainDB.webp" ext="jpg" alt="" %}

I also need two functions to open the two forms:

<script src="https://gist.github.com/el3um4s/e901607b13073fcc6608176013972150.js"></script>

### Create the other databases

Now that I have the database with the reference templates I can create the `otherNotes` database. For the moment I create a form with two buttons, but without implementing the code:

{% include picture img="dbMenu.webp" ext="jpg" alt="" %}

In order to actually link the masks I have to add a reference to the project. I go to the Visual Basic for Applications (VBA) editor and click on `Tools` > `References`. From here I can select the reference database, `notes`.

This is the simplest solution but I prefer to implement a general function.

<script src="https://gist.github.com/el3um4s/34df01e24675bf6a7263a640849ff4f0.js"></script>

First I make sure that the same reference does not already exist. If there is I remove it. Then I add again the reference to the database I want to connect with.

This way I can connect to multiple databases, without having to manually add references.

I create some controls and add a button

{% include picture img="dbMenuWithLinks.webp" ext="jpg" alt="" %}

So I write the function:

<script src="https://gist.github.com/el3um4s/e687abc70f019541761d62e4496564fb.js"></script>

After connecting the two databases, I can call the functions to open the forms.

<script src="https://gist.github.com/el3um4s/77c1a9abdfc481adfd29dd59b0b2df4e.js"></script>

The final result is this:

![ms-notes-demo.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2022/2022-10-27-how-to-link-forms-in-access/showFormsLinked.gif)

Well, that's it. I created a repository with the code from the example. You can find it here: [el3um4s/how-to-link-forms-in-access](https://github.com/el3um4s/how-to-link-forms-in-access)
