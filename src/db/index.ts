import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
const connectionString = process.env.DB_CONNECTION_STRING_TRANS!;

// Disable prefetch as it is not supported for "Transaction" pool mode
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });
