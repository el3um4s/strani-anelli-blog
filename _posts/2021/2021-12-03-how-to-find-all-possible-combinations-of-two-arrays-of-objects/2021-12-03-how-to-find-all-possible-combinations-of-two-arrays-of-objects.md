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

```js
drinks.sort((a, b) => {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }

  return 0;
});
```

The first step is to directly sort the drink list based on the "name" property. So I check if the name of one comes before the name of the other based on the alphabet.

The first problem that may arise concerns the difference between upper and lower case letters. If it is not difficult for us humans to understand that `a === A` for Javascript there are some problems. It is therefore convenient to convert all names to uppercase (or lowercase) letters.

```js
drinks.sort((a, b) => {
  if (a.name.toUpperCase() < b.name.toUpperCase()) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }

  return 0;
});
```

Fine, but this way I'm going to change the menu itself. After that it will be difficult to get a menu with the names written correctly. To solve the problem I don't directly modify the array but I copy the names in some variables:

```js
drinks.sort((a, b) => {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  if (nameA < nameB) {
    return -1;
  } else if (nameB > nameA) {
    return 1;
  }

  return 0;
});
```

There is another problem: the `sort()` method directly modifies the order of the original array. Personally I prefer to leave everything unchanged. I follow [Ramon Balthazar](https://stackoverflow.com/questions/30431304/functional-non-destructive-array-sort)'s advice: use `shuffledArray.slice().sort()`. This way I get a new array without changing the original one:

```js
const sortedDrinks = drinks.slice().sort((a, b) => {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  if (nameA < nameB) {
    return -1;
  } else if (nameB > nameA) {
    return 1;
  }

  return 0;
});
```

### Sort an array of objects: numerical order

After you have sorted your drinks, it's time to move on to the various custom flavors. Instinctively I can think of using a similar function, replacing the `name` property with the `price` property:

```js
const sortedFlavors = flavors.slice().sort((a, b) => a.price - b.price);
```

However, there is a particular case that is missing from this list of ingredients: the drink without extra flavor.

I think the quickest way to deal with this case is to add the "flavor: undefined" with price `0` to the list. I add it to the beginning of the sorted list with the [unshift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift) method

```js
sortedFlavors.unshift({
  name: undefined,
  price: 0,
});
```

### Combining drinks and flavors on a menu

Now that I have two sorted arrays (`sortedDrinks` and `sortedFlavors`) I can start combining ingredients and flavors. I could use two nested for loops. Or use the [map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method:

```js
const result = sortedDrinks.map((drink) => {
  return sortedFlavors.map(flavor => {
      return {
          drink: drink.name,
          flavor: flavor.name,
          price: drink.price + flavor.price
      }
    }
  );
```

But there is a problem: the result is an array containing several arrays, one for each drink. The puzzle requires an array like this:

```js
const result = [
  { drink: "Latte", flavor: undefined, price: 3 },
  { drink: "Latte", flavor: "Cinnamon", price: 4 },
  { drink: "Latte", flavor: "Peppermint", price: 5 },
  { drink: "Macchiato", flavor: undefined, price: 10 },
  { drink: "Macchiato", flavor: "Cinnamon", price: 11 },
  { drink: "Macchiato", flavor: "Peppermint", price: 12 },
];
```

I can use the `flat()` or [Array.prototype.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap) method:

```js
const result = sortedDrinks.flatMap((drink) => {
  return sortedFlavors.map(flavor => {
      return {
          drink: drink.name,
          flavor: flavor.name,
          price: drink.price + flavor.price
      }
    }
  );
```

Well, Santa's elves can be satisfied. Through this solution they can finally order what they want from a convenient menu. Now the time has come for me to drink a nice hot herbal tea.
