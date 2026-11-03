"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponder = void 0;
class ApiResponder {
    static success(res, data, message, statusCode = 200, meta) {
        const payload = {
            success: true,
            ...(message && { message }),
            ...(data !== undefined && { data }),
            ...(meta && { meta }),
        };
        return res.status(statusCode).json(payload);
    }
    static created(res, data, message = 'Created successfully') {
        return this.success(res, data, message, 201);
    }
    static error(res, message = 'Internal server error', statusCode = 500, errors) {
        const payload = {
            success: false,
            message,
            ...(errors && errors.length > 0 && { errors }),
        };
        return res.status(statusCode).json(payload);
    }
}
exports.ApiResponder = ApiResponder;
