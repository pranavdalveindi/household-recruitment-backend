import { db } from '../../database/connection';
import { comparePassword, hashPassword } from '../../utils/password';
import { signJwt } from '../../utils/jwt';
import { AuthResponseData, ChangePasswordInput, LoginCredentials } from './auth.types';
import { AuthUser } from '../../types/common.types';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponseData> {
    const result = await db.query(
      `SELECT id, email, name, password_hash, role, is_active, region_id 
       FROM users 
       WHERE LOWER(email) = LOWER($1)`,
      [credentials.email]
    );

    if (result.rowCount === 0) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const row = result.rows[0];

    if (!row.is_active) {
      const error: any = new Error('Your account has been deactivated. Please contact an administrator.');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await comparePassword(credentials.password, row.password_hash);
    if (!isMatch) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const authUser: AuthUser = {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      isActive: row.is_active,
      regionId: row.region_id,
    };

    const token = signJwt(authUser);

    return {
      user: authUser,
      token,
    };
  }

  async getMe(userId: string): Promise<AuthUser> {
    const result = await db.query(
      `SELECT id, email, name, role, is_active as "isActive", region_id as "regionId"
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (result.rowCount === 0) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  }

  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const result = await db.query(
      `SELECT password_hash FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rowCount === 0) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await comparePassword(input.currentPassword, result.rows[0].password_hash);
    if (!isMatch) {
      const error: any = new Error('Incorrect current password');
      error.statusCode = 400;
      throw error;
    }

    const newHash = await hashPassword(input.newPassword);
    await db.query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [newHash, userId]
    );
  }
}

export const authService = new AuthService();

