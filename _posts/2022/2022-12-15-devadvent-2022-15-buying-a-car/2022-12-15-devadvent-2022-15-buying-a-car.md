---
title: "DevAdvent 2022: #15 Buying a Car"
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

Today's DevAdvent 2022 issue was particularly interesting. In itself it is not very complicated, it is about calculating the point of intersection of two curves. The most interesting thing was refracting the result. But let's start with the text of the problem.

### The Problem: Buying a Car

link to the [Kata](https://www.codewars.com/kata/554a44516729e4d80b000012)

{% include picture img="image-2.webp" ext="jpg" alt="kawai cute little representation of bar graph on a wall, beautiful light. soft colour scheme, 8 k render" %}

A man has a rather old car being worth `$2000`. He saw a secondhand car being worth `$8000`. He wants to keep his old car until he can buy the secondhand one.

He thinks he can save $1000 each month but the prices of his old car and of the new one decrease of `1.5` percent per month. Furthermore this percent of loss increases of `0.5` percent at the end of every two months. Our man finds it difficult to make all these calculations.

**Can you help him?**

How many months will it take him to save up enough money to buy the car he wants, and how much money will he have left over?

**Parameters and return of function:**

```
parameter (positive int or float, guaranteed) start_price_old (Old car price)
parameter (positive int or float, guaranteed) start_price_new (New car price)
parameter (positive int or float, guaranteed) saving_per_month
parameter (positive float or int, guaranteed) percent_loss_by_month

nbMonths(2000, 8000, 1000, 1.5) should return [6, 766] or (6, 766)
```

**Detail of the above example:**

```
end month 1: percent_loss 1.5 available -4910.0
end month 2: percent_loss 2.0 available -3791.7999...
end month 3: percent_loss 2.0 available -2675.964
end month 4: percent_loss 2.5 available -1534.06489...
end month 5: percent_loss 2.5 available -395.71327...
end month 6: percent_loss 3.0 available 766.158120825...
return [6, 766] or (6, 766)
```

where `6` is the number of months at **the end of which** he can buy the new car and `766` is the nearest integer to `766.158...` (rounding `766.158` gives `766`).

**Note:**

Selling, buying and saving are normally done at end of month. Calculations are processed at the end of each considered month but if, by chance from the start, the value of the old car is bigger than the value of the new one or equal there is no saving to be made, no need to wait so he can at the beginning of the month buy the new car:

```
nbMonths(12000, 8000, 1000, 1.5) should return [0, 4000]
nbMonths(8000, 8000, 1000, 1.5) should return [0, 0]
```

We don't take care of a deposit of savings in a bank:-)

### My Solution

{% include picture img="image-2.webp" ext="jpg" alt="a commercial photography of a hot wheels delorean car on a suburban street diorama scene, cinematic lighting, product shot, detailed, hq, macro lens" %}

The solution is something like this:

```js
export function nbMonths(p) {
  while (getMoneyLeft(p) < 0) {
    p = { ...updateValues(p) };
  }

  return [p.month, Math.round(getMoneyLeft(p))];
}
```

If we prefer instead, we can use a recursive function:

```js
export function nbMonths(p) {
  const moneyLeft = getMoneyLeft(p);

  if (moneyLeft >= 0) {
    return [p.month, Math.round(getMoneyLeft(p))];
  } else {
    return nbMonths(updateValues(p));
  }
}
```

Obviously these solutions use other functions. I decided to divide the problem into several single functions, to simplify it conceptually.

This is a programming choice. Personally I prefer to work with simple functions, and use them as lego pieces to build something bigger. In this case it would not be necessary. Without splitting the code, the solution is this:

```ts
export function nbMonths(
  priceOld: number,
  priceNew: number,
  saving: number,
  percentLoss: number
): number[] {
  let available: number = 0;
  let month: number = 0;

  while (available + priceOld < priceNew) {
    month++;
    percentLoss += month % 2 == 0 ? 0.5 : 0;
    priceNew *= (100 - percentLoss) / 100;
    priceOld *= (100 - percentLoss) / 100;
    available += saving;
  }

  return [month, Math.round(available + priceOld - priceNew)];
}
```

But there is something in this code that I don't like. And it's about the parameters. It's a function with too many arguments. In this case I prefer to use an object:

```ts
type Param = {
  priceOld: number;
  priceNew: number;
  saving: number;
  percentLoss: number;
  month: number;
};
```

Then I start dividing the problem into parts. First I need a function to calculate the updated price of the two cars.

```ts
const value = (price: number, delta: number): number =>
  price * (1 - delta / 100);

const updatePriceNew = (p: Param): number => value(p.priceNew, p.percentLoss);
const updatePriceOld = (p: Param): number => value(p.priceOld, p.percentLoss);
```

Next I need something that updates the impairment rate. Since it happens every two months, I can check if the month is even:

```ts
const updatePercentLoss = (p: Param): number =>
  p.percentLoss + (1 - (p.month % 2)) * 0.5;
```

Updating the month number is very simple:

```ts
const updateMonth = (p: Param): number => p.month + 1;
```

I also need a function to calculate the money left after the purchase. That way, if the value is negative I understand that we can't afford the car yet.

```ts
const getMoneyLeft = (p: Param): number =>
  p.month * p.saving + p.priceOld - p.priceNew;
```

I now have all the pieces needed to fix the problem.

```ts
export function nbMonths(
  priceOld: number,
  priceNew: number,
  saving: number,
  percentLoss: number,
  month: number = 0
): number[] {
  let p: Param = { priceOld, priceNew, saving, percentLoss, month };

  while (getMoneyLeft(p) < 0) {
    p.month = updateMonth(p);
    p.percentLoss = updatePercentLoss(p);
    p.priceNew = updatePriceNew(p);
    p.priceOld = updatePriceOld(p);
  }

  return [p.month, Math.round(getMoneyLeft(p))];
}
```

If we want to overdo it, we can add a new function:

```ts
const updateValues = (p: Param): Param => {
  return {
    priceOld: updatePriceOld(p),
    priceNew: updatePriceNew(p),
    saving: p.saving,
    percentLoss: updatePercentLoss(p),
    month: updateMonth(p),
  };
};
```

Which brings us back to the initial solution. Putting the various pieces together, and adapting the code to [CodeWars](https://www.codewars.com/) tests we get:

```ts
type Param = {
  priceOld: number;
  priceNew: number;
  saving: number;
  percentLoss: number;
  month: number;
};

const value = (price: number, delta: number): number =>
  price * (1 - delta / 100);

const updatePercentLoss = (p: Param): number =>
  p.percentLoss + (1 - (p.month % 2)) * 0.5;
const updatePriceNew = (p: Param): number => value(p.priceNew, p.percentLoss);
const updatePriceOld = (p: Param): number => value(p.priceOld, p.percentLoss);
const updateMonth = (p: Param): number => p.month + 1;

const getMoneyLeft = (p: Param): number =>
  p.month * p.saving + p.priceOld - p.priceNew;

const updateValues = (p: Param): Param => {
  return {
    priceOld: updatePriceOld(p),
    priceNew: updatePriceNew(p),
    saving: p.saving,
    percentLoss: updatePercentLoss(p),
    month: updateMonth(p),
  };
};

export function nbMonths(
  priceOld: number,
  priceNew: number,
  saving: number,
  percentLoss: number,
  month: number = 0
): number[] {
  let p: Param = { priceOld, priceNew, saving, percentLoss, month };

  while (getMoneyLeft(p) < 0) {
    p = { ...updateValues(p) };
  }

  return [p.month, Math.round(getMoneyLeft(p))];
}
```
