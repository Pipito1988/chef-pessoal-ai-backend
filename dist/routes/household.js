"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const householdController_1 = require("../controllers/householdController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.get('/data', householdController_1.HouseholdController.getData);
router.put('/data', validation_1.validateAppState, householdController_1.HouseholdController.updateData);
router.get('/members', householdController_1.HouseholdController.getMembers);
router.post('/invite', validation_1.validateInvite, householdController_1.HouseholdController.inviteMember);
router.delete('/members/:userId', householdController_1.HouseholdController.removeMember);
exports.default = router;
//# sourceMappingURL=household.js.map