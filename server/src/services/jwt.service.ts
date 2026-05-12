import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';

export interface AccessTokenPayload {
  usuario_id: string;
  startup_id: string;
  tipo_usuario: string;
  jti: string;
}

export interface RefreshTokenPayload {
  usuario_id: string;
  jti: string;
}

export const jwtService = {
  generateAccessToken(payload: Omit<AccessTokenPayload, 'jti'>): { token: string; jti: string } {
    const jti = uuidv4();
    const token = jwt.sign(
      { ...payload, jti },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );
    return { token, jti };
  },

  generateRefreshToken(usuario_id: string): { token: string; jti: string } {
    const jti = uuidv4();
    const token = jwt.sign(
      { usuario_id, jti },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );
    return { token, jti };
  },

  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  },

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  },

  refreshExpiresAt(): Date {
    // 7 dias
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  },
};
