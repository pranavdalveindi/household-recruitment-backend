export interface ParsedCsvMember {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  relationshipToRespondent: string;
}

export interface ParsedHouseholdRow {
  rowIndex: number;
  hhid: string;
  respondentName: string;
  contactNumber: string;
  alternateContactNumber?: string;
  address: string;
  landmark?: string;
  city: string;
  region: string;
  location?: string;
  sec: number;
  mosr: number;
  members: ParsedCsvMember[];
  isValid: boolean;
  errors: string[];
}

export interface ImportValidationResult {
  totalRows: number;
  validRowsCount: number;
  invalidRowsCount: number;
  preview: ParsedHouseholdRow[];
}

export interface ImportBatch {
  id: string;
  filename: string;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  importedBy: string;
  importedByName?: string;
  createdAt: string;
}

