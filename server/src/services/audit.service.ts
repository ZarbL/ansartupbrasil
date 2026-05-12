import { pool } from '../config/database';

export type AcaoAuditoria =
  | 'LOGIN'
  | 'LOGIN_FALHA'
  | 'LOGOUT'
  | 'CADASTRO'
  | 'VERIFICACAO_EMAIL'
  | 'RECUPERACAO_SENHA'
  | 'ALTERACAO_SENHA'
  | 'TOKEN_REFRESH';

interface LogParams {
  usuario_id?: string;
  startup_id?: string;
  acao: AcaoAuditoria;
  descricao?: string;
  ip_address?: string;
  user_agent?: string;
  sucesso?: boolean;
  codigo_erro?: string;
  mensagem_erro?: string;
  metadados?: Record<string, unknown>;
}

export const auditService = {
  async log(params: LogParams): Promise<void> {
    try {
      await pool.execute(
        `INSERT INTO logs_auditoria
          (usuario_id, startup_id, acao, descricao, ip_address, user_agent, sucesso, codigo_erro, mensagem_erro, metadados)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          params.usuario_id ?? null,
          params.startup_id ?? null,
          params.acao,
          params.descricao ?? null,
          params.ip_address ?? null,
          params.user_agent ?? null,
          params.sucesso !== false,
          params.codigo_erro ?? null,
          params.mensagem_erro ?? null,
          params.metadados ? JSON.stringify(params.metadados) : null,
        ]
      );
    } catch (err) {
      // Não deixa falha de log derrubar a requisição
      console.error('[audit] erro ao gravar log:', err);
    }
  },
};
