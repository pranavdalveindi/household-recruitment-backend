import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middleware/validate';
import { loginSchema, changePasswordSchema } from './auth.validation';
import { authenticate } from '../../middleware/authenticate';
import { asyncHandler } from '../../utils/async-handler';

export const authRouter = Router();

authRouter.post(
  '/login',
  validateRequest({ body: loginSchema }),
  asyncHandler((req, res) => authController.login(req, res))
);

authRouter.post(
  '/logout',
  authenticate,
  asyncHandler((req, res) => authController.logout(req, res))
);

authRouter.get(
  '/me',
  authenticate,
  asyncHandler((req, res) => authController.getMe(req, res))
);

authRouter.post(
  '/change-password',
  authenticate,
  validateRequest({ body: changePasswordSchema }),
  asyncHandler((req, res) => authController.changePassword(req, res))
);

