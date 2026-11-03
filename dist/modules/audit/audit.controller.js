"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditController = exports.AuditController = void 0;
const audit_service_1 = require("./audit.service");
const api_response_1 = require("../../utils/api-response");
class AuditController {
    async list(req, res) {
        const logs = await audit_service_1.auditService.list(req.query);
        api_response_1.ApiResponder.success(res, logs);
    }
}
exports.AuditController = AuditController;
exports.auditController = new AuditController();
