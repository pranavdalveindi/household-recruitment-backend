export interface Region {
  id: string;
  name: string;
  code: string;
  state: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegionInput {
  name: string;
  code: string;
  state: string;
}

export interface UpdateRegionInput {
  name?: string;
  code?: string;
  state?: string;
  isActive?: boolean;
}

