'use strict';

const os = require('os');

// Create an Error able to contain some params and better stack traces
class YError extends Error {
  constructor(wrappedErrors, errorCode, ...params) {
    // Detecting if wrappedErrors are passed
    if(!(wrappedErrors instanceof Array)) {
      params = (
        'undefined' === typeof errorCode ?
        [] :
        [errorCode]
      ).concat(params);
      errorCode = wrappedErrors;
      wrappedErrors = [];
    }

    // Call the parent constructor
    super(errorCode);

    // Filling error
    this.code = errorCode || 'E_UNEXPECTED';
    this.params = params;
    this.wrappedErrors = wrappedErrors;
    this.name = this.toString();

    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toString() {
    return (
      this.wrappedErrors.length ?
      // eslint-disable-next-line
      this.wrappedErrors[this.wrappedErrors.length - 1].stack + os.EOL :
      ''
    ) +
    this.constructor.name + ': ' + this.code +
    ' (' + this.params.join(', ') + ')';
  }
}

// Wrap a classic error
YError.wrap = function yerrorWrap(err, errorCode, ...params) {
  let yError = null;
  const wrappedErrorIsACode = _looksLikeAYErrorCode(err.message);
  const wrappedErrors = (err.wrappedErrors || []).concat(err);

  if(!errorCode) {
    if(wrappedErrorIsACode) {
      errorCode = err.message;
    } else {
      errorCode = 'E_UNEXPECTED';
    }
  }
  if(err.message && !wrappedErrorIsACode) {
    params.push(err.message);
  }
  yError = new YError(wrappedErrors, errorCode, ...params);
  return yError;
};

YError.cast = function yerrorCast(err, ...params) {
  if(_looksLikeAYError(err)) {
    return err;
  }
  return YError.wrap.apply(YError, [err].concat(params));
};

YError.bump = function yerrorBump(err, ...params) {
  if(_looksLikeAYError(err)) {
    return YError.wrap.apply(YError, [err, err.code].concat(err.params));
  }
  return YError.wrap.apply(YError, [err].concat(params));
};

// In order to keep compatibility through major versions
// we have to make kind of an cross major version instanceof
function _looksLikeAYError(err) {
  return err instanceof YError || (
     err.constructor &&
     err.constructor.name &&
     err.constructor.name.endsWith('Error') &&
    'string' === typeof err.code && _looksLikeAYErrorCode(err.code) &&
    err.params && err.params instanceof Array
  );
}

function _looksLikeAYErrorCode(str) {
  return (/^([A-Z0-9_]+)$/).test(str);
}

module.exports = YError;
