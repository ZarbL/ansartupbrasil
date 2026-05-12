import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface StartupRow extends RowDataPacket {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  email_corporativo: string;
  telefone: string | null;
  site_url: string | null;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string;
  estado: string;
  pais: string;
  area_atuacao: string | null;
  descricao_negocio: string | null;
  data_fundacao: Date | null;
  numero_funcionarios: number | null;
  estagio_startup: string | null;
  faturamento_anual: string | null;
  status_associacao: 'pendente' | 'ativa' | 'suspensa' | 'cancelada';
  tipo_plano: 'basico' | 'profissional' | 'premium' | 'enterprise';
  data_associacao: Date;
  data_renovacao: Date | null;
  created_at: Date;
  updated_at: Date;
}

export const startupModel = {
  async findById(id: string): Promise<StartupRow | null> {
    const [rows] = await pool.execute<StartupRow[]>(
      'SELECT * FROM startups WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] ?? null;
  },

  async findByCNPJ(cnpj: string): Promise<StartupRow | null> {
    const [rows] = await pool.execute<StartupRow[]>(
      'SELECT * FROM startups WHERE cnpj = ? LIMIT 1',
      [cnpj]
    );
    return rows[0] ?? null;
  },

  async findByEmail(email: string): Promise<StartupRow | null> {
    const [rows] = await pool.execute<StartupRow[]>(
      'SELECT * FROM startups WHERE email_corporativo = ? LIMIT 1',
      [email]
    );
    return rows[0] ?? null;
  },

  async create(data: {
    id: string;
    razao_social: string;
    nome_fantasia: string;
    cnpj: string;
    email_corporativo: string;
    telefone?: string;
    site_url?: string;
    cep?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade: string;
    estado: string;
    area_atuacao?: string;
    descricao_negocio?: string;
    data_fundacao?: string;
    numero_funcionarios?: number;
    estagio_startup?: string;
    faturamento_anual?: string;
    tipo_plano?: string;
  }): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `INSERT INTO startups
        (id, razao_social, nome_fantasia, cnpj, email_corporativo, telefone, site_url,
         cep, endereco, numero, complemento, bairro, cidade, estado,
         area_atuacao, descricao_negocio, data_fundacao, numero_funcionarios,
         estagio_startup, faturamento_anual, tipo_plano, status_associacao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')`,
      [
        data.id,
        data.razao_social,
        data.nome_fantasia,
        data.cnpj,
        data.email_corporativo,
        data.telefone ?? null,
        data.site_url ?? null,
        data.cep ?? null,
        data.endereco ?? null,
        data.numero ?? null,
        data.complemento ?? null,
        data.bairro ?? null,
        data.cidade,
        data.estado,
        data.area_atuacao ?? null,
        data.descricao_negocio ?? null,
        data.data_fundacao ?? null,
        data.numero_funcionarios ?? null,
        data.estagio_startup ?? null,
        data.faturamento_anual ?? null,
        data.tipo_plano ?? 'basico',
      ]
    );
  },

  async update(id: string, data: Partial<{
    nome_fantasia: string;
    telefone: string;
    site_url: string;
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    area_atuacao: string;
    descricao_negocio: string;
    numero_funcionarios: number;
    estagio_startup: string;
    faturamento_anual: string;
  }>): Promise<void> {
    const fields = Object.keys(data) as (keyof typeof data)[];
    if (fields.length === 0) return;

    const set = fields.map((f) => `${f} = ?`).join(', ');
    const values = fields.map((f) => data[f] ?? null);

    await pool.execute<ResultSetHeader>(
      `UPDATE startups SET ${set} WHERE id = ?`,
      [...values, id]
    );
  },
};
