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

<script src="https://gist.github.com/el3um4s/9a89df405ca64eb3000c0ced135ec905.js"></script>

Due to the way the game is built, the order of the elements of the array is always the same. It means that a single, well-constructed array is enough to handle all the rules.

I can express this concept with a function similar to this one below:

<script src="https://gist.github.com/el3um4s/18f55764f84ad74acf9bb82722fc1259.js"></script>

This function is not my bag, it is by [Paulo Almeida](https://stackoverflow.com/users/1081569/paulo-almeida). It is his idea to use the modulo of a number to generalize the code even more. I also recommend reading this article from a few years ago: [Modulo of Negative Numbers](https://torstencurdt.com/tech/posts/modulo-of-negative-numbers/).

### Code Rock Paper Scissor with `if()`

This reasoning is not the only way to solve the problem. Guides and videos generally recommend starting with the simple before complicating. For example, this video, quite long but well done, by Ania Kubów presents 3 classic solutions

<iframe width="560" height="315" src="https://www.youtube.com/embed/RwFeg0cEZvQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Solution number 1, rewritten to fit the specifics of the puzzle, is something like this:

<script src="https://gist.github.com/el3um4s/e062c13d098c3faaa58628e7cd84e0d0.js"></script>

I think it's possible to go a step further and make the code easier. I find a code all the more readable when it avoids the use of conditions. Even only from a visual point of view I prefer to simplify and split the code into smaller pieces.

### Code Rock Paper Scissor with `ifVal()`

Each problem can be broken down into smaller pieces. Each repeated step can be turned into a function. The code repeatedly reports a code similar to this:

<script src="https://gist.github.com/el3um4s/76a832fd5428ffdab6b8efffaafbfa89.js"></script>

I can turn this bit into a function:

<script src="https://gist.github.com/el3um4s/477d0e2e1fdff6f162670425a84d6dd8.js"></script>

In this way I can manage all the Rock Paper Scissors options with a shorter and more readable code:

<script src="https://gist.github.com/el3um4s/65d778d574bb68f90455029216691342.js"></script>

### Code Rock Paper Scissor with `switch()`

Another way proposed by Ania Kubów involves the use of `switch`. This makes the code more readable than the previous `if` sequence.

<script src="https://gist.github.com/el3um4s/89e13d135d292427cc97b39125817deb.js"></script>

### Code Rock Paper Scissor with `match()`

I can change this example as well. To do this I use the advice of this post by [Hajime Yamasaki Vukelic](https://medium.com/@hayavuk):

- [Alternative to JavaScript’s switch statement with a functional twist](https://codeburst.io/alternative-to-javascripts-switch-statement-with-a-functional-twist-3f572787ba1c)

I create the `match()` function:

<script src="https://gist.github.com/el3um4s/dae4e574c32ba25032a36e43ff0a36b9.js"></script>

Then I use it to manage the rules and solve the puzzle:

<script src="https://gist.github.com/el3um4s/470a5ff7a602276d40114aa36b238108.js"></script>

### Teaching the rules of Rock Paper Scissor to a referee

So far I have approached this problem starting from a list of predefined and known rules. To solve the classic game function is enough. But I can make things more interesting by adding the ability to expand the rules at will.

Of course, the first solution can be easily extended by modifying the array with the rules. But I want to try a different approach. I can create an object (in JavaScript everything is an object, even functions) that learns the rules of the game and has the ability to decide which player won the game. In other words, I want to create a simple AI referee for Rock Paper Scissor.

I create the `referee()` function:

<script src="https://gist.github.com/el3um4s/6acc9a4ed58d8ca9061f758de8dc12b3.js"></script>

This function should be able to learn a rule and apply it on demand:

<script src="https://gist.github.com/el3um4s/50fff6c9c64083fd8ce7993ca8c7c5d8.js"></script>

How do I explain the rules to the referee? Well, with examples. For example, I can say that the `learn` function contains two arguments: in the first place the symbol that wins and in the second the one that loses.

<script src="https://gist.github.com/el3um4s/d0caa26eff692b4c174eb0c30095364e.js"></script>

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

The `learn()` method allows you to teach the referee the rules. For the base game I get:

<script src="https://gist.github.com/el3um4s/74f295b4edc036cf217ffa111c784c5c.js"></script>

This object serves as a memory for the referee. I can use it with `judge()` to figure out who wins between two combinations of symbols:

<script src="https://gist.github.com/el3um4s/6427ed073d25153f7118181560f5dae8.js"></script>

If I join all the pieces I get a function that can be used for all the games similar to Rock Paper Scissors:

<script src="https://gist.github.com/el3um4s/ba54f506a40ea1faaffafd56f1541063.js"></script>

For example, I can solve the puzzle with:

<script src="https://gist.github.com/el3um4s/97a499dc6c01df39df3baec050f31bb7.js"></script>

Or the classic version like with:

<script src="https://gist.github.com/el3um4s/62447595edd1e32a7275badc2408b1ee.js"></script>

### Use JavaScript Classes for Rock Paper Scissor

Obviously the next step is to transform the function into a JavaScript class. The concept is roughly the same it changes the syntax of the code slightly:

<script src="https://gist.github.com/el3um4s/06da32c2f357b1b26ae5354ce82a0fab.js"></script>

I can use the `Referee()` class in my solution in a similar way:

<script src="https://gist.github.com/el3um4s/39d70b4734ec12e97bff6ba3ffe19b44.js"></script>

Well, that's it. As I said at the beginning, using JavaScript for Rock Paper Scissors is a simple problem. Well, that's it. As I said at the beginning, using JavaScript for Sasso Carta Forbice is a simple problem. However, it is useful for learning more about many aspects of JavaScript.

The other articles in this Christmas series can be found here:

- [Dev Advent Calendar](https://el3um4s.medium.com/list/dev-advent-calendar-89d163132d6e)
