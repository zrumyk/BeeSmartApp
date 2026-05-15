const express = require("express");
const vetTaskController = require("../controllers/vetTask.controller");
const auth = require("../middlewares/auth.middleware");
const { isAdmin, allowRoles, isBeekeeper } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const validateObjectId = require("../middlewares/validateObjectId.middleware");
const { createVetTaskSchema } = require("../validators/vetTask.validator");

const router = express.Router();

router.use(auth);

router.post("/", isAdmin, validate(createVetTaskSchema), vetTaskController.createVetTask);
router.get("/", isAdmin, vetTaskController.getAllVetTasks);
router.get("/my-tasks", isBeekeeper, vetTaskController.getMyTasks);
router.patch("/:id/complete", allowRoles("admin", "beekeeper"), validateObjectId("id"), vetTaskController.completeVetTask);

module.exports = router;
