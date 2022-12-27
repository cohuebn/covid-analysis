import asyncRetry from "async-retry";
import postgres from "postgres";

import { getOptional, getRequired, getTransformedOptional } from "../../../common/env";
import { createLogger } from "../../../common/logger";

import { pointSqlType } from "./point";

type Sql = ReturnType<typeof postgres>;

const logger = createLogger("postgresdb");

function getConnectionSettings() {
  return {
    host: getRequired("DB_HOST"),
    database: getOptional("DB_NAME"),
    port: parseInt(getRequired("DB_PORT"), 10),
    username: getRequired("PROCESSOR_USER"),
    password: getRequired("PROCESSOR_PASSWORD"),
    ssl: getOptional("DB_SSL") === "true",
    max: getTransformedOptional("DB_MAX_CONNECTIONS", (value) => parseInt(value, 10)),
  };
}

function getDefaultConnectionSettings() {
  return {
    database: "tsdb",
    ssl: true,
    connection: {
      timezone: "UTC",
    },
    idle_timeout: 3, // Don't hold connections so long
    transform: { undefined: null },
    debug: (...args: unknown[]) => logger.trace(args, "Query trace"),
    types: {
      // TODO - figure out how to hook this into upserts
      point: pointSqlType,
    },
  };
}

let sqlConnection: Promise<Sql>;
// eslint-disable-next-line import/no-mutable-exports
export let sql: Sql;

/**
 * Attempt to make a connection to the database. Run an "is alive" query
 * just to validate the connection was successful. Upon success, return the
 * connection
 * @returns The successful SQL connection
 */
async function attemptConnection(): Promise<Sql> {
  const connectionSettings = getConnectionSettings();
  logger.debug({ host: connectionSettings.host }, "Connecting to database");
  const newConnection = postgres({
    ...getDefaultConnectionSettings(),
    ...connectionSettings,
  });
  // Ensure the connection is valid before using it
  logger.trace("Running alive query");
  const aliveResult = await newConnection`select 1 as databaseAlive`;
  logger.debug({ aliveResult }, "'Is alive' result");
  return newConnection;
}

export async function initializeConnection() {
  if (!sqlConnection) {
    sqlConnection = asyncRetry(attemptConnection, {
      retries: 10,
      onRetry: (err, attempt) =>
        logger.warn(err, `Failed to connect to Postgres. Attempt: ${attempt}`),
    });
  }
  sql = await sqlConnection;
  return sqlConnection;
}
