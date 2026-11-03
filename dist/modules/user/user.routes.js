"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const authenticate_1 = require("../../middleware/authenticate");
const authorize_1 = require("../../middleware/authorize");
const validate_1 = require("../../middleware/validate");
const user_validation_1 = require("./user.validation");
const async_handler_1 = require("../../utils/async-handler");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.use(authenticate_1.authenticate);
// List and get user details (Admin and Panel Manager can view, Field Executives and Call Center can view for assignment/select)
exports.userRouter.get('/', (0, authorize_1.authorize)(['admin', 'panel_manager', 'call_center_agent']), (0, async_handler_1.asyncHandler)((req, res) => user_controller_1.userController.getAll(req, res)));
exports.userRouter.get('/:id', (0, authorize_1.authorize)(['admin', 'panel_manager']), (0, async_handler_1.asyncHandler)((req, res) => user_controller_1.userController.getById(req, res)));
exports.userRouter.post('/', (0, authorize_1.authorize)(['admin', 'panel_manager']), (0, validate_1.validateRequest)({ body: user_validation_1.createUserSchema }), (0, async_handler_1.asyncHandler)((req, res) => user_controller_1.userController.create(req, res)));
exports.userRouter.patch('/:id', (0, authorize_1.authorize)(['admin', 'panel_manager']), (0, validate_1.validateRequest)({ body: user_validation_1.updateUserSchema }), (0, async_handler_1.asyncHandler)((req, res) => user_controller_1.userController.update(req, res)));
