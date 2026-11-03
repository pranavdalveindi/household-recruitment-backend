"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installationService = exports.InstallationService = void 0;
const connection_1 = require("../../database/connection");
class InstallationService {
    async tableHasColumn(tableName, columnName) {
        const result = await connection_1.db.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = $1
        AND column_name = $2
    `, [tableName, columnName]);
        return result.rows.length > 0;
    }
    async list(filters, actor) {
        const conditions = [];
        const params = [];
        let paramIndex = 1;
        const hasVisitDate = await this.tableHasColumn('installation_visits', 'visit_date');
        const hasVisitDatetime = await this.tableHasColumn('installation_visits', 'visit_datetime');
        const hasInstallationDate = await this.tableHasColumn('installation_visits', 'installation_date');
        const hasInstallationStatus = await this.tableHasColumn('installation_visits', 'installation_status');
        const hasStatus = await this.tableHasColumn('installation_visits', 'status');
        const hasRejectionReason = await this.tableHasColumn('installation_visits', 'rejection_reason');
        const hasIssueCategory = await this.tableHasColumn('installation_visits', 'issue_category');
        const hasIssueDescription = await this.tableHasColumn('installation_visits', 'issue_description');
        const hasInstallationNotes = await this.tableHasColumn('installation_visits', 'installation_notes');
        const hasNotes = await this.tableHasColumn('installation_visits', 'notes');
        const hasMeterSerial = await this.tableHasColumn('installation_visits', 'meter_serial_number');
        const visitDateColumn = hasVisitDate ? 'iv.visit_date' : hasVisitDatetime ? 'iv.visit_datetime' : hasInstallationDate ? 'iv.installation_date' : 'iv.visit_datetime';
        const statusColumn = hasInstallationStatus ? 'iv.installation_status' : hasStatus ? 'iv.status' : 'iv.installation_status';
        const rejectionReasonColumn = hasRejectionReason ? 'iv.rejection_reason' : 'iv.rejection_reason';
        const issueCategoryColumn = hasIssueCategory ? 'iv.issue_category' : 'iv.issue_category';
        const issueDescriptionColumn = hasIssueDescription ? 'iv.issue_description' : 'iv.issue_description';
        const notesColumn = hasInstallationNotes ? 'iv.installation_notes' : hasNotes ? 'iv.notes' : 'iv.installation_notes';
        const meterSerialColumn = hasMeterSerial ? 'iv.meter_serial_number' : null;
        const meterSerialSelect = meterSerialColumn ? `${meterSerialColumn} as "meterSerialNumber"` : 'NULL as "meterSerialNumber"';
        if (actor.role === 'field_executive') {
            conditions.push(`iv.field_executive_id = $${paramIndex}`);
            params.push(actor.id);
            paramIndex++;
        }
        if (filters.householdId) {
            conditions.push(`iv.household_id = $${paramIndex}`);
            params.push(filters.householdId);
            paramIndex++;
        }
        if (filters.status) {
            conditions.push(`${statusColumn} = $${paramIndex}`);
            params.push(filters.status);
            paramIndex++;
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
      SELECT iv.id, iv.household_id as "householdId", iv.appointment_id as "appointmentId",
             iv.field_executive_id as "fieldExecutiveId", u.name as "fieldExecutiveName",
             ${visitDateColumn} as "visitDate", ${statusColumn} as status, ${rejectionReasonColumn} as "rejectionReason",
             ${issueCategoryColumn} as "issueCategory", ${issueDescriptionColumn} as "issueDescription",
             ${notesColumn} as notes, ${meterSerialSelect},
             iv.created_at as "createdAt", iv.updated_at as "updatedAt"
      FROM installation_visits iv
      LEFT JOIN users u ON iv.field_executive_id = u.id
      ${whereClause}
      ORDER BY ${visitDateColumn} DESC
    `;
        const result = await connection_1.db.query(query, params);
        return result.rows;
    }
    async recordVisit(input, actor) {
        // If appointmentId is provided, verify assignment
        if (input.appointmentId && actor.role === 'field_executive') {
            const apptCheck = await connection_1.db.query('SELECT field_executive_id FROM appointments WHERE id = $1', [input.appointmentId]);
            if (apptCheck.rowCount === 0 || apptCheck.rows[0].field_executive_id !== actor.id) {
                const error = new Error('Access denied: You are not assigned to this appointment');
                error.statusCode = 403;
                throw error;
            }
        }
        return connection_1.db.transaction(async (client) => {
            const hasVisitDate = await this.tableHasColumn('installation_visits', 'visit_date');
            const hasVisitDatetime = await this.tableHasColumn('installation_visits', 'visit_datetime');
            const hasInstallationDate = await this.tableHasColumn('installation_visits', 'installation_date');
            const hasInstallationStatus = await this.tableHasColumn('installation_visits', 'installation_status');
            const hasStatus = await this.tableHasColumn('installation_visits', 'status');
            const hasRejectionReason = await this.tableHasColumn('installation_visits', 'rejection_reason');
            const hasIssueCategory = await this.tableHasColumn('installation_visits', 'issue_category');
            const hasIssueDescription = await this.tableHasColumn('installation_visits', 'issue_description');
            const hasInstallationNotes = await this.tableHasColumn('installation_visits', 'installation_notes');
            const hasNotes = await this.tableHasColumn('installation_visits', 'notes');
            const hasMeterSerial = await this.tableHasColumn('installation_visits', 'meter_serial_number');
            const hasRecordedBy = await this.tableHasColumn('installation_visits', 'recorded_by');
            const hasUpdatedBy = await this.tableHasColumn('installation_visits', 'updated_by');
            const hasAppointmentStatus = await this.tableHasColumn('appointments', 'appointment_status');
            const hasStatusColumn = await this.tableHasColumn('appointments', 'status');
            const visitDateColumn = hasVisitDate ? 'visit_date' : hasVisitDatetime ? 'visit_datetime' : hasInstallationDate ? 'installation_date' : 'visit_datetime';
            const statusColumn = hasInstallationStatus ? 'installation_status' : hasStatus ? 'status' : 'installation_status';
            const rejectionReasonColumn = hasRejectionReason ? 'rejection_reason' : 'rejection_reason';
            const issueCategoryColumn = hasIssueCategory ? 'issue_category' : 'issue_category';
            const issueDescriptionColumn = hasIssueDescription ? 'issue_description' : 'issue_description';
            const notesColumn = hasInstallationNotes ? 'installation_notes' : hasNotes ? 'notes' : 'installation_notes';
            const meterSerialColumn = hasMeterSerial ? 'iv.meter_serial_number' : null;
            const recordedByColumn = hasRecordedBy ? 'recorded_by' : 'field_executive_id';
            const updatedByColumn = hasUpdatedBy ? 'updated_by' : 'field_executive_id';
            const appointmentStatusColumn = hasAppointmentStatus ? 'appointment_status' : hasStatusColumn ? 'status' : 'status';
            const insertColumns = [
                'household_id',
                'appointment_id',
                'field_executive_id',
                visitDateColumn,
                statusColumn,
                rejectionReasonColumn,
                issueCategoryColumn,
                issueDescriptionColumn,
                notesColumn,
                ...(meterSerialColumn ? [meterSerialColumn] : []),
                recordedByColumn,
                updatedByColumn,
            ];
            const values = [
                input.householdId,
                input.appointmentId || null,
                actor.id,
                input.visitDate,
                input.status,
                input.rejectionReason || null,
                input.issueCategory || null,
                input.issueDescription || null,
                input.notes || null,
                ...(meterSerialColumn ? [input.meterSerialNumber || null] : []),
                actor.id,
                actor.id,
            ];
            const selectColumns = [
                'id',
                'household_id as "householdId"',
                'appointment_id as "appointmentId"',
                'field_executive_id as "fieldExecutiveId"',
                `${visitDateColumn} as "visitDate"`,
                `${statusColumn} as status`,
                `${rejectionReasonColumn} as "rejectionReason"`,
                `${issueCategoryColumn} as "issueCategory"`,
                `${issueDescriptionColumn} as "issueDescription"`,
                `${notesColumn} as notes`,
                ...(meterSerialColumn ? [`${meterSerialColumn} as "meterSerialNumber"`] : ['NULL as "meterSerialNumber"']),
                'created_at as "createdAt"',
                'updated_at as "updatedAt"',
            ];
            const insertResult = await client.query(`INSERT INTO installation_visits (
          ${insertColumns.join(', ')}
        ) VALUES (${values.map((_, idx) => `$${idx + 1}`).join(', ')})
        RETURNING ${selectColumns.join(', ')}`, values);
            const visit = insertResult.rows[0];
            // Update appointment status if connected
            if (input.appointmentId) {
                const apptStatus = input.status === 'installed' ? 'completed' : input.status === 'rejected' ? 'rejected' : 'scheduled';
                await client.query(`UPDATE appointments SET ${appointmentStatusColumn} = $1, updated_at = NOW() WHERE id = $2`, [apptStatus, input.appointmentId]);
            }
            // Update household recruitment status
            if (input.status === 'installed') {
                await client.query(`UPDATE households SET recruitment_status = 'installed', updated_at = NOW() WHERE id = $1`, [input.householdId]);
            }
            else if (input.status === 'rejected') {
                // Note: installation rejection is an operational visit failure, not permanent household rejection
                await client.query(`UPDATE households SET recruitment_status = 'contact_in_progress', updated_at = NOW() 
           WHERE id = $1 AND recruitment_status != 'rejected'`, [input.householdId]);
            }
            else if (input.status === 'issue') {
                await client.query(`UPDATE households SET recruitment_status = 'installation_in_progress', updated_at = NOW() 
           WHERE id = $1 AND recruitment_status != 'rejected'`, [input.householdId]);
            }
            return visit;
        });
    }
}
exports.InstallationService = InstallationService;
exports.installationService = new InstallationService();
