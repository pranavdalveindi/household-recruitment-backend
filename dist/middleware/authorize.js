"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const api_response_1 = require("../utils/api-response");
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            api_response_1.ApiResponder.error(res, 'Authentication required', 401);
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            api_response_1.ApiResponder.error(res, `Access denied. Role '${req.user.role}' is not authorized to access this resource.`, 403);
            return;
        }
        next();
    };
};
exports.authorize = authorize;
