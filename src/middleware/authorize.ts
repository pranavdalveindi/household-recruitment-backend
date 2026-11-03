import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/common.types';
import { ApiResponder } from '../utils/api-response';

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponder.error(res, 'Authentication required', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      ApiResponder.error(
        res,
        `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
        403
      );
      return;
    }

    next();
  };
};

