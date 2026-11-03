import { Request, Response } from 'express';
import { callService } from './call.service';
import { ApiResponder } from '../../utils/api-response';

export class CallController {
  async getByHouseholdId(req: Request, res: Response): Promise<void> {
    const attempts = await callService.getByHouseholdId(req.params.householdId);
    ApiResponder.success(res, attempts);
  }

  async recordAttempt(req: Request, res: Response): Promise<void> {
    const attempt = await callService.recordAttempt(req.body, req.user!);
    ApiResponder.created(res, attempt, 'Call attempt recorded successfully');
  }
}

export const callController = new CallController();

