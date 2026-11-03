import { Request, Response } from 'express';
import { auditService } from './audit.service';
import { ApiResponder } from '../../utils/api-response';

export class AuditController {
  async list(req: Request, res: Response): Promise<void> {
    const logs = await auditService.list(req.query as any);
    ApiResponder.success(res, logs);
  }
}

export const auditController = new AuditController();

