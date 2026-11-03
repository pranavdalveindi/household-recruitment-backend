"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const import_controller_1 = require("./import.controller");
const authenticate_1 = require("../../middleware/authenticate");
const authorize_1 = require("../../middleware/authorize");
const validate_1 = require("../../middleware/validate");
const import_validation_1 = require("./import.validation");
const async_handler_1 = require("../../utils/async-handler");
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only CSV files are allowed'));
        }
    },
});
exports.importRouter = (0, express_1.Router)();
exports.importRouter.use(authenticate_1.authenticate);
exports.importRouter.use((0, authorize_1.authorize)(['admin', 'panel_manager']));
exports.importRouter.get('/batches', (0, async_handler_1.asyncHandler)((req, res) => import_controller_1.importController.listBatches(req, res)));
exports.importRouter.get('/template', (0, async_handler_1.asyncHandler)((req, res) => import_controller_1.importController.downloadTemplate(req, res)));
exports.importRouter.post('/validate', upload.single('file'), (0, async_handler_1.asyncHandler)((req, res) => import_controller_1.importController.validateCsv(req, res)));
exports.importRouter.post('/confirm', (0, validate_1.validateRequest)({ body: import_validation_1.confirmImportSchema }), (0, async_handler_1.asyncHandler)((req, res) => import_controller_1.importController.confirmImport(req, res)));
