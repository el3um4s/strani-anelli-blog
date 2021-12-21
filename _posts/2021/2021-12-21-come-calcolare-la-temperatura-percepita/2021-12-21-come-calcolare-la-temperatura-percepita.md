---
title: "Come calcolare la temperatura percepita"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Denny Müller**](https://unsplash.com/@redaquamedia)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-21 17:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Natale si avvicina e Babbo Natale sta ultimando i preparativi. Uno degli aspetti più delicati riguarda l'attrezzatura. La slitta è sottoposta a forti pressioni, e anche le renne, porelle, devono dare il massimo. Per di più nell'arco di una sola notte attraversano tutti i climi del pianeta. Per proteggerle adeguatamente Babbo Natale calcola la temperatura dei ogni località e copre, o scopre, le renne alla bisogna. Ovviamente non basta la temperatura misurata dal termometro: serve la temperatura percepita.

### Il problema: Baby, It's Cold Outside ❄️

{% include picture img="cover.webp" ext="jpg" alt="" %}

Il problema 18 del [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-18) è abbastanza semplice. Devo calcolare la temperatura percepita conoscendo la velocità del vento (ovvero della slitta di Babbo Natale) e la temperatura esterna. Il risultato può essere sia in gradi centigradi sia in gradi Fahrenheit.

La cosa più difficile è trovare la formula corretta. O, meglio, la formula più comune. Cercando in internet ho trovato questo articolo:

- [Sciencing: How to Calculate a Wind Chill Factor](https://sciencing.com/calculate-wind-chill-factor-5981683.html)

Tralascio tutti conti da fare e riporto solamente la formula:

```
Temperatura Percepita = 13.12 + 0.6215T – 11.37 (V^0.16) + 0.3965T (V^0.16)
```

Dove

- **T**: temperatura in gradi celsius
- **V**: velocità del vento in chilometri all'ora

Posso convertire in JavaScript per ottenere questa funzione:

```js
const windChillCelsius = (temperature, windSpeed) =>
  13.12 +
  0.6215 * temperature -
  11.37 * windSpeed ** 0.16 +
  0.3965 * temperature * windSpeed ** 0.16;
```

Usando invece il sistema imperiale:

```
Temperatura Percepita = 35.74 + 0.6215T – 35.75 (V^0.16) + 0.4275T (V^0.16)
```

Con

- **T**: temperatura in gradi fahrenheit
- **V**: velocità del vento in miglia all'ora

```js
const windChillFahrenheit = (temperature, windSpeed) =>
  35.74 +
  0.6215 * temperature -
  35.75 * windSpeed ** 0.16 +
  0.4275 * temperature * windSpeed ** 0.16;
```

Unendo questi due pezzi di codice ottengo:

```js
export const calculateWindchill = (
  temperature,
  windSpeed,
  units = undefined
) => {
  const result =
    units === "US"
      ? fahrenheit(temperature, windSpeed)
      : celsius(temperature, windSpeed);
  return Math.round(result);
};
```

### Convertire numeri da un sistema all'altro

Il problema è abbastanza semplice ma possono presentarsi alcune complicazioni con la conversione da un sistema di misura all'altro.

Non ho intenzione di scrivere una trattazione completa, mi limito a riportare qui le funzioni di conversione che potranno servirmi in futuro.

Convertire Chilometri e Miglia

```js
const kmToMiles = (km) => km * 0.621371;
const milesToKm = (miles) => miles / 0.621371;
```

Convertire Celsius e Fahrenheit

```js
const celsiusToFahrenheit = (celsius) => celsius * 1.8 + 32;
const fahrenheitToCelsius = (fahrenheit) => (fahrenheit - 32) / 1.8;
```

Con questo è davvero tutto per oggi.
