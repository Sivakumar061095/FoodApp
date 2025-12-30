const Joi = require("joi");

// To Create PRODUCT
const createProductSchema = Joi.object({
  product_name: Joi.string().trim().required(),
  sku: Joi.string().trim().required(),
  description: Joi.string().trim(),
  category: Joi.array().items(Joi.string()).required(),
  price: Joi.number().min(0).required(),
  discount: Joi.number().min(0).max(100).default(0),
  final_price: Joi.number().min(0).required(),
  is_veg: Joi.boolean().required(),
  is_available: Joi.boolean().default(true),
  preparation_time: Joi.number().min(0).optional(),
  rating: Joi.number().min(0).max(5).default(0),
  image_url: Joi.string().trim().uri(),
});

// To Update PRODUCT
const updateProductSchema = Joi.object({
  product_name: Joi.string().trim().optional(),
  sku: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  category: Joi.array().items(Joi.string()).optional(),
  price: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).max(100).optional(),
  final_price: Joi.number().min(0).optional(),
  is_veg: Joi.boolean().optional(),
  is_available: Joi.boolean().optional(),
  preparation_time: Joi.number().min(0).optional(),
  rating: Joi.number().min(0).max(5).optional(),
  image_url: Joi.string().trim().uri().optional(),
}).min(1);

module.exports = {
  createProductSchema,
  updateProductSchema,
};
