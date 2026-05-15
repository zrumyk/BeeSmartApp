const Joi = require("joi");

const queenSchema = Joi.object({
  breed: Joi.string().trim().allow("", null),
  year: Joi.number().integer().min(2000).allow(null),
  color_mark: Joi.string().trim().allow("", null)
});

const createHiveSchema = Joi.object({
  qr_code: Joi.string().trim().required(),
  location_id: Joi.string().hex().length(24).required(),
  type: Joi.string().trim().required(),
  status: Joi.string()
    .valid("healthy", "weak", "sick", "needs_attention", "archived")
    .default("healthy"),
  queen: queenSchema.default({}),
  installed_at: Joi.date().required()
});

const updateHiveSchema = Joi.object({
  qr_code: Joi.string().trim(),
  location_id: Joi.string().hex().length(24),
  type: Joi.string().trim(),
  status: Joi.string().valid("healthy", "weak", "sick", "needs_attention", "archived"),
  queen: queenSchema,
  installed_at: Joi.date()
}).min(1);

module.exports = {
  createHiveSchema,
  updateHiveSchema
};
