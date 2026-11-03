"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("../config/database");
const runMigrations = async () => {
    console.log('🚀 Running database migrations...');
    const migrationsDir = path_1.default.join(__dirname, 'migrations');
    const files = fs_1.default
        .readdirSync(migrationsDir)
        .filter((f) => f.endsWith('.sql'))
        .sort();
    const client = await database_1.pool.connect();
    try {
        for (const file of files) {
            console.log(`📄 Executing migration: ${file}`);
            const sql = fs_1.default.readFileSync(path_1.default.join(migrationsDir, file), 'utf-8');
            await client.query(sql);
            console.log(`✅ Applied migration: ${file}`);
        }
        console.log('🎉 All migrations applied successfully.');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
    finally {
        client.release();
        await database_1.pool.end();
    }
};
exports.runMigrations = runMigrations;
if (require.main === module) {
    (0, exports.runMigrations)();
}
