export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  regionId?: string;
  agentId?: string;
  fieldExecutiveId?: string;
}

export interface CallReportSummary {
  totalAttempts: number;
  uniqueHouseholdsContacted: number;
  successful: number;
  notReachable: number;
  busy: number;
  scheduledAppointments: number;
  rejectedAppointments: number;
  byAgent: Array<{
    agentId: string;
    agentName: string;
    totalAttempts: number;
    uniqueHouseholds: number;
    successful: number;
  }>;
}

export interface InstallationReportSummary {
  totalVisits: number;
  installedCount: number;
  rejectedCount: number;
  issueCount: number;
  completionRate: number;
  byExecutive: Array<{
    executiveId: string;
    executiveName: string;
    totalVisits: number;
    installed: number;
    rejected: number;
    issues: number;
  }>;
}

