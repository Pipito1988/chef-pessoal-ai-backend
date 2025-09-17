"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const household_1 = __importDefault(require("./household"));
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/household', household_1.default);
router.get('/health', (req, res) => {
    res.json({
        success: true,
        data: {
            message: 'Chef Pessoal AI Backend está funcionando!',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
        }
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map