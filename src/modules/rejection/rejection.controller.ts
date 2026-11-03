import { Request, Response } from 'express';
import { rejectionService } from './rejection.service';
import { ApiResponder } from '../../utils/api-response';

export class RejectionController {
  async list(_req: Request, res: Response): Promise<void> {
    const list = await rejectionService.list();
    ApiResponder.success(res, list);
  }

  async rejectPermanently(req: Request, res: Response): Promise<void> {
    const rejection = await rejectionService.rejectPermanently(req.body, req.user!);
    ApiResponder.created(res, rejection, 'Household permanently rejected');
  }

  async findReplacements(req: Request, res: Response): Promise<void> {
    const matches = await rejectionService.findReplacements(req.params.householdId);
    ApiResponder.success(res, matches);
  }
}

export const rejectionController = new RejectionController();

