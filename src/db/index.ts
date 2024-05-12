import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
const connectionString = process.env.DB_CONNECTION_STRING_TRANS!;

// Disable prefetch as it is not supported for "Transaction" pool mode
const queryClient = postgres(connectionString, {
  max: 20, // Adjust the maximum number of connections in the pool
  idle_timeout: 60, // Adjust the idle timeout (in seconds) for connections
});
export const db = drizzle(queryClient, { schema });
