export interface HouseholdRejection {
  id: string;
  householdId: string;
  hhid: string;
  rejectedBy: string;
  rejectedByName?: string;
  reason: string;
  demographicSnapshot: {
    regionId: string;
    regionName: string;
    sec: number;
    mosr: number;
    memberCount: number;
    ageComposition: { min: number; max: number; avg: number };
    genderComposition: Record<string, number>;
  };
  rejectionDate: string;
  createdAt: string;
}

export interface PermanentRejectionInput {
  householdId: string;
  reason: string;
}

export interface ReplacementMatchCriteria {
  householdId: string;
  matchThreshold?: number;
}

