import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginRateLimit, registerRateLimit, forgotPasswordRateLimit } from '../middleware/rateLimit.middleware';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../dtos/auth.dto';

const router = Router();

router.post('/register', registerRateLimit, validate(registerSchema), authController.register);
router.post('/login', loginRateLimit, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', forgotPasswordRateLimit, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

export default router;
