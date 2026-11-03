"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const database_1 = require("../config/database");
exports.db = {
    query: (text, params) => {
        return database_1.pool.query(text, params);
    },
    getClient: () => {
        return database_1.pool.connect();
    },
    transaction: async (callback) => {
        const client = await database_1.pool.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    },
    testConnection: async () => {
        try {
            const res = await database_1.pool.query('SELECT NOW() as current_time, current_database() as db_name');
            console.log(` Connected to PostgreSQL [${res.rows[0].db_name}] at ${res.rows[0].current_time}`);
            return true;
        }
        catch (error) {
            console.error('❌ Failed to connect to PostgreSQL:', error);
            return false;
        }
    },
};
