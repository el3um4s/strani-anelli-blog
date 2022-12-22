---
title: "DevAdvent 2022: #23 Adding Big Numbers"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-12-23 09:00"
categories:
  - devadvent
  - js
  - ts
  - javascript
  - typescript
tags:
  - devadvent
  - js
  - ts
  - javascript
  - typescript
---

We have reached the end of this DevAdvent 2022. And to end things beautifully, CodeWars proposes a level 4 kyu problem for me. And like any difficult problem, it presents itself as something simple, like adding 2 plus 2. And it's all about sums, but sums of very large, gigantic, immense numbers. And it's also about the limits of JavaScript in handling such large numbers. And, to finish, it's about remembering how we used to do sums as children.

### The Problem: Adding Big Numbers

link to the [kata](https://www.codewars.com/kata/525f4206b73515bffb000b21)

We need to sum big numbers and we require your help.

Write a function that returns the sum of two numbers. The input numbers are strings and the function must return a string.

**Example**

```
add("123", "321"); -> "444"
add("11", "99");   -> "110"
```

**Notes**

- The input numbers are big.
- The input is a string of only digits
- The numbers are positives
- You can't use built-in big integers libraries (BigInt)
- You can't use other libraries

### The AI Solution

{% include picture img="image-2.webp" ext="jpg" alt="kawai cute little cartoon mastodon character, with a book, beautiful light. soft colour scheme, 8 k render" %}

I admit that I was stumbling in the dark. The problem is that I can't use BigInt, which would be the most logical and also the most effective solution. After searching the internet a bit and not finding a solution, I tried asking ChatGPT for some ideas. It gave me this solution:

```js
function add(a, b) {
  // Initialize result
  let result = "";

  // Initialize digit sum
  let sum = 0;

  // Initialize carry
  let carry = 0;

  // Add digits from right to left
  for (
    let i = a.length - 1, j = b.length - 1;
    i >= 0 || j >= 0 || carry > 0;
    i--, j--
  ) {
    // Get digits from both numbers
    let x = 0;
    let y = 0;
    if (i >= 0) {
      x = a[i] - "0";
    }
    if (j >= 0) {
      y = b[j] - "0";
    }

    // Add digits and carry
    sum = x + y + carry;

    // Update carry
    carry = Math.floor(sum / 10);

    // Update result
    result = (sum % 10) + result;
  }

  // Return result
  return result;
}
```

This code defines a function add that takes in two large integers as strings and returns their sum as a string. The function performs addition on the two large integers using the following steps:

1. It initializes a variable result to an empty string, which will be used to store the result of the addition.
2. It initializes a variable sum to 0, which will be used to store the sum of the current digits being added.
3. It initializes a variable carry to 0, which will be used to store the carryover value from the previous addition.
4. It then iterates through the digits of the two large integers from right to left.
5. For each iteration, it gets the current digits from both large integers. If the current index is beyond the length of the large integer, it sets the digit to 0.
6. It then adds the digits and the carryover value, and updates the carryover value by dividing the sum by 10 and taking the floor of the result.
7. It then updates the result variable by adding the remainder of the sum when divided by 10 to the left side of the string.
8. The loop continues until all digits have been processed or the carryover value becomes 0.
9. Finally, the function returns the result variable, which contains the sum of the two large integers as a string.

### My Solution

{% include picture img="image-3.webp" ext="jpg" alt="kawai cute little cartoon mastodon character, with a book, beautiful light. soft colour scheme, 8 k render" %}

The proposed solution is good, and I could be satisfied with it. But I don't like it. I don't like it because finding the solution this way is a bit like cheating. And above all because it takes away the pleasure of discovery and study.

So, I can try to propose my own solution. Which is this:

```js
const sum = (x, y = 0, z = 0) => Number(x) + Number(y) + Number(z);
const dec = (x) => (Number(x) >= 10 ? 1 : 0);
const unit = (x) => (Number(x) >= 10 ? Number(x) - 10 : Number(x));

const add = (a, b) => {
  const max = a.length >= b.length ? a : b;
  const min = a.length >= b.length ? b : a;

  const revA = [...max].reverse();
  const revB = [...min].reverse();

  let decimal = 0;
  const revResult = revA.map((x, i, arr) => {
    const result = sum(x, revB[i], decimal);
    decimal = dec(result);
    return unit(result);
  });

  return `${decimal > 0 ? decimal : ""}` + revResult.reverse().join("");
};
```

This code defines a function `add` that takes in two strings `a` and `b` representing positive integers and returns a string representing the sum of the two numbers.

The function first determines the maximum length of the two input strings and assigns the longer string to the variable `max` and the shorter string to the variable `min`. It then creates reversed versions of the strings using the spread operator (`...`) and assigns them to the variables `revA` and `revB`, respectively.

Next, the function defines a variable `decimal` and initializes it to `0`. It then uses the `map` method on `revA` to iterate over each element in the array and apply the `sum` function to it, passing in the corresponding element from `revB` and the current value of decimal. The `sum` function returns the sum of its three arguments, which are all converted to numbers using the Number function.

The result of the `sum` function is then passed to the `dec` function, which returns `1` if the result is greater than or equal to `10` and `0` otherwise. This value is then assigned to the decimal variable. The result of the sum function is also passed to the unit function, which returns the result minus `10` if it is greater than or equal to `10` and the result itself otherwise.

Finally, the function concatenates the value of `decimal` (if it is greater than `0`) with the reversed version of the `revResult` array, which is obtained by calling the reverse method on it. The result is then returned as a string.

For example, if the input strings are `"123"` and `"456"`, the function would return the string `"579"`, which is the sum of the two numbers.

Basically, I built a function that can automatically add up numbers, like the one we are taught in school.
