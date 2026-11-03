export type RecruitmentStatus =
  | 'not_contacted'
  | 'contact_in_progress'
  | 'appointment_pending'
  | 'appointment_scheduled'
  | 'installation_in_progress'
  | 'installed'
  | 'rejected';

export interface Household {
  id: string;
  hhid: string;
  respondentName: string;
  contactNumber: string;
  alternateContactNumber?: string | null;
  address: string;
  landmark?: string | null;
  city: string;
  regionId: string;
  regionName?: string;
  location?: string | null;
  sec: number;
  mosr: number;
  recruitmentStatus: RecruitmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HouseholdFilterParams {
  search?: string;
  regionId?: string;
  recruitmentStatus?: RecruitmentStatus;
  sec?: number;
  mosr?: number;
  page?: number;
  limit?: number;
}

