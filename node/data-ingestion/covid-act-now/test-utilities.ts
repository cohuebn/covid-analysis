import asyncRetry from "async-retry";

import { createLogger } from "../../common/logger";

import { initializeConnection, sql } from "./database/postgresdb";

const logger = createLogger("test-utilities");

export async function waitForTable(table: string, schema = "public") {
  await asyncRetry(
    async () => {
      await initializeConnection();
      const result = await sql`select exists (
        select from information_schema.tables
        where table_schema = ${schema}
        and table_name = ${table}
      )`;
      if (!result) {
        throw new Error(`The table ${table} does not exist yet`);
      }
    },
    {
      onRetry: (_, attempt) => logger.warn(`Failed to find table ${table}. Attempt: ${attempt}`),
    }
  );
}

export async function disconnectFromPostgres() {
  if (sql) {
    await sql.end();
  }
}
