import { Request, Response } from 'express';
import { questionnaireService } from './questionnaire.service';
import { ApiResponder } from '../../utils/api-response';

export class QuestionnaireController {
  async getActive(req: Request, res: Response): Promise<void> {
    const active = await questionnaireService.getActiveVersion();
    ApiResponder.success(res, active);
  }

  async getAllVersions(req: Request, res: Response): Promise<void> {
    const versions = await questionnaireService.getAllVersions();
    ApiResponder.success(res, versions);
  }
}

export const questionnaireController = new QuestionnaireController();

