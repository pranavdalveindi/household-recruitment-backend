"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const api_response_1 = require("../utils/api-response");
const notFoundHandler = (req, res) => {
    api_response_1.ApiResponder.error(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};
exports.notFoundHandler = notFoundHandler;
