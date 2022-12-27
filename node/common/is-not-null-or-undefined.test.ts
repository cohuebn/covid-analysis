import { isNotNullOrUndefined } from "./is-not-null-or-undefined";

describe("isNotNullOrUndefined", () => {
  // Drives out the type narrowing
  function makeAThing<T>(value: T | null | undefined): T | null | undefined {
    return value;
  }

  it("should narrow truthy strings", () => {
    const input = makeAThing<string>("abc");
    expect(isNotNullOrUndefined(input)).toBe(true);
    if (isNotNullOrUndefined(input)) {
      expect(input.length).toBe(3);
    }
  });

  it("should narrow falsy strings", () => {
    const input = makeAThing<string>("");
    expect(isNotNullOrUndefined(input)).toBe(true);
    if (isNotNullOrUndefined(input)) {
      expect(input.length).toBe(0);
    }
  });

  it("should narrow truthy numbers", () => {
    const input = makeAThing<number>(123);
    expect(isNotNullOrUndefined(input)).toBe(true);
    if (isNotNullOrUndefined(input)) {
      expect(input + 2).toBe(125);
    }
  });

  it("should narrow falsy numbers", () => {
    const input = makeAThing<number>(0);
    expect(isNotNullOrUndefined(input)).toBe(true);
    if (isNotNullOrUndefined(input)) {
      expect(input + 2).toBe(2);
    }
  });

  it("should narrow true", () => {
    const input = makeAThing<boolean>(true);
    expect(isNotNullOrUndefined(input)).toBe(true);
    if (isNotNullOrUndefined(input)) {
      expect(input).toBe(true);
    }
  });

  it("should narrow false", () => {
    const input = makeAThing<boolean>(false);
    expect(isNotNullOrUndefined(input)).toBe(true);
    if (isNotNullOrUndefined(input)) {
      expect(input).toBe(false);
    }
  });

  it("should narrow arrays", () => {
    const input: number[] | null | undefined = [1, 2, 3];
    expect(isNotNullOrUndefined(input)).toBe(true);
    if (isNotNullOrUndefined(input)) {
      expect(input[1]).toBe(2);
    }
  });

  it("should narrow objects", () => {
    const input: { a: number } | null | undefined = { a: 1 };
    expect(isNotNullOrUndefined(input)).toBe(true);
    if (isNotNullOrUndefined(input)) {
      expect(input.a).toBe(1);
    }
  });

  it("narrow undefined", () => {
    let input: number | null | undefined;
    expect(isNotNullOrUndefined(input)).toBe(false);
    if (!isNotNullOrUndefined(input)) {
      expect(input).toBeUndefined();
    }
  });

  it("narrow null", () => {
    const input: number | null | undefined = null;
    expect(isNotNullOrUndefined(input)).toBe(false);
    if (!isNotNullOrUndefined(input)) {
      expect(input).toBeNull();
    }
  });
});
