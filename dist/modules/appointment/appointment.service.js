"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentService = exports.AppointmentService = void 0;
const connection_1 = require("../../database/connection");
class AppointmentService {
    parseTimeToMinutes(value) {
        const parts = value.split(':');
        const hours = Number(parts[0] || 0);
        const minutes = Number(parts[1] || 0);
        const seconds = Number(parts[2] || 0);
        return hours * 60 + minutes + seconds / 60;
    }
    formatTimeFromMinutes(totalMinutes) {
        const normalized = Math.max(0, Math.round(totalMinutes));
        const hours = Math.floor(normalized / 60) % 24;
        const minutes = normalized % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    }
    ensureValidEndTime(startTime) {
        const startMinutes = this.parseTimeToMinutes(startTime);
        const endMinutes = startMinutes + 60;
        return this.formatTimeFromMinutes(endMinutes);
    }
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
        const hasAppointmentTime = await this.tableHasColumn('appointments', 'appointment_time');
        const hasStartTime = await this.tableHasColumn('appointments', 'start_time');
        const hasAppointmentStatus = await this.tableHasColumn('appointments', 'appointment_status');
        const hasStatus = await this.tableHasColumn('appointments', 'status');
        const timeColumn = hasAppointmentTime ? 'a.appointment_time' : hasStartTime ? 'a.start_time' : 'a.start_time';
        const statusColumn = hasAppointmentStatus ? 'a.appointment_status' : hasStatus ? 'a.status' : 'a.appointment_status';
        // Field executive restriction: only own appointments!
        if (actor.role === 'field_executive') {
            conditions.push(`a.field_executive_id = $${paramIndex}`);
            params.push(actor.id);
            paramIndex++;
        }
        if (filters.householdId) {
            conditions.push(`a.household_id = $${paramIndex}`);
            params.push(filters.householdId);
            paramIndex++;
        }
        if (filters.status) {
            conditions.push(`${statusColumn} = $${paramIndex}`);
            params.push(filters.status);
            paramIndex++;
        }
        if (filters.date) {
            conditions.push(`a.appointment_date = $${paramIndex}`);
            params.push(filters.date);
            paramIndex++;
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
      SELECT a.id, a.household_id as "householdId", a.field_executive_id as "fieldExecutiveId",
             u.name as "fieldExecutiveName", h.hhid as "householdHhid",
             h.respondent_name as "householdName", a.appointment_date as "appointmentDate",
             ${timeColumn} as "appointmentTime", ${statusColumn} as status,
             a.household_instructions as "householdInstructions",
             a.rescheduled_from_appointment_id as "rescheduledFromAppointmentId",
             a.created_by as "createdBy", a.created_at as "createdAt", a.updated_at as "updatedAt"
      FROM appointments a
      LEFT JOIN users u ON a.field_executive_id = u.id
      LEFT JOIN households h ON a.household_id = h.id
      ${whereClause}
      ORDER BY a.appointment_date ASC, ${timeColumn} ASC
    `;
        const result = await connection_1.db.query(query, params);
        return result.rows;
    }
    async getById(id, actor) {
        const hasAppointmentTime = await this.tableHasColumn('appointments', 'appointment_time');
        const hasStartTime = await this.tableHasColumn('appointments', 'start_time');
        const hasAppointmentStatus = await this.tableHasColumn('appointments', 'appointment_status');
        const hasStatus = await this.tableHasColumn('appointments', 'status');
        const timeColumn = hasAppointmentTime ? 'a.appointment_time' : hasStartTime ? 'a.start_time' : 'a.start_time';
        const statusColumn = hasAppointmentStatus ? 'a.appointment_status' : hasStatus ? 'a.status' : 'a.appointment_status';
        const result = await connection_1.db.query(`SELECT a.id, a.household_id as "householdId", a.field_executive_id as "fieldExecutiveId",
              u.name as "fieldExecutiveName", h.hhid as "householdHhid",
              h.respondent_name as "householdName", a.appointment_date as "appointmentDate",
              ${timeColumn} as "appointmentTime", ${statusColumn} as status,
              a.household_instructions as "householdInstructions",
              a.rescheduled_from_appointment_id as "rescheduledFromAppointmentId",
              a.created_by as "createdBy", a.created_at as "createdAt", a.updated_at as "updatedAt"
       FROM appointments a
       LEFT JOIN users u ON a.field_executive_id = u.id
       LEFT JOIN households h ON a.household_id = h.id
       WHERE a.id = $1`, [id]);
        if (result.rowCount === 0) {
            const error = new Error('Appointment not found');
            error.statusCode = 404;
            throw error;
        }
        const appt = result.rows[0];
        // Field executive can only view their own
        if (actor.role === 'field_executive' && appt.fieldExecutiveId !== actor.id) {
            const error = new Error('Access denied: You are not assigned to this appointment');
            error.statusCode = 403;
            throw error;
        }
        return appt;
    }
    async create(input, actor) {
        return connection_1.db.transaction(async (client) => {
            const hasAppointmentTime = await this.tableHasColumn('appointments', 'appointment_time');
            const hasStartTime = await this.tableHasColumn('appointments', 'start_time');
            const hasAppointmentStatus = await this.tableHasColumn('appointments', 'appointment_status');
            const hasStatus = await this.tableHasColumn('appointments', 'status');
            const hasEndTime = await this.tableHasColumn('appointments', 'end_time');
            const hasOldStatus = await this.tableHasColumn('appointment_status_history', 'old_status');
            const hasPreviousStatus = await this.tableHasColumn('appointment_status_history', 'previous_status');
            const hasChangeReason = await this.tableHasColumn('appointment_status_history', 'change_reason');
            const hasNotes = await this.tableHasColumn('appointment_status_history', 'notes');
            const timeColumn = hasAppointmentTime ? 'appointment_time' : hasStartTime ? 'start_time' : 'start_time';
            const statusColumn = hasAppointmentStatus ? 'appointment_status' : hasStatus ? 'status' : 'appointment_status';
            const endTimeValue = this.ensureValidEndTime(input.appointmentTime);
            const insertColumns = [
                'household_id',
                'field_executive_id',
                'appointment_date',
                timeColumn,
                ...(hasEndTime ? ['end_time'] : []),
                statusColumn,
                'household_instructions',
                'created_by',
            ];
            const insertParams = [
                input.householdId,
                input.fieldExecutiveId,
                input.appointmentDate,
                input.appointmentTime,
                ...(hasEndTime ? [endTimeValue] : []),
                'scheduled',
                input.householdInstructions || null,
                actor.id,
            ];
            const insertResult = await client.query(`INSERT INTO appointments (
          ${insertColumns.join(', ')}
        ) VALUES (${insertColumns.map((_, idx) => `$${idx + 1}`).join(', ')})
        RETURNING id, household_id as "householdId", field_executive_id as "fieldExecutiveId",
                  appointment_date as "appointmentDate", ${timeColumn} as "appointmentTime",
                  ${statusColumn} as status, household_instructions as "householdInstructions",
                  rescheduled_from_appointment_id as "rescheduledFromAppointmentId",
                  created_by as "createdBy", created_at as "createdAt", updated_at as "updatedAt"`, insertParams);
            const appt = insertResult.rows[0];
            if (hasOldStatus || hasPreviousStatus) {
                if (hasOldStatus) {
                    await client.query(`INSERT INTO appointment_status_history (appointment_id, old_status, new_status, changed_by, change_reason)
             VALUES ($1, $2, $3, $4, $5)`, [appt.id, null, 'scheduled', actor.id, 'Initial appointment scheduled']);
                }
                else {
                    await client.query(`INSERT INTO appointment_status_history (appointment_id, previous_status, new_status, changed_by, notes)
             VALUES ($1, NULL, 'scheduled', $2, 'Initial appointment scheduled')`, [appt.id, actor.id]);
                }
            }
            else if (hasChangeReason || hasNotes) {
                await client.query(`INSERT INTO appointment_status_history (appointment_id, new_status, changed_by, change_reason)
           VALUES ($1, $2, $3, $4)`, [appt.id, 'scheduled', actor.id, 'Initial appointment scheduled']);
            }
            await client.query(`UPDATE households 
         SET recruitment_status = 'appointment_scheduled', updated_at = NOW()
         WHERE id = $1 AND recruitment_status NOT IN ('installed', 'rejected')`, [input.householdId]);
            return appt;
        });
    }
    async reschedule(appointmentId, input, actor) {
        const existing = await this.getById(appointmentId, actor);
        return connection_1.db.transaction(async (client) => {
            const hasAppointmentStatus = await this.tableHasColumn('appointments', 'appointment_status');
            const hasStatus = await this.tableHasColumn('appointments', 'status');
            const statusColumn = hasAppointmentStatus ? 'appointment_status' : hasStatus ? 'status' : 'appointment_status';
            const hasAppointmentTime = await this.tableHasColumn('appointments', 'appointment_time');
            const hasStartTime = await this.tableHasColumn('appointments', 'start_time');
            const hasEndTime = await this.tableHasColumn('appointments', 'end_time');
            const timeColumn = hasAppointmentTime ? 'appointment_time' : hasStartTime ? 'start_time' : 'start_time';
            const hasOldStatus = await this.tableHasColumn('appointment_status_history', 'old_status');
            const hasPreviousStatus = await this.tableHasColumn('appointment_status_history', 'previous_status');
            const hasChangeReason = await this.tableHasColumn('appointment_status_history', 'change_reason');
            const hasNotes = await this.tableHasColumn('appointment_status_history', 'notes');
            const endTimeValue = this.ensureValidEndTime(input.appointmentTime);
            await client.query(`UPDATE appointments SET ${statusColumn} = 'rescheduled', updated_at = NOW() WHERE id = $1`, [appointmentId]);
            if (hasOldStatus || hasPreviousStatus) {
                if (hasOldStatus) {
                    await client.query(`INSERT INTO appointment_status_history (appointment_id, old_status, new_status, changed_by, change_reason)
             VALUES ($1, $2, $3, $4, $5)`, [appointmentId, existing.status, 'rescheduled', actor.id, input.reason || 'Appointment rescheduled']);
                }
                else {
                    await client.query(`INSERT INTO appointment_status_history (appointment_id, previous_status, new_status, changed_by, notes)
             VALUES ($1, $2, 'rescheduled', $3, $4)`, [appointmentId, existing.status, actor.id, input.reason || 'Appointment rescheduled']);
                }
            }
            else if (hasChangeReason || hasNotes) {
                await client.query(`INSERT INTO appointment_status_history (appointment_id, new_status, changed_by, change_reason)
           VALUES ($1, 'rescheduled', $2, $3)`, [appointmentId, actor.id, input.reason || 'Appointment rescheduled']);
            }
            const newExecId = input.fieldExecutiveId || existing.fieldExecutiveId;
            const newInstructions = input.householdInstructions || existing.householdInstructions;
            const insertColumns = [
                'household_id',
                'field_executive_id',
                'appointment_date',
                timeColumn,
                ...(hasEndTime ? ['end_time'] : []),
                statusColumn,
                'household_instructions',
                'rescheduled_from_appointment_id',
                'created_by',
            ];
            const insertParams = [
                existing.householdId,
                newExecId,
                input.appointmentDate,
                input.appointmentTime,
                ...(hasEndTime ? [endTimeValue] : []),
                'scheduled',
                newInstructions,
                appointmentId,
                actor.id,
            ];
            const insertResult = await client.query(`INSERT INTO appointments (
          ${insertColumns.join(', ')}
        ) VALUES (${insertColumns.map((_, idx) => `$${idx + 1}`).join(', ')})
        RETURNING id, household_id as "householdId", field_executive_id as "fieldExecutiveId",
                  appointment_date as "appointmentDate", ${timeColumn} as "appointmentTime",
                  ${statusColumn} as status, household_instructions as "householdInstructions",
                  rescheduled_from_appointment_id as "rescheduledFromAppointmentId",
                  created_by as "createdBy", created_at as "createdAt", updated_at as "updatedAt"`, insertParams);
            const newAppt = insertResult.rows[0];
            if (hasOldStatus || hasPreviousStatus) {
                if (hasOldStatus) {
                    await client.query(`INSERT INTO appointment_status_history (appointment_id, old_status, new_status, changed_by, change_reason)
             VALUES ($1, $2, $3, $4, $5)`, [newAppt.id, null, 'scheduled', actor.id, 'Rescheduled appointment created']);
                }
                else {
                    await client.query(`INSERT INTO appointment_status_history (appointment_id, previous_status, new_status, changed_by, notes)
             VALUES ($1, NULL, 'scheduled', $2, 'Rescheduled appointment created')`, [newAppt.id, actor.id]);
                }
            }
            else if (hasChangeReason || hasNotes) {
                await client.query(`INSERT INTO appointment_status_history (appointment_id, new_status, changed_by, change_reason)
           VALUES ($1, 'scheduled', $2, $3)`, [newAppt.id, actor.id, 'Rescheduled appointment created']);
            }
            return newAppt;
        });
    }
}
exports.AppointmentService = AppointmentService;
exports.appointmentService = new AppointmentService();
