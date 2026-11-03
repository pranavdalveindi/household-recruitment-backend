import { z } from 'zod';

export const noteTypeEnum = z.enum([
  'general',
  'contact_instruction',
  'installation_instruction',
  'other',
]);

export const createNoteSchema = z.object({
  householdId: z.string().uuid('Valid household ID is required'),
  noteType: noteTypeEnum,
  content: z.string().min(1, 'Content is required'),
});

