import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'Erro interno do servidor';

  // AppError personalizado
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
  }
  // Erro de violação de constraint do PostgreSQL
  else if (error.message.includes('duplicate key value violates unique constraint')) {
    statusCode = 409;
    code = 'DUPLICATE_ENTRY';
    if (error.message.includes('email')) {
      message = 'Este email já está registado';
    } else {
      message = 'Entrada duplicada';
    }
  }
  // Erro de conexão com a base de dados
  else if (error.message.includes('connect ECONNREFUSED')) {
    statusCode = 503;
    code = 'DATABASE_CONNECTION_ERROR';
    message = 'Erro de conexão com a base de dados';
  }
  // Erro de validação JSON
  else if (error instanceof SyntaxError && error.message.includes('JSON')) {
    statusCode = 400;
    code = 'INVALID_JSON';
    message = 'Formato JSON inválido';
  }

  console.error('❌ Erro:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  });

  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    }
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Rota ${req.method} ${req.path} não encontrada`,
    }
  };

  res.status(404).json(response);
};

// Helper function para criar erros
export const createError = (message: string, statusCode: number, code: string): AppError => {
  return new AppError(message, statusCode, code);
};
