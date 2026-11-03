"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = exports.ReportService = void 0;
const connection_1 = require("../../database/connection");
class ReportService {
    async getCallReport(filter) {
        const conditions = [];
        const params = [];
        let paramIndex = 1;
        if (filter.startDate) {
            conditions.push(`c.created_at >= $${paramIndex}`);
            params.push(filter.startDate);
            paramIndex++;
        }
        if (filter.endDate) {
            conditions.push(`c.created_at <= $${paramIndex}`);
            params.push(filter.endDate);
            paramIndex++;
        }
        if (filter.agentId) {
            conditions.push(`c.agent_id = $${paramIndex}`);
            params.push(filter.agentId);
            paramIndex++;
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const overall = await connection_1.db.query(`SELECT 
         COUNT(*) as total_attempts,
         COUNT(DISTINCT c.household_id) as unique_households,
         COUNT(CASE WHEN c.call_status = 'successful' THEN 1 END) as successful,
         COUNT(CASE WHEN c.call_status = 'not_reachable' THEN 1 END) as not_reachable,
         COUNT(CASE WHEN c.call_status = 'busy' THEN 1 END) as busy,
         COUNT(CASE WHEN c.appointment_decision = 'scheduled' THEN 1 END) as scheduled,
         COUNT(CASE WHEN c.appointment_decision = 'rejected' THEN 1 END) as rejected
       FROM call_attempts c
       ${whereClause}`, params);
        const byAgent = await connection_1.db.query(`SELECT 
         c.agent_id as "agentId",
         u.name as "agentName",
         COUNT(*) as "totalAttempts",
         COUNT(DISTINCT c.household_id) as "uniqueHouseholds",
         COUNT(CASE WHEN c.call_status = 'successful' THEN 1 END) as successful
       FROM call_attempts c
       LEFT JOIN users u ON c.agent_id = u.id
       ${whereClause}
       GROUP BY c.agent_id, u.name
       ORDER BY "totalAttempts" DESC`, params);
        const row = overall.rows[0];
        return {
            totalAttempts: parseInt(row.total_attempts, 10),
            uniqueHouseholdsContacted: parseInt(row.unique_households, 10),
            successful: parseInt(row.successful, 10),
            notReachable: parseInt(row.not_reachable, 10),
            busy: parseInt(row.busy, 10),
            scheduledAppointments: parseInt(row.scheduled, 10),
            rejectedAppointments: parseInt(row.rejected, 10),
            byAgent: byAgent.rows.map((r) => ({
                agentId: r.agentId,
                agentName: r.agentName,
                totalAttempts: parseInt(r.totalAttempts, 10),
                uniqueHouseholds: parseInt(r.uniqueHouseholds, 10),
                successful: parseInt(r.successful, 10),
            })),
        };
    }
    async getInstallationReport(filter) {
        const conditions = [];
        const params = [];
        let paramIndex = 1;
        if (filter.startDate) {
            conditions.push(`iv.visit_date >= $${paramIndex}`);
            params.push(filter.startDate);
            paramIndex++;
        }
        if (filter.endDate) {
            conditions.push(`iv.visit_date <= $${paramIndex}`);
            params.push(filter.endDate);
            paramIndex++;
        }
        if (filter.fieldExecutiveId) {
            conditions.push(`iv.field_executive_id = $${paramIndex}`);
            params.push(filter.fieldExecutiveId);
            paramIndex++;
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const overall = await connection_1.db.query(`SELECT 
         COUNT(*) as total_visits,
         COUNT(CASE WHEN iv.status = 'installed' THEN 1 END) as installed,
         COUNT(CASE WHEN iv.status = 'rejected' THEN 1 END) as rejected,
         COUNT(CASE WHEN iv.status = 'issue' THEN 1 END) as issue
       FROM installation_visits iv
       ${whereClause}`, params);
        const byExec = await connection_1.db.query(`SELECT 
         iv.field_executive_id as "executiveId",
         u.name as "executiveName",
         COUNT(*) as "totalVisits",
         COUNT(CASE WHEN iv.status = 'installed' THEN 1 END) as installed,
         COUNT(CASE WHEN iv.status = 'rejected' THEN 1 END) as rejected,
         COUNT(CASE WHEN iv.status = 'issue' THEN 1 END) as issues
       FROM installation_visits iv
       LEFT JOIN users u ON iv.field_executive_id = u.id
       ${whereClause}
       GROUP BY iv.field_executive_id, u.name
       ORDER BY "totalVisits" DESC`, params);
        const row = overall.rows[0];
        const totalVisits = parseInt(row.total_visits, 10);
        const installed = parseInt(row.installed, 10);
        return {
            totalVisits,
            installedCount: installed,
            rejectedCount: parseInt(row.rejected, 10),
            issueCount: parseInt(row.issue, 10),
            completionRate: totalVisits > 0 ? Math.round((installed / totalVisits) * 100) : 0,
            byExecutive: byExec.rows.map((r) => ({
                executiveId: r.executiveId,
                executiveName: r.executiveName,
                totalVisits: parseInt(r.totalVisits, 10),
                installed: parseInt(r.installed, 10),
                rejected: parseInt(r.rejected, 10),
                issues: parseInt(r.issues, 10),
            })),
        };
    }
}
exports.ReportService = ReportService;
exports.reportService = new ReportService();
