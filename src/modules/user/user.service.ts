import { db } from '../../database/connection';
import { hashPassword } from '../../utils/password';
import { AuthUser } from '../../types/common.types';
import { CreateUserInput, UpdateUserInput, UserSummary } from './user.types';

export class UserService {
  async getAll(role?: string): Promise<UserSummary[]> {
    const params: any[] = [];
    let query = `
      SELECT u.id, u.name, u.email, u.role, u.is_active as "isActive", 
             u.region_id as "regionId", r.name as "regionName",
             u.created_at as "createdAt", u.updated_at as "updatedAt"
      FROM users u
      LEFT JOIN regions r ON u.region_id = r.id
    `;

    if (role) {
      query += ` WHERE u.role = $1`;
      params.push(role);
    }

    query += ` ORDER BY u.name ASC`;

    const result = await db.query<UserSummary>(query, params);
    return result.rows;
  }

  async getById(id: string): Promise<UserSummary> {
    const result = await db.query<UserSummary>(
      `SELECT u.id, u.name, u.email, u.role, u.is_active as "isActive", 
              u.region_id as "regionId", r.name as "regionName",
              u.created_at as "createdAt", u.updated_at as "updatedAt"
       FROM users u
       LEFT JOIN regions r ON u.region_id = r.id
       WHERE u.id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  }

  async create(input: CreateUserInput, actor: AuthUser): Promise<UserSummary> {
    // Role check: Only admin can create admin or panel_manager accounts
    if (actor.role === 'panel_manager' && (input.role === 'admin' || input.role === 'panel_manager')) {
      const error: any = new Error('Panel Managers cannot create Admin or Panel Manager accounts');
      error.statusCode = 403;
      throw error;
    }

    // Check unique email
    const existing = await db.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [input.email]);
    if ((existing.rowCount ?? 0) > 0) {
      const error: any = new Error(`User with email '${input.email}' already exists`);
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await hashPassword(input.password);

    const result = await db.query<UserSummary>(
      `INSERT INTO users (name, email, password_hash, role, region_id)
       VALUES ($1, LOWER($2), $3, $4, $5)
       RETURNING id, name, email, role, is_active as "isActive", region_id as "regionId", created_at as "createdAt", updated_at as "updatedAt"`,
      [input.name, input.email, passwordHash, input.role, input.regionId || null]
    );

    return result.rows[0];
  }

  async update(id: string, input: UpdateUserInput, actor: AuthUser): Promise<UserSummary> {
    const targetUser = await this.getById(id);

    // Only admin can modify admin accounts
    if (targetUser.role === 'admin' && actor.role !== 'admin') {
      const error: any = new Error('Only administrators can modify an Admin account');
      error.statusCode = 403;
      throw error;
    }

    // Panel manager cannot elevate someone to admin
    if (input.role === 'admin' && actor.role !== 'admin') {
      const error: any = new Error('Only administrators can assign the Admin role');
      error.statusCode = 403;
      throw error;
    }

    const name = input.name ?? targetUser.name;
    const email = input.email ?? targetUser.email;
    const role = input.role ?? targetUser.role;
    const isActive = input.isActive !== undefined ? input.isActive : targetUser.isActive;
    const regionId = input.regionId !== undefined ? input.regionId : targetUser.regionId;

    const result = await db.query<UserSummary>(
      `UPDATE users 
       SET name = $1, email = LOWER($2), role = $3, is_active = $4, region_id = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING id, name, email, role, is_active as "isActive", region_id as "regionId", created_at as "createdAt", updated_at as "updatedAt"`,
      [name, email, role, isActive, regionId, id]
    );

    return result.rows[0];
  }
}

export const userService = new UserService();

