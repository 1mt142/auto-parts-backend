import Joi from 'joi';

export const createPartSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  brand: Joi.string().min(2).max(100).required(),
  price: Joi.number().positive().precision(2).required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(1000).optional(),
});

export const updatePartSchema = createPartSchema.fork(
  Object.keys(createPartSchema.describe().keys),
  (schema: any) => schema.optional()
);

export const partsQuerySchema = Joi.object({
  q: Joi.string().max(100).optional(),
  name: Joi.string().max(255).optional(),
  brand: Joi.string().max(255).optional(),
  category: Joi.string().max(100).optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
