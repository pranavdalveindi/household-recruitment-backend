"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentController = exports.AppointmentController = void 0;
const appointment_service_1 = require("./appointment.service");
const api_response_1 = require("../../utils/api-response");
class AppointmentController {
    async list(req, res) {
        const appointments = await appointment_service_1.appointmentService.list(req.query, req.user);
        api_response_1.ApiResponder.success(res, appointments);
    }
    async getById(req, res) {
        const appt = await appointment_service_1.appointmentService.getById(req.params.id, req.user);
        api_response_1.ApiResponder.success(res, appt);
    }
    async create(req, res) {
        const appt = await appointment_service_1.appointmentService.create(req.body, req.user);
        api_response_1.ApiResponder.created(res, appt, 'Appointment scheduled successfully');
    }
    async reschedule(req, res) {
        const appt = await appointment_service_1.appointmentService.reschedule(req.params.id, req.body, req.user);
        api_response_1.ApiResponder.success(res, appt, 'Appointment rescheduled successfully');
    }
}
exports.AppointmentController = AppointmentController;
exports.appointmentController = new AppointmentController();
