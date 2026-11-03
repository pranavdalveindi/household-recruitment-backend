import { Response } from 'express';
import { ApiResponse, PaginatedMeta } from '../types/common.types';

export class ApiResponder {
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200,
    meta?: PaginatedMeta | Record<string, any>
  ): Response {
    const payload: ApiResponse<T> = {
      success: true,
      ...(message && { message }),
      ...(data !== undefined && { data }),
      ...(meta && { meta }),
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, data: T, message: string = 'Created successfully'): Response {
    return this.success(res, data, message, 201);
  }

  static error(
    res: Response,
    message: string = 'Internal server error',
    statusCode: number = 500,
    errors?: Array<{ field?: string; message: string }>
  ): Response {
    const payload: ApiResponse = {
      success: false,
      message,
      ...(errors && errors.length > 0 && { errors }),
    };
    return res.status(statusCode).json(payload);
  }
}

