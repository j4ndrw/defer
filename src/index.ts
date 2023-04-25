import { Defer, DeferOptions } from "./types";

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
