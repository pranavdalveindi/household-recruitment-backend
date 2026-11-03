import { AuthUser } from './common.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      correlationId?: string;
    }
  }
}

export {};

