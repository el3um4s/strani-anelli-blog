---
title: "How To Code a Caesar Cipher in JavaScript"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Ilona Frey**](https://unsplash.com/@couleuroriginal)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-12-23 13:30"
categories:
  - dev advent
  - javascript
tags:
  - dev advent
  - javascript
---

The elves have taken cybersecurity seriously. Like any fashion, it has also reached children. One of the little elves' favorite games is writing encrypted messages during school hours. Some of them found the page on the [Caesar cipher on Wikipedia](https://en.wikipedia.org/wiki/Caesar_cipher) and now they don't stop it anymore.

### The Puzzle: Secret Messages ✉️

{% include picture img="cover.webp" ext="jpg" alt="" %}

Today's problem, issue 22 of the [Dev Advent Calendar 🎅](https://github.com/devadvent/puzzle-22) is once again about the passwords, the codes and the methods to decipher them. And we go to the classic: Caesar's cipher:

```
In cryptography, a Caesar cipher, also known as Caesar's cipher, the shift cipher, Caesar's code or Caesar shift, is one of the simplest and most widely known encryption techniques. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet.
```

Put simply, we replace each letter with the one that follows it in `x` positions. For example, with `shift = 1` the letter `A` becomes `B`. With `shift = 2` the letter `A` becomes `C`. With `shift = 3` the letter `A` becomes `D`. And so on.

{% include picture img="caesar.webp" ext="jpg" alt="" %}

There are several solutions on the internet but almost all of them involve explicit writing of the alphabet plus some `if` conditions combined with `for` loops. My solution to the problem is different and starts from the formula

```
f(x) = x + k(mod. m)
```

With `m = number of letters of the alphabet` and `k = shift`.

Starting from this formula I can get a JavaScript function similar to this:

```js
const chiper = (char, shift) => mod(char + shift, alphabet.length);
```

The problem is figuring out how to pass the letters. The most common method involves converting the character into the corresponding numeric code. Then we add the shift and convert it back to characters.

I decided to do something different. After all, a Caesar cipher is nothing more than a dictionary in which each letter corresponds to another. I can then create a JavaScript object with the various letters as keys.

First I create two arrays, one for uppercase letters, the other for lowercase ones:

```js
const uppercase = () =>
  [...Array(26)].map((n, i) => `${String.fromCharCode(i + "A".charCodeAt())}`);
const lowercase = () =>
  [...Array(26)].map((n, i) => `${String.fromCharCode(i + "a".charCodeAt())}`);
```

Then I need a function to calculate the modulus of a number:

```js
const mod = (a, b) => {
  const c = a % b;
  return c < 0 ? c + b : c;
};
```

Finally something that creates a match between the key and the solution.

```js
const chiper = (array, shift) => {
  const cipher = {};
  array.forEach((value, index) => {
    cipher[value] = array[mod(index + shift, array.length)];
  });
  return cipher;
};
```

This function accepts an array containing the alphabet as input and returns an object with the encryption code.

For each item in the array, for each letter of the alphabet, it calculates the corresponding encrypted letter. The length of the alphabet is given by the number of elements in the array.

To simplify the resolution I create a helper function to handle the dictionary of both uppercase and lowercase letters.

```js
const caesarChipher = (shift) => {
  return {
    ...chiper(uppercase(), shift),
    ...chiper(lowercase(), shift),
  };
};
```

This way I get an object like this:

```js
const caesar = {
  A: "N",
  B: "O",
  C: "P",
  //...
  a: "n",
  b: "o",
  c: "p",
  //...
};
```

After getting the cipher I can translate each letter:

```js
const a = caesar.a; // n
const aUpper = caesar.A; // N
const b = caesar["b"]; // o
```

We can also ignore all non-alphabetic characters in a very simple way: if the matching key does not exist in the cipher then the character is not converted:

```js
const processCharacter = (cipher, character) =>
  cipher.hasOwnProperty(character) ? cipher[character] : character;
```

After creating all the various support functions the solution is short and simple:

```js
export default (text, shift) => {
  const caesar = caesarChipher(shift);
  return [...text].map((c) => processCharacter(caesar, c)).join("");
};
```

There is an interesting aspect to this solution: the same function used to decrypt can also be used to decrypt. Just use a negative shift: in this way the letters are not scrolled forward but backwards allowing you to recover the original message.

This is the complete code:

```js
const uppercase = () =>
  [...Array(26)].map((n, i) => `${String.fromCharCode(i + "A".charCodeAt())}`);
const lowercase = () =>
  [...Array(26)].map((n, i) => `${String.fromCharCode(i + "a".charCodeAt())}`);

const mod = (a, b) => {
  const c = a % b;
  return c < 0 ? c + b : c;
};

const chiper = (array, shift) => {
  const cipher = {};
  array.forEach((value, index) => {
    cipher[value] = array[mod(index + shift, array.length)];
  });
  return cipher;
};

const caesarChipher = (shift) => {
  return {
    ...chiper(uppercase(), shift),
    ...chiper(lowercase(), shift),
  };
};

const processCharacter = (cipher, character) =>
  cipher.hasOwnProperty(character) ? cipher[character] : character;

export default (text, shift) => {
  const caesar = caesarChipher(shift);
  return [...text].map((c) => processCharacter(caesar, c)).join("");
};
```

### Prashant Yadav's solution

As I said at the beginning, there are many solutions to this problem online. [Prashant Yadav](https://learnersbucket.com/examples/algorithms/caesar-cipher-in-javascript/) proposes some of the most common.

```js
let ceaserCipher = (str) => {
  //Deciphered reference letters
  let decoded = {
    a: "n",
    b: "o",
    c: "p",
    d: "q",
    e: "r",
    f: "s",
    g: "t",
    h: "u",
    i: "v",
    j: "w",
    k: "x",
    l: "y",
    m: "z",
    n: "a",
    o: "b",
    p: "c",
    q: "d",
    r: "e",
    s: "f",
    t: "g",
    u: "h",
    v: "i",
    w: "j",
    x: "k",
    y: "l",
    z: "m",
  };

  //convert the string to lowercase
  str = str.toLowerCase();

  //decipher the code
  let decipher = "";
  for (let i = 0; i < str.length; i++) {
    decipher += decoded[str[i]];
  }

  //return the output
  return decipher;
};
```

What are the problems with this approach?

- this code only encrypts with a predefined shift (in this case of 13)
- only works for lowercase letters
- only works with strings that do not contain spaces or other characters not contained in the `decoded` variable
- does not decrypt the message

His second idea is more interesting:

```js
let caesarCipher => (str, key) {
  return str.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0)-65 + key ) % 26 + 65));
}
```

This function converts all letters to uppercase and then replaces them. There remains the problem of handling lowercase letters. To do this, you need to change the function:

```js
//check if letter is uppercase
function isUpperCase(str) {
  return str === str.toUpperCase();
}

//decipher the string
let ceaserCipher = (str, key) => {
  let decipher = "";

  //decipher each letter
  for (let i = 0; i < str.length; i++) {
    //if letter is uppercase then add uppercase letters
    if (isUpperCase(str[i])) {
      decipher += String.fromCharCode(
        ((str.charCodeAt(i) + key - 65) % 26) + 65
      );
    } else {
      //else add lowercase letters
      decipher += String.fromCharCode(
        ((str.charCodeAt(i) + key - 97) % 26) + 97
      );
    }
  }

  return decipher;
};
```

The management of non-alphabetic characters, including spaces, remains problematic.

### Marian Veteanu's solution

[Marian Veteanu's blog](https://codeavenger.com/2017/05/19/JavaScript-Modulo-operation-and-the-Caesar-Cipher.html) has many interesting posts. There is a solution to how to create a Caesar cipher

```js
function mod(n, p) {
  return n - p * Math.floor(n / p);
}

function encrypt(msg, key) {
  var encMsg = "";

  for (var i = 0; i < msg.length; i++) {
    var code = msg.charCodeAt(i);

    if (code >= 65 && code <= 65 + 26 - 1) {
      code -= 65;
      code = mod(code + key, 26);
      code += 65;
    }
    if (code >= 97 && code <= 97 + 26 - 1) {
      code -= 97;
      code = mod(code + key, 26);
      code += 97;
    }

    encMsg += String.fromCharCode(code);
  }

  return encMsg;
}
```

This solution works, but I don't like having so many hard-coded values. But it has the advantage of not using arrays or other objects. Like the next solution.

### Evan Hahn's solution

[Evan Hahn](https://gist.github.com/EvanHahn/2587465) proposes a working solution:

```js
var caesarShift = function (str, amount) {
  // Wrap the amount
  if (amount < 0) {
    return caesarShift(str, amount + 26);
  }

  // Make an output variable
  var output = "";

  // Go through each character
  for (var i = 0; i < str.length; i++) {
    // Get the character we'll be appending
    var c = str[i];

    // If it's a letter...
    if (c.match(/[a-z]/i)) {
      // Get its code
      var code = str.charCodeAt(i);

      // Uppercase letters
      if (code >= 65 && code <= 90) {
        c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
      }

      // Lowercase letters
      else if (code >= 97 && code <= 122) {
        c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
      }
    }

    // Append
    output += c;
  }

  // All done!
  return output;
};
```

However, this solution presents some problems. Or, rather, some things I don't like. The first is the presence of several `if` conditions and a` for` loop. I am increasingly convinced that they make it difficult to read the code and difficult to maintain.

Secondly, the alphabet to work on is fixed in the code by hard-coded values. Where possible it is always best to avoid entering hard-coded values. Finally if I wanted to convert this function to use another character set I would run into trouble.

But the code works.

Well, that's all for today. Obviously I prefer the solution that I have proposed. But the great thing about JavaScript, and programming in general, is that there can be several ways to get to the correct solution. Part of the fun is figuring out which paths are possible.
