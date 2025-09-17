import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateSignup, validateLogin } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// POST /api/v1/auth/signup - Registar novo utilizador
router.post('/signup', validateSignup, AuthController.signup);

// POST /api/v1/auth/login - Autenticar utilizador
router.post('/login', validateLogin, AuthController.login);

// GET /api/v1/auth/verify - Verificar token (endpoint protegido)
router.get('/verify', authenticateToken, AuthController.verifyToken);

export default router;
