"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionnaireController = exports.QuestionnaireController = void 0;
const questionnaire_service_1 = require("./questionnaire.service");
const api_response_1 = require("../../utils/api-response");
class QuestionnaireController {
    async getActive(req, res) {
        const active = await questionnaire_service_1.questionnaireService.getActiveVersion();
        api_response_1.ApiResponder.success(res, active);
    }
    async getAllVersions(req, res) {
        const versions = await questionnaire_service_1.questionnaireService.getAllVersions();
        api_response_1.ApiResponder.success(res, versions);
    }
}
exports.QuestionnaireController = QuestionnaireController;
exports.questionnaireController = new QuestionnaireController();
