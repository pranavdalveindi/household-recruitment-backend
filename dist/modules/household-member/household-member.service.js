"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.householdMemberService = exports.HouseholdMemberService = void 0;
const connection_1 = require("../../database/connection");
class HouseholdMemberService {
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
    async getByHouseholdId(householdId) {
        const hasMemberName = await this.tableHasColumn('household_members', 'member_name');
        const hasName = await this.tableHasColumn('household_members', 'name');
        const nameColumn = hasMemberName ? 'member_name' : hasName ? 'name' : 'member_name';
        const result = await connection_1.db.query(`SELECT id, household_id as "householdId", ${nameColumn} as name, age, gender, 
              relationship_to_respondent as "relationshipToRespondent",
              created_at as "createdAt", updated_at as "updatedAt"
       FROM household_members
       WHERE household_id = $1
       ORDER BY created_at ASC`, [householdId]);
        return result.rows;
    }
    async create(input) {
        const hasMemberName = await this.tableHasColumn('household_members', 'member_name');
        const hasName = await this.tableHasColumn('household_members', 'name');
        const nameColumn = hasMemberName ? 'member_name' : hasName ? 'name' : 'member_name';
        const result = await connection_1.db.query(`INSERT INTO household_members (household_id, ${nameColumn}, age, gender, relationship_to_respondent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, household_id as "householdId", ${nameColumn} as name, age, gender, 
                 relationship_to_respondent as "relationshipToRespondent",
                 created_at as "createdAt", updated_at as "updatedAt"`, [input.householdId, input.name, input.age, input.gender, input.relationshipToRespondent]);
        return result.rows[0];
    }
}
exports.HouseholdMemberService = HouseholdMemberService;
exports.householdMemberService = new HouseholdMemberService();
