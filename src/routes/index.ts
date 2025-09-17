import { Router } from 'express';
import authRoutes from './auth';
import householdRoutes from './household';

const router = Router();

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de household
router.use('/household', householdRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Chef Pessoal AI Backend está funcionando!',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }
  });
});

export default router;
