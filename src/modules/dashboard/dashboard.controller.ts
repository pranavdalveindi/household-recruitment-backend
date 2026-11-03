import { Request, Response } from 'express';
import { dashboardService } from './dashboard.service';
import { ApiResponder } from '../../utils/api-response';

export class DashboardController {
  async getDashboard(req: Request, res: Response): Promise<void> {
    const data = await dashboardService.getDashboard(req.user!);
    ApiResponder.success(res, data);
  }
}

export const dashboardController = new DashboardController();

