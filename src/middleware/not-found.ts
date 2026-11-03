import { Request, Response } from 'express';
import { ApiResponder } from '../utils/api-response';

export const notFoundHandler = (req: Request, res: Response) => {
  ApiResponder.error(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    404
  );
};

