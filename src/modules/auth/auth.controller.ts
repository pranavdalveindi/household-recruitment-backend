import { Request, Response } from 'express';
import { authService } from './auth.service';
import { ApiResponder } from '../../utils/api-response';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const data = await authService.login(req.body);
    ApiResponder.success(res, data, 'Logged in successfully');
  }

  async logout(_req: Request, res: Response): Promise<void> {
    // JWT is stateless; client removes token. Endpoint provided for API symmetry and logging.
    ApiResponder.success(res, null, 'Logged out successfully');
  }

  async getMe(req: Request, res: Response): Promise<void> {
    const user = await authService.getMe(req.user!.id);
    ApiResponder.success(res, user);
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    await authService.changePassword(req.user!.id, req.body);
    ApiResponder.success(res, null, 'Password updated successfully');
  }
}

export const authController = new AuthController();

