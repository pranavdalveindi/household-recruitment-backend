"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.householdController = exports.HouseholdController = void 0;
const household_service_1 = require("./household.service");
const api_response_1 = require("../../utils/api-response");
class HouseholdController {
    async list(req, res) {
        const { households, meta } = await household_service_1.householdService.list(req.query, req.user);
        api_response_1.ApiResponder.success(res, households, undefined, 200, meta);
    }
    async getById(req, res) {
        const household = await household_service_1.householdService.getById(req.params.id);
        api_response_1.ApiResponder.success(res, household);
    }
    async create(req, res) {
        const household = await household_service_1.householdService.create(req.body, req.user);
        api_response_1.ApiResponder.created(res, household, 'Household created successfully');
    }
}
exports.HouseholdController = HouseholdController;
exports.householdController = new HouseholdController();
