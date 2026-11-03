import fs from 'fs';
import path from 'path';
import { pool } from '../config/database';

export const runSeeds = async () => {
  console.log('🌱 Running database seeds...');
  const seedsDir = path.join(__dirname, 'seeds');
  const files = fs
    .readdirSync(seedsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const client = await pool.connect();
  try {
    for (const file of files) {
      console.log(`📄 Executing seed: ${file}`);
      const sql = fs.readFileSync(path.join(seedsDir, file), 'utf-8');
      await client.query(sql);
      console.log(`✅ Applied seed: ${file}`);
    }
    console.log('🎉 All seed data inserted successfully.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

if (require.main === module) {
  runSeeds();
}

