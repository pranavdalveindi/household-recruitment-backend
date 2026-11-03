export interface AdminDashboardData {
  totalHouseholds: number;
  statusBreakdown: Record<string, number>;
  totalCallAttempts: number;
  successfulCalls: number;
  totalAppointments: number;
  completedInstallations: number;
  rejectedHouseholds: number;
  regionalProgress: Array<{ regionName: string; total: number; installed: number }>;
}

export interface CallCenterDashboardData {
  assignedHouseholdsCount: number;
  callsMadeToday: number;
  successfulCallsToday: number;
  notReachableToday: number;
  busyToday: number;
  appointmentsScheduledToday: number;
}

export interface FieldExecutiveDashboardData {
  todaysAppointments: number;
  upcomingAppointments: number;
  completedInstallations: number;
  rejectedVisits: number;
  issuesReported: number;
}

