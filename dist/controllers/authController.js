"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = require("../models/User");
const Household_1 = require("../models/Household");
const HouseholdMember_1 = require("../models/HouseholdMember");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
class AuthController {
    static async signup(req, res) {
        try {
            const { name, email, password } = req.body;
            const existingUser = await User_1.UserModel.findByEmail(email);
            if (existingUser) {
                const response = {
                    success: false,
                    error: {
                        code: 'EMAIL_ALREADY_EXISTS',
                        message: 'Este email já está registado',
                    }
                };
                res.status(409).json(response);
                return;
            }
            const user = await User_1.UserModel.create(name, email, password);
            const householdName = `Casa de ${name}`;
            const initialAppState = Household_1.HouseholdModel.getInitialAppState();
            const household = await Household_1.HouseholdModel.create(householdName, initialAppState);
            await HouseholdMember_1.HouseholdMemberModel.addMember(user.id, household.id, 'owner');
            const token = (0, auth_1.generateToken)(user.id, household.id, user.email);
            const authResponse = {
                token,
                user: User_1.UserModel.toResponse(user),
                household: await Household_1.HouseholdModel.toResponse(household),
            };
            const response = {
                success: true,
                data: authResponse,
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Erro no signup:', error);
            throw (0, errorHandler_1.createError)('Erro interno ao criar conta', 500, 'SIGNUP_ERROR');
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User_1.UserModel.findByEmail(email);
            if (!user) {
                const response = {
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Email ou password inválidos',
                    }
                };
                res.status(401).json(response);
                return;
            }
            const isValidPassword = await User_1.UserModel.verifyPassword(password, user.password_hash);
            if (!isValidPassword) {
                const response = {
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Email ou password inválidos',
                    }
                };
                res.status(401).json(response);
                return;
            }
            const householdId = await HouseholdMember_1.HouseholdMemberModel.getUserHousehold(user.id);
            if (!householdId) {
                const response = {
                    success: false,
                    error: {
                        code: 'NO_HOUSEHOLD',
                        message: 'Utilizador não pertence a nenhuma casa',
                    }
                };
                res.status(400).json(response);
                return;
            }
            const household = await Household_1.HouseholdModel.findById(householdId);
            if (!household) {
                const response = {
                    success: false,
                    error: {
                        code: 'HOUSEHOLD_NOT_FOUND',
                        message: 'Casa não encontrada',
                    }
                };
                res.status(400).json(response);
                return;
            }
            const token = (0, auth_1.generateToken)(user.id, household.id, user.email);
            const authResponse = {
                token,
                user: User_1.UserModel.toResponse(user),
                household: await Household_1.HouseholdModel.toResponse(household),
            };
            const response = {
                success: true,
                data: authResponse,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Erro no login:', error);
            throw (0, errorHandler_1.createError)('Erro interno ao fazer login', 500, 'LOGIN_ERROR');
        }
    }
    static async verifyToken(req, res) {
        try {
            const user = req.user;
            const userData = await User_1.UserModel.findById(user.id);
            const household = await Household_1.HouseholdModel.findById(user.householdId);
            if (!userData || !household) {
                const response = {
                    success: false,
                    error: {
                        code: 'USER_OR_HOUSEHOLD_NOT_FOUND',
                        message: 'Utilizador ou casa não encontrados',
                    }
                };
                res.status(404).json(response);
                return;
            }
            const authResponse = {
                token: req.headers.authorization.split(' ')[1],
                user: User_1.UserModel.toResponse(userData),
                household: await Household_1.HouseholdModel.toResponse(household),
            };
            const response = {
                success: true,
                data: authResponse,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Erro na verificação do token:', error);
            throw (0, errorHandler_1.createError)('Erro interno na verificação', 500, 'TOKEN_VERIFICATION_ERROR');
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map