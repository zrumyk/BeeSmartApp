const Joi = require("joi");

const createVetTaskSchema = Joi.object({
  hive_id: Joi.string().hex().length(24).required(),
  assigned_to: Joi.string().hex().length(24).required(),
  task_type: Joi.string().trim().required(),
  medication: Joi.string().trim().allow("", null),
  due_date: Joi.date().required(),
  status: Joi.string().valid("pending", "completed").default("pending")
});

module.exports = {
  createVetTaskSchema
};
