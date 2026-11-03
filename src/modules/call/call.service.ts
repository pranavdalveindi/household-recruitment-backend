import { db } from '../../database/connection';
import { AuthUser } from '../../types/common.types';
import { CallAttempt, RecordCallAttemptInput } from './call.types';

export class CallService {
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

  async getByHouseholdId(householdId: string): Promise<CallAttempt[]> {
    const hasCallStartedAt = await this.tableHasColumn('call_attempts', 'call_started_at');
    const hasCallEndedAt = await this.tableHasColumn('call_attempts', 'call_ended_at');
    const hasCallDuration = await this.tableHasColumn('call_attempts', 'call_duration_seconds');
    const hasAppointmentDecision = await this.tableHasColumn('call_attempts', 'appointment_decision');
    const hasCallNotes = await this.tableHasColumn('call_attempts', 'call_notes');
    const hasNotes = await this.tableHasColumn('call_attempts', 'notes');
    const hasCallDatetime = await this.tableHasColumn('call_attempts', 'call_datetime');
    const hasCreatedAt = await this.tableHasColumn('call_attempts', 'created_at');

    const selectCols = [
      'c.id',
      'c.household_id as "householdId"',
      'c.agent_id as "agentId"',
      'u.name as "agentName"',
      'c.call_status as "callStatus"',
      hasAppointmentDecision ? 'c.appointment_decision as "appointmentDecision"' : 'NULL as "appointmentDecision"',
      hasCallStartedAt ? 'c.call_started_at as "callStartedAt"' : 'NULL as "callStartedAt"',
      hasCallEndedAt ? 'c.call_ended_at as "callEndedAt"' : 'NULL as "callEndedAt"',
      hasCallDuration ? 'c.call_duration_seconds as "callDurationSeconds"' : 'NULL as "callDurationSeconds"',
      hasCallNotes ? 'c.call_notes as "notes"' : hasNotes ? 'c.notes as "notes"' : 'NULL as "notes"',
      'c.questionnaire_version_id as "questionnaireVersionId"',
      hasCallDatetime ? 'c.call_datetime as "createdAt"' : hasCreatedAt ? 'c.created_at as "createdAt"' : 'NULL as "createdAt"',
    ].join(', ');

    const result = await db.query<CallAttempt>(
      `SELECT ${selectCols}
       FROM call_attempts c
       LEFT JOIN users u ON c.agent_id = u.id
       WHERE c.household_id = $1
       ORDER BY ${hasCallDatetime ? 'c.call_datetime' : 'c.created_at'} DESC`,
      [householdId]
    );
    return result.rows;
  }

  async recordAttempt(input: RecordCallAttemptInput, agent: AuthUser): Promise<CallAttempt> {
    return db.transaction(async (client) => {
      const hasCallStartedAt = await this.tableHasColumn('call_attempts', 'call_started_at');
      const hasCallEndedAt = await this.tableHasColumn('call_attempts', 'call_ended_at');
      const hasCallDuration = await this.tableHasColumn('call_attempts', 'call_duration_seconds');
      const hasAppointmentDecision = await this.tableHasColumn('call_attempts', 'appointment_decision');
      const hasQuestionnaireVersion = await this.tableHasColumn('call_attempts', 'questionnaire_version_id');
      const hasCallNotes = await this.tableHasColumn('call_attempts', 'call_notes');
      const hasNotes = await this.tableHasColumn('call_attempts', 'notes');
      const hasCallDatetime = await this.tableHasColumn('call_attempts', 'call_datetime');

      const insertColumns = [
        'household_id',
        'agent_id',
        'call_status',
        ...(hasAppointmentDecision ? ['appointment_decision'] : []),
        ...(hasCallStartedAt ? ['call_started_at'] : []),
        ...(hasCallEndedAt ? ['call_ended_at'] : []),
        ...(hasCallDuration ? ['call_duration_seconds'] : []),
        ...(hasCallNotes ? ['call_notes'] : hasNotes ? ['notes'] : []),
        ...(hasCallDatetime ? ['call_datetime'] : []),
        ...(hasQuestionnaireVersion ? ['questionnaire_version_id'] : []),
      ];

      const insertValues = [
        input.householdId,
        agent.id,
        input.callStatus,
        ...(hasAppointmentDecision ? [input.appointmentDecision || null] : []),
        ...(hasCallStartedAt ? [input.callStartedAt || null] : []),
        ...(hasCallEndedAt ? [input.callEndedAt || null] : []),
        ...(hasCallDuration ? [input.callDurationSeconds || null] : []),
        ...(hasCallNotes || hasNotes ? [input.notes || null] : []),
        ...(hasCallDatetime ? [(input.callStartedAt || new Date().toISOString())] : []),
        ...(hasQuestionnaireVersion ? [input.questionnaireVersionId || null] : []),
      ];

      const selectColumns = [
        'id',
        'household_id as "householdId"',
        'agent_id as "agentId"',
        'call_status as "callStatus"',
        ...(hasAppointmentDecision ? ['appointment_decision as "appointmentDecision"'] : ['NULL as "appointmentDecision"']),
        ...(hasCallStartedAt ? ['call_started_at as "callStartedAt"'] : ['NULL as "callStartedAt"']),
        ...(hasCallEndedAt ? ['call_ended_at as "callEndedAt"'] : ['NULL as "callEndedAt"']),
        ...(hasCallDuration ? ['call_duration_seconds as "callDurationSeconds"'] : ['NULL as "callDurationSeconds"']),
        hasCallNotes ? 'call_notes as "notes"' : hasNotes ? 'notes as "notes"' : 'NULL as "notes"',
        ...(hasQuestionnaireVersion ? ['questionnaire_version_id as "questionnaireVersionId"'] : ['NULL as "questionnaireVersionId"']),
        hasCallDatetime ? 'call_datetime as "createdAt"' : 'created_at as "createdAt"',
      ].join(', ');

      // 1. Insert call attempt
      const insertResult = await client.query<CallAttempt>(
        `INSERT INTO call_attempts (
          ${insertColumns.join(', ')}
        ) VALUES (${insertColumns.map((_, idx) => `$${idx + 1}`).join(', ')})
        RETURNING ${selectColumns}`,
        insertValues
      );

      const attempt = insertResult.rows[0];

      // 2. Insert questionnaire responses if provided
      if (input.responses && input.responses.length > 0) {
        const hasResponseValue = await this.tableHasColumn('call_responses', 'response_value');
        const hasAnswerValue = await this.tableHasColumn('call_responses', 'answer');

        for (const resp of input.responses) {
          if (hasResponseValue) {
            await client.query(
              `INSERT INTO call_responses (call_attempt_id, question_id, response_value)
               VALUES ($1, $2, $3)`,
              [attempt.id, resp.questionId, JSON.stringify(resp.responseValue)]
            );
          } else if (hasAnswerValue) {
            await client.query(
              `INSERT INTO call_responses (call_attempt_id, question_id, answer)
               VALUES ($1, $2, $3)`,
              [attempt.id, resp.questionId, JSON.stringify(resp.responseValue)]
            );
          }
        }
      }

      // 3. Update household recruitment status
      let nextStatus = 'contact_in_progress';
      if (input.callStatus === 'successful') {
        if (input.appointmentDecision === 'scheduled') {
          nextStatus = 'appointment_pending';
        }
      }

      await client.query(
        `UPDATE households 
         SET recruitment_status = $1, updated_at = NOW() 
         WHERE id = $2 AND recruitment_status NOT IN ('installed', 'rejected')`,
        [nextStatus, input.householdId]
      );

      return attempt;
    });
  }
}

export const callService = new CallService();

