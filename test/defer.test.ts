import { deferred } from "../src";

const createMockFileContext = () => {
  const mockFileContext: {
    state: "open" | "closed" | "writing" | "reading";
    content: string;
  } = {
    state: "closed",
    content: "",
  };

  const order: (typeof mockFileContext)["state"][] = [];

  const openFile = () => {
    mockFileContext.state = "open";
    order.push(mockFileContext.state);
  };
  const closeFile = () => {
    mockFileContext.state = "closed";
    order.push(mockFileContext.state);
  };
  const write = (content: string) => {
    mockFileContext.content = content;
    mockFileContext.state = "writing";
    order.push(mockFileContext.state);
  };
  const read = () => {
    mockFileContext.state = "reading";
    order.push(mockFileContext.state);
    return mockFileContext.content;
  };

  return { openFile, closeFile, write, read, mockFileContext, order };
};

describe("Defer", () => {
  it("should return the value of the callback", async () => {
    const value = await deferred(async () => 2);

    expect(value).toBe(2);
  });
  it("should defer the sync callback", async () => {
    const { openFile, closeFile, read, write, order } = createMockFileContext();
    const value = await deferred(async ({ defer }) => {
      openFile();
      defer(closeFile);

      write("test");
      return read();
    });

    expect(value).toBe("test");
    expect(order).toStrictEqual([
      "open",
      "writing",
      "reading",
      "closed",
    ] as typeof order);
  });
  it("should defer the async callback", async () => {
    const { openFile, closeFile, read, write, order } = createMockFileContext();
    const value = await deferred(async ({ defer }) => {
      openFile();
      defer(async () => closeFile());

      write("test");
      return read();
    });

    expect(value).toBe("test");
    expect(order).toStrictEqual([
      "open",
      "writing",
      "reading",
      "closed",
    ] as typeof order);
  });
});
