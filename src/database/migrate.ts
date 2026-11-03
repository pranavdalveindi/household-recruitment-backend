import fs from 'fs';
import path from 'path';
import { pool } from '../config/database';

export const runMigrations = async () => {
  console.log('🚀 Running database migrations...');
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const client = await pool.connect();
  try {
    for (const file of files) {
      console.log(`📄 Executing migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      await client.query(sql);
      console.log(`✅ Applied migration: ${file}`);
    }
    console.log('🎉 All migrations applied successfully.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

if (require.main === module) {
  runMigrations();
}

