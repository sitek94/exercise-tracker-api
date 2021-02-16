import Joi from 'joi';
import {
  ContainerTypes,
  ValidatedRequestSchema,
  createValidator,
} from 'express-joi-validation';

const YYYY_MM_DD = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

export const validator = createValidator({
  passError: true,
});

// Add exercise
export const addSchema = Joi.object({
  userId: Joi.string().required(),
  description: Joi.string().required(),
  duration: Joi.number().required(),
  date: Joi.string().regex(YYYY_MM_DD).optional(),
});

export interface AddRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    userId: string;
    description: string;
    duration: number;
    date?: string;
  };
}

// Get user's log
export const logSchema = Joi.object({
  userId: Joi.string().required(),
  from: Joi.string().pattern(YYYY_MM_DD).optional(),
  to: Joi.string().pattern(YYYY_MM_DD).optional(),
  limit: Joi.number().integer().optional(),
});

export interface LogRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    userId: string;
    from?: string;
    to?: string;
    limit?: number;
  };
}

export default validator;
