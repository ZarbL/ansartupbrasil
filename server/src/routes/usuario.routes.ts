import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/me', usuarioController.getProfile);
router.patch('/me', usuarioController.updateProfile);

export default router;
