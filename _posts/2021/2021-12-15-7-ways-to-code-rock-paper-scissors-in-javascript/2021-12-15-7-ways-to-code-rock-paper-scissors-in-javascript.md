---
title: "7 Ways To Code Rock Paper Scissors in JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Marcus Wallis**](https://unsplash.com/@marcus_wallis)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-15 16:00"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

Today's puzzle, number 14 of the [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-14), is an elven version of Rock Paper Scissors. Although it is based on a simple game, creating a digital version raises some interesting questions. It is the classic problem that can be solved in different ways. The interesting thing is to understand how to simplify the code, make it readable and above all create a version that can be expanded at will.

### The puzzle: Earth-Fire-Snow Game 🌍🔥❄️ aka Rock-Paper-Scissors 💎📜✂️

{% include picture img="cover.webp" ext="jpg" alt="" %}

Today I do different. First I show the solution I submitted for the contest, then I will report my notes on the various alternatives I found.

Let's start with the code:

<script src="https://gist.github.com/el3um4s/41f33b0a5216f9fd5049d6e07c224792.js"></script>

It seems a bit strange way of dealing with the problem. I decided not to use the classic `if...then...else` approach. I also preferred not to deal with the `switch` variant: there are a thousand tutorials of this type on the net. I did find, however, an old [stackoverflow](https://stackoverflow.com/questions/17976883/rock-paper-scissors-in-javascript) thread full of tricks.

This is an interesting suggestion and a good example of a creative solution. If we observe the rules of the game we have that:

- _Earth_ extinguishes _fire_ (_rock_ beats _scissors_)
- _Snow_ covers _earth_ (_paper_ beats _rock_)
- _Fire_ melts _snow_ (_scissors_ beats _paper_)

If we put them in line we notice an interesting thing:

```
Earth, Snow, Fire
Rock, Paper, Scissors
```

Let's take Snow: snow defeats the elements that precede him and is defeated by those that follow him.

I try to explain myself with a drawing and taking a similar game but with more options: rock-spock-paper-lizard-scissors

{% include picture img="rock-spock-paper-lizard-scissors.webp" ext="jpg" alt="" %}

I put the symbols in sequence to create a different array for each symbol. The main symbol is in the center and defeats all those who precede it. Instead, all the symbols that follow defeat him.

```js
const choices = ["rock", "spock", "paper", "lizard", "scissors"];
```

Due to the way the game is built, the order of the elements of the array is always the same. It means that a single, well-constructed array is enough to handle all the rules.

I can express this concept with a function similar to this one below:

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

This function is not my bag, it is by [Paulo Almeida](https://stackoverflow.com/users/1081569/paulo-almeida). It is his idea to use the modulo of a number to generalize the code even more. I also recommend reading this article from a few years ago: [Modulo of Negative Numbers](https://torstencurdt.com/tech/posts/modulo-of-negative-numbers/).

### Code Rock Paper Scissor with `if()`

This reasoning is not the only way to solve the problem. Guides and videos generally recommend starting with the simple before complicating. For example, this video, quite long but well done, by Ania Kubów presents 3 classic solutions

<iframe width="560" height="315" src="https://www.youtube.com/embed/RwFeg0cEZvQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Solution number 1, rewritten to fit the specifics of the puzzle, is something like this:

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

I think it's possible to go a step further and make the code easier. I find a code all the more readable when it avoids the use of conditions. Even only from a visual point of view I prefer to simplify and split the code into smaller pieces.

### Code Rock Paper Scissor with `ifVal()`

Each problem can be broken down into smaller pieces. Each repeated step can be turned into a function. The code repeatedly reports a code similar to this:

```js
if (user1.choice === "rock" && user2.choice === "scissors") {
  result = user1;
}
```

I can turn this bit into a function:

```js
function ifVal(a, b, winner) {
  if (user1.choice === a && user2.choice === b) {
    result = winner;
  }
}

ifVal("rock", "scissors", user1);
ifVal("scissors", "rock", user2);
```

In this way I can manage all the Rock Paper Scissors options with a shorter and more readable code:

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

### Code Rock Paper Scissor with `switch()`

Another way proposed by Ania Kubów involves the use of `switch`. This makes the code more readable than the previous `if` sequence.

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

### Code Rock Paper Scissor with `match()`

I can change this example as well. To do this I use the advice of this post by [Hajime Yamasaki Vukelic](https://medium.com/@hayavuk):

- [Alternative to JavaScript’s switch statement with a functional twist](https://codeburst.io/alternative-to-javascripts-switch-statement-with-a-functional-twist-3f572787ba1c)

I create the `match()` function:

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

Then I use it to manage the rules and solve the puzzle:

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

### Teaching the rules of Rock Paper Scissor to a referee

So far I have approached this problem starting from a list of predefined and known rules. To solve the classic game function is enough. But I can make things more interesting by adding the ability to expand the rules at will.

Of course, the first solution can be easily extended by modifying the array with the rules. But I want to try a different approach. I can create an object (in JavaScript everything is an object, even functions) that learns the rules of the game and has the ability to decide which player won the game. In other words, I want to create a simple AI referee for Rock Paper Scissor.

I create the `referee()` function:

```js
function referee() {
  return {};
}
```

This function should be able to learn a rule and apply it on demand:

```js
function referee() {
  const learn = () => {};
  const judge = () => {};

  return { learn, judge };
}
```

How do I explain the rules to the referee? Well, with examples. For example, I can say that the `learn` function contains two arguments: in the first place the symbol that wins and in the second the one that loses.

```js
learn("rock", "scissors");
```

Obviously the referee must have a memory to keep what he learns:

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

The `lean()` method allows you to teach the referee the rules. For the base game I get:

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

This object serves as a memory for the referee. I can use it with `judge()` to figure out who wins between two combinations of symbols:

```js
const judge = (user1, user2) => {
  return user1.choice === user2.choice
    ? null
    : training[user1.choice][user2.choice] === 1
    ? user1
    : user2;
};
```

If I join all the pieces I get a function that can be used for all the games similar to Rock Paper Scissors:

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

For example, I can solve the puzzle with:

```js
export const selectWinner = (user1, user2) => {
  const ref = referee();
  ref.learn("fire", "snow");
  ref.learn("snow", "earth");
  ref.learn("earth", "fire");

  return ref.judge(user1, user2);
};
```

Or the classic version like with:

```js
export const selectWinner = (user1, user2) => {
  const ref = referee();
  ref.learn("rock", "scissors");
  ref.learn("paper", "rock");
  ref.learn("scissors", "paper");

  return ref.judge(user1, user2);
};
```

### Use JavaScript Classes for Rock Paper Scissor

Obviously the next step is to transform the function into a JavaScript class. The concept is roughly the same it changes the syntax of the code slightly:

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

I can use the `Referee()` class in my solution in a similar way:

```js
export const selectWinner = (user1, user2) => {
  const referee = new Referee();
  referee.learn("rock", "scissors");
  referee.learn("paper", "rock");
  referee.learn("scissors", "paper");

  return referee.judge(user1, user2);
};
```

Well, that's it. As I said at the beginning, using JavaScript for Rock Paper Scissors is a simple problem. Well, that's it. As I said at the beginning, using JavaScript for Sasso Carta Forbice is a simple problem. However, it is useful for learning more about many aspects of JavaScript.

The other articles in this Christmas series can be found here:

- [Dev Advent Calendar](https://el3um4s.medium.com/list/dev-advent-calendar-89d163132d6e)
