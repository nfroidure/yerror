'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

var os = require('os');

// Create an Error able to contain some params and better stack traces

var YError = function (_extendableBuiltin2) {
  _inherits(YError, _extendableBuiltin2);

  function YError(wrappedErrors, errorCode) {
    for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      params[_key - 2] = arguments[_key];
    }

    _classCallCheck(this, YError);

    // Detecting if wrappedErrors are passed
    if (!(wrappedErrors instanceof Array)) {
      params = ('undefined' === typeof errorCode ? [] : [errorCode]).concat(params);
      errorCode = wrappedErrors;
      wrappedErrors = [];
    }

    // Call the parent constructor

    // Filling error
    var _this = _possibleConstructorReturn(this, (YError.__proto__ || Object.getPrototypeOf(YError)).call(this, errorCode));

    _this.code = errorCode || 'E_UNEXPECTED';
    _this.params = params;
    _this.wrappedErrors = wrappedErrors;
    _this.name = _this.toString();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(_this, _this.constructor);
    }
    return _this;
  }

  _createClass(YError, [{
    key: 'toString',
    value: function toString() {
      return (this.wrappedErrors.length ? this.wrappedErrors[this.wrappedErrors.length - 1].stack + os.EOL : '') + this.constructor.name + ': ' + this.code + ' (' + this.params.join(', ') + ')';
    }
  }]);

  return YError;
}(_extendableBuiltin(Error));

// Wrap a classic error


YError.wrap = function yerrorWrap(err, errorCode) {
  var yError = null;
  var wrappedErrorIsACode = /^([A-Z0-9_]+)$/.test(err.message);
  var wrappedErrors = (err.wrappedErrors || []).concat(err);

  if (!errorCode) {
    if (wrappedErrorIsACode) {
      errorCode = err.message;
    } else {
      errorCode = 'E_UNEXPECTED';
    }
  }

  for (var _len2 = arguments.length, params = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    params[_key2 - 2] = arguments[_key2];
  }

  if (err.message && !wrappedErrorIsACode) {
    params.push(err.message);
  }
  yError = new (Function.prototype.bind.apply(YError, [null].concat([wrappedErrors, errorCode], params)))();
  return yError;
};

YError.cast = function yerrorCast(err, params) {
  if (err instanceof YError) {
    return err;
  }
  return YError.wrap.apply(YError, [err].concat(params));
};

YError.bump = function yerrorBump(err, params) {
  if (err instanceof YError) {
    return YError.wrap.apply(YError, [err, err.code].concat(err.params));
  }
  return YError.wrap.apply(YError, [err].concat(params));
};

module.exports = YError;