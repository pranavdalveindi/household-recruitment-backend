import { z } from 'zod';

export const callStatusEnum = z.enum(['successful', 'not_reachable', 'busy']);
export const appointmentDecisionEnum = z.enum(['scheduled', 'rejected']);

export const recordCallAttemptSchema = z
  .object({
    householdId: z.string().uuid('Valid household ID is required'),
    callStatus: callStatusEnum,
    appointmentDecision: appointmentDecisionEnum.nullable().optional(),
    callStartedAt: z.string().datetime().optional(),
    callEndedAt: z.string().datetime().optional(),
    callDurationSeconds: z.coerce.number().int().min(0).optional(),
    notes: z.string().optional(),
    questionnaireVersionId: z.string().uuid().optional(),
    responses: z
      .array(
        z.object({
          questionId: z.string().uuid(),
          responseValue: z.any(),
        })
      )
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.callStatus === 'successful' && !val.appointmentDecision) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Appointment decision (scheduled or rejected) is required for successful calls',
        path: ['appointmentDecision'],
      });
    }
  });

