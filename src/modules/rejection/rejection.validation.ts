import { z } from 'zod';

export const permanentRejectionSchema = z.object({
  householdId: z.string().uuid('Valid household ID is required'),
  reason: z.string().min(5, 'Rejection reason must be at least 5 characters'),
});

