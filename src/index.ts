import { EOL } from 'node:os';

export interface YErrorRegistry {
  E_UNEXPECTED: unknown[];
}

export type YErrorDebug<C extends string> = C extends keyof YErrorRegistry
  ? YErrorRegistry[C] extends unknown[]
    ? YErrorRegistry[C]
    : never
  : unknown[];

/**
 * A YError class able to contain some debug and
 *  print better stack traces
 * @extends Error
 */
class YError<
  C extends string = string,
  CC extends string = string,
> extends Error {
  code: string;
  debug: YErrorDebug<C>;
  cause?: Error | YError<CC> | undefined;
  /**
   * Creates a new YError with an error code
   *  and some debug as debug values.
   * @param {string} [errorCode = 'E_UNEXPECTED']
   * The error code corresponding to the actual error
   * @param {any} [debug]
   * Some additional debugging values
   * The error options
   * @param {Object} options
   * The error options
   */
  constructor(
    errorCode: C = 'E_UNEXPECTED' as C,
    debug?: YErrorDebug<C>,
    options: { cause?: Error | YError<CC> } = {},
  ) {
    // Call the parent constructor
    super(errorCode);

    // Filling error
    this.code = errorCode;
    this.debug = (debug || []) as YErrorDebug<C>;
    this.cause = options.cause;
    this.name = this.toString();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Wraps any error and output a YError with an error
   *  code and some debug as debug values.
   * @param {Error} err
   * The error to wrap
   * @param {string} [errorCode = 'E_UNEXPECTED']
   * The error code corresponding to the actual error
   * @param {any} [debug]
   * Some additional debugging values
   * @return {YError}
   * The wrapped error
   */
  static wrap<C extends string, CC extends string>(
    err: Error | YError<CC>,
    errorCode?: C,
    debug?: YErrorDebug<C>,
  ): YError<C, CC> {
    const wrappedErrorIsACode = looksLikeAYErrorCode(err.message);

    if (!errorCode) {
      if (wrappedErrorIsACode) {
        errorCode = err.message as C;
      } else {
        errorCode = 'E_UNEXPECTED' as C;
      }
    }

    return new YError(errorCode, debug, { cause: err });
  }

  /**
   * Return a YError as is or wraps any other error and output
   *  a YError with a code and some debug as debug values.
   * @param {Error} err
   * The error to cast
   * @param {string} [errorCode = 'E_UNEXPECTED']
   * The error code corresponding to the actual error
   * @param {any} [debug]
   * Some additional debugging values
   * @return {YError}
   * The wrapped error
   */
  static cast<C extends string, CC extends string>(
    err: Error | YError<C> | YError<CC>,
    errorCode?: C,
    debug?: YErrorDebug<C>,
  ): YError<C> | YError<C, CC> {
    if (looksLikeAYError(err)) {
      return err as YError<C>;
    }
    return YError.wrap<C, CC>(err, errorCode, debug);
  }

  /**
   * Same than `YError.wrap()` but preserves the code
   *  and the debug values of the error if it is
   *  already an instance of the YError constructor.
   * @param {Error} err
   * The error to bump
   * @param {string} [errorCode = 'E_UNEXPECTED']
   * The error code corresponding to the actual error
   * @param {any} [debug]
   * Some additional debugging values
   * @return {YError}
   * The wrapped error
   */
  static bump<C extends string, CC extends string>(
    err: Error | YError<CC>,
    errorCode?: C,
    debug?: YErrorDebug<C>,
  ): YError<C, CC> | YError<CC, CC> {
    if (looksLikeAYError(err)) {
      return YError.wrap(err, err.code as CC, err.debug as YErrorDebug<CC>);
    }
    return YError.wrap(err, errorCode, debug);
  }

  toString(): string {
    let debugAsString: string;

    try {
      debugAsString = JSON.stringify(this.debug);
    } catch {
      debugAsString = '<circular>';
    }

    return `${this.constructor.name}: ${this.code} (${debugAsString})`;
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
export function printStackTrace(err: Error | YError | unknown): string {
  let errorAsString: string;

  if (
    typeof err === 'object' &&
    err instanceof Error &&
    typeof err.stack === 'string'
  ) {
    errorAsString = err.stack;
  } else {
    try {
      errorAsString = `[no_stack_trace]: error is serializable (${JSON.stringify(err)})`;
    } catch {
      errorAsString = `[no_stack_trace]: error is circular ("${
        err != null && typeof err.toString === 'function'
          ? err.toString()
          : typeof err
      }")`;
    }
  }

  return `${errorAsString}${err instanceof Error && err.cause ? EOL + 'Caused by: ' + printStackTrace(err.cause) : ''}`;
}

export function looksLikeAYErrorCode(str: string): boolean {
  return /^([A-Z0-9_]+)$/.test(str);
}

// In order to keep compatibility through major versions
// we have to make kind of a cross major version instanceof
export function looksLikeAYError(err: Error | YError | unknown): err is YError {
  return (
    !!(err instanceof YError) ||
    !!(
      err &&
      typeof err === 'object' &&
      err.constructor &&
      err.constructor.name &&
      err.constructor.name.endsWith('Error') &&
      'code' in err &&
      'string' === typeof err.code &&
      looksLikeAYErrorCode(err.code) &&
      'debug' in err &&
      err.debug &&
      err.debug instanceof Array
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
export function hasYErrorCode<C extends string>(
  err: Error | YError | unknown,
  code: C,
): err is YError<C> {
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
export function pickYErrorWithCode<C extends string>(
  err: Error | YError | unknown,
  code: C,
): YError<C> | null {
  do {
    if (hasYErrorCode(err, code)) {
      return err;
    }
    err =
      err && typeof err === 'object' && 'cause' in err && (err.cause as Error);
  } while (err);

  return null;
}

export { YError };
