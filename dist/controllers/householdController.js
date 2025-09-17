"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseholdController = void 0;
const Household_1 = require("../models/Household");
const User_1 = require("../models/User");
const HouseholdMember_1 = require("../models/HouseholdMember");
const errorHandler_1 = require("../middleware/errorHandler");
class HouseholdController {
    static async getData(req, res) {
        try {
            const user = req.user;
            const household = await Household_1.HouseholdModel.findById(user.householdId);
            if (!household) {
                const response = {
                    success: false,
                    error: {
                        code: 'HOUSEHOLD_NOT_FOUND',
                        message: 'Casa não encontrada',
                    }
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                data: household.app_state,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Erro ao obter dados da casa:', error);
            throw (0, errorHandler_1.createError)('Erro interno ao obter dados', 500, 'GET_DATA_ERROR');
        }
    }
    static async updateData(req, res) {
        try {
            const user = req.user;
            const appState = req.body;
            const success = await Household_1.HouseholdModel.updateAppState(user.householdId, appState);
            if (!success) {
                const response = {
                    success: false,
                    error: {
                        code: 'UPDATE_FAILED',
                        message: 'Falha ao atualizar dados da casa',
                    }
                };
                res.status(400).json(response);
                return;
            }
            const response = {
                success: true,
                data: {
                    message: 'State updated successfully',
                    updated_at: new Date().toISOString(),
                }
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Erro ao atualizar dados da casa:', error);
            throw (0, errorHandler_1.createError)('Erro interno ao atualizar dados', 500, 'UPDATE_DATA_ERROR');
        }
    }
    static async getMembers(req, res) {
        try {
            const user = req.user;
            const members = await Household_1.HouseholdModel.getMembers(user.householdId);
            const response = {
                success: true,
                data: { members },
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Erro ao obter membros da casa:', error);
            throw (0, errorHandler_1.createError)('Erro interno ao obter membros', 500, 'GET_MEMBERS_ERROR');
        }
    }
    static async inviteMember(req, res) {
        try {
            const user = req.user;
            const { email } = req.body;
            const inviteeUser = await User_1.UserModel.findByEmail(email);
            if (!inviteeUser) {
                const response = {
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'Utilizador com este email não encontrado',
                    }
                };
                res.status(404).json(response);
                return;
            }
            const isAlreadyMember = await HouseholdMember_1.HouseholdMemberModel.isMember(inviteeUser.id, user.householdId);
            if (isAlreadyMember) {
                const response = {
                    success: false,
                    error: {
                        code: 'ALREADY_MEMBER',
                        message: 'Este utilizador já é membro da casa',
                    }
                };
                res.status(409).json(response);
                return;
            }
            const existingHouseholdId = await HouseholdMember_1.HouseholdMemberModel.getUserHousehold(inviteeUser.id);
            if (existingHouseholdId) {
                const response = {
                    success: false,
                    error: {
                        code: 'ALREADY_IN_HOUSEHOLD',
                        message: 'Este utilizador já pertence a outra casa',
                    }
                };
                res.status(409).json(response);
                return;
            }
            await HouseholdMember_1.HouseholdMemberModel.addMember(inviteeUser.id, user.householdId, 'member');
            const updatedMembers = await Household_1.HouseholdModel.getMembers(user.householdId);
            const response = {
                success: true,
                data: {
                    message: 'User added to household successfully',
                    members: updatedMembers,
                }
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Erro ao convidar membro:', error);
            throw (0, errorHandler_1.createError)('Erro interno ao convidar membro', 500, 'INVITE_MEMBER_ERROR');
        }
    }
    static async removeMember(req, res) {
        try {
            const user = req.user;
            const { userId } = req.params;
            const isMember = await HouseholdMember_1.HouseholdMemberModel.isMember(userId, user.householdId);
            if (!isMember) {
                const response = {
                    success: false,
                    error: {
                        code: 'NOT_MEMBER',
                        message: 'Utilizador não é membro desta casa',
                    }
                };
                res.status(404).json(response);
                return;
            }
            if (userId === user.id) {
                const response = {
                    success: false,
                    error: {
                        code: 'CANNOT_REMOVE_SELF',
                        message: 'Não pode remover-se a si próprio',
                    }
                };
                res.status(400).json(response);
                return;
            }
            const success = await HouseholdMember_1.HouseholdMemberModel.removeMember(userId, user.householdId);
            if (!success) {
                const response = {
                    success: false,
                    error: {
                        code: 'REMOVE_FAILED',
                        message: 'Falha ao remover membro',
                    }
                };
                res.status(400).json(response);
                return;
            }
            const updatedMembers = await Household_1.HouseholdModel.getMembers(user.householdId);
            const response = {
                success: true,
                data: {
                    message: 'Member removed successfully',
                    members: updatedMembers,
                }
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Erro ao remover membro:', error);
            throw (0, errorHandler_1.createError)('Erro interno ao remover membro', 500, 'REMOVE_MEMBER_ERROR');
        }
    }
}
exports.HouseholdController = HouseholdController;
//# sourceMappingURL=householdController.js.map