import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import path from 'path'

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'sqlite.db')
const sqlite = new Database(dbPath)

// Enable foreign keys
sqlite.exec('PRAGMA foreign_keys = ON')

// Create Drizzle database instance
export const db = drizzle(sqlite)

export type * from './schema' 