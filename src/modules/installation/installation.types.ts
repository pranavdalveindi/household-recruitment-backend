export type InstallationStatus = 'pending' | 'installed' | 'rejected' | 'issue';

export interface InstallationVisit {
  id: string;
  householdId: string;
  appointmentId?: string | null;
  fieldExecutiveId: string;
  fieldExecutiveName?: string;
  visitDate: string;
  status: InstallationStatus;
  rejectionReason?: string | null;
  issueCategory?: string | null;
  issueDescription?: string | null;
  notes?: string | null;
  meterSerialNumber?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecordInstallationInput {
  householdId: string;
  appointmentId?: string | null;
  visitDate: string;
  status: InstallationStatus;
  rejectionReason?: string | null;
  issueCategory?: string | null;
  issueDescription?: string | null;
  notes?: string | null;
  meterSerialNumber?: string | null;
}

