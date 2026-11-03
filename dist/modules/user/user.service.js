"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const connection_1 = require("../../database/connection");
const password_1 = require("../../utils/password");
class UserService {
    async getAll(role) {
        const params = [];
        let query = `
      SELECT u.id, u.name, u.email, u.role, u.is_active as "isActive", 
             u.region_id as "regionId", r.name as "regionName",
             u.created_at as "createdAt", u.updated_at as "updatedAt"
      FROM users u
      LEFT JOIN regions r ON u.region_id = r.id
    `;
        if (role) {
            query += ` WHERE u.role = $1`;
            params.push(role);
        }
        query += ` ORDER BY u.name ASC`;
        const result = await connection_1.db.query(query, params);
        return result.rows;
    }
    async getById(id) {
        const result = await connection_1.db.query(`SELECT u.id, u.name, u.email, u.role, u.is_active as "isActive", 
              u.region_id as "regionId", r.name as "regionName",
              u.created_at as "createdAt", u.updated_at as "updatedAt"
       FROM users u
       LEFT JOIN regions r ON u.region_id = r.id
       WHERE u.id = $1`, [id]);
        if (result.rowCount === 0) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return result.rows[0];
    }
    async create(input, actor) {
        // Role check: Only admin can create admin or panel_manager accounts
        if (actor.role === 'panel_manager' && (input.role === 'admin' || input.role === 'panel_manager')) {
            const error = new Error('Panel Managers cannot create Admin or Panel Manager accounts');
            error.statusCode = 403;
            throw error;
        }
        // Check unique email
        const existing = await connection_1.db.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [input.email]);
        if ((existing.rowCount ?? 0) > 0) {
            const error = new Error(`User with email '${input.email}' already exists`);
            error.statusCode = 409;
            throw error;
        }
        const passwordHash = await (0, password_1.hashPassword)(input.password);
        const result = await connection_1.db.query(`INSERT INTO users (name, email, password_hash, role, region_id)
       VALUES ($1, LOWER($2), $3, $4, $5)
       RETURNING id, name, email, role, is_active as "isActive", region_id as "regionId", created_at as "createdAt", updated_at as "updatedAt"`, [input.name, input.email, passwordHash, input.role, input.regionId || null]);
        return result.rows[0];
    }
    async update(id, input, actor) {
        const targetUser = await this.getById(id);
        // Only admin can modify admin accounts
        if (targetUser.role === 'admin' && actor.role !== 'admin') {
            const error = new Error('Only administrators can modify an Admin account');
            error.statusCode = 403;
            throw error;
        }
        // Panel manager cannot elevate someone to admin
        if (input.role === 'admin' && actor.role !== 'admin') {
            const error = new Error('Only administrators can assign the Admin role');
            error.statusCode = 403;
            throw error;
        }
        const name = input.name ?? targetUser.name;
        const email = input.email ?? targetUser.email;
        const role = input.role ?? targetUser.role;
        const isActive = input.isActive !== undefined ? input.isActive : targetUser.isActive;
        const regionId = input.regionId !== undefined ? input.regionId : targetUser.regionId;
        const result = await connection_1.db.query(`UPDATE users 
       SET name = $1, email = LOWER($2), role = $3, is_active = $4, region_id = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING id, name, email, role, is_active as "isActive", region_id as "regionId", created_at as "createdAt", updated_at as "updatedAt"`, [name, email, role, isActive, regionId, id]);
        return result.rows[0];
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
