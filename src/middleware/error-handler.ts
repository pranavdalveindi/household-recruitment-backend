import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiResponder } from '../utils/api-response';
import { env } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
  errors?: Array<{ field?: string; message: string }>;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return ApiResponder.error(res, 'Validation error', 400, formattedErrors);
  }

  // Known AppError
  const statusCode = err.statusCode || (err.status ? Number(err.status) : 500);
  const message = err.message || 'Internal server error';

  if (statusCode >= 500) {
    console.error('Unhandled Application Error:', {
      message: err.message,
      stack: env.NODE_ENV === 'development' ? err.stack : undefined,
      url: req.originalUrl,
      method: req.method,
    });
  }

  return ApiResponder.error(
    res,
    statusCode >= 500 && env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : message,
    statusCode,
    err.errors
  );
};

