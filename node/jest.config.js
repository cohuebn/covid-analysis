/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export const globals = {
  "ts-jest": {
    tsconfig: "./tsconfig-tests.json",
  },
};
export const testEnvironment = "node";
export const moduleFileExtensions = ["js", "ts"];
export const transform = {
  "\\.ts$": "ts-jest",
  "\\.js$": "babel-jest",
};
