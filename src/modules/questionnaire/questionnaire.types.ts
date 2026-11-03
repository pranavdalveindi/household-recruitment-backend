export type QuestionType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'single_choice'
  | 'multiple_choice'
  | 'date';

export interface QuestionnaireVersion {
  id: string;
  versionNumber: number;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface QuestionnaireQuestion {
  id: string;
  questionnaireVersionId: string;
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  isRequired: boolean;
  displayOrder: number;
  isActive: boolean;
}

