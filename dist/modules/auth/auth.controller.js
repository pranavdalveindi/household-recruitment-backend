"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const api_response_1 = require("../../utils/api-response");
class AuthController {
    async login(req, res) {
        const data = await auth_service_1.authService.login(req.body);
        api_response_1.ApiResponder.success(res, data, 'Logged in successfully');
    }
    async logout(_req, res) {
        // JWT is stateless; client removes token. Endpoint provided for API symmetry and logging.
        api_response_1.ApiResponder.success(res, null, 'Logged out successfully');
    }
    async getMe(req, res) {
        const user = await auth_service_1.authService.getMe(req.user.id);
        api_response_1.ApiResponder.success(res, user);
    }
    async changePassword(req, res) {
        await auth_service_1.authService.changePassword(req.user.id, req.body);
        api_response_1.ApiResponder.success(res, null, 'Password updated successfully');
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
