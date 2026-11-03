import { db } from '../../database/connection';
import { AuthUser } from '../../types/common.types';
import { AdminDashboardData, CallCenterDashboardData, FieldExecutiveDashboardData } from './dashboard.types';

export class DashboardService {
  private async tableHasColumn(tableName: string, columnName: string): Promise<boolean> {
    const result = await db.query<{ column_name: string }>(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = $1
        AND column_name = $2
    `, [tableName, columnName]);

    return result.rows.length > 0;
  }

  async getDashboard(actor: AuthUser): Promise<any> {
    switch (actor.role) {
      case 'admin':
      case 'panel_manager':
        return this.getAdminDashboard();
      case 'call_center_agent':
        return this.getCallCenterDashboard(actor.id);
      case 'field_executive':
        return this.getFieldExecutiveDashboard(actor.id);
      default:
        return {};
    }
  }

  private async getAdminDashboard(): Promise<AdminDashboardData> {
    const totalHh = await db.query('SELECT COUNT(*) as count FROM households');
    const statusCounts = await db.query(
      `SELECT recruitment_status, COUNT(*) as count 
       FROM households 
       GROUP BY recruitment_status`
    );

    const statusMap: Record<string, number> = {};
    statusCounts.rows.forEach((r) => {
      statusMap[r.recruitment_status] = parseInt(r.count, 10);
    });

    const hasAppointmentStatus = await this.tableHasColumn('appointments', 'appointment_status');
    const hasStatus = await this.tableHasColumn('appointments', 'status');
    const apptStatusColumn = hasAppointmentStatus ? 'appointment_status' : hasStatus ? 'status' : 'appointment_status';

    const hasInstallationStatus = await this.tableHasColumn('installation_visits', 'installation_status');
    const hasVisitStatus = await this.tableHasColumn('installation_visits', 'status');
    const installationStatusColumn = hasInstallationStatus ? 'installation_status' : hasVisitStatus ? 'status' : 'installation_status';

    const callStats = await db.query(
      `SELECT 
         COUNT(*) as total, 
         COUNT(CASE WHEN call_status = 'successful' THEN 1 END) as successful 
       FROM call_attempts`
    );

    const apptStats = await db.query(`SELECT COUNT(*) as count FROM appointments`);
    const instStats = await db.query(`SELECT COUNT(*) as count FROM installation_visits WHERE ${installationStatusColumn} = 'installed'`);
    const rejStats = await db.query('SELECT COUNT(*) as count FROM household_rejections');

    const regional = await db.query(
      `SELECT r.name as "regionName", 
              COUNT(h.id) as total,
              COUNT(CASE WHEN h.recruitment_status = 'installed' THEN 1 END) as installed
       FROM regions r
       LEFT JOIN households h ON r.id = h.region_id
       GROUP BY r.name
       ORDER BY r.name ASC`
    );

    return {
      totalHouseholds: parseInt(totalHh.rows[0].count, 10),
      statusBreakdown: statusMap,
      totalCallAttempts: parseInt(callStats.rows[0].total, 10),
      successfulCalls: parseInt(callStats.rows[0].successful, 10),
      totalAppointments: parseInt(apptStats.rows[0].count, 10),
      completedInstallations: parseInt(instStats.rows[0].count, 10),
      rejectedHouseholds: parseInt(rejStats.rows[0].count, 10),
      regionalProgress: regional.rows.map((r) => ({
        regionName: r.regionName,
        total: parseInt(r.total, 10),
        installed: parseInt(r.installed, 10),
      })),
    };
  }

  private async getCallCenterDashboard(agentId: string): Promise<CallCenterDashboardData> {
    const today = new Date().toISOString().slice(0, 10);
    const hasCallDatetime = await this.tableHasColumn('call_attempts', 'call_datetime');
    const hasCreatedAt = await this.tableHasColumn('call_attempts', 'created_at');
    const hasAppointmentDecision = await this.tableHasColumn('call_attempts', 'appointment_decision');

    const timestampColumn = hasCallDatetime ? 'call_datetime' : hasCreatedAt ? 'created_at' : 'created_at';
    const appointmentDecisionColumn = hasAppointmentDecision ? 'appointment_decision' : 'NULL::text';

    const stats = await db.query(
      `SELECT
         COALESCE(COUNT(*), 0)::int as total,
         COALESCE(COUNT(CASE WHEN call_status = 'successful' THEN 1 END), 0)::int as successful,
         COALESCE(COUNT(CASE WHEN call_status = 'not_reachable' THEN 1 END), 0)::int as not_reachable,
         COALESCE(COUNT(CASE WHEN call_status = 'busy' THEN 1 END), 0)::int as busy,
         COALESCE(COUNT(CASE WHEN ${appointmentDecisionColumn} IS NOT NULL AND ${appointmentDecisionColumn} = 'scheduled' THEN 1 END), 0)::int as appts
       FROM call_attempts
       WHERE agent_id = $1 AND DATE(${timestampColumn}) = $2`,
      [agentId, today]
    );

    const eligible = await db.query(
      "SELECT COUNT(*) as count FROM households WHERE recruitment_status IN ('not_contacted', 'contact_in_progress')"
    );

    const row = stats.rows[0] || { total: 0, successful: 0, not_reachable: 0, busy: 0, appts: 0 };
    return {
      assignedHouseholdsCount: parseInt(eligible.rows[0]?.count ?? '0', 10),
      callsMadeToday: parseInt(row.total ?? '0', 10),
      successfulCallsToday: parseInt(row.successful ?? '0', 10),
      notReachableToday: parseInt(row.not_reachable ?? '0', 10),
      busyToday: parseInt(row.busy ?? '0', 10),
      appointmentsScheduledToday: parseInt(row.appts ?? '0', 10),
    };
  }

  private async getFieldExecutiveDashboard(executiveId: string): Promise<FieldExecutiveDashboardData> {
    const today = new Date().toISOString().slice(0, 10);

    const hasAppointmentStatus = await this.tableHasColumn('appointments', 'appointment_status');
    const hasStatus = await this.tableHasColumn('appointments', 'status');
    const apptStatusColumn = hasAppointmentStatus ? 'appointment_status' : hasStatus ? 'status' : 'appointment_status';

    const hasInstallationStatus = await this.tableHasColumn('installation_visits', 'installation_status');
    const hasVisitStatus = await this.tableHasColumn('installation_visits', 'status');
    const installationStatusColumn = hasInstallationStatus ? 'installation_status' : hasVisitStatus ? 'status' : 'installation_status';

    const appts = await db.query(
      `SELECT 
         COUNT(CASE WHEN appointment_date = $1 THEN 1 END) as today_count,
         COUNT(CASE WHEN appointment_date > $1 THEN 1 END) as upcoming_count
       FROM appointments
       WHERE field_executive_id = $2 AND ${apptStatusColumn} = 'scheduled'`,
      [today, executiveId]
    );

    const visits = await db.query(
      `SELECT 
         COUNT(CASE WHEN ${installationStatusColumn} = 'installed' THEN 1 END) as installed_count,
         COUNT(CASE WHEN ${installationStatusColumn} = 'rejected' THEN 1 END) as rejected_count,
         COUNT(CASE WHEN ${installationStatusColumn} = 'issue' THEN 1 END) as issue_count
       FROM installation_visits
       WHERE field_executive_id = $1`,
      [executiveId]
    );

    return {
      todaysAppointments: parseInt(appts.rows[0].today_count, 10),
      upcomingAppointments: parseInt(appts.rows[0].upcoming_count, 10),
      completedInstallations: parseInt(visits.rows[0].installed_count, 10),
      rejectedVisits: parseInt(visits.rows[0].rejected_count, 10),
      issuesReported: parseInt(visits.rows[0].issue_count, 10),
    };
  }
}

export const dashboardService = new DashboardService();

