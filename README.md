# JSON Schema Builder
[![Build Status](https://travis-ci.org/enriched/ts-json-schema.svg?branch=master)](https://travis-ci.org/enriched/ts-json-schema)

A fluent builder for JSON Schemas

Currently with zero dependencies

![Awwww yeah](https://i.imgur.com/1H9wWCt.gif)

## Developing

`yarn install` will install all dependencies

### Testing
* `yarn test` will run the unit tests
* `yarn test:watch` will run run the unit tests in watch mode.

Compiled using typescript 2.6

## Change Log
### 1.1.0
* Added the ability to have an array of strings for the path of the property in the builder
* Switched typescript comiler to v2.6.2
* Added .npmignore to ignore source files when releasing
* Switched testing framework to jest
* excluded testing files from built files