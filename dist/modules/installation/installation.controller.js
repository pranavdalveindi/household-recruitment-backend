"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installationController = exports.InstallationController = void 0;
const installation_service_1 = require("./installation.service");
const api_response_1 = require("../../utils/api-response");
class InstallationController {
    async list(req, res) {
        const visits = await installation_service_1.installationService.list(req.query, req.user);
        api_response_1.ApiResponder.success(res, visits);
    }
    async recordVisit(req, res) {
        const visit = await installation_service_1.installationService.recordVisit(req.body, req.user);
        api_response_1.ApiResponder.created(res, visit, 'Installation visit recorded successfully');
    }
}
exports.InstallationController = InstallationController;
exports.installationController = new InstallationController();
