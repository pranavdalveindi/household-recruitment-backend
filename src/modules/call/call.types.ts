export type CallStatus = 'successful' | 'not_reachable' | 'busy';
export type AppointmentDecision = 'scheduled' | 'rejected';

export interface CallAttempt {
  id: string;
  householdId: string;
  agentId: string;
  agentName?: string;
  callStatus: CallStatus;
  appointmentDecision?: AppointmentDecision | null;
  callStartedAt?: string | null;
  callEndedAt?: string | null;
  callDurationSeconds?: number | null;
  notes?: string | null;
  questionnaireVersionId?: string | null;
  createdAt: string;
}

export interface QuestionnaireAnswerInput {
  questionId: string;
  responseValue: any;
}

export interface RecordCallAttemptInput {
  householdId: string;
  callStatus: CallStatus;
  appointmentDecision?: AppointmentDecision | null;
  callStartedAt?: string;
  callEndedAt?: string;
  callDurationSeconds?: number;
  notes?: string;
  questionnaireVersionId?: string;
  responses?: QuestionnaireAnswerInput[];
}

