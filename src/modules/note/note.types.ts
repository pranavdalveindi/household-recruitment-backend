export type NoteType =
  | 'general'
  | 'contact_instruction'
  | 'installation_instruction'
  | 'other';

export interface HouseholdNote {
  id: string;
  householdId: string;
  authorId: string;
  authorName?: string;
  noteType: NoteType;
  content: string;
  createdAt: string;
}

export interface CreateNoteInput {
  householdId: string;
  noteType: NoteType;
  content: string;
}

