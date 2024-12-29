import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { join } from "path";

const dbPath = join(import.meta.dir, "../sqlite.db");

// Create/connect to SQLite database
const sqlite = new Database(dbPath, { create: true });
export const db = drizzle(sqlite);

export const initDb = async () => {
  try {
    console.log('Initializing database...');
    
    // Run migrations from the drizzle folder
    migrate(db, {
      migrationsFolder: join(import.meta.dir, "../drizzle")
    });

    console.log('✅ Database initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
};

// Run initialization if this file is executed directly
if (import.meta.main) {
  await initDb();
} 