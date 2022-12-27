import { getOptional, getRequired } from "@common/env";

export const config = {
  get actNowUrl() {
    return getOptional("ACT_NOW_URL", "https://api.covidactnow.org");
  },

  get actNowKey() {
    return getRequired("ACT_NOW_KEY");
  },
};
