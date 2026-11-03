"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.householdMemberController = exports.HouseholdMemberController = void 0;
const household_member_service_1 = require("./household-member.service");
const api_response_1 = require("../../utils/api-response");
class HouseholdMemberController {
    async getByHouseholdId(req, res) {
        const members = await household_member_service_1.householdMemberService.getByHouseholdId(req.params.householdId);
        api_response_1.ApiResponder.success(res, members);
    }
    async create(req, res) {
        const member = await household_member_service_1.householdMemberService.create(req.body);
        api_response_1.ApiResponder.created(res, member, 'Household member added successfully');
    }
}
exports.HouseholdMemberController = HouseholdMemberController;
exports.householdMemberController = new HouseholdMemberController();
