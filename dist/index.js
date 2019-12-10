"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var os = require('os'); // Create an Error able to contain some params and better stack traces


var YError =
/*#__PURE__*/
function (_Error) {
  _inherits(YError, _Error);

  function YError(wrappedErrors, errorCode) {
    var _this;

    for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      params[_key - 2] = arguments[_key];
    }

    _classCallCheck(this, YError);

    // Detecting if wrappedErrors are passed
    if (!(wrappedErrors instanceof Array)) {
      params = ('undefined' === typeof errorCode ? [] : [errorCode]).concat(params);
      errorCode = wrappedErrors;
      wrappedErrors = [];
    } // Call the parent constructor


    _this = _possibleConstructorReturn(this, _getPrototypeOf(YError).call(this, errorCode)); // Filling error

    _this.code = errorCode || 'E_UNEXPECTED';
    _this.params = params;
    _this.wrappedErrors = wrappedErrors;
    _this.name = _this.toString();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(_assertThisInitialized(_this), _this.constructor);
    }

    return _this;
  }

  _createClass(YError, [{
    key: "toString",
    value: function toString() {
      return (this.wrappedErrors.length ? // eslint-disable-next-line
      this.wrappedErrors[this.wrappedErrors.length - 1].stack + os.EOL : '') + this.constructor.name + ': ' + this.code + ' (' + this.params.join(', ') + ')';
    }
  }]);

  return YError;
}(_wrapNativeSuper(Error)); // Wrap a classic error


YError.wrap = function yerrorWrap(err, errorCode) {
  var yError = null;

  var wrappedErrorIsACode = _looksLikeAYErrorCode(err.message);

  var wrappedErrors = (err.wrappedErrors || []).concat(err);

  if (!errorCode) {
    if (wrappedErrorIsACode) {
      errorCode = err.message;
    } else {
      errorCode = 'E_UNEXPECTED';
    }
  }

  for (var _len2 = arguments.length, params = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    params[_key2 - 2] = arguments[_key2];
  }

  if (err.message && !wrappedErrorIsACode) {
    params.push(err.message);
  }

  yError = _construct(YError, [wrappedErrors, errorCode].concat(params));
  return yError;
};

YError.cast = function yerrorCast(err) {
  if (_looksLikeAYError(err)) {
    return err;
  }

  for (var _len3 = arguments.length, params = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    params[_key3 - 1] = arguments[_key3];
  }

  return YError.wrap.apply(YError, [err].concat(params));
};

YError.bump = function yerrorBump(err) {
  if (_looksLikeAYError(err)) {
    return YError.wrap.apply(YError, [err, err.code].concat(err.params));
  }

  for (var _len4 = arguments.length, params = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    params[_key4 - 1] = arguments[_key4];
  }

  return YError.wrap.apply(YError, [err].concat(params));
}; // In order to keep compatibility through major versions
// we have to make kind of an cross major version instanceof


function _looksLikeAYError(err) {
  return err instanceof YError || err.constructor && err.constructor.name && err.constructor.name.endsWith('Error') && 'string' === typeof err.code && _looksLikeAYErrorCode(err.code) && err.params && err.params instanceof Array;
}

function _looksLikeAYErrorCode(str) {
  return /^([A-Z0-9_]+)$/.test(str);
}

module.exports = YError;