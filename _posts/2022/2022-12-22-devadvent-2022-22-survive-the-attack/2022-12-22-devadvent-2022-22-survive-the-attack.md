---
title: "DevAdvent 2022: #22 Survive the attack"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-12-22 10:00"
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

The problem for today's DevAdvent concerns comparing elements of two arrays. The interesting thing is how the problem is presented, through a real-world example. Imagine you want to build a game and have two teams facing off against each other. Each member challenges the corresponding member of the opposing team. In this case, a JavaScript function to get the result of the duels from the arrays is exactly what we need.

### The Problem: Survive the attack

link to the [kata](https://www.codewars.com/kata/634d0f7c562caa0016debac5)

Given two Arrays in which values are the power of each soldier, return true if you survive the attack or false if you perish.

**CONDITIONS**

- Each soldier attacks the opposing soldier in the same index of the array. The survivor is the number with the highest value.
  - If the value is the same they both perish
  - If one of the values is empty(different array lengths) the non-empty value soldier survives.
- To survive the defending side must have more survivors than the attacking side.
- In case there are the same number of survivors in both sides, the winner is the team with the highest initial attack power. If the total attack power of both sides is the same return true.
  - The initial attack power is the sum of all the values in each array.

**EXAMPLES**

```
attackers=[ 1, 3, 5, 7 ]   defenders=[ 2, 4, 6, 8 ]
//0 survivors                4 survivors
//return true

attackers=[ 1, 3, 5, 7 ]   defenders=[ 2, 4 ]
//2 survivors  (16 damage)   2 survivors (6 damage)
//return false

attackers=[ 1, 3, 5, 7 ]   defenders=[ 2, 4, 0, 8 ]
//1 survivors                3 survivors
//return true
```

### The Solution

{% include picture img="image-2.webp" ext="jpg" alt="kawai cute little cartoon orcs characters, in armor, beautiful light. soft colour scheme, 8 k render" %}

The solution is conceptually quite simple. I can create a JavaScript function similar to this:

```js
export const hasSurvived = (attackers, defenders) => {
  let attackingPower = attackers.reduce((acc, val) => acc + val, 0);
  let defendingPower = defenders.reduce((acc, val) => acc + val, 0);

  let attackingSurvivors = 0;
  let defendingSurvivors = 0;

  for (let i = 0; i < Math.max(attackers.length, defenders.length); i++) {
    if (i >= attackers.length) {
      defendingSurvivors++;
    } else if (i >= defenders.length) {
      attackingSurvivors++;
    } else if (attackers[i] > defenders[i]) {
      attackingSurvivors++;
    } else if (defenders[i] > attackers[i]) {
      defendingSurvivors++;
    }
  }

  return (
    defendingSurvivors > attackingSurvivors ||
    (defendingSurvivors === attackingSurvivors &&
      defendingPower >= attackingPower) ||
    (defendingSurvivors === attackingSurvivors &&
      attackingPower === defendingPower)
  );
};
```

This function first calculates the initial attack power for both the attacking and defending teams. It then iterates through the arrays and compares the values at each index. If the value at the current index in the `attackers` array is greater than the value at the same index in the `defenders` array, the number of attacking survivors is incremented. If the value at the current index in the `defenders` array is greater than the value at the same index in the `attackers` array, the number of defending survivors is incremented. If either array is shorter than the other, the surviving soldiers from the longer array are also counted.

Finally, the function returns `true` if the number of defending survivors is greater than the number of attacking survivors, or if the number of surviving soldiers is the same but the defending team has a higher initial attack power, or if the total attack power of both sides is the same. If none of these conditions are met, the function returns `false`.

However, there's one thing I don't like. That series of 'if...then...else' conditions make it difficult to read the code, and they make the function look less elegant. Over time, I've noticed that when a JavaScript function looks ugly to the eye, it means there's something to improve.

Let's take a closer look at the code.

{% include picture img="image-4.webp" ext="jpg" alt="kawai cute little cartoon orcs characters, in armor, beautiful light. soft colour scheme, 8 k render" %}

What I want to do is compare each element in the array and then count how many elements meet the given condition.

I'll try rephrasing the sentence in a different way: I want to get from each array all the elements that meet a certain condition. In other words, I want to filter all the elements that are greater than the corresponding element in the other array.

Here, by reformulating the problem, I get a new idea. I can use the [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method to compare the various elements in each array and keep only the ones that interest us.

```js
let defendersAfterFight = defenders.filter((e, i) => 0 < e - attackers[i]);
let attackersAfterFight = attackers.filter((e, i) => 0 < e - defenders[i]);
```

Now all I have to do is calculate the length of each array to find out how many survivors there are among the attackers and defenders.

```js
const hasSurvived = (attackers, defenders) => {
  let attackingPower = attackers.reduce((acc, val) => acc + val, 0);
  let defendingPower = defenders.reduce((acc, val) => acc + val, 0);

  let defendersAfterFight = defenders.filter((e, i) => 0 < e - attackers[i]);
  let attackersAfterFight = attackers.filter((e, i) => 0 < e - defenders[i]);

  return (
    defendersAfterFight.length > attackersAfterFight.length ||
    (defendersAfterFight.length === attackersAfterFight.length &&
      defendingPower >= attackingPower)
  );
};
```

{% include picture img="image-3.webp" ext="jpg" alt="kawai cute little cartoon orcs characters, in armor, beautiful light. soft colour scheme, 8 k render" %}

I can further simplify the code by directly counting the length of the various arrays.

```js
const hasSurvived = (attackers, defenders) => {
  let attackingPower = attackers.reduce((acc, val) => acc + val, 0);
  let defendingPower = defenders.reduce((acc, val) => acc + val, 0);

  let defendersSurvived = defenders.filter(
    (d, i) => 0 < d - attackers[i]
  ).length;
  let attackersSurvived = attackers.filter(
    (a, i) => 0 < a - defenders[i]
  ).length;

  return (
    defendersSurvived > attackersSurvived ||
    (defendersSurvived === attackersSurvived &&
      defendingPower >= attackingPower)
  );
};
```

If we want to exaggerate, we can further reduce the lines of code needed to solve the problem.

But I don't recommend it. The JavaScript function is difficult to read. There is no practical advantage to complicating the code too much. It's better to write clean, easy-to-read code: our future selves will thank us.

```js
const hasSurvived = (a, d) =>
  d.filter((x, i) => 0 < x - a[i]).length >
    a.filter((x, i) => 0 < x - d[i]).length ||
  (d.filter((x, i) => 0 < x - a[i]).length ===
    a.filter((x, i) => 0 < x - d[i]).length &&
    d.reduce((c, v) => c + v, 0) >= a.reduce((c, v) => c + v, 0));
```
