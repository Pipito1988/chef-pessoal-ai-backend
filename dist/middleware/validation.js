"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAppState = exports.validateInvite = exports.validateLogin = exports.validateSignup = exports.isValidPassword = exports.isValidEmail = void 0;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidPassword = (password) => {
    return password.length >= 8;
};
exports.isValidPassword = isValidPassword;
const validateSignup = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        const response = {
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
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        const response = {
            success: false,
            error: {
                code: 'INVALID_TYPES',
                message: 'Nome, email e password devem ser strings',
            }
        };
        res.status(400).json(response);
        return;
    }
    if (name.trim().length < 2) {
        const response = {
            success: false,
            error: {
                code: 'INVALID_NAME',
                message: 'Nome deve ter pelo menos 2 caracteres',
            }
        };
        res.status(400).json(response);
        return;
    }
    if (!(0, exports.isValidEmail)(email)) {
        const response = {
            success: false,
            error: {
                code: 'INVALID_EMAIL',
                message: 'Email inválido',
            }
        };
        res.status(400).json(response);
        return;
    }
    if (!(0, exports.isValidPassword)(password)) {
        const response = {
            success: false,
            error: {
                code: 'INVALID_PASSWORD',
                message: 'Password deve ter pelo menos 8 caracteres',
            }
        };
        res.status(400).json(response);
        return;
    }
    req.body.name = name.trim();
    req.body.email = email.trim().toLowerCase();
    next();
};
exports.validateSignup = validateSignup;
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const response = {
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
        const response = {
            success: false,
            error: {
                code: 'INVALID_TYPES',
                message: 'Email e password devem ser strings',
            }
        };
        res.status(400).json(response);
        return;
    }
    req.body.email = email.trim().toLowerCase();
    next();
};
exports.validateLogin = validateLogin;
const validateInvite = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        const response = {
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
        const response = {
            success: false,
            error: {
                code: 'INVALID_TYPE',
                message: 'Email deve ser uma string',
            }
        };
        res.status(400).json(response);
        return;
    }
    if (!(0, exports.isValidEmail)(email)) {
        const response = {
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
exports.validateInvite = validateInvite;
const validateAppState = (req, res, next) => {
    const appState = req.body;
    if (!appState || typeof appState !== 'object') {
        const response = {
            success: false,
            error: {
                code: 'INVALID_APP_STATE',
                message: 'Estado da aplicação deve ser um objeto válido',
            }
        };
        res.status(400).json(response);
        return;
    }
    const requiredFields = ['profile', 'inventory', 'recipes'];
    const missingFields = requiredFields.filter(field => !(field in appState));
    if (missingFields.length > 0) {
        const response = {
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
exports.validateAppState = validateAppState;
//# sourceMappingURL=validation.js.map