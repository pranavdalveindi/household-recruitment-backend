import { Request, Response } from 'express';
import { reportService } from './report.service';
import { ApiResponder } from '../../utils/api-response';

export class ReportController {
  async getCallReport(req: Request, res: Response): Promise<void> {
    const report = await reportService.getCallReport(req.query as any);
    ApiResponder.success(res, report);
  }

  async getInstallationReport(req: Request, res: Response): Promise<void> {
    const report = await reportService.getInstallationReport(req.query as any);
    ApiResponder.success(res, report);
  }
}

export const reportController = new ReportController();

