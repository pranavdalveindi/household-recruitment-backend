"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const connection_1 = require("../../database/connection");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
class AuthService {
    async login(credentials) {
        const result = await connection_1.db.query(`SELECT id, email, name, password_hash, role, is_active, region_id 
       FROM users 
       WHERE LOWER(email) = LOWER($1)`, [credentials.email]);
        if (result.rowCount === 0) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }
        const row = result.rows[0];
        if (!row.is_active) {
            const error = new Error('Your account has been deactivated. Please contact an administrator.');
            error.statusCode = 403;
            throw error;
        }
        const isMatch = await (0, password_1.comparePassword)(credentials.password, row.password_hash);
        if (!isMatch) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }
        const authUser = {
            id: row.id,
            email: row.email,
            name: row.name,
            role: row.role,
            isActive: row.is_active,
            regionId: row.region_id,
        };
        const token = (0, jwt_1.signJwt)(authUser);
        return {
            user: authUser,
            token,
        };
    }
    async getMe(userId) {
        const result = await connection_1.db.query(`SELECT id, email, name, role, is_active as "isActive", region_id as "regionId"
       FROM users 
       WHERE id = $1`, [userId]);
        if (result.rowCount === 0) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return result.rows[0];
    }
    async changePassword(userId, input) {
        const result = await connection_1.db.query(`SELECT password_hash FROM users WHERE id = $1`, [userId]);
        if (result.rowCount === 0) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        const isMatch = await (0, password_1.comparePassword)(input.currentPassword, result.rows[0].password_hash);
        if (!isMatch) {
            const error = new Error('Incorrect current password');
            error.statusCode = 400;
            throw error;
        }
        const newHash = await (0, password_1.hashPassword)(input.newPassword);
        await connection_1.db.query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [newHash, userId]);
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
