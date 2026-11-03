import { Router } from 'express';
import { regionController } from './region.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validate';
import { createRegionSchema, updateRegionSchema } from './region.validation';
import { asyncHandler } from '../../utils/async-handler';

export const regionRouter = Router();

regionRouter.use(authenticate);

regionRouter.get(
  '/',
  asyncHandler((req, res) => regionController.getAll(req, res))
);

regionRouter.get(
  '/:id',
  asyncHandler((req, res) => regionController.getById(req, res))
);

regionRouter.post(
  '/',
  authorize(['admin']),
  validateRequest({ body: createRegionSchema }),
  asyncHandler((req, res) => regionController.create(req, res))
);

regionRouter.patch(
  '/:id',
  authorize(['admin']),
  validateRequest({ body: updateRegionSchema }),
  asyncHandler((req, res) => regionController.update(req, res))
);

