import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { JWTPayload, ApiResponse } from '../types';
import { UserModel } from '../models/User';
import { HouseholdMemberModel } from '../models/HouseholdMember';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        householdId: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Token de acesso é obrigatório',
        }
      };
      res.status(401).json(response);
      return;
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
    
    // Verificar se o utilizador ainda existe
    const user = await UserModel.findById(decoded.sub);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Utilizador não encontrado',
        }
      };
      res.status(401).json(response);
      return;
    }

    // Verificar se o utilizador ainda pertence à household
    const isMember = await HouseholdMemberModel.isMember(decoded.sub, decoded.household_id);
    if (!isMember) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'NOT_HOUSEHOLD_MEMBER',
          message: 'Utilizador não pertence a esta casa',
        }
      };
      res.status(403).json(response);
      return;
    }

    // Adicionar informações do utilizador ao request
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      householdId: decoded.household_id,
    };

    next();
  } catch (error) {
    let errorMessage = 'Token inválido';
    let errorCode = 'INVALID_TOKEN';

    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = 'Token expirado';
      errorCode = 'TOKEN_EXPIRED';
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = 'Token malformado';
      errorCode = 'MALFORMED_TOKEN';
    }

    const response: ApiResponse = {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      }
    };

    res.status(401).json(response);
  }
};

export const generateToken = (userId: string, householdId: string, email: string): string => {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    sub: userId,
    household_id: householdId,
    email,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '24h', // Usar valor literal em vez da config
  });
};
