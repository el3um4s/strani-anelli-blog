---
title: "JS Tips #8: How To Validate Sudoku Solutions"
subtitle: ""
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2023-01-10 15:00"
categories:
  - js
  - ts
  - javascript
  - typescript
tags:
  - js
  - ts
  - javascript
  - typescript
---

The today's problem is interesting because I have always wanted to understand how to solve it. We are in the field of JavaScript (obviously), of two-dimensional arrays and games. In simple terms, given a grid of numbers, we have to verify that each row, each column, and each block of 3x3 contains all the numbers from 1 to 9. It follows that there cannot be any repeated numbers and no different numbers. And since there are a myriad of possible combinations, we must necessarily solve the problem by using a fast algorithm. But before moving on to the solution, let's see the problem.

### The Problem: Sudoku Solution Validator

link to the [kata](https://www.codewars.com/kata/529bf0e9bdf7657179000008)

{% include picture img="sudoku-01.webp" ext="jpg" alt="sodoku, beautiful light, soft colour scheme, numbers, steampunk" %}

**Sudoku Background**

Sudoku is a game played on a 9x9 grid. The goal of the game is to fill all cells of the grid with digits from 1 to 9, so that each column, each row, and each of the nine 3x3 sub-grids (also known as blocks) contain all of the digits from 1 to 9. (More info at: [Wikipedia - Sudoku](http://en.wikipedia.org/wiki/Sudoku))

**Sudoku Solution Validator**

Write a function `validSolution()` that accepts a 2D array representing a Sudoku board, and returns true if it is a valid solution, or false otherwise. The cells of the sudoku board may also contain `0`'s, which will represent empty cells. Boards containing one or more zeroes are considered to be invalid solutions.

The board is always `9 cells by 9 cells`, and every cell only contains integers from `0` to `9`.

Examples

```js
validSolution([
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
]); // => true

validSolution([
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 0, 3, 4, 8],
  [1, 0, 0, 3, 4, 2, 5, 6, 0],
  [8, 5, 9, 7, 6, 1, 0, 2, 0],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 0, 1, 5, 3, 7, 2, 1, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 0, 0, 4, 8, 1, 1, 7, 9],
]); // => false
```

### The Solution

{% include picture img="sudoku-02.webp" ext="jpg" alt="sodoku, beautiful light, soft colour scheme, numbers, steampunk" %}

I'm starting by immediately presenting my solution. It's not one of the smartest on CodeWars, but I think it's easy enough to understand.

```js
const checkSum = (arr) => arr.reduce((r, x) => r + x, 0) === 45;
const checkZero = (arr) => arr.every((x) => x > 0);
const validateRow = (arr) => checkZero(arr) && checkSum(arr);

const rotate = (arr) => arr[0].map((_, i) => arr.map((_, j) => arr[j][i]));
const divide = (arr) =>
  arr.map((x) => [x.slice(0, 3), x.slice(3, 6), x.slice(6, 9)]);
const blocks = (arr) => divide(rotate(divide(arr))).flat();

const listSolutions = (arr) => [...arr, ...rotate(arr), ...blocks(arr)];

const validSolution = (board) =>
  listSolutions(board).every((x) => validateRow(x.flat()));
```

I've already said it before; I think it's better to have a slightly longer solution that's easy to read, compared to a short but cryptic one. After all, we might have to touch the code again in the future: it's better to avoid leaving ourselves with a mystery to solve.

But let's move on to the algorithm that we need.

First of all, we need a check function. We have two conditions to verify:

1. each section of the Sudoku must not have the number `0`;
2. each section must have all the numbers from `1` to `9`;

To check for the presence of zero, we can use the [Array.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) method:

```js
const checkZero = (arr) => !arr.includes(0);
```

To check for the presence of all numbers, we have two options. We can create a new array and remove the duplicates (using [Set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)): if the new array contains `9` elements then we have `9` different numbers. Or we can simply check if the sum of all the elements in the array is equal to the sum of the numbers from `1` to `9`. That is `45`.

```js
const checkSum = (arr) => arr.reduce((r, x) => r + x, 0) === 45;
```

The next step is understanding what are the sections of the Sudoku that we need to check.

Of course, I must check all the rows of the original schema:

```js
const listSolutions = (arr) => [...arr];
```

Then I need the columns of the matrix. I can get them by rotating the matrix itself by 90 degrees. This way the columns become arrays in themselves:

```js
const rotate = (arr) => arr[0].map((_, i) => arr.map((_, j) => arr[j][i]));
const listSolutions = (arr) => [...arr, ...rotate(arr)];
```

Finding the different quadrants of the Sudoku requires a different thinking. This problem can also be solved in different ways. We can create a loop:

```js
const blocks = (arr) =>
  arr.map((_, x) =>
    arr.map((_, y) => arr[~~(x / 3) * 3 + ~~(y / 3)][(x % 3) * 3 + (y % 3)])
  );
```

Or we can take it one step at a time.

Since I know that each quadrant is composed of 3 rows of 3 elements each, we can make this type of reasoning. I divide each row of the array into 3 parts. Then I rotate the entire schema. And I find myself with three different arrays on each row. By merging them, I get 9 rows again, but each row contains a block of 3x3 elements. But it's easier to put things in JavaScript:

```js
const rotate = (arr) => arr[0].map((_, i) => arr.map((_, j) => arr[j][i]));

const divide = (arr) =>
  arr.map((x) => [x.slice(0, 3), x.slice(3, 6), x.slice(6, 9)]);

const blocks = (arr) => {
  const a = divide(arr);
  const b = rotate(a);
  const c = divide(b);
  const d = c.map((x) => x.map((y) => y.flat())).flat();
  return d;
};
```

Now, finally, I have all the rows to check:

```js
const listSolutions = (arr) => [...arr, ...rotate(arr), ...blocks(arr)];
```

By combining the various pieces, I finally obtain a solution for the problem:

```js
const checkZero = (arr) => !arr.includes(0);
const checkSum = (arr) => arr.reduce((r, x) => r + x, 0) === 45;

const rotate = (arr) => arr[0].map((_, i) => arr.map((_, j) => arr[j][i]));

const divide = (arr) =>
  arr.map((x) => [x.slice(0, 3), x.slice(3, 6), x.slice(6, 9)]);

const blocks = (arr) => {
  const a = divide(arr);
  const b = rotate(a);
  const c = divide(b);
  const d = c.map((x) => x.map((y) => y.flat())).flat();
  return d;
};

const listSolutions = (arr) => [...arr, ...rotate(arr), ...blocks(arr)];

const validSolution = (board) => {
  const list = listSolutions(board);
  const result = list.map((x) => checkZero(x) && checkSum(x));

  return !result.includes(false);
};
```

{% include picture img="sudoku-03.webp" ext="jpg" alt="sodoku, beautiful light, soft colour scheme, numbers, steampunk" %}

But it's still not a good solution. Or, better, I can simplify the code a bit. First, I rewrite the `blocks` function so as to eliminate the variables:

```js
const blocks = (arr) =>
  divide(rotate(divide(arr)))
    .map((x) => x.map((y) => y.flat()))
    .flat();
```

I can also simplify `validSolution`:

```js
const validSolution = (board) =>
  !listSolutions(board)
    .map((x) => checkZero(x) && checkSum(x))
    .includes(false);
```

However, if I look at the code closely, I realize two things. The first: I'm not taking into account the presence of any negative numbers. I can rewrite `checkZero` like this:

```js
const checkZero = (arr) => arr.every((x) => x > 0);
```

Or like

```js
const checkZero = (arr) => arr.every((x) => x > 0 && x <= 9);
```

In this way, I use the [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) method to verify that every element present in the array is between `1` and `9`.

The second thing is that I can use `Array.every` also to check the different solutions simplifying the code even more :

```js
const validSolution = (board) =>
  listSolutions(board).every((x) => checkZero(x) && checkSum(x));
```

In this way, we don't need an additional `.map().includes(false)` and this also directly returns true or false based on the check of all solutions using Array.every method.

```js
const checkSum = (arr) => arr.reduce((r, x) => r + x, 0) === 45;
const checkZero = (arr) => arr.every((x) => x > 0 && x <= 9);
const validateRow = (arr) => checkZero(arr) && checkSum(arr);

const rotate = (arr) => arr[0].map((_, i) => arr.map((_, j) => arr[j][i]));
const divide = (arr) =>
  arr.map((x) => [x.slice(0, 3), x.slice(3, 6), x.slice(6, 9)]);
const blocks = (arr) => divide(rotate(divide(arr))).flat();

const listSolutions = (arr) => [...arr, ...rotate(arr), ...blocks(arr)];

const validSolution = (board) =>
  listSolutions(board).every((x) => validateRow(x.flat()));
```

If we want, we can also modify the blocks function (using the [double](https://medium.com/@s.kutyepov/how-a-k-a-double-bitwise-not-operator-in-javascript-can-help-boost-performance-of-your-app-3d973078ff42) [bitwise NOT (`~`) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_NOT)) and eliminate the divide function.

```js
const checkSum = (arr) => arr.reduce((r, x) => r + x, 0) === 45;
const checkZero = (arr) => arr.every((x) => x > 0 && x <= 9);
const validateRow = (arr) => checkZero(arr) && checkSum(arr);

const rotate = (arr) => arr[0].map((_, i) => arr.map((_, j) => arr[j][i]));

const blocks = (arr) =>
  arr.map((_, x) =>
    arr.map((_, y) => arr[~~(x / 3) * 3 + ~~(y / 3)][(x % 3) * 3 + (y % 3)])
  );

const listSolutions = (arr) => [...arr, ...rotate(arr), ...blocks(arr)];

const validSolution = (board) =>
  listSolutions(board).every((x) => validateRow(x.flat()));
```

Finally, I can write an even more compact solution:

```js
const validSolution = (board) =>
  [
    ...board,
    ...board[0].map((_, i) => board.map((_, j) => board[j][i])),
    ...board.map((_, x) =>
      board.map(
        (_, y) => board[~~(x / 3) * 3 + ~~(y / 3)][(x % 3) * 3 + (y % 3)]
      )
    ),
  ].every(
    (a) =>
      a.flat().reduce((x, y) => x + y, 0) === 45 &&
      a.flat().every((x) => x > 0 && x <= 9)
  );
```

But, as I said before, perhaps this solution is a bit too cryptic. In any case, it is a valid and functioning solution.
