"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeeds = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("../config/database");
const runSeeds = async () => {
    console.log('🌱 Running database seeds...');
    const seedsDir = path_1.default.join(__dirname, 'seeds');
    const files = fs_1.default
        .readdirSync(seedsDir)
        .filter((f) => f.endsWith('.sql'))
        .sort();
    const client = await database_1.pool.connect();
    try {
        for (const file of files) {
            console.log(`📄 Executing seed: ${file}`);
            const sql = fs_1.default.readFileSync(path_1.default.join(seedsDir, file), 'utf-8');
            await client.query(sql);
            console.log(`✅ Applied seed: ${file}`);
        }
        console.log('🎉 All seed data inserted successfully.');
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
    finally {
        client.release();
        await database_1.pool.end();
    }
};
exports.runSeeds = runSeeds;
if (require.main === module) {
    (0, exports.runSeeds)();
}
