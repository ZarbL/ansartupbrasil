import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly codigo?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      erro: err.message,
      ...(err.codigo && { codigo: err.codigo }),
    });
    return;
  }

  console.error('[server] erro não tratado:', err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
}
