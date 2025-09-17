"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const User_1 = require("../models/User");
const HouseholdMember_1 = require("../models/HouseholdMember");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            const response = {
                success: false,
                error: {
                    code: 'MISSING_TOKEN',
                    message: 'Token de acesso é obrigatório',
                }
            };
            res.status(401).json(response);
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        const user = await User_1.UserModel.findById(decoded.sub);
        if (!user) {
            const response = {
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'Utilizador não encontrado',
                }
            };
            res.status(401).json(response);
            return;
        }
        const isMember = await HouseholdMember_1.HouseholdMemberModel.isMember(decoded.sub, decoded.household_id);
        if (!isMember) {
            const response = {
                success: false,
                error: {
                    code: 'NOT_HOUSEHOLD_MEMBER',
                    message: 'Utilizador não pertence a esta casa',
                }
            };
            res.status(403).json(response);
            return;
        }
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            householdId: decoded.household_id,
        };
        next();
    }
    catch (error) {
        let errorMessage = 'Token inválido';
        let errorCode = 'INVALID_TOKEN';
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            errorMessage = 'Token expirado';
            errorCode = 'TOKEN_EXPIRED';
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            errorMessage = 'Token malformado';
            errorCode = 'MALFORMED_TOKEN';
        }
        const response = {
            success: false,
            error: {
                code: errorCode,
                message: errorMessage,
            }
        };
        res.status(401).json(response);
    }
};
exports.authenticateToken = authenticateToken;
const generateToken = (userId, householdId, email) => {
    const payload = {
        sub: userId,
        household_id: householdId,
        email,
    };
    return jsonwebtoken_1.default.sign(payload, config_1.config.jwtSecret, {
        expiresIn: '24h',
    });
};
exports.generateToken = generateToken;
//# sourceMappingURL=auth.js.map