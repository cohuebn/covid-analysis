import { SnakeCasedPropertiesDeep } from "type-fest";

import { snakeCaseProperties, camelCaseProperties } from "./property-transforms";

describe("property transforms", () => {
  type CameledTestObj = {
    strVal: string;
    numVal: number;
    nested: {
      boolVal: boolean;
    };
  };
  type SnakedTestObj = SnakeCasedPropertiesDeep<CameledTestObj>;

  it("should camel-case properties for each item", () => {
    const snaked1: SnakedTestObj = {
      str_val: "abc",
      num_val: 123,
      nested: {
        bool_val: true,
      },
    };
    const snaked2: SnakedTestObj = { ...snaked1, nested: { bool_val: false } };

    const result = camelCaseProperties([snaked1, snaked2]);
    expect(result).toHaveLength(2);
    expect(result[0].strVal).toBe("abc");
    expect(result[0].numVal).toBe(123);
    expect(result[0].nested.boolVal).toBe(true);
    expect(result[1].strVal).toBe("abc");
    expect(result[1].numVal).toBe(123);
    expect(result[1].nested.boolVal).toBe(false);
  });

  it("should snake-case properties", () => {
    const cameled1: CameledTestObj = {
      strVal: "abc",
      numVal: 123,
      nested: {
        boolVal: true,
      },
    };
    const cameled2: CameledTestObj = { ...cameled1, nested: { boolVal: false } };

    const result = snakeCaseProperties([cameled1, cameled2]);
    expect(result).toHaveLength(2);
    expect(result[0].str_val).toBe("abc");
    expect(result[0].num_val).toBe(123);
    expect(result[0].nested.bool_val).toBe(true);
    expect(result[1].str_val).toBe("abc");
    expect(result[1].num_val).toBe(123);
    expect(result[1].nested.bool_val).toBe(false);
  });
});
