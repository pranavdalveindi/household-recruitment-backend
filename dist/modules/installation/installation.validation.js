"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordInstallationSchema = exports.installationStatusEnum = void 0;
const zod_1 = require("zod");
exports.installationStatusEnum = zod_1.z.enum(['pending', 'installed', 'rejected', 'issue']);
exports.recordInstallationSchema = zod_1.z
    .object({
    householdId: zod_1.z.string().uuid('Valid household ID is required'),
    appointmentId: zod_1.z.string().uuid().nullable().optional(),
    visitDate: zod_1.z.string().datetime().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    status: exports.installationStatusEnum,
    rejectionReason: zod_1.z.string().nullable().optional(),
    issueCategory: zod_1.z.string().nullable().optional(),
    issueDescription: zod_1.z.string().nullable().optional(),
    notes: zod_1.z.string().nullable().optional(),
    meterSerialNumber: zod_1.z.string().nullable().optional(),
})
    .superRefine((val, ctx) => {
    if (val.status === 'rejected' && (!val.rejectionReason || val.rejectionReason.trim().length === 0)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Rejection reason is mandatory when status is rejected',
            path: ['rejectionReason'],
        });
    }
    if (val.status === 'issue') {
        if (!val.issueCategory || val.issueCategory.trim().length === 0) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'Issue category is mandatory when status is issue',
                path: ['issueCategory'],
            });
        }
        if (!val.issueDescription || val.issueDescription.trim().length === 0) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'Issue description is mandatory when status is issue',
                path: ['issueDescription'],
            });
        }
    }
});
