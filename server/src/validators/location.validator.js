const Joi = require("joi");

const coordinatesSchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required()
});

const createLocationSchema = Joi.object({
  name: Joi.string().trim().required(),
  region: Joi.string().trim().required(),
  coordinates: coordinatesSchema.required(),
  max_capacity: Joi.number().min(0).required(),
  status: Joi.string().valid("active", "inactive", "maintenance").default("active")
});

const updateLocationSchema = Joi.object({
  name: Joi.string().trim(),
  region: Joi.string().trim(),
  coordinates: coordinatesSchema,
  max_capacity: Joi.number().min(0),
  status: Joi.string().valid("active", "inactive", "maintenance")
}).min(1);

module.exports = {
  createLocationSchema,
  updateLocationSchema
};
