const express = require("express");
const hiveController = require("../controllers/hive.controller");
const auth = require("../middlewares/auth.middleware");
const { isAdmin, allowRoles } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const validateObjectId = require("../middlewares/validateObjectId.middleware");
const { createHiveSchema, updateHiveSchema } = require("../validators/hive.validator");

const router = express.Router();

router.use(auth);

router.get("/sick", allowRoles("admin", "beekeeper"), hiveController.getSickHives);
router.get("/qr/:qr_code", allowRoles("admin", "beekeeper"), hiveController.getHiveByQrCode);

router.post("/", isAdmin, validate(createHiveSchema), hiveController.createHive);
router.get("/", allowRoles("admin", "beekeeper"), hiveController.getAllHives);
router.get(
  "/:id/productivity",
  allowRoles("admin", "beekeeper"),
  validateObjectId("id"),
  hiveController.getHiveProductivity
);
router.get("/:id", allowRoles("admin", "beekeeper"), validateObjectId("id"), hiveController.getHiveById);
router.put("/:id", isAdmin, validateObjectId("id"), validate(updateHiveSchema), hiveController.updateHive);
router.delete("/:id", isAdmin, validateObjectId("id"), hiveController.deleteHive);

module.exports = router;
