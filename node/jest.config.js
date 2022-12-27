/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig-tests.json",
    },
  },
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts"],
  transform: {
    "\\.ts$": "ts-jest",
    "\\.js$": "babel-jest",
  },
};
