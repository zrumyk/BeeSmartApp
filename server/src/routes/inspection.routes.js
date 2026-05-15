const express = require("express");
const inspectionController = require("../controllers/inspection.controller");
const auth = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const validateObjectId = require("../middlewares/validateObjectId.middleware");
const { createInspectionSchema, syncInspectionSchema } = require("../validators/inspection.validator");

const router = express.Router();

router.use(auth);

router.post("/", allowRoles("admin", "beekeeper"), validate(createInspectionSchema), inspectionController.createInspection);
router.get(
  "/hive/:hiveId",
  allowRoles("admin", "beekeeper"),
  validateObjectId("hiveId"),
  inspectionController.getHiveHistory
);
router.post("/sync", allowRoles("admin", "beekeeper"), validate(syncInspectionSchema), inspectionController.syncInspections);

module.exports = router;
