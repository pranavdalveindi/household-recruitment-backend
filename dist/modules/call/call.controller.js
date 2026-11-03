"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callController = exports.CallController = void 0;
const call_service_1 = require("./call.service");
const api_response_1 = require("../../utils/api-response");
class CallController {
    async getByHouseholdId(req, res) {
        const attempts = await call_service_1.callService.getByHouseholdId(req.params.householdId);
        api_response_1.ApiResponder.success(res, attempts);
    }
    async recordAttempt(req, res) {
        const attempt = await call_service_1.callService.recordAttempt(req.body, req.user);
        api_response_1.ApiResponder.created(res, attempt, 'Call attempt recorded successfully');
    }
}
exports.CallController = CallController;
exports.callController = new CallController();
