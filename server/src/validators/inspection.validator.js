const Joi = require("joi");

const inspectionDetailsSchema = Joi.object({
  brood_frames: Joi.number().min(0).required(),
  honey_frames: Joi.number().min(0).required(),
  temper: Joi.string().trim().allow("", null),
  notes: Joi.string().trim().allow("", null)
});

const createInspectionSchema = Joi.object({
  hive_id: Joi.string().hex().length(24).required(),
  date: Joi.date(),
  details: inspectionDetailsSchema.required(),
  client_inspection_id: Joi.string().trim().max(128)
});

const syncInspectionItemSchema = Joi.object({
  hive_id: Joi.string().hex().length(24).required(),
  date: Joi.date(),
  details: inspectionDetailsSchema.required(),
  client_inspection_id: Joi.string().trim().max(128)
});

const syncInspectionSchema = Joi.alternatives()
  .try(
    Joi.array().items(syncInspectionItemSchema).min(1).required(),
    Joi.object({
      inspections: Joi.array().items(syncInspectionItemSchema).min(1).required()
    }).required()
  )
  .required();

module.exports = {
  createInspectionSchema,
  syncInspectionSchema
};
