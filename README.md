# Defer

A package that allows you to defer the execution of a particular instruction at the end of the function's execution.

# Example usage

```ts
import { deferred } from '@j4ndrw/defer';

const file = ...; // imagine this is a file object with read, write, open and close methods

async function main() {
    const content = await deferred(async ({ defer }) => {
        await file.open();
        defer(async () => file.close());

        file.write("This is some text");
        return file.read();
    })
}

main();
```
