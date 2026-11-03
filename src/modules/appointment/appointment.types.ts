export type AppointmentStatus =
  | 'scheduled'
  | 'rescheduled'
  | 'cancelled'
  | 'completed'
  | 'rejected';

export interface Appointment {
  id: string;
  householdId: string;
  fieldExecutiveId: string;
  fieldExecutiveName?: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  householdInstructions?: string | null;
  rescheduledFromAppointmentId?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentInput {
  householdId: string;
  fieldExecutiveId: string;
  appointmentDate: string;
  appointmentTime: string;
  householdInstructions?: string;
}

export interface RescheduleAppointmentInput {
  fieldExecutiveId?: string;
  appointmentDate: string;
  appointmentTime: string;
  householdInstructions?: string;
  reason?: string;
}

