import Database from 'better-sqlite3'
import path from 'path'

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'sqlite.db')
export const db = new Database(dbPath)

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON')

export type * from './schema' 