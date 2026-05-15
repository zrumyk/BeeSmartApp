const express = require("express");
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");
const optionalAuth = require("../middlewares/optionalAuth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", optionalAuth, validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", auth, authController.me);
router.get("/beekeepers", auth, isAdmin, authController.listBeekeepers);

module.exports = router;
