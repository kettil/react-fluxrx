# react-fluxRx [BETA]

react-fluxRx is a predictable state container for react apps.
It combines the idea behind [flux](https://facebook.github.io/flux/)/[redux](https://www.npmjs.com/package/redux) and [RxJS](https://www.npmjs.com/package/rxjs).

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Introduction](#introduction)
- [Building](#building)
- [Tests](#tests)
- [Prettier and Lint](#prettier-and-lint)

## Features

- Support one or many state containers
- Actions can synchronously or asynchronously
- Multiple updates can be made per action
- API similar to redux (e.g. you can use [reselect](https://github.com/reduxjs/reselect))
- Simple integration of e.g. [debounce](https://www.learnrxjs.io/operators/filtering/debounce.html) or [throttle](https://www.learnrxjs.io/operators/filtering/throttle.html) per action
- Middleware system
- Full TypeScript support
- Support for [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension)

## Installation

```bash
npm install -P react-fluxrx
```

## Introduction

...

## Building

Compile the application from TypeScript to JavaScript.

The following command is available:

- `npm run build`

  Builds the application

## Tests

**The following commands are available:**

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `npm run test`       | Run all unit tests                  |
| `npm run test:watch` | Watching mode from unit test        |
| `npm run coverage`   | Creates a coverage report from test |

## Prettier and Lint

Ensures that the code is formatted uniformly and that the coding standards are adhered to.

The following commands are available:

- `npm run prettier`

  Changes the code formatting as defined in the Prettier setting.

- `npm run lint`

  Checks if the lint rules are followed. It calls the prettier command first.
