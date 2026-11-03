"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_service_1 = require("./user.service");
const api_response_1 = require("../../utils/api-response");
class UserController {
    async getAll(req, res) {
        const role = typeof req.query.role === 'string' ? req.query.role : undefined;
        const users = await user_service_1.userService.getAll(role);
        api_response_1.ApiResponder.success(res, users);
    }
    async getById(req, res) {
        const user = await user_service_1.userService.getById(req.params.id);
        api_response_1.ApiResponder.success(res, user);
    }
    async create(req, res) {
        const user = await user_service_1.userService.create(req.body, req.user);
        api_response_1.ApiResponder.created(res, user, 'User created successfully');
    }
    async update(req, res) {
        const user = await user_service_1.userService.update(req.params.id, req.body, req.user);
        api_response_1.ApiResponder.success(res, user, 'User updated successfully');
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
