import { Router } from 'express';
import multer from 'multer';
import { importController } from './import.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validate';
import { confirmImportSchema } from './import.validation';
import { asyncHandler } from '../../utils/async-handler';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

export const importRouter = Router();

importRouter.use(authenticate);
importRouter.use(authorize(['admin', 'panel_manager']));

importRouter.get(
  '/batches',
  asyncHandler((req, res) => importController.listBatches(req, res))
);

importRouter.get(
  '/template',
  asyncHandler((req, res) => importController.downloadTemplate(req, res))
);

importRouter.post(
  '/validate',
  upload.single('file'),
  asyncHandler((req, res) => importController.validateCsv(req, res))
);

importRouter.post(
  '/confirm',
  validateRequest({ body: confirmImportSchema }),
  asyncHandler((req, res) => importController.confirmImport(req, res))
);

