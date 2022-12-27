import createPinoLogger from "pino";

const prettyTransport = { level: "info", target: "pino-pretty" };

export function createLogger(name: string): ReturnType<typeof createPinoLogger> {
  return createPinoLogger({
    name,
    level: process.env.LOG_LEVEL ?? "info",
    transport: process.env.IS_DEV === "true" ? prettyTransport : undefined,
  });
}
