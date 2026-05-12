import { Request, Response, NextFunction } from 'express';
import { jwtService, AccessTokenPayload } from '../services/jwt.service';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ erro: 'Token de acesso necessário' });
    return;
  }

  const token = header.slice(7);
  try {
    req.user = jwtService.verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}
