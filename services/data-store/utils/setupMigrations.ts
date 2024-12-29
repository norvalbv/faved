import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const setupMigrations = async () => {
  const migrationsPath = join(import.meta.dir, '../drizzle');
  const metaPath = join(migrationsPath, 'meta');
  const journalPath = join(metaPath, '_journal.json');

  try {
    await mkdir(metaPath, { recursive: true });
    
    const initialJournal = {
      version: "5",
      dialect: "sqlite",
      entries: []
    };

    await writeFile(journalPath, JSON.stringify(initialJournal, null, 2));
    console.log('✅ Migration files setup completed');
  } catch (error) {
    console.error('❌ Failed to setup migration files:', error);
    throw error;
  }
};

export default setupMigrations; 