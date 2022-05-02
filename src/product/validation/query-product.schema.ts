import * as Joi from 'joi';

export const queryProductSchema = Joi.object({
  page: Joi.number().integer().positive().optional(),
  limit: Joi.number().integer().positive().optional(),
  categoryId: Joi.number().integer().positive().optional(),
});
