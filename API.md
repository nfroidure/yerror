# API
## Classes

<dl>
<dt><a href="#YError">YError</a> ⇐ <code>Error</code></dt>
<dd><p>A YError class able to contain some debugValues and
 print better stack traces</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#printStackTrace">printStackTrace(err)</a> ⇒ <code>string</code></dt>
<dd><p>Allow to print a stack from anything (especially caught
 errors that may or may not contain errors 🤷).</p>
</dd>
</dl>

<a name="YError"></a>

## YError ⇐ <code>Error</code>
A YError class able to contain some debugValues and
 print better stack traces

**Kind**: global class  
**Extends**: <code>Error</code>  

* [YError](#YError) ⇐ <code>Error</code>
    * [new YError([errorCode], [debugValues])](#new_YError_new)
    * [.wrap(err, [errorCode], [debugValues])](#YError.wrap) ⇒ [<code>YError</code>](#YError)
    * [.cast(err, [errorCode], [debugValues])](#YError.cast) ⇒ [<code>YError</code>](#YError)
    * [.bump(err, [errorCode], [debugValues])](#YError.bump) ⇒ [<code>YError</code>](#YError)

<a name="new_YError_new"></a>

### new YError([errorCode], [debugValues])
Creates a new YError with an error code
 and some debugValues as debug values.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [errorCode] | <code>string</code> | <code>&quot;&#x27;E_UNEXPECTED&#x27;&quot;</code> | The error code corresponding to the actual error |
| [debugValues] | <code>any</code> |  | Some additional debugging values |

<a name="YError.wrap"></a>

### YError.wrap(err, [errorCode], [debugValues]) ⇒ [<code>YError</code>](#YError)
Wraps any error and output a YError with an error
 code and some debugValues as debug values.

**Kind**: static method of [<code>YError</code>](#YError)  
**Returns**: [<code>YError</code>](#YError) - The wrapped error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| err | <code>Error</code> |  | The error to wrap |
| [errorCode] | <code>string</code> | <code>&quot;&#x27;E_UNEXPECTED&#x27;&quot;</code> | The error code corresponding to the actual error |
| [debugValues] | <code>any</code> |  | Some additional debugging values |

<a name="YError.cast"></a>

### YError.cast(err, [errorCode], [debugValues]) ⇒ [<code>YError</code>](#YError)
Return a YError as is or wraps any other error and output
 a YError with a code and some debugValues as debug values.

**Kind**: static method of [<code>YError</code>](#YError)  
**Returns**: [<code>YError</code>](#YError) - The wrapped error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| err | <code>Error</code> |  | The error to cast |
| [errorCode] | <code>string</code> | <code>&quot;&#x27;E_UNEXPECTED&#x27;&quot;</code> | The error code corresponding to the actual error |
| [debugValues] | <code>any</code> |  | Some additional debugging values |

<a name="YError.bump"></a>

### YError.bump(err, [errorCode], [debugValues]) ⇒ [<code>YError</code>](#YError)
Same than `YError.wrap()` but preserves the code
 and the debug values of the error if it is
 already an instance of the YError constructor.

**Kind**: static method of [<code>YError</code>](#YError)  
**Returns**: [<code>YError</code>](#YError) - The wrapped error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| err | <code>Error</code> |  | The error to bump |
| [errorCode] | <code>string</code> | <code>&quot;&#x27;E_UNEXPECTED&#x27;&quot;</code> | The error code corresponding to the actual error |
| [debugValues] | <code>any</code> |  | Some additional debugging values |

<a name="printStackTrace"></a>

## printStackTrace(err) ⇒ <code>string</code>
Allow to print a stack from anything (especially caught
 errors that may or may not contain errors 🤷).

**Kind**: global function  
**Returns**: <code>string</code> - The stack trace if any  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | The error to print |

