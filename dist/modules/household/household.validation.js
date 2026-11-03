"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHouseholdSchema = exports.createHouseholdSchema = exports.recruitmentStatusEnum = void 0;
const zod_1 = require("zod");
exports.recruitmentStatusEnum = zod_1.z.enum([
    'not_contacted',
    'contact_in_progress',
    'appointment_pending',
    'appointment_scheduled',
    'installation_in_progress',
    'installed',
    'rejected',
]);
exports.createHouseholdSchema = zod_1.z.object({
    hhid: zod_1.z.string().min(2, 'HHID is required'),
    respondentName: zod_1.z.string().min(2, 'Respondent name is required'),
    contactNumber: zod_1.z.string().min(8, 'Contact number is required'),
    alternateContactNumber: zod_1.z.string().optional().nullable(),
    address: zod_1.z.string().min(3, 'Address is required'),
    landmark: zod_1.z.string().optional().nullable(),
    city: zod_1.z.string().min(2, 'City is required'),
    regionId: zod_1.z.string().uuid('Valid region ID is required'),
    location: zod_1.z.string().optional().nullable(),
    sec: zod_1.z.coerce.number().int().min(1),
    mosr: zod_1.z.coerce.number().int().min(0),
});
exports.updateHouseholdSchema = zod_1.z.object({
    respondentName: zod_1.z.string().min(2).optional(),
    contactNumber: zod_1.z.string().min(8).optional(),
    alternateContactNumber: zod_1.z.string().optional().nullable(),
    address: zod_1.z.string().min(3).optional(),
    landmark: zod_1.z.string().optional().nullable(),
    city: zod_1.z.string().min(2).optional(),
    regionId: zod_1.z.string().uuid().optional(),
    location: zod_1.z.string().optional().nullable(),
    sec: zod_1.z.coerce.number().int().min(1).optional(),
    mosr: zod_1.z.coerce.number().int().min(0).optional(),
    recruitmentStatus: exports.recruitmentStatusEnum.optional(),
});
