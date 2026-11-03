import { Request, Response } from 'express';
import { installationService } from './installation.service';
import { ApiResponder } from '../../utils/api-response';

export class InstallationController {
  async list(req: Request, res: Response): Promise<void> {
    const visits = await installationService.list(req.query as any, req.user!);
    ApiResponder.success(res, visits);
  }

  async recordVisit(req: Request, res: Response): Promise<void> {
    const visit = await installationService.recordVisit(req.body, req.user!);
    ApiResponder.created(res, visit, 'Installation visit recorded successfully');
  }
}

export const installationController = new InstallationController();

