"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportController = exports.ReportController = void 0;
const report_service_1 = require("./report.service");
const api_response_1 = require("../../utils/api-response");
class ReportController {
    async getCallReport(req, res) {
        const report = await report_service_1.reportService.getCallReport(req.query);
        api_response_1.ApiResponder.success(res, report);
    }
    async getInstallationReport(req, res) {
        const report = await report_service_1.reportService.getInstallationReport(req.query);
        api_response_1.ApiResponder.success(res, report);
    }
}
exports.ReportController = ReportController;
exports.reportController = new ReportController();
