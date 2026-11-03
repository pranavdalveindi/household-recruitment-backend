"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRouter = void 0;
const express_1 = require("express");
const appointment_controller_1 = require("./appointment.controller");
const authenticate_1 = require("../../middleware/authenticate");
const authorize_1 = require("../../middleware/authorize");
const validate_1 = require("../../middleware/validate");
const appointment_validation_1 = require("./appointment.validation");
const async_handler_1 = require("../../utils/async-handler");
exports.appointmentRouter = (0, express_1.Router)();
exports.appointmentRouter.use(authenticate_1.authenticate);
exports.appointmentRouter.get('/', (0, async_handler_1.asyncHandler)((req, res) => appointment_controller_1.appointmentController.list(req, res)));
exports.appointmentRouter.get('/:id', (0, async_handler_1.asyncHandler)((req, res) => appointment_controller_1.appointmentController.getById(req, res)));
// Only Call Center Agent, Panel Manager, and Admin can schedule or reschedule
exports.appointmentRouter.post('/', (0, authorize_1.authorize)(['admin', 'panel_manager', 'call_center_agent']), (0, validate_1.validateRequest)({ body: appointment_validation_1.createAppointmentSchema }), (0, async_handler_1.asyncHandler)((req, res) => appointment_controller_1.appointmentController.create(req, res)));
exports.appointmentRouter.post('/:id/reschedule', (0, authorize_1.authorize)(['admin', 'panel_manager', 'call_center_agent']), (0, validate_1.validateRequest)({ body: appointment_validation_1.rescheduleAppointmentSchema }), (0, async_handler_1.asyncHandler)((req, res) => appointment_controller_1.appointmentController.reschedule(req, res)));
