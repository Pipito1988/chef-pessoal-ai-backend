"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.notFoundHandler = exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Erro interno do servidor';
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        code = error.code;
        message = error.message;
    }
    else if (error.message.includes('duplicate key value violates unique constraint')) {
        statusCode = 409;
        code = 'DUPLICATE_ENTRY';
        if (error.message.includes('email')) {
            message = 'Este email já está registado';
        }
        else {
            message = 'Entrada duplicada';
        }
    }
    else if (error.message.includes('connect ECONNREFUSED')) {
        statusCode = 503;
        code = 'DATABASE_CONNECTION_ERROR';
        message = 'Erro de conexão com a base de dados';
    }
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
    const response = {
        success: false,
        error: {
            code,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        }
    };
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    const response = {
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Rota ${req.method} ${req.path} não encontrada`,
        }
    };
    res.status(404).json(response);
};
exports.notFoundHandler = notFoundHandler;
const createError = (message, statusCode, code) => {
    return new AppError(message, statusCode, code);
};
exports.createError = createError;
//# sourceMappingURL=errorHandler.js.map