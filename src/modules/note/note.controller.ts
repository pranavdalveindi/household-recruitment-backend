import { Request, Response } from 'express';
import { noteService } from './note.service';
import { ApiResponder } from '../../utils/api-response';

export class NoteController {
  async getByHouseholdId(req: Request, res: Response): Promise<void> {
    const notes = await noteService.getByHouseholdId(req.params.householdId);
    ApiResponder.success(res, notes);
  }

  async create(req: Request, res: Response): Promise<void> {
    const note = await noteService.create(req.body, req.user!);
    ApiResponder.created(res, note, 'Note added successfully');
  }
}

export const noteController = new NoteController();

