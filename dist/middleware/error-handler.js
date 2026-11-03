"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const api_response_1 = require("../utils/api-response");
const env_1 = require("../config/env");
const errorHandler = (err, req, res, _next) => {
    // Zod Validation Error
    if (err instanceof zod_1.ZodError) {
        const formattedErrors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        return api_response_1.ApiResponder.error(res, 'Validation error', 400, formattedErrors);
    }
    // Known AppError
    const statusCode = err.statusCode || (err.status ? Number(err.status) : 500);
    const message = err.message || 'Internal server error';
    if (statusCode >= 500) {
        console.error('Unhandled Application Error:', {
            message: err.message,
            stack: env_1.env.NODE_ENV === 'development' ? err.stack : undefined,
            url: req.originalUrl,
            method: req.method,
        });
    }
    return api_response_1.ApiResponder.error(res, statusCode >= 500 && env_1.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : message, statusCode, err.errors);
};
exports.errorHandler = errorHandler;
