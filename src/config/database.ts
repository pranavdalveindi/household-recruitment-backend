import { Pool, PoolConfig } from 'pg';
import { env } from './env';

const isRemoteDatabase =
  !env.DATABASE_URL.includes('localhost') && !env.DATABASE_URL.includes('127.0.0.1');

const poolConfig: PoolConfig = {
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: isRemoteDatabase ? { rejectUnauthorized: false } : false,
};

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

