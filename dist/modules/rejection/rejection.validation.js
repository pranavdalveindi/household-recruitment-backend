"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permanentRejectionSchema = void 0;
const zod_1 = require("zod");
exports.permanentRejectionSchema = zod_1.z.object({
    householdId: zod_1.z.string().uuid('Valid household ID is required'),
    reason: zod_1.z.string().min(5, 'Rejection reason must be at least 5 characters'),
});
