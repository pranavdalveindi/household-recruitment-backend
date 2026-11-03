import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/authenticate';
import { asyncHandler } from '../../utils/async-handler';

export const dashboardRouter = Router();

dashboardRouter.use(authenticate);

dashboardRouter.get(
  '/',
  asyncHandler((req, res) => dashboardController.getDashboard(req, res))
);

