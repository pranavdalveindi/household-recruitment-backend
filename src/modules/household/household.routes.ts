import { Router } from 'express';
import { householdController } from './household.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validate';
import { createHouseholdSchema } from './household.validation';
import { asyncHandler } from '../../utils/async-handler';

export const householdRouter = Router();

householdRouter.use(authenticate);

householdRouter.get(
  '/',
  asyncHandler((req, res) => householdController.list(req, res))
);

householdRouter.get(
  '/:id',
  asyncHandler((req, res) => householdController.getById(req, res))
);

householdRouter.post(
  '/',
  authorize(['admin', 'panel_manager']),
  validateRequest({ body: createHouseholdSchema }),
  asyncHandler((req, res) => householdController.create(req, res))
);

