"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = exports.DashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
const api_response_1 = require("../../utils/api-response");
class DashboardController {
    async getDashboard(req, res) {
        const data = await dashboard_service_1.dashboardService.getDashboard(req.user);
        api_response_1.ApiResponder.success(res, data);
    }
}
exports.DashboardController = DashboardController;
exports.dashboardController = new DashboardController();
