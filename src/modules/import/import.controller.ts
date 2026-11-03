import { Request, Response } from 'express';
import { importService } from './import.service';
import { ApiResponder } from '../../utils/api-response';

export class ImportController {
  async listBatches(_req: Request, res: Response): Promise<void> {
    const batches = await importService.listBatches();
    ApiResponder.success(res, batches);
  }

  async validateCsv(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      ApiResponder.error(res, 'No CSV file uploaded', 400);
      return;
    }

    const validation = await importService.validateCsv(req.file.buffer);
    ApiResponder.success(res, validation, 'CSV validated successfully');
  }

  async confirmImport(req: Request, res: Response): Promise<void> {
    const { filename, rows } = req.body;
    const result = await importService.confirmImport(filename, rows, req.user!);
    ApiResponder.created(res, result, 'Households imported successfully');
  }

  async downloadTemplate(_req: Request, res: Response): Promise<void> {
    const headers = [
      'hhid',
      'respondant_name',
      'respondent_name',
      'contact_number',
      'alternate_contact_number',
      'address',
      'landmark',
      'city',
      'region',
      'location',
      'sec',
      'mosr',
      'member_1_name',
      'member_1_age',
      'member_1_gender',
      'member_1_relationship_to_respondent',
      'member_2_name',
      'member_2_age',
      'member_2_gender',
      'member_2_relationship_to_respondent',
    ];

    const sampleRow = [
      'HH1001',
      'Rajesh Sharma',
      'Rajesh Sharma',
      '+919876543210',
      '+919876543211',
      'Flat 402, Sunshine Apts',
      'Near Metro Station',
      'Mumbai',
      'West Zone',
      'Andheri West',
      '1',
      '3',
      'Sunita Sharma',
      '38',
      'female',
      'Wife',
      'Aarav Sharma',
      '12',
      'male',
      'Son',
    ];

    const csvContent = `${headers.join(',')}\n${sampleRow.join(',')}\n`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="household_recruitment_template.csv"');
    res.status(200).send(csvContent);
  }
}

export const importController = new ImportController();

