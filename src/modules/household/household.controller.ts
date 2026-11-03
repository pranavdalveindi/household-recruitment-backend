import { Request, Response } from 'express';
import { householdService } from './household.service';
import { ApiResponder } from '../../utils/api-response';

export class HouseholdController {
  async list(req: Request, res: Response): Promise<void> {
    const { households, meta } = await householdService.list(req.query as any, req.user!);
    ApiResponder.success(res, households, undefined, 200, meta);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const household = await householdService.getById(req.params.id);
    ApiResponder.success(res, household);
  }

  async create(req: Request, res: Response): Promise<void> {
    const household = await householdService.create(req.body, req.user!);
    ApiResponder.created(res, household, 'Household created successfully');
  }
}

export const householdController = new HouseholdController();

