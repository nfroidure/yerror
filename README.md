# YError
> Better errors for your NodeJS code.


[![NPM version](https://badge.fury.io/js/yerror.svg)](https://npmjs.org/package/yerror) [![Build status](https://secure.travis-ci.org/SimpliField/yerror.png)](https://travis-ci.org/SimpliField/yerror) [![Dependency Status](https://david-dm.org/SimpliField/yerror/status.svg)](https://david-dm.org/SimpliField/yerror) [![devDependency Status](https://david-dm.org/SimpliField/yerror/dev-status.svg)](https://david-dm.org/SimpliField/yerror#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/SimpliField/yerror/badge.svg?branch=master)](https://coveralls.io/r/SimpliField/yerror?branch=master) [![Code Climate](https://codeclimate.com/github/SimpliField/yerror.png)](https://codeclimate.com/github/SimpliField/yerror)

## Usage

First, require me where you could throw errors:

```js
var YError = require('yerror');
```

Then, emit errors with a bonus: parameters!

```js
function doSomething(pay, action) {
  if(parseInt(pay, 10) !== pay) {
    throw new YError('E_BAD_PAY', pay, action);
  }
}

doSomething('nuts', 'code');


// YError: E_BAD_PAY (nuts, code)
//   at doSomething (/home/nfroidure/simplifield/yerror/test.js:5:11)
//   at Object.<anonymous> (/home/nfroidure/simplifield/yerror/test.js:9:1)
//   (...)

```

You don't have to use constant like error messages, we use this convention
 mainly for i18n reasons.

Also, you could want to wrap errors and keep a valuable stack trace:

```js
function doSomethingAsync(pay, action) {
  return  new Promise(function(resolve, reject) {
    try {
      doSomething(pay, action);
      resolve();
    } catch(err) {
      reject(YError.bump(err));
    }
  });
}

doSomethingAsync('nuts', 'code')
  .catch(function(err) {
    console.log(err.stack);
  });

// YError: E_BAD_PAY (nuts, code)
//    at doSomething (/home/nfroidure/simplifield/yerror/test.js:5:11)
//    (...)
// YError: E_BAD_TRANSACTION (pay)
//    at Function.YError.wrap (/home/nfroidure/simplifield/yerror/src/index.js:41:12)
//    at /home/nfroidure/simplifield/yerror/test.js:16:21
//    at doSomethingAsync (/home/nfroidure/simplifield/yerror/test.js:11:11)
//    (...)


```

## API

### YError(msg:String, ...args:Mixed):Error

Creates a new YError with `msg` as a message and `args` as debug values.

### YError.wrap(err:Error, msg:String, ...args:Mixed):Error

Wraps any error and output a YError with `msg` as its message and `args` as
 debug values.

### YError.cast(err:Error, msg:String, ...args:Mixed):Error

Return YError as is or wraps any other error and output a YError with `msg` as
 its message and `args` as debug values.

### YError.bump(err:Error, fallbackMsg:String, ...fallbackArgs:Mixed):Error

Same than `YError.wrap()` but preserves the message and the debug values of the
 YError errors.

## Stats

[![NPM](https://nodei.co/npm/yerror.png?downloads=true&stars=true)](https://nodei.co/npm/yerror/)
[![NPM](https://nodei.co/npm-dl/yerror.png)](https://nodei.co/npm/yerror/)


