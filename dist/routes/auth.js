"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/signup', validation_1.validateSignup, authController_1.AuthController.signup);
router.post('/login', validation_1.validateLogin, authController_1.AuthController.login);
router.get('/verify', auth_1.authenticateToken, authController_1.AuthController.verifyToken);
exports.default = router;
//# sourceMappingURL=auth.js.map