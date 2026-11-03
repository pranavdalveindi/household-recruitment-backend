import { AuthUser, UserRole } from '../../types/common.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    regionId?: string | null;
  };
  token: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

