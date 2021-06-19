---
title: "How to create menu in C3 (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-06-20 16:00"
categories:
  - Construct 3
  - JavaScript
  - Svelte
  - TypeScript
tags:
  - Construct 3
  - JavaScript
  - Svelte
  - TypeScript
---

This week I continued to explore Svelte. However, I was distracted by some new ideas. And this is one of the reasons why I started updating my blog again: having something that forces me to finish a project before moving on to the next. So I resisted the temptation to procrastinate (forever): I completed this template. I'm happy because I can easily reuse it in other projects.

As I said last week, my aim is to get a simple method for creating menus in C3. To do this, I created a reusable component with Svelte, inserted it into C3 and created a Construct 3 project to document its APIs

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-20-how-to-create-menu-in-c3/c3-svelte-menu-10.gif)

In this post I want to write how to use this template to create a custom menu. The future me will certainly be happy to find these notes.

First I need two files: [menu.js](https://raw.githubusercontent.com/el3um4s/construct-demo/master/javascript/012-menu/source/lib-menu/menu.js) and [menu.css](https://raw.githubusercontent.com/el3um4s/construct-demo/master/javascript/012-menu/source/lib-menu/menu.css). I created and compiled these two files with Svelte. They are the code needed to create, manage and customize the menu.

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-20-how-to-create-menu-in-c3/add-js-and-css.gif)

After importing them into Construct I can start setting up the project. The CSS file only needs to be loaded once, at startup:

{% include picture img="loader.webp" ext="jpg" alt="" %}

I insert the reference to menu.js in a file with purpose "Imports for Events":

```js
import * as svelte from "./menu.js";
```

A line of code is enough to show the menu:

```js
menuSvelte.visible.true();
```

To hide the menu just write:

```js
menuSvelte.visible.false();
```

In the example file I create several menus using different techniques. Consequently, each time I call the `clearMenu()` command to delete all the items in the menu itself.

```js
menuSvelte.items.clearMenu();
```

I use the `setTitle()` command to customize the menu title

```js
menuSvelte.title.setTitle("Main Menu");
```

Finally I set the template:

```js
menuSvelte.columns.setColumns(["icon", "label", "description"]);
```

There are 5 "columns" available: _icon_, _label_, _description_, _rightIcon_, _rightImage_. Also there is a container, _textual_, for textual components.

{% include picture img="schema.webp" ext="jpg" alt="" %}

To insert the various elements in the menu, you can use some commands, which partly follow those already in use for arrays.

```js
menuSvelte.items.push({
	icon,
	label: "Fonts",
	description: "Choose Font Family for the Menu",
  rightIcon,
  rightImage,
	onClick: "g_runtime.callFunction('showFonts')"
});
```

The `items.push(newItem)` command allows you to insert a new item in the menu. Accept an object whose properties trace the columns that will be displayed in the menu.

To these is added the property: `onClick`. As you can easily understand, it is used to define the function to perform when you click on the element.

{% include picture img="show-menu.webp" ext="jpg" alt="" %}

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-20-how-to-create-menu-in-c3/c3-svelte-menu-11.gif)

I have implemented these commands:

- **push**_(item: ItemType)_
- **unshift**_(item: ItemType)_
- **shift**_()_
- **pop**_()_
- **addItemAtIndex**_(index: number, item:ItemType)_
- **updateItemById**_(id:string, item:ItemType)_
- **updateItemByLabel**_(label:string, item:ItemType)_
- **updateItemByIndex**_(index: number, item:ItemType)_
- **removeItemById**_(id: string)_
- **removeItemByLabel**_(label: string)_
- **removeItemByIndex**_(index: number)_
- **loadItemsFromArray**_(arrayItems:ItemType[])_

Another useful thing is the ability to change the style of many of the menu items. To do this you can use commands similar to this:

```js
menuSvelte.css.changeStyle("menu-width", "360px");
```

The available commands are:

1. **changeStyle**_(style: string, value: string)_
2. **changeFontTitle**_(value: string)_
3. **changeFontItems**_(value: string)_
4. **changeFontTitleAndItems**_(title: string, items: string)_
5. **themeStandard**_(theme:string)_
6. **loadTheme**_(customTheme: Styles, standard:string = "Light")_

You use the first 4 to modify only a single aspect of the menu. For things a little more elaborate, however, it is better to use the last two commands.

```js
menuSvelte.css.themeStandard("Dark");
```

You use `menuSvelte.css.themeStandard(theme)` to set one of the default color themes. I can choose from 9 different themes: _Dark_, _Light_, _Bouron_, _Gold Miner_, _Oscar_, _Herrera Yellow_, _Herrera Green_, _Herrera Blue_, and _Herrera Magenta_.

{% include picture img="show-menu.webp" ext="jpg" alt="" %}

You use `menuSvelte.css.loadTheme(customTheme, standard)`  to load a custom theme from a JSON file. You can use create a theme with a json similar to this:

```json
{   
	"color-primary": "#2e257d",
    "color-background": "#aaa8bd",

    "font-title": "Roboto, sans-serif",
    "font-items": "Roboto, sans-serif",
    
    "modal-background": "#0f0c45bf",

    "menu-border-radius": "32px 0px 32px 0px",
    "menu-border-style": "solid",
    "menu-border-width": "1px",

    "item-height": "64px",
    "item-icon-size": "48px",
    "item-image-size": "64px"
}
```

You can use a custom theme in C3 through a function similar to this:

{% include picture img="theme-json.webp" ext="jpg" alt="" %}

![animation](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-06-20-how-to-create-menu-in-c3/c3-svelte-menu-12.gif)

That's all. Here are the links related to this project:

- [the project on GitHub](https://github.com/el3um4s/construct-demo)
- [the online demo](https://c3demo.stranianelli.com/javascript/012-menu/demo/)
- [the c3p file](https://c3demo.stranianelli.com/javascript/012-menu/source/c3p/menu.c3p)
- [menu.js](https://c3demo.stranianelli.com/javascript/012-menu/source/lib-menu/menu.js)
- [menu.css](https://c3demo.stranianelli.com/javascript/012-menu/source/lib-menu/menu.css)
- [Patreon](https://www.patreon.com/el3um4s)