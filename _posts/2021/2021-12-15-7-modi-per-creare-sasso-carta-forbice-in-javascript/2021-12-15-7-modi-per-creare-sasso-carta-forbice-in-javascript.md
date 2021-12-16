---
title: "7 Modi per programmare Sasso Carta Forbice in JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Marcus Wallis**](https://unsplash.com/@marcus_wallis)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-16 15:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Il puzzle di oggi, il numero 14 del [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-14), è una versione elfica di Sasso Carta Forbice. Nonostante si basi su un gioco semplice crearne una versione digitale pone alcuni quesiti interessanti. È il classico problema che può essere risolto in modi diversi. La cosa interessante è capire come semplificare il codice, renderlo leggibile e sopratutto creare una versione che può essere ampliata a piacere

### Il problema: Earth-Fire-Snow Game 🌍🔥❄️ aka Rock-Paper-Scissors 💎📜✂️

{% include picture img="cover.webp" ext="jpg" alt="" %}

Oggi faccio una cosa diversa. Per prima cosa mostro la soluzione che ho inviato per il contest, poi riporterò i miei appunti sulle varie alternative che ho trovato.

Cominciamo con il codice:

```js
export const selectWinner = (user1, user2) => {
  const choices = ["earth", "snow", "fire"]; // ["rock", "paper", "scissors"]
  const x = choices.indexOf(user1.choice);
  const y = choices.indexOf(user2.choice);
  if (x == y) {
    return null;
  }
  if (mod(x - y, choices.length) < choices.length / 2) {
    return user1;
  } else {
    return user2;
  }
};

function mod(a, b) {
  const c = a % b;
  return c < 0 ? c + b : c;
}
```

A prima vista pare un modo un po' strano per affrontare il problema. Ho deciso di non usare il classico approccio `if...then...else`. Ho anche preferito non affrontare la variante `switch`: in rete ci sono mille tutorial di questo tipo. Ho trovato, però, una vecchia discussione di [stackoverflow](https://stackoverflow.com/questions/17976883/rock-paper-scissors-in-javascript) ricca di suggerimenti.

Questo è un suggerimento interessante e un bell'esempio di soluzione creativa. Se osserviamo le regole del gioco abbiamo che:

- _Earth_ extinguishes _fire_ (_rock_ beats _scissors_)
- _Snow_ covers _earth_ (_paper_ beats _rock_)
- _Fire_ melts _snow_ (_scissors_ beats _paper_)

Se li mettiamo in riga notiamo una cosa interessante:

```
Earth, Snow, Fire
Rock, Paper, Scissors
```

Prendiamo Snow: snow sconfigge gli elementi che lo precedono e viene sconfitto da quelli che lo seguono.

Provo a spiegarmi con un disegno e prendendo un gioco simile ma con più opzioni: rock-spock-paper-lizard-scissors

{% include picture img="rock-spock-paper-lizard-scissors.webp" ext="jpg" alt="" %}

Mettendo i simboli in sequenza posso creare un array diverso per ogni simbolo. Il simbolo principale è al centro e sconfigge tutti quelli che lo precedono. Invece tutti i simboli che seguono lo sconfiggono.

```js
const choices = ["rock", "spock", "paper", "lizard", "scissors"];
```

La cosa interessante è che per come è costruito il gioco l'ordine degli elementi dell'array è sempre lo stesso. Significa che basta un unico array e trattarlo come circuito chiuso.

Un modo per esprimere questo concetto usare una funzione simile a questa:

```js
function compare(choice1, choice2) {
  choice1 = choices.indexOf(choice1);
  choice2 = choices.indexOf(choice2);
  if (choice1 == choice2) {
    return "Tie";
  }
  if (choice1 == choices.length - 1 && choice2 == 0) {
    return "Right wins";
  }
  if (choice2 == choices.length - 1 && choice1 == 0) {
    return "Left wins";
  }
  if (choice1 > choice2) {
    return "Left wins";
  } else {
    return "Right wins";
  }
}
```

Questa funzione non è farina del mio sacco, è di [Paulo Almeida](https://stackoverflow.com/users/1081569/paulo-almeida). Ed è sempre sua l'idea di usare il modulo di un numero per generalizzare ancor di più il codice.

Giusto per inciso, consiglio anche la lettura di questo articolo di qualche anno fa: [Modulo of Negative Numbers](https://torstencurdt.com/tech/posts/modulo-of-negative-numbers/).

### Sasso Carta Forbice usando `if()`

Ovviamente questo ragionamento non è l'unico modo per risolvere il problema. In genere le guide e i video in rete consigliano di partire dal semplice prima di complicare. Per esempio questo video, abbastanza lungo ma ben fatto, di Ania Kubów presenta 3 soluzioni classiche

<iframe width="560" height="315" src="https://www.youtube.com/embed/RwFeg0cEZvQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

La sua soluzione numero 1, riscritta per adattarsi al problema del giorno, è qualcosa del genere:

```js
export const selectWinner = (user1, user2) => {
  let result = null;

  if (user1.choice === user2.choice) {
    result = null;
  }

  if (user1.choice === "rock" && user2.choice === "scissors") {
    result = user1;
  }

  if (user1.choice === "scissors" && user2.choice === "paper") {
    result = user1;
  }

  if (user1.choice === "paper" && user2.choice === "rock") {
    result = user1;
  }

  if (user1.choice === "scissors" && user2.choice === "rock") {
    result = user2;
  }

  if (user1.choice === "paper" && user2.choice === "scissors") {
    result = user2;
  }

  if (user1.choice === "rock" && user2.choice === "paper") {
    result = user2;
  }

  return result;
};
```

Penso però che sia possibile fare un passo oltre e semplificare il codice. Per lo meno, trovo tanto più leggibile un codice quanto evita l'utilizzo di condizioni. Anche solo dal punto di vista visivo preferisco semplificare. E dividere.

### Sasso Carta Forbice usando `ifVal()`

Ogni problema può essere scomposto in pezzetti più piccoli. E ogni passaggio ripetuto può essere trasformato in una funzione. Il codice riporta più volte una codice simile a questo:

```js
if (user1.choice === "rock" && user2.choice === "scissors") {
  result = user1;
}
```

Posso trasformare in una funzione questo pezzetto, generalizzandolo:

```js
function ifVal(a, b, winner) {
  if (user1.choice === a && user2.choice === b) {
    result = winner;
  }
}

ifVal("rock", "scissors", user1);
ifVal("scissors", "rock", user2);
```

In questo modo posso gestire tutte le opzioni di Sasso Carta Forbice con un codice più corto e più leggibile:

```js
export const selectWinner = (user1, user2) => {
  let result = null;

  const ifVal = (a, b, w) =>
    user1.choice === a && user2.choice === b ? (result = w) : null;

  ifVal("rock", "scissors", user1);
  ifVal("scissors", "paper", user1);
  ifVal("paper", "rock", user1);
  ifVal("scissors", "rock", user2);
  ifVal("paper", "scissors", user2);
  ifVal("rock", "paper", user2);

  return result;
};
```

### Sasso Carta Forbice usando `switch()`

Un altro modo proposto da Ania Kubów prevede l'utilizzo di `switch`. Questo rende il codice più leggibile rispetto alla sequela di `if` precedenti.

```js
export const selectWinner = (user1, user2) => {
  let result = null;

  switch (user1.choice + user2.choice) {
    case "rockscissors":
    case "scissorspaper":
    case "paperrock":
      result = user1;
      break;
    case "scissorsrock":
    case "paperscissors":
    case "rockpaper":
      result = user2;
      break;
    case "paperpaper":
    case "scissorsscissors":
    case "rockrock":
      result = null;
      break;
  }
  return result;
};
```

### Sasso Carta Forbice usando `match()`

È però possibile modificare anche questo esempio. Per farlo utilizzo il consiglio di questo post di [Hajime Yamasaki Vukelic](https://medium.com/@hayavuk):

- [Alternative to JavaScript’s switch statement with a functional twist](https://codeburst.io/alternative-to-javascripts-switch-statement-with-a-functional-twist-3f572787ba1c)

Creo una funzione `match()`:

```js
const isFunction = function isFunction(check) {
  return check && {}.toString.call(check) === "[object Function]";
};

const matched = (x) => ({
  on: () => matched(x),
  otherwise: () => x,
});

const match = (x) => ({
  on: (pred, fn) =>
    (isFunction(pred) ? pred(x) : pred === x) ? matched(fn(x)) : match(x),
  otherwise: (fn) => fn(x),
});
```

Poi la uso per gestire le regole e risolvere il puzzle:

```js
export const selectWinner = (user1, user2) => {
  return match({
    user1,
    user2,
  })
    .on(
      ({ user1, user2 }) => user1.choice == user2.choice,
      () => null
    )
    .on(
      ({ user1, user2 }) =>
        user1.choice == "rock" && user2.choice == "scissors",
      () => user1
    )
    .on(
      ({ user1, user2 }) =>
        user1.choice == "scissors" && user2.choice == "paper",
      () => user1
    )
    .on(
      ({ user1, user2 }) => user1.choice == "paper" && user2.choice == "rock",
      () => user1
    )
    .otherwise(() => user2);
};
```

### Insegnare le regole di Sasso Carta Forbice ad un arbitro

Finora ho affrontato questo problema partendo da una lista di regole predefinite e conosciute. Per risolvere la funzione classica del gioco è sufficiente. Ma posso rendere le cose più interessanti aggiungendo la possibilità di ampliare le regole a piacere.

Certo, la prima soluzione presenta può essere facilmente estesa modificando l'array con le regole. Ma voglio provare un approccio diverso. Posso creare un oggetto (in JavaScript ogni cosa è un oggetto, anche le funzioni) che impara le regole del gioco e abbia la capacità di decidere quale giocatore abbia vinto la partita. In altre parole, voglio programmare un arbitro per Sasso Carta Forbice.

Creo quindi una funzione `referee()`:

```js
function referee() {
  return {};
}
```

Questa funzione dovrà essere in grado di apprendere una regola e di applicarla a richiesta:

```js
function referee() {
  const learn = () => {};
  const judge = () => {};

  return { learn, judge };
}
```

Come faccio a spiegare all'arbitro le regole? Beh, con degli esempi. Posso stabile per esempio che la funzione `learn` contenga due argomenti: al primo posto il simbolo che vince mentre al secondo quello che perde.

```js
learn("rock", "scissors");
```

Ovviamente l'arbitro deve avere una memoria in cui conservare quello che apprende:

```js
function referee() {
  const training = {};

  const learn = (winner, loser) => {
    if (!choice in training) {
      training[winner] = {};
    }
    training[winner][loser] = 1;
  };

  const judge = () => {};

  return { learn, judge };
}
```

Il metodo lean permette di insegnare all'arbitro le regole. Per il gioco base ottengo:

```js
const training = {
  rock: {
    scissors: 1,
  },
  paper: {
    rock: 1,
  },
  scissors: {
    paper: 1,
  },
};
```

Questo oggetto funge da memoria per l'arbitro. Posso usarlo con `judge()` per ricavare chi vince tra due combinazioni di simboli:

```js
const judge = (user1, user2) => {
  return user1.choice === user2.choice
    ? null
    : training[user1.choice][user2.choice] === 1
    ? user1
    : user2;
};
```

Se unisco tutti i pezzi ottengo una funzione che puà essere usata per tutti i giochi simili a Sasso Carta Forbice:

```js
function referee() {
  const training = {};

  const isValidAction = (choice) => choice in training;

  const learn = (winner, loser) => {
    if (!isValidAction(winner)) {
      training[winner] = {};
    }
    training[winner][loser] = 1;
  };

  const judge = (user1, user2) => {
    return user1.choice === user2.choice
      ? null
      : training[user1.choice][user2.choice] === 1
      ? user1
      : user2;
  };

  const getChoices = () => Object.keys(training);

  return {
    isValidAction,
    learn,
    judge,
    getChoices,
  };
}
```

Per esempio, posso risolvere il puzzle così:

```js
export const selectWinner = (user1, user2) => {
  const ref = referee();
  ref.learn("fire", "snow");
  ref.learn("snow", "earth");
  ref.learn("earth", "fire");

  return ref.judge(user1, user2);
};
```

Oppure la versione classica così:

```js
export const selectWinner = (user1, user2) => {
  const ref = referee();
  ref.learn("rock", "scissors");
  ref.learn("paper", "rock");
  ref.learn("scissors", "paper");

  return ref.judge(user1, user2);
};
```

### Usare Classi JavaScript per Sasso Carta Forbice

Ovviamente il passo successivo è trasformare la funzione in una classe JavaScript. Il concetto è grosso modo lo stesso cambia leggermente la sintassi del codice:

```js
class Referee {
  rules = {};
  constructor() {}

  validate = (choice) => choice in this.rules;
  getChoices = () => Object.keys(this.rules);
  learn = (winner, loser) => {
    if (!this.validate(winner)) {
      this.rules[winner] = {};
    }
    this.rules[winner][loser] = 1;
  };

  judge(user1, user2) {
    return user1.choice === user2.choice
      ? null
      : this.rules[user1.choice][user2.choice] === 1
      ? user1
      : user2;
  }
}
```

Posso usare la classe `Referee()` nella mia soluzione in maniera simile:

```js
export const selectWinner = (user1, user2) => {
  const referee = new Referee();
  referee.learn("rock", "scissors");
  referee.learn("paper", "rock");
  referee.learn("scissors", "paper");

  return referee.judge(user1, user2);
};
```

Bene, questo è tutto. Come ho detto all'inizio, usare JavaScript per Sasso Carta Forbice è un problema semplice ma si presta bene per approfondire molti aspetti di JavaScript.

Infine, gli altri articoli di questa serie natalizia sono disponibili qui:

- [Dev Advent Calendar](https://el3um4s.medium.com/list/dev-advent-calendar-89d163132d6e)
