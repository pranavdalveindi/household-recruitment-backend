"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionService = exports.RegionService = void 0;
const connection_1 = require("../../database/connection");
class RegionService {
    async getAll() {
        const result = await connection_1.db.query(`SELECT id, name, code, state, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
       FROM regions 
       ORDER BY name ASC`);
        return result.rows;
    }
    async getById(id) {
        const result = await connection_1.db.query(`SELECT id, name, code, state, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
       FROM regions 
       WHERE id = $1`, [id]);
        if (result.rowCount === 0) {
            const error = new Error('Region not found');
            error.statusCode = 404;
            throw error;
        }
        return result.rows[0];
    }
    async create(input) {
        const existing = await connection_1.db.query('SELECT id FROM regions WHERE LOWER(code) = LOWER($1)', [input.code]);
        if ((existing.rowCount ?? 0) > 0) {
            const error = new Error(`Region with code '${input.code}' already exists`);
            error.statusCode = 409;
            throw error;
        }
        const result = await connection_1.db.query(`INSERT INTO regions (name, code, state)
       VALUES ($1, $2, $3)
       RETURNING id, name, code, state, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"`, [input.name, input.code, input.state]);
        return result.rows[0];
    }
    async update(id, input) {
        const region = await this.getById(id);
        const name = input.name ?? region.name;
        const code = input.code ?? region.code;
        const state = input.state ?? region.state;
        const isActive = input.isActive ?? region.isActive;
        const result = await connection_1.db.query(`UPDATE regions 
       SET name = $1, code = $2, state = $3, is_active = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING id, name, code, state, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"`, [name, code, state, isActive, id]);
        return result.rows[0];
    }
}
exports.RegionService = RegionService;
exports.regionService = new RegionService();
