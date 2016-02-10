'use strict';

var util = require('util');
var os = require('os');

// Create an Error able to contain some params and better stack traces
function YError(errorCode) {

  // Ensure new were called
  if(!this instanceof YError) {
    return new (YError.bind.apply(YError,
      [YError].concat([].slice.call(arguments, 0))));
  }

  // Call the parent constructor
  Error.call(this, errorCode);
  Error.captureStackTrace(this, this.constructor);

  // Filling error
  this.code = errorCode || 'E_UNEXPECTED';
  this.params = [].slice.call(arguments, 1);
  this.wrappedErrors = [];
  this.name = this.toString();
}

util.inherits(YError, Error);

YError.prototype.toString = function() {
  return (
    this.wrappedErrors.length ?
    this.wrappedErrors[this.wrappedErrors.length - 1].stack + os.EOL :
    ''
  ) +
  this.constructor.name + ': ' + this.code +
  ' (' + this.params.join(', ') + ')';
};

// Wrap a classic error
YError.wrap = function(err, errorCode) {
  var yError = null;
  var wrappedErrorIsACode = (/^([A-Z0-9_]+)$/).test(err.message);
  if(!errorCode) {
    if(wrappedErrorIsACode) {
      errorCode = err.message;
    } else {
      errorCode = 'E_UNEXPECTED';
    }
  }
  yError = new YError(errorCode);
  yError.wrappedErrors = (err.wrappedErrors || []).concat(err);
  yError.params = [].slice.call(arguments, 2);
  if(err.message && !wrappedErrorIsACode) {
    yError.params.push(err.message);
  }
  yError.name = yError.toString();
  return yError;
};

YError.cast = function(err) {
  if(err instanceof YError) {
    return err;
  }
  return YError.wrap.apply(YError, arguments);
};

YError.bump = function(err) {
  if(err instanceof YError) {
    return YError.wrap.apply(YError, [err, err.code].concat(err.params));
  }
  return YError.wrap.apply(YError, arguments);
};

module.exports = YError;
