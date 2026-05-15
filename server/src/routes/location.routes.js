const express = require("express");
const locationController = require("../controllers/location.controller");
const auth = require("../middlewares/auth.middleware");
const { isAdmin, allowRoles } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const validateObjectId = require("../middlewares/validateObjectId.middleware");
const { createLocationSchema, updateLocationSchema } = require("../validators/location.validator");

const router = express.Router();

router.use(auth);

router.post("/", isAdmin, validate(createLocationSchema), locationController.createLocation);
router.get("/", allowRoles("admin", "beekeeper"), locationController.getAllLocations);
router.get("/:id", allowRoles("admin", "beekeeper"), validateObjectId("id"), locationController.getLocationById);
router.put("/:id", isAdmin, validateObjectId("id"), validate(updateLocationSchema), locationController.updateLocation);
router.delete("/:id", isAdmin, validateObjectId("id"), locationController.deleteLocation);

module.exports = router;
