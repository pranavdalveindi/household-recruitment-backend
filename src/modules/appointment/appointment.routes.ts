import { Router } from 'express';
import { appointmentController } from './appointment.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validate';
import { createAppointmentSchema, rescheduleAppointmentSchema } from './appointment.validation';
import { asyncHandler } from '../../utils/async-handler';

export const appointmentRouter = Router();

appointmentRouter.use(authenticate);

appointmentRouter.get(
  '/',
  asyncHandler((req, res) => appointmentController.list(req, res))
);

appointmentRouter.get(
  '/:id',
  asyncHandler((req, res) => appointmentController.getById(req, res))
);

// Only Call Center Agent, Panel Manager, and Admin can schedule or reschedule
appointmentRouter.post(
  '/',
  authorize(['admin', 'panel_manager', 'call_center_agent']),
  validateRequest({ body: createAppointmentSchema }),
  asyncHandler((req, res) => appointmentController.create(req, res))
);

appointmentRouter.post(
  '/:id/reschedule',
  authorize(['admin', 'panel_manager', 'call_center_agent']),
  validateRequest({ body: rescheduleAppointmentSchema }),
  asyncHandler((req, res) => appointmentController.reschedule(req, res))
);

