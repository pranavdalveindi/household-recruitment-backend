import { z } from 'zod';

export const questionTypeEnum = z.enum([
  'text',
  'number',
  'boolean',
  'single_choice',
  'multiple_choice',
  'date',
]);

export const createQuestionnaireVersionSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
});

export const createQuestionSchema = z.object({
  questionnaireVersionId: z.string().uuid(),
  questionText: z.string().min(2, 'Question text is required'),
  questionType: questionTypeEnum,
  options: z.array(z.string()).optional(),
  isRequired: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(1),
});

