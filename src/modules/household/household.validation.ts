import { z } from 'zod';

export const recruitmentStatusEnum = z.enum([
  'not_contacted',
  'contact_in_progress',
  'appointment_pending',
  'appointment_scheduled',
  'installation_in_progress',
  'installed',
  'rejected',
]);

export const createHouseholdSchema = z.object({
  hhid: z.string().min(2, 'HHID is required'),
  respondentName: z.string().min(2, 'Respondent name is required'),
  contactNumber: z.string().min(8, 'Contact number is required'),
  alternateContactNumber: z.string().optional().nullable(),
  address: z.string().min(3, 'Address is required'),
  landmark: z.string().optional().nullable(),
  city: z.string().min(2, 'City is required'),
  regionId: z.string().uuid('Valid region ID is required'),
  location: z.string().optional().nullable(),
  sec: z.coerce.number().int().min(1),
  mosr: z.coerce.number().int().min(0),
});

export const updateHouseholdSchema = z.object({
  respondentName: z.string().min(2).optional(),
  contactNumber: z.string().min(8).optional(),
  alternateContactNumber: z.string().optional().nullable(),
  address: z.string().min(3).optional(),
  landmark: z.string().optional().nullable(),
  city: z.string().min(2).optional(),
  regionId: z.string().uuid().optional(),
  location: z.string().optional().nullable(),
  sec: z.coerce.number().int().min(1).optional(),
  mosr: z.coerce.number().int().min(0).optional(),
  recruitmentStatus: recruitmentStatusEnum.optional(),
});

