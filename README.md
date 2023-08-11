[//]: # ( )
[//]: # (This file is automatically generated by a `metapak`)
[//]: # (module. Do not change it  except between the)
[//]: # (`content:start/end` flags, your changes would)
[//]: # (be overridden.)
[//]: # ( )
# yerror
> It helps to know why you got an error.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nfroidure/yerror/blob/main/LICENSE)
[![Coverage Status](https://coveralls.io/repos/github/git://github.com/nfroidure/yerror.git/badge.svg?branch=main)](https://coveralls.io/github/git://github.com/nfroidure/yerror.git?branch=main)


[//]: # (::contents:start)

## Usage

First, require me where you could throw errors:

```js
import YError from 'yerror';
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
//   at doSomething (/home/nfroidure/nfroidure/yerror/test.js:5:11)
//   at Object.<anonymous> (/home/nfroidure/nfroidure/yerror/test.js:9:1)
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
//    at doSomething (/home/nfroidure/nfroidure/yerror/test.js:5:11)
//    (...)
// YError: E_BAD_TRANSACTION (pay)
//    at Function.YError.wrap (/home/nfroidure/nfroidure/yerror/src/index.js:41:12)
//    at /home/nfroidure/nfroidure/yerror/test.js:16:21
//    at doSomethingAsync (/home/nfroidure/nfroidure/yerror/test.js:11:11)
//    (...)
```


[//]: # (::contents:end)

# API
## Classes

<dl>
<dt><a href="#YError">YError</a> ⇐ <code>Error</code></dt>
<dd><p>A YError class able to contain some params and
 print better stack traces</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#printStackTrace">printStackTrace(err)</a> ⇒ <code>string</code></dt>
<dd><p>Allow to print a stack from anything (especially catched
 errors that may or may not contain errors 🤷).</p>
</dd>
</dl>

<a name="YError"></a>

## YError ⇐ <code>Error</code>
A YError class able to contain some params and
 print better stack traces

**Kind**: global class  
**Extends**: <code>Error</code>  

* [YError](#YError) ⇐ <code>Error</code>
    * [.wrap(err, [errorCode], [...params])](#YError.wrap) ⇒ [<code>YError</code>](#YError)
    * [.cast(err, [errorCode], [...params])](#YError.cast) ⇒ [<code>YError</code>](#YError)
    * [.bump(err, [errorCode], [...params])](#YError.bump) ⇒ [<code>YError</code>](#YError)

<a name="YError.wrap"></a>

### YError.wrap(err, [errorCode], [...params]) ⇒ [<code>YError</code>](#YError)
Wraps any error and output a YError with an error
 code and some params as debug values.

**Kind**: static method of [<code>YError</code>](#YError)  
**Returns**: [<code>YError</code>](#YError) - The wrapped error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| err | <code>Error</code> |  | The error to wrap |
| [errorCode] | <code>string</code> | <code>&quot;&#x27;E_UNEXPECTED&#x27;&quot;</code> | The error code corresponding to the actual error |
| [...params] | <code>YErrorParams</code> |  | Some additional debugging values |

<a name="YError.cast"></a>

### YError.cast(err, [errorCode], [...params]) ⇒ [<code>YError</code>](#YError)
Return a YError as is or wraps any other error and output
 a YError with a code and some params as debug values.

**Kind**: static method of [<code>YError</code>](#YError)  
**Returns**: [<code>YError</code>](#YError) - The wrapped error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| err | <code>Error</code> |  | The error to cast |
| [errorCode] | <code>string</code> | <code>&quot;&#x27;E_UNEXPECTED&#x27;&quot;</code> | The error code corresponding to the actual error |
| [...params] | <code>YErrorParams</code> |  | Some additional debugging values |

<a name="YError.bump"></a>

### YError.bump(err, [errorCode], [...params]) ⇒ [<code>YError</code>](#YError)
Same than `YError.wrap()` but preserves the code
 and the debug values of the error if it is
 already an instance of the YError constructor.

**Kind**: static method of [<code>YError</code>](#YError)  
**Returns**: [<code>YError</code>](#YError) - The wrapped error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| err | <code>Error</code> |  | The error to bump |
| [errorCode] | <code>string</code> | <code>&quot;&#x27;E_UNEXPECTED&#x27;&quot;</code> | The error code corresponding to the actual error |
| [...params] | <code>YErrorParams</code> |  | Some additional debugging values |

<a name="printStackTrace"></a>

## printStackTrace(err) ⇒ <code>string</code>
Allow to print a stack from anything (especially catched
 errors that may or may not contain errors 🤷).

**Kind**: global function  
**Returns**: <code>string</code> - The stack trace if any  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | The error to print |


# Authors
- [Nicolas Froidure (formerly at SimpliField)](http://insertafter.com/en/index.html)

# License
[MIT](https://github.com/nfroidure/yerror/blob/main/LICENSE)
