import { Router } from 'express';
import { auditController } from './audit.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { asyncHandler } from '../../utils/async-handler';

export const auditRouter = Router();

auditRouter.use(authenticate);
auditRouter.use(authorize(['admin']));

auditRouter.get(
  '/',
  asyncHandler((req, res) => auditController.list(req, res))
);

