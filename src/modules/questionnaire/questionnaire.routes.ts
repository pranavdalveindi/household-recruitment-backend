import { Router } from 'express';
import { questionnaireController } from './questionnaire.controller';
import { authenticate } from '../../middleware/authenticate';
import { asyncHandler } from '../../utils/async-handler';

export const questionnaireRouter = Router();

questionnaireRouter.use(authenticate);

questionnaireRouter.get(
  '/active',
  asyncHandler((req, res) => questionnaireController.getActive(req, res))
);

questionnaireRouter.get(
  '/versions',
  asyncHandler((req, res) => questionnaireController.getAllVersions(req, res))
);

