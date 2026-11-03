"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionnaireService = exports.QuestionnaireService = void 0;
const connection_1 = require("../../database/connection");
class QuestionnaireService {
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
    async getActiveVersion() {
        const hasName = await this.tableHasColumn('questionnaire_versions', 'name');
        const hasTitle = await this.tableHasColumn('questionnaire_versions', 'title');
        const hasVersionNumber = await this.tableHasColumn('questionnaire_versions', 'version_number');
        const versionLabel = hasTitle ? 'title' : hasName ? 'name' : 'title';
        const versionResult = await connection_1.db.query(`SELECT id, version_number as "versionNumber", ${versionLabel} as title, description, is_active as "isActive", created_at as "createdAt"
       FROM questionnaire_versions
       WHERE is_active = true
       ORDER BY version_number DESC
       LIMIT 1`);
        if (versionResult.rowCount === 0)
            return null;
        const version = versionResult.rows[0];
        const questionsResult = await connection_1.db.query(`SELECT id, questionnaire_version_id as "questionnaireVersionId", question_text as "questionText",
              question_type as "questionType", options, is_required as "isRequired",
              display_order as "displayOrder", is_active as "isActive"
       FROM questionnaire_questions
       WHERE questionnaire_version_id = $1 AND is_active = true
       ORDER BY display_order ASC`, [version.id]);
        return {
            version,
            questions: questionsResult.rows,
        };
    }
    async getAllVersions() {
        const hasName = await this.tableHasColumn('questionnaire_versions', 'name');
        const hasTitle = await this.tableHasColumn('questionnaire_versions', 'title');
        const versionLabel = hasTitle ? 'title' : hasName ? 'name' : 'title';
        const result = await connection_1.db.query(`SELECT id, version_number as "versionNumber", ${versionLabel} as title, description, is_active as "isActive", created_at as "createdAt"
       FROM questionnaire_versions
       ORDER BY version_number DESC`);
        return result.rows;
    }
}
exports.QuestionnaireService = QuestionnaireService;
exports.questionnaireService = new QuestionnaireService();
