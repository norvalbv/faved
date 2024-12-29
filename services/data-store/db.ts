import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { join } from "path";

// Create/connect to SQLite database
const sqlite = new Database(join(process.cwd(), "sqlite.db"), { create: true });

// Create drizzle database instance
export const db = drizzle(sqlite);

export type * from './schema' 