import { z } from 'zod';

export const createRegionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters').toUpperCase(),
  state: z.string().min(2, 'State must be at least 2 characters'),
});

export const updateRegionSchema = z.object({
  name: z.string().min(2).optional(),
  code: z.string().min(2).toUpperCase().optional(),
  state: z.string().min(2).optional(),
  isActive: z.boolean().optional(),
});

