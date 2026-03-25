import { describe, test, expect } from '@jest/globals';
import { YError } from './index.js';

describe('YError', () => {
  describe('.__constructor', () => {
    test('Should work', () => {
      const err = new YError('E_ERROR', ['arg1', 'arg2']);

      expect(err instanceof Error).toBeTruthy();
      expect(err.name).toEqual(err.toString());
      expect(err.code).toEqual('E_ERROR');
      expect(err.debugValues).toEqual(['arg1', 'arg2']);
      expect(err.toString()).toEqual('YError: E_ERROR (["arg1","arg2"])');
    });
    test('Should work without code', () => {
      const err = new YError();

      expect(err.code).toEqual('E_UNEXPECTED');
      expect(err.debugValues).toEqual([]);
      expect(err.toString()).toEqual('YError: E_UNEXPECTED ([])');
      expect(err.name).toEqual(err.toString());
    });
    test('Should work without new', () => {
      const err = new YError('E_ERROR', ['arg1', 'arg2']);

      expect(err.code).toEqual('E_ERROR');
      expect(err instanceof YError).toBeTruthy();
      expect(err.debugValues).toEqual(['arg1', 'arg2']);
      expect(err.toString()).toEqual('YError: E_ERROR (["arg1","arg2"])');
      expect(err.name).toEqual(err.toString());
    });
  });

  describe('.wrap()', () => {
    test('Should work with standard errors and a message', () => {
      const err = YError.wrap(new Error('This is an error!'));

      expect(err.code).toEqual('E_UNEXPECTED');
      expect(err.wrappedErrors.length).toEqual(1);
      expect(err.debugValues).toEqual([]);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !== (err.stack || '').indexOf('Error: This is an error!'),
        ).toBeTruthy();
        expect(
          -1 !== (err.stack || '').indexOf('YError: E_UNEXPECTED ([])'),
        ).toBeTruthy();
        expect(err.name).toEqual(err.toString());
      }
    });

    test('Should work with standard errors and an error code', () => {
      const err = YError.wrap(new Error('E_ERROR'));

      expect(err.code).toEqual('E_ERROR');
      expect(err.wrappedErrors.length).toEqual(1);
      expect(err.debugValues).toEqual([]);

      if ('captureStackTrace' in Error) {
        expect(-1 !== (err.stack || '').indexOf('Error: E_ERROR')).toBeTruthy();
        expect(
          -1 !== (err.stack || '').indexOf('YError: E_ERROR ([])'),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });

    test('Should work with standard errors, an error code and params', () => {
      const err = YError.wrap(new Error('E_ERROR'), 'E_ERROR_2', [
        'arg1',
        'arg2',
      ]);

      expect(err.code).toEqual('E_ERROR_2');
      expect(err.wrappedErrors.length).toEqual(1);
      expect(err.debugValues).toEqual(['arg1', 'arg2']);

      if ('captureStackTrace' in Error) {
        expect(-1 !== (err.stack || '').indexOf('Error: E_ERROR')).toBeTruthy();
        expect(
          -1 !==
            (err.stack || '').indexOf('YError: E_ERROR_2 (["arg1","arg2"])'),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });

    test('Should work with several wrapped errors', () => {
      const err = YError.wrap(
        YError.wrap(new Error('E_ERROR_1'), 'E_ERROR_2', ['arg2.1', 'arg2.2']),
        'E_ERROR_3',
        ['arg3.1', 'arg3.2'],
      );

      expect(err.code).toEqual('E_ERROR_3');
      expect(err.wrappedErrors.length).toEqual(2);
      expect(err.debugValues).toEqual(['arg3.1', 'arg3.2']);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !== (err.stack || '').indexOf('Error: E_ERROR_1'),
        ).toBeTruthy();
        expect(
          -1 !==
            (err.stack || '').indexOf(
              'YError: E_ERROR_2 (["arg2.1","arg2.2"])',
            ),
        ).toBeTruthy();
        expect(
          -1 !==
            (err.stack || '').indexOf(
              'YError: E_ERROR_3 (["arg3.1","arg3.2"])',
            ),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });
  });

  describe('.cast()', () => {
    test('Should work with standard errors and a message', () => {
      const err = YError.cast(new Error('This is an error!'));

      expect(err.code).toEqual('E_UNEXPECTED');
      expect(err.wrappedErrors.length).toEqual(1);
      expect(err.debugValues).toEqual([]);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !== (err.stack || '').indexOf('Error: This is an error!'),
        ).toBeTruthy();
        expect(
          -1 !== (err.stack || '').indexOf('YError: E_UNEXPECTED ([])'),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });

    test('Should let YError instances pass through', () => {
      const err = YError.cast(new YError('E_ERROR', ['arg1', 'arg2']));

      expect(err.code).toEqual('E_ERROR');
      expect(err.debugValues).toEqual(['arg1', 'arg2']);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !== (err.stack || '').indexOf('YError: E_ERROR (["arg1","arg2"])'),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });
  });

  describe('.bump()', () => {
    test('Should work with standard errors and a message', () => {
      const err = YError.bump(new Error('This is an error!'));

      expect(err.code).toEqual('E_UNEXPECTED');
      expect(err.wrappedErrors.length).toEqual(1);
      expect(err.debugValues).toEqual([]);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !== (err.stack || '').indexOf('Error: This is an error!'),
        ).toBeTruthy();
        expect(
          -1 !== (err.stack || '').indexOf('YError: E_UNEXPECTED ([])'),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });

    test('Should work with YError like errors', () => {
      const baseErr = new Error('E_A_NEW_ERROR');

      (baseErr as YError).code = 'E_A_NEW_ERROR';
      (baseErr as YError).debugValues = ['baseParam1', 'baseParam2'];

      const err = YError.bump(baseErr);

      expect(err.code).toEqual('E_A_NEW_ERROR');
      expect(err.wrappedErrors.length).toEqual(1);
      expect(err.debugValues).toEqual(['baseParam1', 'baseParam2']);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !== (err.stack || '').indexOf('Error: E_A_NEW_ERROR'),
        ).toBeTruthy();
        expect(
          -1 !==
            (err.stack || '').indexOf(
              'YError: E_A_NEW_ERROR (["baseParam1","baseParam2"])',
            ),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });

    test('Should work with Y errors and a message', () => {
      const err = YError.bump(
        new YError('E_ERROR', ['arg1.1', 'arg1.2']),
        'E_ERROR_2',
        ['arg2.1', 'arg2.2'],
      );

      expect(err.code).toEqual('E_ERROR');
      expect(err.debugValues).toEqual(['arg1.1', 'arg1.2']);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !==
            (err.stack || '').indexOf('YError: E_ERROR (["arg1.1","arg1.2"])'),
        ).toBeTruthy();
        expect(
          -1 !==
            (err.stack || '').indexOf('YError: E_ERROR (["arg1.1","arg1.2"])'),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });
  });
});
