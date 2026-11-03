import { UserRole } from '../../types/common.types';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  regionId?: string | null;
  regionName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  regionId?: string | null;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  regionId?: string | null;
}

