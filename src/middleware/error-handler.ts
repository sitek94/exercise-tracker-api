import { Request, Response, NextFunction } from 'express';
import { ExpressJoiError } from 'express-joi-validation';

export default function errorHandler(
  err: any | ExpressJoiError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err && err.error && err.error.isJoi) {
    const e: ExpressJoiError = err;
    return res.status(400).json({
      error: `You submitted a bad ${e.type} parameter`,
    });
  } else {
    res.status(400).json({
      error: err.message,
    });
  }
}
