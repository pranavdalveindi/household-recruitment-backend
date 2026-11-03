import { db } from '../../database/connection';
import { AuthUser } from '../../types/common.types';
import { CreateNoteInput, HouseholdNote } from './note.types';

export class NoteService {
  async getByHouseholdId(householdId: string): Promise<HouseholdNote[]> {
    const result = await db.query<HouseholdNote>(
      `SELECT n.id, n.household_id as "householdId", n.author_id as "authorId",
              u.name as "authorName", n.note_type as "noteType", n.content,
              n.created_at as "createdAt"
       FROM household_notes n
       LEFT JOIN users u ON n.author_id = u.id
       WHERE n.household_id = $1
       ORDER BY n.created_at DESC`,
      [householdId]
    );
    return result.rows;
  }

  async create(input: CreateNoteInput, actor: AuthUser): Promise<HouseholdNote> {
    const result = await db.query<HouseholdNote>(
      `INSERT INTO household_notes (household_id, author_id, note_type, content)
       VALUES ($1, $2, $3, $4)
       RETURNING id, household_id as "householdId", author_id as "authorId",
                 note_type as "noteType", content, created_at as "createdAt"`,
      [input.householdId, actor.id, input.noteType, input.content]
    );

    const note = result.rows[0];
    note.authorName = actor.name;
    return note;
  }
}

export const noteService = new NoteService();

