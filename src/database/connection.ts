import { pool } from '../config/database';
import { PoolClient, QueryResult, QueryResultRow } from 'pg';

export const db = {
  query: <T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<QueryResult<T>> => {
    return pool.query<T>(text, params);
  },

  getClient: (): Promise<PoolClient> => {
    return pool.connect();
  },

  transaction: async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  testConnection: async (): Promise<boolean> => {
    try {
      const res = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
      console.log(` Connected to PostgreSQL [${res.rows[0].db_name}] at ${res.rows[0].current_time}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to PostgreSQL:', error);
      return false;
    }
  },
};

