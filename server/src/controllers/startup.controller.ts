import { Request, Response, NextFunction } from 'express';
import { startupModel } from '../models/startup.model';
import { AppError } from '../middleware/error.middleware';

export const startupController = {
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const startup = await startupModel.findById(req.user!.startup_id);
      if (!startup) throw new AppError(404, 'Startup não encontrada');

      res.json({ startup });
    } catch (err) {
      next(err);
    }
  },

  async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const allowed = [
        'nome_fantasia', 'telefone', 'site_url',
        'cep', 'endereco', 'numero', 'complemento', 'bairro', 'cidade', 'estado',
        'area_atuacao', 'descricao_negocio', 'numero_funcionarios',
        'estagio_startup', 'faturamento_anual',
      ] as const;

      type AllowedKey = typeof allowed[number];
      const data: Partial<Record<AllowedKey, unknown>> = {};

      for (const key of allowed) {
        if (key in req.body) {
          data[key] = req.body[key];
        }
      }

      await startupModel.update(req.user!.startup_id, data as Parameters<typeof startupModel.update>[1]);

      const startup = await startupModel.findById(req.user!.startup_id);
      res.json({ startup });
    } catch (err) {
      next(err);
    }
  },
};
