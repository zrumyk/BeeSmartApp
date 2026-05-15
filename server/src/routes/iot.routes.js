const express = require("express");
const iotController = require("../controllers/iot.controller");
const auth = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const validateObjectId = require("../middlewares/validateObjectId.middleware");
const { weightWebhookSchema } = require("../validators/iot.validator");

const router = express.Router();

router.post("/webhook/weight", validate(weightWebhookSchema), iotController.receiveWeightWebhook);
router.get(
  "/hive/:hiveId/yield",
  auth,
  allowRoles("admin", "beekeeper"),
  validateObjectId("hiveId"),
  iotController.getHiveDailyYield
);

module.exports = router;
