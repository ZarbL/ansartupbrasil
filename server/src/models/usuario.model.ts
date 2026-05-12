import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface UsuarioRow extends RowDataPacket {
  id: string;
  startup_id: string;
  nome_completo: string;
  cpf: string;
  email: string;
  telefone_celular: string | null;
  cargo: string | null;
  tipo_usuario: 'admin' | 'representante' | 'membro';
  senha_hash: string;
  salt: string;
  ultimo_login: Date | null;
  tentativas_login: number;
  bloqueado_ate: Date | null;
  email_verificado: boolean;
  token_verificacao: string | null;
  token_verificacao_expira: Date | null;
  token_recuperacao: string | null;
  token_recuperacao_expira: Date | null;
  ativo: boolean;
  created_at: Date;
  updated_at: Date;
}

export const usuarioModel = {
  async findByEmail(email: string): Promise<UsuarioRow | null> {
    const [rows] = await pool.execute<UsuarioRow[]>(
      'SELECT * FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] ?? null;
  },

  async findById(id: string): Promise<UsuarioRow | null> {
    const [rows] = await pool.execute<UsuarioRow[]>(
      'SELECT * FROM usuarios WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] ?? null;
  },

  async findByVerificationToken(token: string): Promise<UsuarioRow | null> {
    const [rows] = await pool.execute<UsuarioRow[]>(
      `SELECT * FROM usuarios
       WHERE token_verificacao = ? AND token_verificacao_expira > NOW()
       LIMIT 1`,
      [token]
    );
    return rows[0] ?? null;
  },

  async findByResetToken(token: string): Promise<UsuarioRow | null> {
    const [rows] = await pool.execute<UsuarioRow[]>(
      `SELECT * FROM usuarios
       WHERE token_recuperacao = ? AND token_recuperacao_expira > NOW()
       LIMIT 1`,
      [token]
    );
    return rows[0] ?? null;
  },

  async create(data: {
    id: string;
    startup_id: string;
    nome_completo: string;
    cpf: string;
    email: string;
    telefone_celular?: string;
    cargo?: string;
    tipo_usuario?: string;
    senha_hash: string;
    salt: string;
    token_verificacao: string;
    token_verificacao_expira: Date;
  }): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `INSERT INTO usuarios
        (id, startup_id, nome_completo, cpf, email, telefone_celular, cargo, tipo_usuario,
         senha_hash, salt, token_verificacao, token_verificacao_expira, email_verificado, ativo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE, TRUE)`,
      [
        data.id,
        data.startup_id,
        data.nome_completo,
        data.cpf,
        data.email,
        data.telefone_celular ?? null,
        data.cargo ?? null,
        data.tipo_usuario ?? 'admin',
        data.senha_hash,
        data.salt,
        data.token_verificacao,
        data.token_verificacao_expira,
      ]
    );
  },

  async verifyEmail(id: string): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `UPDATE usuarios
       SET email_verificado = TRUE,
           token_verificacao = NULL,
           token_verificacao_expira = NULL
       WHERE id = ?`,
      [id]
    );
  },

  async setResetToken(id: string, token: string, expira: Date): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `UPDATE usuarios SET token_recuperacao = ?, token_recuperacao_expira = ? WHERE id = ?`,
      [token, expira, id]
    );
  },

  async clearResetToken(id: string): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `UPDATE usuarios
       SET token_recuperacao = NULL, token_recuperacao_expira = NULL
       WHERE id = ?`,
      [id]
    );
  },

  async updatePassword(id: string, senha_hash: string, salt: string): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `UPDATE usuarios SET senha_hash = ?, salt = ?, tentativas_login = 0, bloqueado_ate = NULL WHERE id = ?`,
      [senha_hash, salt, id]
    );
  },

  async updateLoginAttempts(id: string, tentativas: number, bloqueado_ate: Date | null): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `UPDATE usuarios SET tentativas_login = ?, bloqueado_ate = ? WHERE id = ?`,
      [tentativas, bloqueado_ate, id]
    );
  },

  async resetLoginAttempts(id: string): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `UPDATE usuarios SET tentativas_login = 0, bloqueado_ate = NULL, ultimo_login = NOW() WHERE id = ?`,
      [id]
    );
  },
};
