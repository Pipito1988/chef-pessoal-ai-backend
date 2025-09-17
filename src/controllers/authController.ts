import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { HouseholdModel } from '../models/Household';
import { HouseholdMemberModel } from '../models/HouseholdMember';
import { generateToken } from '../middleware/auth';
import { ApiResponse, AuthResponse, SignupRequest, LoginRequest } from '../types';
import { createError } from '../middleware/errorHandler';

export class AuthController {
  
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password }: SignupRequest = req.body;

      // Verificar se o email já existe
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            message: 'Este email já está registado',
          }
        };
        res.status(409).json(response);
        return;
      }

      // Criar o utilizador
      const user = await UserModel.create(name, email, password);

      // Criar a household para o utilizador
      const householdName = `Casa de ${name}`;
      const initialAppState = HouseholdModel.getInitialAppState();
      const household = await HouseholdModel.create(householdName, initialAppState);

      // Adicionar o utilizador à household como owner
      await HouseholdMemberModel.addMember(user.id, household.id, 'owner');

      // Gerar token JWT
      const token = generateToken(user.id, household.id, user.email);

      // Preparar resposta
      const authResponse: AuthResponse = {
        token,
        user: UserModel.toResponse(user),
        household: await HouseholdModel.toResponse(household),
      };

      const response: ApiResponse<AuthResponse> = {
        success: true,
        data: authResponse,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Erro no signup:', error);
      throw createError('Erro interno ao criar conta', 500, 'SIGNUP_ERROR');
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      // Encontrar utilizador pelo email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Email ou password inválidos',
          }
        };
        res.status(401).json(response);
        return;
      }

      // Verificar password
      const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Email ou password inválidos',
          }
        };
        res.status(401).json(response);
        return;
      }

      // Encontrar household do utilizador
      const householdId = await HouseholdMemberModel.getUserHousehold(user.id);
      if (!householdId) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'NO_HOUSEHOLD',
            message: 'Utilizador não pertence a nenhuma casa',
          }
        };
        res.status(400).json(response);
        return;
      }

      const household = await HouseholdModel.findById(householdId);
      if (!household) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'HOUSEHOLD_NOT_FOUND',
            message: 'Casa não encontrada',
          }
        };
        res.status(400).json(response);
        return;
      }

      // Gerar token JWT
      const token = generateToken(user.id, household.id, user.email);

      // Preparar resposta
      const authResponse: AuthResponse = {
        token,
        user: UserModel.toResponse(user),
        household: await HouseholdModel.toResponse(household),
      };

      const response: ApiResponse<AuthResponse> = {
        success: true,
        data: authResponse,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Erro no login:', error);
      throw createError('Erro interno ao fazer login', 500, 'LOGIN_ERROR');
    }
  }

  // Endpoint para verificar se o token é válido
  static async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      // Se chegou aqui, o middleware de autenticação já validou o token
      const user = req.user!;
      
      // Buscar dados atualizados do utilizador e household
      const userData = await UserModel.findById(user.id);
      const household = await HouseholdModel.findById(user.householdId);

      if (!userData || !household) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'USER_OR_HOUSEHOLD_NOT_FOUND',
            message: 'Utilizador ou casa não encontrados',
          }
        };
        res.status(404).json(response);
        return;
      }

      const authResponse: AuthResponse = {
        token: req.headers.authorization!.split(' ')[1], // Token atual
        user: UserModel.toResponse(userData),
        household: await HouseholdModel.toResponse(household),
      };

      const response: ApiResponse<AuthResponse> = {
        success: true,
        data: authResponse,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      throw createError('Erro interno na verificação', 500, 'TOKEN_VERIFICATION_ERROR');
    }
  }
}
