import { db } from '../../database/connection';
import { CreateHouseholdMemberInput, HouseholdMember } from './household-member.types';

export class HouseholdMemberService {
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

  async getByHouseholdId(householdId: string): Promise<HouseholdMember[]> {
    const hasMemberName = await this.tableHasColumn('household_members', 'member_name');
    const hasName = await this.tableHasColumn('household_members', 'name');
    const nameColumn = hasMemberName ? 'member_name' : hasName ? 'name' : 'member_name';

    const result = await db.query<HouseholdMember>(
      `SELECT id, household_id as "householdId", ${nameColumn} as name, age, gender, 
              relationship_to_respondent as "relationshipToRespondent",
              created_at as "createdAt", updated_at as "updatedAt"
       FROM household_members
       WHERE household_id = $1
       ORDER BY created_at ASC`,
      [householdId]
    );
    return result.rows;
  }

  async create(input: CreateHouseholdMemberInput): Promise<HouseholdMember> {
    const hasMemberName = await this.tableHasColumn('household_members', 'member_name');
    const hasName = await this.tableHasColumn('household_members', 'name');
    const nameColumn = hasMemberName ? 'member_name' : hasName ? 'name' : 'member_name';

    const result = await db.query<HouseholdMember>(
      `INSERT INTO household_members (household_id, ${nameColumn}, age, gender, relationship_to_respondent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, household_id as "householdId", ${nameColumn} as name, age, gender, 
                 relationship_to_respondent as "relationshipToRespondent",
                 created_at as "createdAt", updated_at as "updatedAt"`,
      [input.householdId, input.name, input.age, input.gender, input.relationshipToRespondent]
    );
    return result.rows[0];
  }
}

export const householdMemberService = new HouseholdMemberService();

