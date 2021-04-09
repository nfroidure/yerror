# API
<a name="YError"></a>

## YError ⇐ <code>Error</code>
An YError class able to contain some params and
 print better stack traces

**Kind**: global class  
**Extends**: <code>Error</code>  

* [YError](#YError) ⇐ <code>Error</code>
    * [new YError([errorCode], [...params])](#new_YError_new)
    * [.wrap(err, [errorCode], [...params])](#YError.wrap) ⇒ [<code>YError</code>](#YError)
    * [.cast(err, [errorCode], [...params])](#YError.cast) ⇒ [<code>YError</code>](#YError)
    * [.bump(err, [errorCode], [...params])](#YError.bump) ⇒ [<code>YError</code>](#YError)

<a name="new_YError_new"></a>

### new YError([errorCode], [...params])
Creates a new YError with an error code
 and some params as debug values.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [errorCode] | <code>string</code> | <code>&quot;&#x27;E_UNEXPECTED&#x27;&quot;</code> | The error code corresponding to the actual error |
| [...params] | <code>any</code> |  | Some additional debugging values |

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
| [...params] | <code>any</code> |  | Some additional debugging values |

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
| [...params] | <code>any</code> |  | Some additional debugging values |

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
| [...params] | <code>any</code> |  | Some additional debugging values |

