"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordCallAttemptSchema = exports.appointmentDecisionEnum = exports.callStatusEnum = void 0;
const zod_1 = require("zod");
exports.callStatusEnum = zod_1.z.enum(['successful', 'not_reachable', 'busy']);
exports.appointmentDecisionEnum = zod_1.z.enum(['scheduled', 'rejected']);
exports.recordCallAttemptSchema = zod_1.z
    .object({
    householdId: zod_1.z.string().uuid('Valid household ID is required'),
    callStatus: exports.callStatusEnum,
    appointmentDecision: exports.appointmentDecisionEnum.nullable().optional(),
    callStartedAt: zod_1.z.string().datetime().optional(),
    callEndedAt: zod_1.z.string().datetime().optional(),
    callDurationSeconds: zod_1.z.coerce.number().int().min(0).optional(),
    notes: zod_1.z.string().optional(),
    questionnaireVersionId: zod_1.z.string().uuid().optional(),
    responses: zod_1.z
        .array(zod_1.z.object({
        questionId: zod_1.z.string().uuid(),
        responseValue: zod_1.z.any(),
    }))
        .optional(),
})
    .superRefine((val, ctx) => {
    if (val.callStatus === 'successful' && !val.appointmentDecision) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Appointment decision (scheduled or rejected) is required for successful calls',
            path: ['appointmentDecision'],
        });
    }
});
