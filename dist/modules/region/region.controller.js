"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionController = exports.RegionController = void 0;
const region_service_1 = require("./region.service");
const api_response_1 = require("../../utils/api-response");
class RegionController {
    async getAll(_req, res) {
        const regions = await region_service_1.regionService.getAll();
        api_response_1.ApiResponder.success(res, regions);
    }
    async getById(req, res) {
        const region = await region_service_1.regionService.getById(req.params.id);
        api_response_1.ApiResponder.success(res, region);
    }
    async create(req, res) {
        const region = await region_service_1.regionService.create(req.body);
        api_response_1.ApiResponder.created(res, region, 'Region created successfully');
    }
    async update(req, res) {
        const region = await region_service_1.regionService.update(req.params.id, req.body);
        api_response_1.ApiResponder.success(res, region, 'Region updated successfully');
    }
}
exports.RegionController = RegionController;
exports.regionController = new RegionController();
