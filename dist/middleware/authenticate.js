"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const api_response_1 = require("../utils/api-response");
const connection_1 = require("../database/connection");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            api_response_1.ApiResponder.error(res, 'Authentication required: missing Bearer token', 401);
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyJwt)(token);
        if (!decoded) {
            api_response_1.ApiResponder.error(res, 'Invalid or expired authentication token', 401);
            return;
        }
        // Lookup user in database
        const userResult = await connection_1.db.query('SELECT id, email, name, role, is_active as "isActive", region_id as "regionId" FROM users WHERE id = $1', [decoded.userId]);
        if (userResult.rowCount === 0) {
            api_response_1.ApiResponder.error(res, 'User account not found', 401);
            return;
        }
        const user = userResult.rows[0];
        if (!user.isActive) {
            api_response_1.ApiResponder.error(res, 'User account is deactivated', 403);
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
