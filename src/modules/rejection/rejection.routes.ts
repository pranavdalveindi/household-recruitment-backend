import { Router } from 'express';
import { rejectionController } from './rejection.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validate';
import { permanentRejectionSchema } from './rejection.validation';
import { asyncHandler } from '../../utils/async-handler';

export const rejectionRouter = Router();

rejectionRouter.use(authenticate);

rejectionRouter.get(
  '/',
  authorize(['admin', 'panel_manager']),
  asyncHandler((req, res) => rejectionController.list(req, res))
);

rejectionRouter.post(
  '/',
  authorize(['admin', 'panel_manager']),
  validateRequest({ body: permanentRejectionSchema }),
  asyncHandler((req, res) => rejectionController.rejectPermanently(req, res))
);

rejectionRouter.get(
  '/replacements/:householdId',
  authorize(['admin', 'panel_manager']),
  asyncHandler((req, res) => rejectionController.findReplacements(req, res))
);

