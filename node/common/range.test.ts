import { range } from "./range";

describe("range", () => {
  it("should throw an error when start is larger than end", () => {
    expect(() => range(5, 4)).toThrow("Range not allowed; start (5) is larger than end (4)");
  });

  it("should return a single item range", () => {
    expect(range(5, 5)).toEqual([5]);
  });

  it("should return a multi-item range", () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("support a zero-start range", () => {
    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4, 5]);
  });
});
