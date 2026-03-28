import { EOL } from 'node:os';

export type YErrorDebugValue = unknown[];

/**
 * A YError class able to contain some debugValues and
 *  print better stack traces
 * @extends Error
 */
class YError<T extends unknown[] = YErrorDebugValue> extends Error {
  code: string;
  debugValues: T = [] as unknown as T;
  wrappedErrors: (Error | YError)[] = [];
  /**
   * Creates a new YError with an error code
   *  and some debugValues as debug values.
   * @param {string} [errorCode = 'E_UNEXPECTED']
   * The error code corresponding to the actual error
   * @param {any} [debugValues]
   * Some additional debugging values
   */
  constructor(
    errorCode?: string,
    debugValues: T = [] as unknown as T,
    wrappedErrors: (Error | YError)[] = [],
  ) {
    // Call the parent constructor
    super(errorCode);

    // Filling error
    this.code = errorCode || 'E_UNEXPECTED';
    this.debugValues = debugValues;
    this.wrappedErrors = wrappedErrors;
    this.name = this.toString();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Wraps any error and output a YError with an error
   *  code and some debugValues as debug values.
   * @param {Error} err
   * The error to wrap
   * @param {string} [errorCode = 'E_UNEXPECTED']
   * The error code corresponding to the actual error
   * @param {any} [debugValues]
   * Some additional debugging values
   * @return {YError}
   * The wrapped error
   */
  static wrap<T extends unknown[] = YErrorDebugValue>(
    err: Error | YError,
    errorCode?: string,
    debugValues: T = [] as unknown as T,
  ): YError {
    const wrappedErrorIsACode = looksLikeAYErrorCode(err.message);
    const wrappedErrors = (
      'wrappedErrors' in err ? err.wrappedErrors : []
    ).concat([err]);

    if (!errorCode) {
      if (wrappedErrorIsACode) {
        errorCode = err.message;
      } else {
        errorCode = 'E_UNEXPECTED';
      }
    }

    return new YError<T>(errorCode, debugValues, wrappedErrors);
  }

  /**
   * Return a YError as is or wraps any other error and output
   *  a YError with a code and some debugValues as debug values.
   * @param {Error} err
   * The error to cast
   * @param {string} [errorCode = 'E_UNEXPECTED']
   * The error code corresponding to the actual error
   * @param {any} [debugValues]
   * Some additional debugging values
   * @return {YError}
   * The wrapped error
   */
  static cast<T extends unknown[] = YErrorDebugValue>(
    err: Error | YError,
    errorCode?: string,
    debugValues: T = [] as unknown as T,
  ): YError {
    if (looksLikeAYError(err)) {
      return err;
    }
    return YError.wrap(err, errorCode, debugValues);
  }

  /**
   * Same than `YError.wrap()` but preserves the code
   *  and the debug values of the error if it is
   *  already an instance of the YError constructor.
   * @param {Error} err
   * The error to bump
   * @param {string} [errorCode = 'E_UNEXPECTED']
   * The error code corresponding to the actual error
   * @param {any} [debugValues]
   * Some additional debugging values
   * @return {YError}
   * The wrapped error
   */
  static bump<T extends unknown[] = YErrorDebugValue>(
    err: Error | YError,
    errorCode?: string,
    debugValues: T = [] as unknown as T,
  ): YError {
    if (looksLikeAYError(err)) {
      return YError.wrap(err, err.code, err.debugValues);
    }
    return YError.wrap(err, errorCode, debugValues);
  }

  toString(): string {
    let debugValuesAsString: string;

    try {
      debugValuesAsString = JSON.stringify(this.debugValues);
    } catch {
      debugValuesAsString = '<circular>';
    }

    return `${
      this.wrappedErrors.length
        ? this.wrappedErrors[this.wrappedErrors.length - 1].stack + EOL
        : ''
    }${this.constructor.name}: ${this.code} (${debugValuesAsString})`;
  }
}

/**
 * Allow to print a stack from anything (especially caught
 *  errors that may or may not contain errors 🤷).
 * @param {Error} err
 * The error to print
 * @return {string}
 * The stack trace if any
 */
export function printStackTrace(err: Error | YError): string {
  return typeof err === 'object' && typeof err.stack === 'string'
    ? err.stack
    : `[no_stack_trace]: error is ${
        err != null && typeof err.toString === 'function'
          ? err.toString()
          : typeof err
      }`;
}

export function looksLikeAYErrorCode(str: string): boolean {
  return /^([A-Z0-9_]+)$/.test(str);
}

// In order to keep compatibility through major versions
// we have to make kind of a cross major version instanceof
export function looksLikeAYError(err: Error | YError): err is YError {
  return (
    !!(err instanceof YError) ||
    !!(
      err.constructor &&
      err.constructor.name &&
      err.constructor.name.endsWith('Error') &&
      'code' in err &&
      'string' === typeof err.code &&
      looksLikeAYErrorCode(err.code) &&
      'debugValues' in err &&
      err.debugValues &&
      err.debugValues instanceof Array
    )
  );
}

/**
 * Allow to check a YError code and cast the error.
 * @param {Error} err
 * The error to cast
 * @param {Error} code
 * The code to check
 * @return {boolean}
 * The result
 */
export function hasYErrorCode<T extends unknown[] = YErrorDebugValue>(
  err: Error | YError,
  code: string,
): err is YError<T> {
  return looksLikeAYError(err) && err.code === code;
}

/**
 * Allow to check all errors for a YError code and return the casted the error.
 * @param {Error} err
 * The error to cast
 * @param {Error} code
 * The code to check
 * @return {boolean}
 * The result
 */
export function pickYErrorWithCode<T extends unknown[] = YErrorDebugValue>(
  err: Error | YError,
  code: string,
): YError<T> | null {
  for (const currentError of [err].concat(
    'wrappedErrors' in err ? err.wrappedErrors : [],
  )) {
    if (hasYErrorCode(currentError, code)) {
      return currentError as YError<T>;
    }
  }

  return null;
}

export { YError };
