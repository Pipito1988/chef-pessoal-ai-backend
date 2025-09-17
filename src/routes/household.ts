import { Router } from 'express';
import { HouseholdController } from '../controllers/householdController';
import { authenticateToken } from '../middleware/auth';
import { validateAppState, validateInvite } from '../middleware/validation';

const router = Router();

// Todas as rotas de household requerem autenticação
router.use(authenticateToken);

// GET /api/v1/household/data - Obter estado da casa
router.get('/data', HouseholdController.getData);

// PUT /api/v1/household/data - Atualizar estado da casa
router.put('/data', validateAppState, HouseholdController.updateData);

// GET /api/v1/household/members - Listar membros da casa
router.get('/members', HouseholdController.getMembers);

// POST /api/v1/household/invite - Convidar utilizador para a casa
router.post('/invite', validateInvite, HouseholdController.inviteMember);

// DELETE /api/v1/household/members/:userId - Remover membro da casa
router.delete('/members/:userId', HouseholdController.removeMember);

export default router;
