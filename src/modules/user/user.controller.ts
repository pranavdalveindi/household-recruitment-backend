import { Request, Response } from 'express';
import { userService } from './user.service';
import { ApiResponder } from '../../utils/api-response';

export class UserController {
  async getAll(req: Request, res: Response): Promise<void> {
    const role = typeof req.query.role === 'string' ? req.query.role : undefined;
    const users = await userService.getAll(role);
    ApiResponder.success(res, users);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const user = await userService.getById(req.params.id);
    ApiResponder.success(res, user);
  }

  async create(req: Request, res: Response): Promise<void> {
    const user = await userService.create(req.body, req.user!);
    ApiResponder.created(res, user, 'User created successfully');
  }

  async update(req: Request, res: Response): Promise<void> {
    const user = await userService.update(req.params.id, req.body, req.user!);
    ApiResponder.success(res, user, 'User updated successfully');
  }
}

export const userController = new UserController();

