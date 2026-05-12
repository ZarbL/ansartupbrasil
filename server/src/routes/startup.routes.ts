import { Router } from 'express';
import { startupController } from '../controllers/startup.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/me', startupController.getMe);
router.patch('/me', startupController.updateMe);

export default router;
