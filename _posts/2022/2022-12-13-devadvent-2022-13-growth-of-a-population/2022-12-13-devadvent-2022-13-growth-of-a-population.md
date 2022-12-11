---
title: "DevAdvent 2022: #13 Growth of a Population"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2022-12-13 09:00"
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

Today's problem of my personal DevAdvent 2022 is about calculating percentages, population and number series trends. Or, to put it simply, how to make a simple prediction about the increase in population of a small town?

### The Problem: Growth of a Population

link to the [Kata](https://www.codewars.com/kata/563b662a59afc2b5120000c6)

{% include picture img="image-2.webp" ext="jpg" alt="kawai cute little representation of bar graph on a wall, beautiful light. soft colour scheme, 8 k render" %}

In a small town the population is `p0 = 1000` at the beginning of a year. The population regularly increases by `2 percent` per year and moreover `50` new inhabitants per year come to live in the town. How many years does the town need to see its population greater or equal to `p = 1200` inhabitants?

```
At the end of the first year there will be:
1000 + 1000 * 0.02 + 50 => 1070 inhabitants

At the end of the 2nd year there will be:
1070 + 1070 * 0.02 + 50 => 1141 inhabitants (** number of inhabitants is an integer **)

At the end of the 3rd year there will be:
1141 + 1141 * 0.02 + 50 => 1213

It will need 3 entire years.
```

More generally given parameters:

```
p0, percent, aug (inhabitants coming or leaving each year), p (population to equal or surpass)
```

the function `nb_year` should return `n` number of entire years needed to get a population greater or equal to `p`.

`aug` is an integer, `percent` a positive or null floating number, `p0` and `p` are positive integers (`> 0`)

```
Examples:
nb_year(1500, 5, 100, 5000) -> 15
nb_year(1500000, 2.5, 10000, 2000000) -> 10
```

**Note:**

Don't forget to convert the percent parameter as a percentage in the body of your function: if the parameter percent is 2 you have to convert it to 0.02.

### My Solution

{% include picture img="image-3.webp" ext="jpg" alt="kawai cute little representation of bar graph on a wall, beautiful light. soft colour scheme, 8 k render" %}

I decided to solve this problem in two ways. The first solution is the most simple. It is a simple `while` loop that will iterate until the condition is met. The condition is that the population is greater than or equal to the target population.

```ts
export const nbYear = (
  p0: number,
  percent: number,
  aug: number,
  p: number
): number => {
  let pop = p0;
  let perc = percent / 100;
  let year = 0;
  while (pop < p) {
    pop = pop + pop * perc + aug;
    pop = Math.trunc(pop);
    ++year;
  }
  return year;
};
```

The most difficult point is to understand the problem well. Since we are talking about population, the number must be an integer. Writing 0.25 inhabitants is meaningless. For this I have to use the Math.trunc() method to truncate the number of the expected population.

I can write the same function a little more concise.

```js
function nbYear(p0, percent, aug, p) {
  let year = 0;
  while (p0 < p) {
    p0 = Math.trunc(p0 + (p0 * percent) / 100 + aug);
    ++year;
  }
  return year;
}
```

#### Complex Solution

{% include picture img="image-4.webp" ext="jpg" alt="kawai cute little representation of bar graph on a wall, beautiful light. soft colour scheme, 8 k render" %}

The second solution is a little more complex. It is a recursive function that will call itself until the condition is met. The condition is that the population is greater than or equal to the target population.

```ts
export const nbYear = (
  p0: number,
  percent: number,
  aug: number,
  p: number
): number => {
  if (p0 >= p) return 0;
  return (
    1 + nbYear(Math.trunc(p0 + p0 * (percent / 100) + aug), percent, aug, p)
  );
};
```

I can try to make this function a little clearer by dividing it into two. The new version looks like this

```js
const calculatePop = (p0, percent, aug, p) =>
  Math.trunc(p0 + p0 * (percent / 100) + aug);

function nbYear(p0, percent, aug, p) {
  const annualCount = calculatePop(p0, percent, aug, p);

  if (annualCount >= p) return 1;

  return 1 + nbYear(annualCount, percent, aug, p);
}
```

### Conclusion

Today's problem is very simple. I decided to solve it in two ways. The first is the most simple and the second is a little more complex. I hope you liked it. See you tomorrow for the next problem.
