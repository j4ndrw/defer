export type Defer = (cb: () => void) => void;

export type DeferOptions = {
  defer: Defer;
};
