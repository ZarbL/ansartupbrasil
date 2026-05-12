import { Request, Response, NextFunction } from 'express';
import { usuarioModel } from '../models/usuario.model';
import { AppError } from '../middleware/error.middleware';

export const usuarioController = {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuario = await usuarioModel.findById(req.user!.usuario_id);
      if (!usuario) throw new AppError(404, 'Usuário não encontrado');

      const { senha_hash, salt, token_verificacao, token_recuperacao, ...perfil } = usuario;
      void senha_hash; void salt; void token_verificacao; void token_recuperacao;

      res.json({ usuario: perfil });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nome_completo, telefone_celular, cargo } = req.body as {
        nome_completo?: string;
        telefone_celular?: string;
        cargo?: string;
      };

      const fields: string[] = [];
      const values: unknown[] = [];

      if (nome_completo) { fields.push('nome_completo = ?'); values.push(nome_completo); }
      if (telefone_celular !== undefined) { fields.push('telefone_celular = ?'); values.push(telefone_celular); }
      if (cargo) { fields.push('cargo = ?'); values.push(cargo); }

      if (fields.length === 0) {
        res.status(400).json({ erro: 'Nenhum campo para atualizar' });
        return;
      }

      const { pool } = await import('../config/database');
      values.push(req.user!.usuario_id);
      await pool.execute(
        `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`,
        values as string[]
      );

      const usuario = await usuarioModel.findById(req.user!.usuario_id);
      if (!usuario) throw new AppError(404, 'Usuário não encontrado');

      const { senha_hash, salt, token_verificacao, token_recuperacao, ...perfil } = usuario;
      void senha_hash; void salt; void token_verificacao; void token_recuperacao;

      res.json({ usuario: perfil });
    } catch (err) {
      next(err);
    }
  },
};
