"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
const isRemoteDatabase = !env_1.env.DATABASE_URL.includes('localhost') && !env_1.env.DATABASE_URL.includes('127.0.0.1');
const poolConfig = {
    connectionString: env_1.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: isRemoteDatabase ? { rejectUnauthorized: false } : false,
};
exports.pool = new pg_1.Pool(poolConfig);
exports.pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err);
});
