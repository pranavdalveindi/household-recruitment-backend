import { Router } from 'express';
import { userController } from './user.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validate';
import { createUserSchema, updateUserSchema } from './user.validation';
import { asyncHandler } from '../../utils/async-handler';

export const userRouter = Router();

userRouter.use(authenticate);

// List and get user details (Admin and Panel Manager can view, Field Executives and Call Center can view for assignment/select)
userRouter.get(
  '/',
  authorize(['admin', 'panel_manager', 'call_center_agent']),
  asyncHandler((req, res) => userController.getAll(req, res))
);

userRouter.get(
  '/:id',
  authorize(['admin', 'panel_manager']),
  asyncHandler((req, res) => userController.getById(req, res))
);

userRouter.post(
  '/',
  authorize(['admin', 'panel_manager']),
  validateRequest({ body: createUserSchema }),
  asyncHandler((req, res) => userController.create(req, res))
);

userRouter.patch(
  '/:id',
  authorize(['admin', 'panel_manager']),
  validateRequest({ body: updateUserSchema }),
  asyncHandler((req, res) => userController.update(req, res))
);

