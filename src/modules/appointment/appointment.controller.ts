import { Request, Response } from 'express';
import { appointmentService } from './appointment.service';
import { ApiResponder } from '../../utils/api-response';

export class AppointmentController {
  async list(req: Request, res: Response): Promise<void> {
    const appointments = await appointmentService.list(req.query as any, req.user!);
    ApiResponder.success(res, appointments);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const appt = await appointmentService.getById(req.params.id, req.user!);
    ApiResponder.success(res, appt);
  }

  async create(req: Request, res: Response): Promise<void> {
    const appt = await appointmentService.create(req.body, req.user!);
    ApiResponder.created(res, appt, 'Appointment scheduled successfully');
  }

  async reschedule(req: Request, res: Response): Promise<void> {
    const appt = await appointmentService.reschedule(req.params.id, req.body, req.user!);
    ApiResponder.success(res, appt, 'Appointment rescheduled successfully');
  }
}

export const appointmentController = new AppointmentController();

