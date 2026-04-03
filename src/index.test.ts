import { describe, test, expect } from '@jest/globals';
import {
  hasYErrorCode,
  pickYErrorWithCode,
  printStackTrace,
  YError,
} from './index.js';

declare module './index.js' {
  interface YErrorRegistry {
    E_ERROR: `arg${number}`[];
    E_ERROR_1: [string, string];
    E_ERROR_2: [`arg2.1`, `arg2.2`];
    E_ERROR_3: [`arg3.1`, `arg3.2`];
  }
}

describe('YError', () => {
  describe('.__constructor', () => {
    test('should work', () => {
      const err = new YError('E_ERROR', ['arg1', 'arg2']);

      expect(err instanceof Error).toBeTruthy();
      expect(err.name).toEqual(err.toString());
      expect(err.code).toEqual('E_ERROR');
      expect(err.debug).toEqual(['arg1', 'arg2']);
      expect(err.toString()).toEqual('YError: E_ERROR (["arg1","arg2"])');
    });
    test('should work without code', () => {
      const err = new YError();

      expect(err.code).toEqual('E_UNEXPECTED');
      expect(err.debug).toEqual(undefined);
      expect(err.toString()).toEqual('YError: E_UNEXPECTED (undefined)');
      expect(err.name).toEqual(err.toString());
    });
    test('should work without new', () => {
      const err = new YError('E_ERROR', ['arg1', 'arg2']);

      expect(err.code).toEqual('E_ERROR');
      expect(err instanceof YError).toBeTruthy();
      expect(err.debug).toEqual(['arg1', 'arg2']);
      expect(err.toString()).toEqual('YError: E_ERROR (["arg1","arg2"])');
      expect(err.name).toEqual(err.toString());
    });
  });

  describe('.wrap()', () => {
    test('should work with standard errors and a message', () => {
      const causeErr = new Error('This is an error!');
      const err = YError.wrap(causeErr);

      expect(err.code).toEqual('E_UNEXPECTED');
      expect(err.cause).toEqual(causeErr);
      expect(err.debug).toEqual(undefined);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !== printStackTrace(err).indexOf('Error: This is an error!'),
        ).toBeTruthy();
        expect(
          -1 !==
            printStackTrace(err).indexOf('YError: E_UNEXPECTED (undefined)'),
        ).toBeTruthy();
        expect(err.name).toEqual(err.toString());
      }
    });

    test('should work with standard errors and an error code', () => {
      const causeErr = new Error('E_ERROR');
      const err = YError.wrap(causeErr);

      expect(err.code).toEqual('E_ERROR');
      expect(err.cause).toEqual(causeErr);
      expect(err.debug).toEqual(undefined);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !== printStackTrace(err).indexOf('Error: E_ERROR'),
        ).toBeTruthy();
        expect(
          -1 !== printStackTrace(err).indexOf('YError: E_ERROR (undefined)'),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });

    test('should work with standard errors, an error code and params', () => {
      const causeErr = new Error('E_ERROR');
      const err = YError.wrap(causeErr, 'E_ERROR_2', ['arg2.1', 'arg2.2']);

      expect(err.code).toEqual('E_ERROR_2');
      expect(err.cause).toEqual(causeErr);
      expect(err.debug).toEqual(['arg2.1', 'arg2.2']);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !== printStackTrace(err).indexOf('Error: E_ERROR'),
        ).toBeTruthy();
        expect(
          -1 !==
            printStackTrace(err).indexOf(
              'YError: E_ERROR_2 (["arg2.1","arg2.2"])',
            ),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });

    test('should work with several wrapped errors', () => {
      const causeErr1 = new Error('E_ERROR_1');
      const causeErr2 = YError.wrap(causeErr1, 'E_ERROR_2', [
        'arg2.1',
        'arg2.2',
      ]);
      const err = YError.wrap(causeErr2, 'E_ERROR_3', ['arg3.1', 'arg3.2']);

      expect(err.code).toEqual('E_ERROR_3');
      expect(err.cause).toEqual(causeErr2);
      expect(err.debug).toEqual(['arg3.1', 'arg3.2']);
      console.log(printStackTrace(err));
      if ('captureStackTrace' in Error) {
        expect(
          -1 !== printStackTrace(err).indexOf('Error: E_ERROR_1'),
        ).toBeTruthy();
        expect(
          -1 !==
            printStackTrace(err).indexOf(
              'YError: E_ERROR_2 (["arg2.1","arg2.2"])',
            ),
        ).toBeTruthy();
        expect(
          -1 !==
            printStackTrace(err).indexOf(
              'YError: E_ERROR_3 (["arg3.1","arg3.2"])',
            ),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });
  });

  describe('.cast()', () => {
    test('should work with standard errors and a message', () => {
      const causeErr = new Error('This is an error!');
      const err = YError.cast(causeErr);

      expect(err.code).toEqual('E_UNEXPECTED');
      expect(err.cause).toEqual(causeErr);
      expect(err.debug).toEqual(undefined);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !== printStackTrace(err).indexOf('Error: This is an error!'),
        ).toBeTruthy();
        expect(
          -1 !==
            printStackTrace(err).indexOf('YError: E_UNEXPECTED (undefined)'),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });

    test('should let YError instances pass through', () => {
      const causeErr = new YError('E_ERROR', ['arg1', 'arg2']);
      const err = YError.cast(causeErr);

      expect(err.code).toEqual('E_ERROR');
      expect(err.cause).toBeUndefined();
      expect(err.debug).toEqual(['arg1', 'arg2']);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !==
            printStackTrace(err).indexOf('YError: E_ERROR (["arg1","arg2"])'),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });
  });

  describe('.bump()', () => {
    test('should work with standard errors and a message', () => {
      const causeErr = new Error('This is an error!');
      const err = YError.bump(causeErr);

      expect(err.code).toEqual('E_UNEXPECTED');
      expect(err.cause).toEqual(causeErr);
      expect(err.debug).toEqual(undefined);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !== printStackTrace(err).indexOf('Error: This is an error!'),
        ).toBeTruthy();
        expect(
          -1 !==
            printStackTrace(err).indexOf('YError: E_UNEXPECTED (undefined)'),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });

    test('should work with YError like errors', () => {
      const baseErr = new Error('E_A_NEW_ERROR');

      (baseErr as YError).code = 'E_A_NEW_ERROR';
      (baseErr as YError).debug = ['baseParam1', 'baseParam2'];

      const err = YError.bump(baseErr);

      expect(err.code).toEqual('E_A_NEW_ERROR');
      expect(err.cause).toEqual(baseErr);
      expect(err.debug).toEqual(['baseParam1', 'baseParam2']);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !== printStackTrace(err).indexOf('Error: E_A_NEW_ERROR'),
        ).toBeTruthy();
        expect(
          -1 !==
            printStackTrace(err).indexOf(
              'YError: E_A_NEW_ERROR (["baseParam1","baseParam2"])',
            ),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });

    test('should work with Y errors and a message', () => {
      const err = YError.bump(
        new YError('E_ERROR', ['arg1.1', 'arg1.2']),
        'E_ERROR_2',
        ['arg2.1', 'arg2.2'],
      );

      expect(err.code).toEqual('E_ERROR');
      expect(err.debug).toEqual(['arg1.1', 'arg1.2']);

      if ('captureStackTrace' in Error) {
        expect(
          -1 !==
            printStackTrace(err).indexOf(
              'YError: E_ERROR (["arg1.1","arg1.2"])',
            ),
        ).toBeTruthy();
        expect(
          -1 !==
            printStackTrace(err).indexOf(
              'YError: E_ERROR (["arg1.1","arg1.2"])',
            ),
        ).toBeTruthy();
      }
      expect(err.name).toEqual(err.toString());
    });
  });

  describe('.hasYErrorCode()', () => {
    test('should work with defined debug value type', () => {
      const err = new YError('E_ERROR', ['arg1.1', 'arg1.2']);

      expect(hasYErrorCode(err, 'E_ERROR')).toBeTruthy();
    });

    test('should work with undefined debug value type', () => {
      const err = new YError('E_ERROR_2', ['arg2.1', 'arg2.2']);

      expect(hasYErrorCode(err, 'E_ERROR_2')).toBeTruthy();
    });

    test('should work with native errors', () => {
      const err = new Error('E_ERROR');

      expect(hasYErrorCode(err, 'E_ERROR')).toBeFalsy();
    });
  });

  describe('.pickYErrorWithCode()', () => {
    test('should work', () => {
      const err1 = new Error('E_ERROR_1');
      const err2 = YError.wrap(err1, 'E_ERROR_2', ['arg2.1', 'arg2.2']);
      const err3 = YError.wrap(err2, 'E_ERROR_3', ['arg3.1', 'arg3.2']);

      expect(pickYErrorWithCode(err3, 'E_ERROR_1')).toEqual(null);
      expect(pickYErrorWithCode(err3, 'E_ERROR_2')).toEqual(err2);
      expect(pickYErrorWithCode(err3, 'E_ERROR_3')).toEqual(err3);
    });
  });

  describe('.printStackTrace()', () => {
    test('should work with non errors', () => {
      expect(printStackTrace('an error string')).toEqual(
        '[no_stack_trace]: error is serializable ("an error string")',
      );
      expect(printStackTrace(undefined)).toEqual(
        '[no_stack_trace]: error is serializable (undefined)',
      );
      expect(printStackTrace(null)).toEqual(
        '[no_stack_trace]: error is serializable (null)',
      );
      expect(printStackTrace(global)).toEqual(
        '[no_stack_trace]: error is circular ("[object Object]")',
      );
    });
  });

  test('should enforce types from registry', () => {
    // @ts-expect-error : E_ERROR_1 expects [string, string]
    new YError('E_ERROR_1', ['un seul']);
    // Must work
    new YError('E_WHATEVER', ['un seul']);
    new YError('E_WHATEVER', undefined);
    new YError('E_WHATEVER');

    const err = new YError('E_ERROR_2', ['arg2.1', 'arg2.2']);
    const val: 'arg2.1' | undefined = err.debug?.[0];

    expect(val);

    const err2 = err as YError;

    // @ts-expect-error : still unknown at this level
    const val2: 'arg2.1' | undefined = err2.debug?.[0];

    expect(val2);

    if (!hasYErrorCode(err2, 'E_ERROR_2')) {
      throw new YError('E_UNEXPECTED');
    }

    const val3: 'arg2.1' | undefined = err2.debug?.[0];

    expect(val3);
  });
});
