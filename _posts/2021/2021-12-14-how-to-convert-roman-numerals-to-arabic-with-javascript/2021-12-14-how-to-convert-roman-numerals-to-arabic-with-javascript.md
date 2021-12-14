---
title: "How To Convert Roman Numerals To Arabic With JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [Kedar Gadge](https://unsplash.com/@kedar9)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-14 15:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

The elves are excited about new technologies. They convinced Santa to modernize everything. They are converting millennia of paperwork into digital documents. They realized, however, that the more they go back in time, the more difficult it is. For a long, long time the elves used the Roman numeral system. The one with the letters instead of the numbers. Now it's all in Arabic numbering, the one with the digits from 0 to 9. What is the quickest way to convert a Roman numeral to an Arabic number?

### The puzzle: Number Conversion 🏛️

{% include picture img="cover.webp" ext="jpg" alt="" %}

Converting Roman numerals to decimals is not an easy problem. It is not possible to use native JavaScript methods: we have to create an ad hoc function ourselves. Furthermore, the Latin numbering is based on grouped letters. The meaning of the letter varies according to the letters that follow or precede it.

For example, the letter `I` stands for the digit `1`. The letter `V` stands for the number `5`. We can combine these two symbols in two different ways: `IV` and `VI`. In our number system they would become `15` and `51`. But is not so. Because `I` in front of `V` means `minus 1 to 5`, or `4`. Instead `I` after `V` means `5 plus 1`, or `6`.

### Convert from Roman numerals to decimal numbers

The conversion from Roman numerals to Arabic numbers therefore requires two types of operations. First I analyze the position of the single letters of a string. Then I extract the individual values and add them up.

To solve this puzzle I used a discussion from a few years ago posted on [stackoverflow](https://stackoverflow.com/questions/48946083/convert-roman-number-to-arabic-using-javascript). The comments present many possible solutions. Starting from there I wrote my solution:

```js
export const romanToArabic = (input) => {
  const romans = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  return [...input.toUpperCase()].reduce(
    (previousValue, currentValue, currentIndex, array) =>
      romans[array[currentIndex + 1]] > romans[currentValue]
        ? previousValue - romans[currentValue]
        : previousValue + romans[currentValue],
    0
  );
};
```

How does it work?

First I define an object with Roman numeral letters as a property. The value of each property is the value of the letter:

```js
const romans = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};
```

Then I take the number to convert, which will be a string, and transform it into an array containing characters:

```js
const inputUppercase = input.toUpperCase();
const arrayRomans = [...inputUppercase];
```

First I turn all the content into uppercase characters; this way I can simplify the later analysis.

To iterate through all the letters I use the [Array.prototype.reduce()
](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) method. Unlike other times I use its extended form:

```js
reduce((previousValue, currentValue, currentIndex, array) => {
  /* ... */
}, initialValue);
```

What I want to do is compare the value I am analyzing with the one that follows it:

```js
arrayRomans.reduce((previousValue, currentValue, currentIndex, array) => {
  if (romans[array[currentIndex + 1]] > romans[currentValue]) {
    //
  } else {
    //
  }, 0
});
```

I take this number as an example: `["M","X","X","I","V"]`.

With `index = 0` the condition becomes:

```js
romans[arrayRomans[0 + 1]] > romans["M"];
romans["X"] > romans["M"];
10 > 1000;
```

Instead the next one is:

```js
romans[arrayRomans[1 + 1]] > romans["X"];
romans["X"] > romans["X"];
10 > 10;
```

What do I have to do now?

Now I have to calculate the value that that character indicates.

So if the following value is greater than the previous one we have to subtract the current value from the total number:

```js
previousValue - romans[currentValue];
```

On the contrary, if the following value is smaller I can add it to the total:

```js
previousValue + romans[currentValue];
```

If I run all the steps in sequence I get:

![roman.gif](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-12-14-come-convertire-numeri-romani/roman.gif)

A little note on the gif. To delay the execution of the code in JavaScript I used a `sleep()` function:

```js
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}
```

### Transforming Arabic numerals into Roman numerals

At this point I wondered how to do the opposite. I then looked for how to convert a decimal number to Roman numerals. I found an interesting article by [Carlos da Costa](https://calolocosta.medium.com/create-a-roman-numerals-converter-in-javascript-a82fda6b7a60) explaining how to do it. I changed his code a bit, trying to simplify it. This is my method:

```js
export const arabicToRoman = (input) => {
  const rules = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    XXX: 30,
    XX: 20,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  let res = "";
  let num = parseInt(input);
  const romans = Object.keys(rules);

  for (let value of romans) {
    const val = rules[value];
    while (num >= val) {
      num -= val;
      res += value;
    }
  }
  return res;
};
```

Although I hope the elves don't decide to convert everything from Arabic numbers back to decimal numbers.

Finally, this post is part of a series of Christmas puzzles. I have published all my solutions on Medium:

- [Dev Advent Calendar](https://el3um4s.medium.com/list/dev-advent-calendar-89d163132d6e)
