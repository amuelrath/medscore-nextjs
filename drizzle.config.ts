import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  driver: "pg",
  breakpoints: true,
  dbCredentials: {
    connectionString: process.env.DB_CONNECTION_STRING!,
  },

} satisfies Config;
