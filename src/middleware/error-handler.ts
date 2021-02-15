import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = function (
  err,
  req,
  res,
  next,
) {
  res.status(200).json({
    error: err.message,
  });
};
