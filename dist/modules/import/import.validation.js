"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmImportSchema = void 0;
const zod_1 = require("zod");
exports.confirmImportSchema = zod_1.z.object({
    filename: zod_1.z.string().min(1, 'Filename is required'),
    rows: zod_1.z.array(zod_1.z.object({
        hhid: zod_1.z.string().min(1),
        respondentName: zod_1.z.string().min(1),
        contactNumber: zod_1.z.string().min(1),
        alternateContactNumber: zod_1.z.string().optional(),
        address: zod_1.z.string().min(1),
        landmark: zod_1.z.string().optional(),
        city: zod_1.z.string().min(1),
        region: zod_1.z.string().min(1),
        location: zod_1.z.string().optional(),
        sec: zod_1.z.coerce.number().int(),
        mosr: zod_1.z.coerce.number().int(),
        members: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            age: zod_1.z.coerce.number().int(),
            gender: zod_1.z.enum(['male', 'female', 'other']),
            relationshipToRespondent: zod_1.z.string(),
        })),
    })).min(1, 'At least one valid row must be provided for import'),
});
