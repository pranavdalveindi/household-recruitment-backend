import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import { ApiResponder } from '../utils/api-response';
import { db } from '../database/connection';
import { AuthUser } from '../types/common.types';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ApiResponder.error(res, 'Authentication required: missing Bearer token', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJwt(token);

    if (!decoded) {
      ApiResponder.error(res, 'Invalid or expired authentication token', 401);
      return;
    }

    // Lookup user in database
    const userResult = await db.query<AuthUser>(
      'SELECT id, email, name, role, is_active as "isActive", region_id as "regionId" FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rowCount === 0) {
      ApiResponder.error(res, 'User account not found', 401);
      return;
    }

    const user = userResult.rows[0];

    if (!user.isActive) {
      ApiResponder.error(res, 'User account is deactivated', 403);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

