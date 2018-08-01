/* eslint max-nested-callbacks:[0], no-magic-numbers:[0] */
'use strict';

var assert = require('assert');
var YError = require('./index.js');

describe('YError', function () {

  describe('.__constructor', function () {

    it('Should work', function () {
      var err = new YError('E_ERROR', 'arg1', 'arg2');

      assert(err instanceof Error);
      assert.equal(err.name, err.toString());
      assert.equal(err.code, 'E_ERROR');
      assert.deepEqual(err.params, ['arg1', 'arg2']);
      assert.equal(err.toString(), 'YError: E_ERROR (arg1, arg2)');
    });
    it('Should work without code', function () {
      var err = new YError();

      assert.equal(err.code, 'E_UNEXPECTED');
      assert.deepEqual(err.params, []);
      assert.equal(err.toString(), 'YError: E_UNEXPECTED ()');
      assert.equal(err.name, err.toString());
    });
    it('Should work without new', function () {
      var err = new YError('E_ERROR', 'arg1', 'arg2');

      assert.equal(err.code, 'E_ERROR');
      assert(err instanceof YError);
      assert.deepEqual(err.params, ['arg1', 'arg2']);
      assert.equal(err.toString(), 'YError: E_ERROR (arg1, arg2)');
      assert.equal(err.name, err.toString());
    });
  });

  describe('.wrap()', function () {

    it('Should work with standard errors and a message', function () {
      // eslint-disable-line
      var err = YError.wrap(new Error('This is an error!'));

      assert.equal(err.code, 'E_UNEXPECTED');
      assert.equal(err.wrappedErrors.length, 1);
      assert.deepEqual(err.params, ['This is an error!']);

      if (Error.captureStackTrace) {
        assert(-1 !== err.stack.indexOf('Error: This is an error!'), 'Stack contains original error.');
        assert(-1 !== err.stack.indexOf('YError: E_UNEXPECTED (This is an error!)'), 'Stack contains cast error.');
        assert.equal(err.name, err.toString());
      }
    });

    it('Should work with standard errors and an error code', function () {
      var err = YError.wrap(new Error('E_ERROR'));

      assert.equal(err.code, 'E_ERROR');
      assert.equal(err.wrappedErrors.length, 1);
      assert.deepEqual(err.params, []);

      if (Error.captureStackTrace) {
        assert(-1 !== err.stack.indexOf('Error: E_ERROR'), 'Stack contains original error.');
        assert(-1 !== err.stack.indexOf('YError: E_ERROR ()'), 'Stack contains cast error.');
      }
      assert.equal(err.name, err.toString());
    });

    it('Should work with standard errors, an error code and params', function () {
      var err = YError.wrap(new Error('E_ERROR'), 'E_ERROR_2', 'arg1', 'arg2');

      assert.equal(err.code, 'E_ERROR_2');
      assert.equal(err.wrappedErrors.length, 1);
      assert.deepEqual(err.params, ['arg1', 'arg2']);

      if (Error.captureStackTrace) {
        assert(-1 !== err.stack.indexOf('Error: E_ERROR'), 'Stack contains first error.');
        assert(-1 !== err.stack.indexOf('YError: E_ERROR_2 (arg1, arg2)'), 'Stack contains second error.');
      }
      assert.equal(err.name, err.toString());
    });

    it('Should work with several wrapped errors', function () {
      var err = YError.wrap(YError.wrap(new Error('E_ERROR_1'), 'E_ERROR_2', 'arg2.1', 'arg2.2'), 'E_ERROR_3', 'arg3.1', 'arg3.2');

      assert.equal(err.code, 'E_ERROR_3');
      assert.equal(err.wrappedErrors.length, 2);
      assert.deepEqual(err.params, ['arg3.1', 'arg3.2']);

      if (Error.captureStackTrace) {
        assert(-1 !== err.stack.indexOf('Error: E_ERROR_1'), 'Stack contains first error.');
        assert(-1 !== err.stack.indexOf('YError: E_ERROR_2 (arg2.1, arg2.2)'), 'Stack contains second error.');
        assert(-1 !== err.stack.indexOf('YError: E_ERROR_3 (arg3.1, arg3.2)'), 'Stack contains second error.');
      }
      assert.equal(err.name, err.toString());
    });
  });

  describe('.cast()', function () {

    it('Should work with standard errors and a message', function () {
      var err = YError.cast(new Error('This is an error!'));

      assert.equal(err.code, 'E_UNEXPECTED');
      assert.equal(err.wrappedErrors.length, 1);
      assert.deepEqual(err.params, ['This is an error!']);

      if (Error.captureStackTrace) {
        assert(-1 !== err.stack.indexOf('Error: This is an error!'), 'Stack contains original error.');
        assert(-1 !== err.stack.indexOf('YError: E_UNEXPECTED (This is an error!)'), 'Stack contains cast error.');
      }
      assert.equal(err.name, err.toString());
    });

    it('Should let YError instances pass through', function () {
      var err = YError.cast(new YError('E_ERROR', 'arg1', 'arg2'));

      assert.equal(err.code, 'E_ERROR');
      assert.deepEqual(err.params, ['arg1', 'arg2']);

      if (Error.captureStackTrace) {
        assert(-1 !== err.stack.indexOf('YError: E_ERROR (arg1, arg2)'), 'Stack contains cast error.');
      }
      assert.equal(err.name, err.toString());
    });
  });

  describe('.bump()', function () {

    it('Should work with standard errors and a message', function () {
      var err = YError.bump(new Error('This is an error!'));

      assert.equal(err.code, 'E_UNEXPECTED');
      assert.equal(err.wrappedErrors.length, 1);
      assert.deepEqual(err.params, ['This is an error!']);

      if (Error.captureStackTrace) {
        assert(-1 !== err.stack.indexOf('Error: This is an error!'), 'Stack contains original error.');
        assert(-1 !== err.stack.indexOf('YError: E_UNEXPECTED (This is an error!)'), 'Stack contains bumped error.');
      }
      assert.equal(err.name, err.toString());
    });

    it('Should work with Y errors and a message', function () {
      var err = YError.bump(new YError('E_ERROR', 'arg1.1', 'arg1.2'), 'E_ERROR_2', 'arg2.1', 'arg2.2');

      assert.equal(err.code, 'E_ERROR');
      assert.deepEqual(err.params, ['arg1.1', 'arg1.2']);

      if (Error.captureStackTrace) {
        assert(-1 !== err.stack.indexOf('YError: E_ERROR (arg1.1, arg1.2)'), 'Stack contains original error.');
        assert(-1 !== err.stack.indexOf('YError: E_ERROR (arg1.1, arg1.2)'), 'Stack contains bumped error.');
      }
      assert.equal(err.name, err.toString());
    });
  });
});