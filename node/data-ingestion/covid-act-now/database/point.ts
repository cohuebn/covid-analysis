import { Point } from "../types";

export const pointSqlType = {
  // The pg_types oid to pass to the db along with the serialized value.
  to: 600,
  // An array of pg_types oids to handle when parsing values coming from the db.
  from: [600],
  // Function that transform values before sending them to the db.
  serialize: (input: Point | null) => (input ? `(${input.latitude},${input.longitude})` : null),
  // Function that transforms values coming from the db.
  parse: (input: string): Point | null => {
    if (!input) {
      return null;
    }
    const pointParts = input.slice(1, -1).split(",");
    return { latitude: +pointParts[0], longitude: +pointParts[1] };
  },
};
