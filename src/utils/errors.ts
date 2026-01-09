/**
 *  @fileOverview 404 Error Response
 *  @module       ErrorModule
 *  @author       Darshit Vora
 */
import type { Request, Response } from 'express';

const NOT_FOUND = 404;

/**
 * pageNotFound() - Return Not found response
 * @name pageNotFound
 * @param req - Express request object
 * @param res - Express response object
 */
function pageNotFound(_req: Request, res: Response): void {
  res.status(NOT_FOUND).json({ error: 'Not found', status: NOT_FOUND });
}

const errors: Record<number, (req: Request, res: Response) => void> = {
  [NOT_FOUND]: pageNotFound,
};

export default errors;
