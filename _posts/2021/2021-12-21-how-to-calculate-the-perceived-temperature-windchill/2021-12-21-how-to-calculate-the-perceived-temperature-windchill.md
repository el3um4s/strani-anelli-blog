---
title: "How To Calculate The Perceived Temperature (Windchill)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Denny Müller**](https://unsplash.com/@redaquamedia)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-21 16:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Christmas is approaching and Santa Claus is making preparations. One of the most delicate aspects concerns the equipment. The sled is under great pressure, and even the reindeer have to give their all. In one night they go through all climates. To protect them, Santa Claus calculates the temperature of each location. Obviously, the temperature measured by the thermometer is not enough: he uses the perceived temperature.

### The Puzzle: Baby, It's Cold Outside ❄️

{% include picture img="cover.webp" ext="jpg" alt="" %}

[Dev Advent Calendar problem 18 🎅](https://github.com/devadvent/puzzle-18) is quite simple. I have to calculate the perceived temperature knowing the wind speed and the outside temperature. The result can be either in degrees centigrade or in degrees Fahrenheit.

The hardest thing is to find the correct formula. Or, rather, the most common formula. Searching the internet I found this article:

- [Sciencing: How to Calculate a Wind Chill Factor](https://sciencing.com/calculate-wind-chill-factor-5981683.html)

I omit all the calculations and report only the formula:

```
Perceived Temperature = 13.12 + 0.6215T – 11.37 (V^0.16) + 0.3965T (V^0.16)
```

With:

- **T**: temperature in degrees Celsius
- **V**: wind velocity in kilometers per hour

I can convert to JavaScript to get this function:

<script src="https://gist.github.com/el3um4s/446fe375ba3a7a33727ad5b8129cb5e6.js"></script>

Using miles and fahrenheit:

```
Perceived Temperature = 35.74 + 0.6215T – 35.75 (V^0.16) + 0.4275T (V^0.16)
```

With:

- **T**: temperature in degrees Fahrenheit
- **V**: wind velocity in miles per hour

<script src="https://gist.github.com/el3um4s/a3d69b29a7a9697716115acde25276f8.js"></script>

Combining these two pieces of code I get:

<script src="https://gist.github.com/el3um4s/0cee8b6ddffb94e4cb1ffd0ed136b4b3.js"></script>

### Convert numbers from one system to another

The problem is quite simple but some complications can arise with converting from one measurement system to another.

I am not going to write a full discussion. I will just report some conversion functions

Convert Kilometers and Miles

<script src="https://gist.github.com/el3um4s/9d9b611740b220c3b816f64a9f713feb.js"></script>

Convert Celsius and Fahrenheit

<script src="https://gist.github.com/el3um4s/edd7931604f62cc07aa4d65d22633230.js"></script>

That's all for today.
