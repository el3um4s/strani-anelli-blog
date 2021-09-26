---
title: "NPM Packages with TypeScript (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Paul Esch-Laurent**](https://unsplash.com/@pinjasaur)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-09-26 17:00"
categories:
  - NPM
  - GitHub
  - TypeScript
tags:
  - NPM
  - GitHub
  - TypeScript
---

The more I play with the programming, the more I realize that I am often rewriting the same code. I therefore decided to upload some functions to [NPM](https://www.npmjs.com/). But how can I create an NPM package using TypeScript? Well, I had to put together a few guides and do some tests. These are the steps I followed.

### Initialize the package and install TypeScript

I create the `package.json` file with default values:

```bash
npm init -y
```

Then I add the `node_modules` folder among the paths to ignore in `.gitignore`.

I install TypeScript:

```bash
npm install --save-dev typescript
```

I configure the `tsconfig.json` file:

```json
{
    "compilerOptions": {
        "outDir": "./lib",
        "module": "ES2020", // or commonjs
        "target": "ES2019",
        "lib": [
            "ES2019",
            "DOM",
            "ES2020"
        ],
        "declaration": true,
        "strict": true
    },
    "include": ["src"],
    "exclude": ["node_modules", "**/__tests__/*"]
}
```

I create a `src` folder in which to put the starting code. Then I add the `index.ts` file:

```ts
const myCustomFunction = (name: string):string => `Hello ${name}`;
function ciao(name: string): string {
    return `Ciao ${name}`;
}

export { myCustomFunction, ciao};
```

I add a script to `package.json` to start compiling the ts files:

```json
{
//...
  "scripts": {
    "build": "tsc"
  }
//...
}
```

I use the `npm run build` command to compile the files:

```bash
npm run build
```

After running the command I can see a new folder: `lib`. Inside there are 2 files: `index.js` with the compiled code and `index.d.ts` with the type definitions.

I'm not interested in comparing with source control the generated files. I add the `lib` folder to `.gitignore`:

```
node_modules
/lib
```

For NPM packages I want the opposite. I want to make only the compiled files visible and not the source files. To do this I add to `package.json`:

```json
{
  // ...
  "files": [
    "lib/**/*"
  ]
}
```

### Add ESLint

I add [ESLint](https://www.npmjs.com/package/eslint) to keep the code a little cleaner

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Then I add the `.eslintrc` file:

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ]
}
```

I use `.eslintignore` to ignore compiled files:

```
node_modules
/lib
```

Now, to check my code, I can use:

```bash
npm run lint
```

### Set the script to publish NPM

I add some specific scripts to publish on NPM

- **prepare**: will run both _before_ the package is packed and published, and on local `npm install`. Perfect for running building the code
- **prepublishOnly**: will run _before_ prepare and _only_ on npm publish
- **preversion**: will run before bumping a new package version
- **version**: will run after a new version has been bumped. If your package has a git repository, like in our case, a commit and a new version-tag will be made every time you bump a new version. This command will run _before_ the commit is made
- **postversion**: will run after the commit has been made

By adding these scripts the `package.json` file looks like this:

```json
"scripts": {
  "build": "tsc",
  "lint": "eslint . --ext .ts",
  "test": "echo \"Error: no test specified\" && exit 1",
  "prepare" : "npm run build",
  "prepublishOnly" : "npm run lint",
  "preversion" : "npm run lint",
  "version" : "git add -A src",
  "postversion" : "git push && git push --tags"
}
```

### Set the information for NPM

Before publishing the package on NPM I need to update and add some information. I edit `package.json`:

```json
{
  "name": "@el3um4s/typescript-npm-package-starter",
  "version": "0.0.1",
  "description": "Typescript NPM Package Starter",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "keywords": ["typescript", "npm", "template", "ts"],
  "license": "MIT",
}
```

I decided to add a [_scope_](https://docs.npmjs.com/cli/v7/using-npm/scope) to the repository name to avoid conflicts with other repositories similar names.

### Publish the package

To publish the package on NPM I need an account (this is the [signup page]((https://www.npmjs.com/signup))). After creating it, I can log in directly from the console:


```bash
npm login
```

So I can publish to NPM with the command

```bash
npm publish --access public
```

The package is now available at [@el3um4s/typescript-npm-package-starter](https://www.npmjs.com/package/@el3um4s/typescript-npm-package-starter).

### Try the package

I can use my code in each project using the command:

```bash
npm i @el3um4s/typescript-npm-package-starter
```

I import the function I need:

```ts
import { ciao } from "@el3um4s/typescript-npm-package-starter";

const b = ciao("mondo");
console.log(b);
```

### Add tests

It is good practice to always add tests. This way we can be sure not to break anything by accident.

This is a point on which I am quite poor, so I just follow the advice found on the internet.

I start with installing [Jest](https://jestjs.io/):

```bash
npm install --save-dev jest ts-jest @types/jest
```

So I create a `jestconfig.json` configuration file:

```json
{
  "transform": {
    "^.+\\.(t|j)sx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"]
}
```

and replace the `package.json` test script with

```json
"test": "jest --config jestconfig.json",
```

I put the tests in the `src / __ tests__` directory. I can name the files whatever I like, the important thing is that they have the extension `.test.ts`. I create the file `Ciao.test.ts` and add the first tests:

```ts
import { Greeter } from '../index';
test('My Greeter', () => {
  expect(Greeter('Carl')).toBe('Hello Carl');
});
```

I run `npm test` to verify the code:

```bash
npm test
```

I then update the _prepublishOnly_ script to automatically run the tests before uploading a new version.

```json
"prepublishOnly" : "npm test && npm run lint"
```

### Test Coverage

A good practice is to measure how much code is covered by the tests. I can automatically get a report after each test by adding these lines to `jestconfig.json`

```json
"collectCoverageFrom": ["src/**/*.{ts,tsx}"],
"collectCoverage":true
```

This way, every time I run tests, a `coverage\lcov-report` folder is created with an `index.html` file inside to be consulted to verify test coverage.

### Update the package

I can update the package on NPM directly from the command line. First I increase the version number with the command:

```bash
npm version patch
```

Then I publish to NPM again with:

```bash
npm publish
```

### Links

To write this post I used several guides, posts and repositories. These are the most useful ones:

- [Step by step: Building and publishing an NPM Typescript package.](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)
- [npm - Understanding Scoped Packages](https://nitayneeman.com/posts/understanding-scoped-packages-in-npm/)
- [How to use ESLint with TypeScript](https://khalilstemmler.com/blogs/typescript/eslint-for-typescript/)

Finally:

- the project on GitHub: [el3um4s/typescript-npm-package-starter](https://github.com/el3um4s/typescript-npm-package-starter)
- the project on NPM: [@el3um4s/typescript-npm-package-starter](https://www.npmjs.com/package/@el3um4s/typescript-npm-package-starter)
- my Patreon: [patreon.com/el3um4s](https://patreon.com/el3um4s)
