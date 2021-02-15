import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = function (
  err,
  req,
  res,
  next,
) {
  res.status(400).json({
    error: err.message,
  });
};
