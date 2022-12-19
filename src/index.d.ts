declare class YError extends Error {
  constructor(errorCode: string, ...params: any[]);
  constructor(wrappedErrors?: Error[], errorCode?: string, ...params: any[]);
  code: string;
  params: any[];
  static wrap<E extends Error>(
    err: E,
    errorCode?: string,
    ...params: any[]
  ): YError;
  static cast<E extends Error>(
    err: E,
    errorCode?: string,
    ...params: any[]
  ): YError;
  static bump<E extends Error>(
    err: E,
    errorCode?: string,
    ...params: any[]
  ): YError;
}

export function printStackTrace(err: any): string;

export { YError };
export default YError;
