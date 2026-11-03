import { z } from 'zod';

export const userRoleEnum = z.enum([
  'admin',
  'panel_manager',
  'call_center_agent',
  'field_executive',
]);

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: userRoleEnum,
  regionId: z.string().uuid().nullable().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: userRoleEnum.optional(),
  isActive: z.boolean().optional(),
  regionId: z.string().uuid().nullable().optional(),
});

