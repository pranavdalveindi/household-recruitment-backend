import { Router } from 'express';
import { noteController } from './note.controller';
import { authenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validate';
import { createNoteSchema } from './note.validation';
import { asyncHandler } from '../../utils/async-handler';

export const noteRouter = Router();

noteRouter.use(authenticate);

noteRouter.get(
  '/household/:householdId',
  asyncHandler((req, res) => noteController.getByHouseholdId(req, res))
);

noteRouter.post(
  '/',
  validateRequest({ body: createNoteSchema }),
  asyncHandler((req, res) => noteController.create(req, res))
);

