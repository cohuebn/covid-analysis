import { generateCounty } from "../test-data/data-generators";
import { disconnectFromPostgres, waitForTable } from "../test-utilities";
import { generate, randomItem } from "../../../common/data-generator";

import { initializeConnection } from "./postgresdb";
import { getCounty, saveCounties } from "./counties";

describe("counties queries", () => {
  const countiesTable = "counties";

  beforeAll(async () => {
    await waitForTable(countiesTable);
    await initializeConnection();
  });

  afterAll(async () => {
    await disconnectFromPostgres();
  });

  it("should be able to upsert counties", async () => {
    const countyName = "Skuttlebug";
    const county = generateCounty({ county: countyName, state: "NH" });
    await saveCounties([county, generateCounty()]);
    const updatedCounty = { ...county, state: "VT" };
    await saveCounties([updatedCounty]);
    const result = await getCounty({ state: "VT", name: countyName });
    expect(result?.state).toBe("VT");
  });

  it("should be able to lookup by name or id", async () => {
    const counties = generate(3, generateCounty);
    const expected = randomItem(counties);
    const { county: countyName, state, id } = expected;
    await saveCounties(counties);
    const byNameLookup = await getCounty({ state, name: countyName });
    const byIdLookup = await getCounty({ id });
    expect(byNameLookup).toEqual(byIdLookup);
  });
});
