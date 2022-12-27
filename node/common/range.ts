/**
 * A helper to create an array of all numbers from start to end
 * E.g. Start=2, End=5 would result in [2,3,4,5]
 * @param start The first number in the range
 * @param end The last number in the range
 */
export function range(start: number, end: number) {
  if (start > end) {
    throw new Error(`Range not allowed; start (${start}) is larger than end (${end})`);
  }
  const size = end - start + 1;
  return [...Array(size).keys()].map((i) => i + start);
}
