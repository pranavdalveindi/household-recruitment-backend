import { z } from 'zod';

export const installationStatusEnum = z.enum(['pending', 'installed', 'rejected', 'issue']);

export const recordInstallationSchema = z
  .object({
    householdId: z.string().uuid('Valid household ID is required'),
    appointmentId: z.string().uuid().nullable().optional(),
    visitDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    status: installationStatusEnum,
    rejectionReason: z.string().nullable().optional(),
    issueCategory: z.string().nullable().optional(),
    issueDescription: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    meterSerialNumber: z.string().nullable().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.status === 'rejected' && (!val.rejectionReason || val.rejectionReason.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Rejection reason is mandatory when status is rejected',
        path: ['rejectionReason'],
      });
    }

    if (val.status === 'issue') {
      if (!val.issueCategory || val.issueCategory.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Issue category is mandatory when status is issue',
          path: ['issueCategory'],
        });
      }
      if (!val.issueDescription || val.issueDescription.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Issue description is mandatory when status is issue',
          path: ['issueDescription'],
        });
      }
    }
  });

