import { Request, Response } from 'express';
import { regionService } from './region.service';
import { ApiResponder } from '../../utils/api-response';

export class RegionController {
  async getAll(_req: Request, res: Response): Promise<void> {
    const regions = await regionService.getAll();
    ApiResponder.success(res, regions);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const region = await regionService.getById(req.params.id);
    ApiResponder.success(res, region);
  }

  async create(req: Request, res: Response): Promise<void> {
    const region = await regionService.create(req.body);
    ApiResponder.created(res, region, 'Region created successfully');
  }

  async update(req: Request, res: Response): Promise<void> {
    const region = await regionService.update(req.params.id, req.body);
    ApiResponder.success(res, region, 'Region updated successfully');
  }
}

export const regionController = new RegionController();

