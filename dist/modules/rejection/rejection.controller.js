"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectionController = exports.RejectionController = void 0;
const rejection_service_1 = require("./rejection.service");
const api_response_1 = require("../../utils/api-response");
class RejectionController {
    async list(_req, res) {
        const list = await rejection_service_1.rejectionService.list();
        api_response_1.ApiResponder.success(res, list);
    }
    async rejectPermanently(req, res) {
        const rejection = await rejection_service_1.rejectionService.rejectPermanently(req.body, req.user);
        api_response_1.ApiResponder.created(res, rejection, 'Household permanently rejected');
    }
    async findReplacements(req, res) {
        const matches = await rejection_service_1.rejectionService.findReplacements(req.params.householdId);
        api_response_1.ApiResponder.success(res, matches);
    }
}
exports.RejectionController = RejectionController;
exports.rejectionController = new RejectionController();
