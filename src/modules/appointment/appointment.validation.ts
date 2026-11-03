import { z } from 'zod';

export const appointmentStatusEnum = z.enum([
  'scheduled',
  'rescheduled',
  'cancelled',
  'completed',
  'rejected',
]);

export const createAppointmentSchema = z.object({
  householdId: z.string().uuid('Valid household ID is required'),
  fieldExecutiveId: z.string().uuid('Valid field executive ID is required'),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  appointmentTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, 'Time must be in HH:MM or HH:MM:SS format'),
  householdInstructions: z.string().optional(),
});

export const rescheduleAppointmentSchema = z.object({
  fieldExecutiveId: z.string().uuid().optional(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  appointmentTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, 'Time must be in HH:MM format'),
  householdInstructions: z.string().optional(),
  reason: z.string().optional(),
});

