import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import { createError } from './errorHandler';

// Validação de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de password
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// Middleware de validação para signup
export const validateSignup = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, password } = req.body;

  // Verificar campos obrigatórios
  if (!name || !email || !password) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'MISSING_FIELDS',
        message: 'Nome, email e password são obrigatórios',
        details: {
          name: !name ? 'Nome é obrigatório' : null,
          email: !email ? 'Email é obrigatório' : null,
          password: !password ? 'Password é obrigatória' : null,
        }
      }
    };
    res.status(400).json(response);
    return;
  }

  // Validar tipos
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INVALID_TYPES',
        message: 'Nome, email e password devem ser strings',
      }
    };
    res.status(400).json(response);
    return;
  }

  // Validar comprimentos
  if (name.trim().length < 2) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INVALID_NAME',
        message: 'Nome deve ter pelo menos 2 caracteres',
      }
    };
    res.status(400).json(response);
    return;
  }

  if (!isValidEmail(email)) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INVALID_EMAIL',
        message: 'Email inválido',
      }
    };
    res.status(400).json(response);
    return;
  }

  if (!isValidPassword(password)) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INVALID_PASSWORD',
        message: 'Password deve ter pelo menos 8 caracteres',
      }
    };
    res.status(400).json(response);
    return;
  }

  // Sanitizar dados
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

// Middleware de validação para login
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'MISSING_CREDENTIALS',
        message: 'Email e password são obrigatórios',
      }
    };
    res.status(400).json(response);
    return;
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INVALID_TYPES',
        message: 'Email e password devem ser strings',
      }
    };
    res.status(400).json(response);
    return;
  }

  // Sanitizar email
  req.body.email = email.trim().toLowerCase();

  next();
};

// Middleware de validação para convite
export const validateInvite = (req: Request, res: Response, next: NextFunction): void => {
  const { email } = req.body;

  if (!email) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'MISSING_EMAIL',
        message: 'Email é obrigatório',
      }
    };
    res.status(400).json(response);
    return;
  }

  if (typeof email !== 'string') {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INVALID_TYPE',
        message: 'Email deve ser uma string',
      }
    };
    res.status(400).json(response);
    return;
  }

  if (!isValidEmail(email)) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INVALID_EMAIL',
        message: 'Email inválido',
      }
    };
    res.status(400).json(response);
    return;
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

// Middleware de validação para app state
export const validateAppState = (req: Request, res: Response, next: NextFunction): void => {
  const appState = req.body;

  if (!appState || typeof appState !== 'object') {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INVALID_APP_STATE',
        message: 'Estado da aplicação deve ser um objeto válido',
      }
    };
    res.status(400).json(response);
    return;
  }

  // Verificar se tem as propriedades básicas esperadas
  const requiredFields = ['profile', 'inventory', 'recipes'];
  const missingFields = requiredFields.filter(field => !(field in appState));

  if (missingFields.length > 0) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'MISSING_APP_STATE_FIELDS',
        message: `Campos obrigatórios em falta: ${missingFields.join(', ')}`,
        details: { missingFields }
      }
    };
    res.status(400).json(response);
    return;
  }

  next();
};
