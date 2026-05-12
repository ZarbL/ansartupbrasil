export type StatusAssociacao = 'pendente' | 'ativa' | 'suspensa' | 'cancelada';
export type TipoPlano = 'basico' | 'profissional' | 'premium' | 'enterprise';
export type EstagioStartup = 'Ideia' | 'MVP' | 'Tração' | 'Escala' | 'Consolidada';

export interface Startup {
  id: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  email_corporativo: string;
  telefone?: string;
  site_url?: string;
  area_atuacao: string;
  descricao_negocio?: string;
  data_fundacao?: string;
  numero_funcionarios?: string;
  estagio_startup?: EstagioStartup;
  faturamento_anual?: string;
  status_associacao: StatusAssociacao;
  tipo_plano: TipoPlano;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

export interface StartupUpdateDTO {
  nome_fantasia?: string;
  telefone?: string;
  site_url?: string;
  descricao_negocio?: string;
  numero_funcionarios?: string;
  estagio_startup?: EstagioStartup;
  faturamento_anual?: string;
}

export interface CadastroStartupDTO {
  // Etapa 1
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  email_corporativo: string;
  telefone: string;
  site_url?: string;
  // Etapa 2
  cep: string;
  estado: string;
  cidade: string;
  bairro?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  // Etapa 3
  area_atuacao: string;
  descricao_negocio: string;
  data_fundacao?: string;
  numero_funcionarios?: string;
  estagio_startup: string;
  faturamento_anual?: string;
  tipo_plano: TipoPlano;
  // Etapa 4
  nome_completo: string;
  cpf: string;
  email: string;
  telefone_celular: string;
  cargo: string;
  // Etapa 5
  senha: string;
  confirmar_senha: string;
  aceite_termos: boolean;
  aceite_privacidade: boolean;
}
