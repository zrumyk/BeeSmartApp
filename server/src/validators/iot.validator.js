const Joi = require("joi");

const weightWebhookSchema = Joi.object({
  hive_id: Joi.string().hex().length(24).required(),
  weight_kg: Joi.number().required(),
  battery_level: Joi.number().min(0).max(100),
  timestamp: Joi.date()
});

module.exports = {
  weightWebhookSchema
};
