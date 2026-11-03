import { Router } from 'express';
import { reportController } from './report.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { asyncHandler } from '../../utils/async-handler';

export const reportRouter = Router();

reportRouter.use(authenticate);

reportRouter.get(
  '/calls',
  authorize(['admin', 'panel_manager', 'call_center_agent']),
  asyncHandler((req, res) => reportController.getCallReport(req, res))
);

reportRouter.get(
  '/installations',
  authorize(['admin', 'panel_manager', 'field_executive']),
  asyncHandler((req, res) => reportController.getInstallationReport(req, res))
);

