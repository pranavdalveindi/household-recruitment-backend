import { z } from 'zod';

export const confirmImportSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  rows: z.array(
    z.object({
      hhid: z.string().min(1),
      respondentName: z.string().min(1),
      contactNumber: z.string().min(1),
      alternateContactNumber: z.string().optional(),
      address: z.string().min(1),
      landmark: z.string().optional(),
      city: z.string().min(1),
      region: z.string().min(1),
      location: z.string().optional(),
      sec: z.coerce.number().int(),
      mosr: z.coerce.number().int(),
      members: z.array(
        z.object({
          name: z.string(),
          age: z.coerce.number().int(),
          gender: z.enum(['male', 'female', 'other']),
          relationshipToRespondent: z.string(),
        })
      ),
    })
  ).min(1, 'At least one valid row must be provided for import'),
});

