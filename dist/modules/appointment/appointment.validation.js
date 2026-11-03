"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rescheduleAppointmentSchema = exports.createAppointmentSchema = exports.appointmentStatusEnum = void 0;
const zod_1 = require("zod");
exports.appointmentStatusEnum = zod_1.z.enum([
    'scheduled',
    'rescheduled',
    'cancelled',
    'completed',
    'rejected',
]);
exports.createAppointmentSchema = zod_1.z.object({
    householdId: zod_1.z.string().uuid('Valid household ID is required'),
    fieldExecutiveId: zod_1.z.string().uuid('Valid field executive ID is required'),
    appointmentDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    appointmentTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, 'Time must be in HH:MM or HH:MM:SS format'),
    householdInstructions: zod_1.z.string().optional(),
});
exports.rescheduleAppointmentSchema = zod_1.z.object({
    fieldExecutiveId: zod_1.z.string().uuid().optional(),
    appointmentDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    appointmentTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, 'Time must be in HH:MM format'),
    householdInstructions: zod_1.z.string().optional(),
    reason: zod_1.z.string().optional(),
});
