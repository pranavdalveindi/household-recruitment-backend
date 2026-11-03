import { Router } from 'express';
import { callController } from './call.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validate';
import { recordCallAttemptSchema } from './call.validation';
import { asyncHandler } from '../../utils/async-handler';

export const callRouter = Router();

callRouter.use(authenticate);

callRouter.get(
  '/household/:householdId',
  asyncHandler((req, res) => callController.getByHouseholdId(req, res))
);

callRouter.post(
  '/',
  authorize(['admin', 'panel_manager', 'call_center_agent']),
  validateRequest({ body: recordCallAttemptSchema }),
  asyncHandler((req, res) => callController.recordAttempt(req, res))
);

