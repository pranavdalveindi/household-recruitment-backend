import { Router } from 'express';
import { householdMemberController } from './household-member.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validate';
import { createHouseholdMemberSchema } from './household-member.validation';
import { asyncHandler } from '../../utils/async-handler';

export const householdMemberRouter = Router();

householdMemberRouter.use(authenticate);

householdMemberRouter.get(
  '/household/:householdId',
  asyncHandler((req, res) => householdMemberController.getByHouseholdId(req, res))
);

householdMemberRouter.post(
  '/',
  authorize(['admin', 'panel_manager']),
  validateRequest({ body: createHouseholdMemberSchema }),
  asyncHandler((req, res) => householdMemberController.create(req, res))
);

