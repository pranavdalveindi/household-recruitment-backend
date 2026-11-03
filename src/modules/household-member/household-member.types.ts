export type Gender = 'male' | 'female' | 'other';

export interface HouseholdMember {
  id: string;
  householdId: string;
  name: string;
  age: number;
  gender: Gender;
  relationshipToRespondent: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHouseholdMemberInput {
  householdId: string;
  name: string;
  age: number;
  gender: Gender;
  relationshipToRespondent: string;
}

