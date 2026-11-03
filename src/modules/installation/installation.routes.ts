import { Router } from 'express';
import { installationController } from './installation.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validate';
import { recordInstallationSchema } from './installation.validation';
import { asyncHandler } from '../../utils/async-handler';

export const installationRouter = Router();

installationRouter.use(authenticate);

installationRouter.get(
  '/',
  asyncHandler((req, res) => installationController.list(req, res))
);

installationRouter.post(
  '/',
  authorize(['field_executive', 'admin']),
  validateRequest({ body: recordInstallationSchema }),
  asyncHandler((req, res) => installationController.recordVisit(req, res))
);

