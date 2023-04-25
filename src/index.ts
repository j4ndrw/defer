import { Defer, DeferOptions } from "./types";

/**
 * # Description
 *
 * Function that provides a `defer` primitive - useful for deferring
 * the execution of one or more instructions at the end of the function's
 * execution.
 *
 * # Usage
 *
 * ```typescript
 * import { deferred } from '@j4ndrw/defer';
 *
 * const file = ...; // imagine this is a file object with read, write, open and close methods
 *
 * async function main() {
 *     const content = await deferred(async ({ defer }) => {
 *         await file.open();
 *         defer(async () => file.close());
 *
 *         file.write("This is some text");
 *         return file.read();
 *     })
 * }
 *
 * main();
 * ```
 * */
export const deferred = async <TReturn>(
  cb: ({ defer }: DeferOptions) => Promise<TReturn>
): Promise<TReturn> => {
  const deferredFns: (() => Promise<void>)[] = [];
  const defer: Defer = (fn) => deferredFns.push(async () => fn());

  const returnValue = await cb({ defer });

  for (const fn of deferredFns) {
    await fn();
  }

  return returnValue;
};
