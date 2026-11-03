import { z } from 'zod';

export const genderEnum = z.enum(['male', 'female', 'other']);

export const createHouseholdMemberSchema = z.object({
  householdId: z.string().uuid('Valid household ID is required'),
  name: z.string().min(1, 'Name is required'),
  age: z.coerce.number().int().min(0, 'Age must be non-negative').max(125),
  gender: genderEnum,
  relationshipToRespondent: z.string().min(1, 'Relationship is required'),
});

export const updateHouseholdMemberSchema = z.object({
  name: z.string().min(1).optional(),
  age: z.coerce.number().int().min(0).max(125).optional(),
  gender: genderEnum.optional(),
  relationshipToRespondent: z.string().min(1).optional(),
});

