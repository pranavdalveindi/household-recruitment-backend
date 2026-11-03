import { Request, Response } from 'express';
import { householdMemberService } from './household-member.service';
import { ApiResponder } from '../../utils/api-response';

export class HouseholdMemberController {
  async getByHouseholdId(req: Request, res: Response): Promise<void> {
    const members = await householdMemberService.getByHouseholdId(req.params.householdId);
    ApiResponder.success(res, members);
  }

  async create(req: Request, res: Response): Promise<void> {
    const member = await householdMemberService.create(req.body);
    ApiResponder.created(res, member, 'Household member added successfully');
  }
}

export const householdMemberController = new HouseholdMemberController();

