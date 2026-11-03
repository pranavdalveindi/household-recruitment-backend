"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importController = exports.ImportController = void 0;
const import_service_1 = require("./import.service");
const api_response_1 = require("../../utils/api-response");
class ImportController {
    async listBatches(_req, res) {
        const batches = await import_service_1.importService.listBatches();
        api_response_1.ApiResponder.success(res, batches);
    }
    async validateCsv(req, res) {
        if (!req.file) {
            api_response_1.ApiResponder.error(res, 'No CSV file uploaded', 400);
            return;
        }
        const validation = await import_service_1.importService.validateCsv(req.file.buffer);
        api_response_1.ApiResponder.success(res, validation, 'CSV validated successfully');
    }
    async confirmImport(req, res) {
        const { filename, rows } = req.body;
        const result = await import_service_1.importService.confirmImport(filename, rows, req.user);
        api_response_1.ApiResponder.created(res, result, 'Households imported successfully');
    }
    async downloadTemplate(_req, res) {
        const headers = [
            'hhid',
            'respondant_name',
            'respondent_name',
            'contact_number',
            'alternate_contact_number',
            'address',
            'landmark',
            'city',
            'region',
            'location',
            'sec',
            'mosr',
            'member_1_name',
            'member_1_age',
            'member_1_gender',
            'member_1_relationship_to_respondent',
            'member_2_name',
            'member_2_age',
            'member_2_gender',
            'member_2_relationship_to_respondent',
        ];
        const sampleRow = [
            'HH1001',
            'Rajesh Sharma',
            'Rajesh Sharma',
            '+919876543210',
            '+919876543211',
            'Flat 402, Sunshine Apts',
            'Near Metro Station',
            'Mumbai',
            'West Zone',
            'Andheri West',
            '1',
            '3',
            'Sunita Sharma',
            '38',
            'female',
            'Wife',
            'Aarav Sharma',
            '12',
            'male',
            'Son',
        ];
        const csvContent = `${headers.join(',')}\n${sampleRow.join(',')}\n`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="household_recruitment_template.csv"');
        res.status(200).send(csvContent);
    }
}
exports.ImportController = ImportController;
exports.importController = new ImportController();
