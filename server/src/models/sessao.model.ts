import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface SessaoRow extends RowDataPacket {
  id: string;
  usuario_id: string;
  refresh_token: string;
  access_token_jti: string;
  ip_address: string | null;
  user_agent: string | null;
  dispositivo: string | null;
  navegador: string | null;
  expires_at: Date;
  ultimo_uso: Date;
  ativa: boolean;
  revogada_em: Date | null;
  motivo_revogacao: string | null;
  created_at: Date;
}

export const sessaoModel = {
  async create(data: {
    id: string;
    usuario_id: string;
    refresh_token: string;
    access_token_jti: string;
    expires_at: Date;
    ip_address?: string;
    user_agent?: string;
  }): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `INSERT INTO sessoes
        (id, usuario_id, refresh_token, access_token_jti, expires_at, ip_address, user_agent, ativa)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        data.id,
        data.usuario_id,
        data.refresh_token,
        data.access_token_jti,
        data.expires_at,
        data.ip_address ?? null,
        data.user_agent ?? null,
      ]
    );
  },

  async findByRefreshToken(token: string): Promise<SessaoRow | null> {
    const [rows] = await pool.execute<SessaoRow[]>(
      `SELECT * FROM sessoes
       WHERE refresh_token = ? AND ativa = TRUE AND expires_at > NOW()
       LIMIT 1`,
      [token]
    );
    return rows[0] ?? null;
  },

  async updateAccessTokenJti(id: string, jti: string): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `UPDATE sessoes SET access_token_jti = ?, ultimo_uso = NOW() WHERE id = ?`,
      [jti, id]
    );
  },

  async invalidate(id: string, motivo?: string): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `UPDATE sessoes
       SET ativa = FALSE, revogada_em = NOW(), motivo_revogacao = ?
       WHERE id = ?`,
      [motivo ?? 'logout', id]
    );
  },

  async invalidateAllForUser(usuario_id: string, motivo?: string): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `UPDATE sessoes
       SET ativa = FALSE, revogada_em = NOW(), motivo_revogacao = ?
       WHERE usuario_id = ? AND ativa = TRUE`,
      [motivo ?? 'logout_all', usuario_id]
    );
  },
};
