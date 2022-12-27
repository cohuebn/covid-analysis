import { generateCounty } from "../test-data/data-generators";
import { disconnectFromPostgres, waitForTable } from "../test-utilities";

import { initializeConnection } from "./postgresdb";
import { getCountyByName, saveCounties } from "./counties";

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
    const result = await getCountyByName("VT", countyName);
    expect(result?.state).toBe("VT");
  });
});
