import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export type MedscoreDatabase = PostgresJsDatabase<
  typeof import('C:/Users/Austin Muelrath/medscore-nextjs/src/db/schema')
>;