---
title: "How to Find All Possible Combinations of Two Arrays of Objects"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Nathan Dumlao**](https://unsplash.com/@nate_dumlao)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-03 17:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Second day of the [Dev Advent Calendar 2021](https://github.com/devadvent/readme) and new puzzle to solve. Santa's elves have managed to find Rudolf the reindeer lost in the forest. Back in the village they need to warm up with a hot cup. But the Elf Coffee Shop menu is confusing. Maybe we need to help the elf bartender rewrite the menu.

### The puzzle: Elf Coffee Shop 🧝🥤

{% include picture img="cover.webp" ext="jpg" alt="" %}

Today's problem is about joining two arrays of objects. It also concerns their ordering. Today's puzzle is also quite simple but I had to deepen some of my knowledge. I haven't had time to test various solutions, so I'm not ruling out that there is a smarter way. But no more chatter and let's start with the puzzle.

### Sort an array of objects: alphabetical order

I immediately tackle the problem of sorting. Why? Because I suspect it's quicker to sort two small arrays than to sort a much larger array. So I start by alphabetizing the drinks list.

Before starting I recommend reading a post from [Javascript Tutorial: Sorting Array Elements](https://www.javascripttutorial.net/javascript-array-sort/). And, of course, the documentation of the [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method.

<script src="https://gist.github.com/el3um4s/4eb1766d86a7c2f93731ccc74baa07d6.js"></script>

The first step is to directly sort the drink list based on the "name" property. So I check if the name of one comes before the name of the other based on the alphabet.

The first problem that may arise concerns the difference between upper and lower case letters. If it is not difficult for us humans to understand that `a === A` for Javascript there are some problems. It is therefore convenient to convert all names to uppercase (or lowercase) letters.

<script src="https://gist.github.com/el3um4s/fc94b6dee0ca494dfc7bdf165b2c72b1.js"></script>

Fine, but this way I'm going to change the menu itself. After that it will be difficult to get a menu with the names written correctly. To solve the problem I don't directly modify the array but I copy the names in some variables:

<script src="https://gist.github.com/el3um4s/e35cd7caa4b06bd79382d035cbb9535d.js"></script>

There is another problem: the `sort()` method directly modifies the order of the original array. Personally I prefer to leave everything unchanged. I follow [Ramon Balthazar](https://stackoverflow.com/questions/30431304/functional-non-destructive-array-sort)'s advice: use `shuffledArray.slice().sort()`. This way I get a new array without changing the original one:

<script src="https://gist.github.com/el3um4s/a37aabd1465c2800d22168f3f73cd2e8.js"></script>

### Sort an array of objects: numerical order

After you have sorted your drinks, it's time to move on to the various custom flavors. Instinctively I can think of using a similar function, replacing the `name` property with the `price` property:

<script src="https://gist.github.com/el3um4s/642e05ee9ab1796d6a3efecb06654b26.js"></script>

However, there is a particular case that is missing from this list of ingredients: the drink without extra flavor.

I think the quickest way to deal with this case is to add the "flavor: undefined" with price `0` to the list. I add it to the beginning of the sorted list with the [unshift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift) method

<script src="https://gist.github.com/el3um4s/535238a748dd8b580ca27c5f2f6452c0.js"></script>

### Combining drinks and flavors on a menu

Now that I have two sorted arrays (`sortedDrinks` and `sortedFlavors`) I can start combining ingredients and flavors. I could use two nested for loops. Or use the [map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method:

<script src="https://gist.github.com/el3um4s/ab16f075071f962332a57d26d8155cf3.js"></script>

But there is a problem: the result is an array containing several arrays, one for each drink. The puzzle requires an array like this:

<script src="https://gist.github.com/el3um4s/39a6e3f078a29875311b1ebb413e82eb.js"></script>

I can use the `flat()` or [Array.prototype.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap) method:

```js
const result = sortedDrinks.flatMap((drink) => {
  return sortedFlavors.map((flavor) => {
    return {
      drink: drink.name,
      flavor: flavor.name,
      price: drink.price + flavor.price,
    };
  });
});
```

Well, Santa's elves can be satisfied. Through this solution they can finally order what they want from a convenient menu. Now the time has come for me to drink a nice hot herbal tea.
