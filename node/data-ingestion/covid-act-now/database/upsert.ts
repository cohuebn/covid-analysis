import unique from "just-unique";

import { UpsertableItem } from "../types";

import { initializeConnection, sql } from "./postgresdb";
import { snakeCaseProperties } from "./property-transforms";

export type UpsertSettings = {
  table: string;
  items: UpsertableItem[];
  keyFields: string[];
  fieldsExcludedOnUpdate?: string[];
  snakeCaseItems?: boolean;
};

/**
 * Create a quoted field for SQL (e.g. for column names). This method
 * verifies the provided value doesn't contain quotes itself to prevent
 * the possiblity of SQL injection
 * @param value The value to quote
 * @returns The quoted value
 */
function safeQuote(value: string): string {
  if (value.includes(`"`)) {
    throw new Error(
      `Cannot safely use ${value} within SQL as it contains quotation mark(s) and is vulnerable to SQL injection`
    );
  }
  return `"${value}"`;
}

export async function upsert(upsertSettings: UpsertSettings) {
  const { items, table, keyFields } = upsertSettings;
  if (!items.length) {
    return;
  }
  const normalizedItems =
    upsertSettings.snakeCaseItems !== false ? snakeCaseProperties(items) : items;
  await initializeConnection();
  // 'unsafe' SQL methods used to simplify code, but using safe quote to prevent SQL injection
  const conflictDetectionColumns = sql.unsafe(keyFields.map((key) => safeQuote(key)).join(", "));
  const fieldsExcludedOnUpdate = unique(
    keyFields.concat(upsertSettings.fieldsExcludedOnUpdate ?? [])
  );
  const updateKeys = Object.keys(normalizedItems[0]).filter(
    (key) => !fieldsExcludedOnUpdate?.includes(key)
  );
  const updateSql = sql.unsafe(
    updateKeys.map((key) => `${safeQuote(key)} = excluded.${safeQuote(key)}`).join(",")
  );
  await sql`
    insert into ${sql(table)}
      ${sql(normalizedItems)}
      on conflict(${conflictDetectionColumns})
      do update set ${updateSql};
  `;
}
