import { Request, Response } from 'express';
import { HouseholdModel } from '../models/Household';
import { UserModel } from '../models/User';
import { HouseholdMemberModel } from '../models/HouseholdMember';
import { ApiResponse, AppState, InviteRequest } from '../types';
import { createError } from '../middleware/errorHandler';

export class HouseholdController {
  
  static async getData(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user!;
      
      // Buscar household do utilizador
      const household = await HouseholdModel.findById(user.householdId);
      if (!household) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'HOUSEHOLD_NOT_FOUND',
            message: 'Casa não encontrada',
          }
        };
        res.status(404).json(response);
        return;
      }

      // Retornar o app_state
      const response: ApiResponse<AppState> = {
        success: true,
        data: household.app_state,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao obter dados da casa:', error);
      throw createError('Erro interno ao obter dados', 500, 'GET_DATA_ERROR');
    }
  }

  static async updateData(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const appState: AppState = req.body;

      // Atualizar app_state da household
      const success = await HouseholdModel.updateAppState(user.householdId, appState);
      if (!success) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'UPDATE_FAILED',
            message: 'Falha ao atualizar dados da casa',
          }
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'State updated successfully',
          updated_at: new Date().toISOString(),
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao atualizar dados da casa:', error);
      throw createError('Erro interno ao atualizar dados', 500, 'UPDATE_DATA_ERROR');
    }
  }

  static async getMembers(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user!;
      
      // Buscar membros da household
      const members = await HouseholdModel.getMembers(user.householdId);

      const response: ApiResponse = {
        success: true,
        data: { members },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao obter membros da casa:', error);
      throw createError('Erro interno ao obter membros', 500, 'GET_MEMBERS_ERROR');
    }
  }

  static async inviteMember(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { email }: InviteRequest = req.body;

      // Verificar se o utilizador a ser convidado existe
      const inviteeUser = await UserModel.findByEmail(email);
      if (!inviteeUser) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Utilizador com este email não encontrado',
          }
        };
        res.status(404).json(response);
        return;
      }

      // Verificar se já é membro desta casa
      const isAlreadyMember = await HouseholdMemberModel.isMember(inviteeUser.id, user.householdId);
      if (isAlreadyMember) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'ALREADY_MEMBER',
            message: 'Este utilizador já é membro da casa',
          }
        };
        res.status(409).json(response);
        return;
      }

      // Verificar se o utilizador já pertence a outra casa
      const existingHouseholdId = await HouseholdMemberModel.getUserHousehold(inviteeUser.id);
      if (existingHouseholdId) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'ALREADY_IN_HOUSEHOLD',
            message: 'Este utilizador já pertence a outra casa',
          }
        };
        res.status(409).json(response);
        return;
      }

      // Adicionar o utilizador à casa (implementação simplificada - adiciona diretamente)
      await HouseholdMemberModel.addMember(inviteeUser.id, user.householdId, 'member');

      // Buscar lista atualizada de membros
      const updatedMembers = await HouseholdModel.getMembers(user.householdId);

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'User added to household successfully',
          members: updatedMembers,
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao convidar membro:', error);
      throw createError('Erro interno ao convidar membro', 500, 'INVITE_MEMBER_ERROR');
    }
  }

  static async removeMember(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { userId } = req.params;

      // Verificar se o utilizador a ser removido é membro da casa
      const isMember = await HouseholdMemberModel.isMember(userId, user.householdId);
      if (!isMember) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'NOT_MEMBER',
            message: 'Utilizador não é membro desta casa',
          }
        };
        res.status(404).json(response);
        return;
      }

      // Não permitir que o próprio utilizador se remova (pode ser implementado separadamente)
      if (userId === user.id) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'CANNOT_REMOVE_SELF',
            message: 'Não pode remover-se a si próprio',
          }
        };
        res.status(400).json(response);
        return;
      }

      // Remover o membro
      const success = await HouseholdMemberModel.removeMember(userId, user.householdId);
      if (!success) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'REMOVE_FAILED',
            message: 'Falha ao remover membro',
          }
        };
        res.status(400).json(response);
        return;
      }

      // Buscar lista atualizada de membros
      const updatedMembers = await HouseholdModel.getMembers(user.householdId);

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Member removed successfully',
          members: updatedMembers,
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      throw createError('Erro interno ao remover membro', 500, 'REMOVE_MEMBER_ERROR');
    }
  }
}
