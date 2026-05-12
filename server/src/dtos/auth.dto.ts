import { z } from 'zod';

const CPF_REGEX = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const CNPJ_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const TELEFONE_REGEX = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha obrigatória'),
});

export type LoginDTO = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  // Startup
  razao_social: z.string().min(3, 'Razão social obrigatória'),
  nome_fantasia: z.string().min(2, 'Nome fantasia obrigatório'),
  cnpj: z.string().regex(CNPJ_REGEX, 'CNPJ inválido — formato: 00.000.000/0000-00'),
  email_corporativo: z.string().email('Email corporativo inválido'),
  telefone: z.string().regex(TELEFONE_REGEX, 'Telefone inválido').optional(),
  site_url: z.string().url('URL inválida').optional().or(z.literal('')),
  cep: z.string().min(8, 'CEP obrigatório'),
  endereco: z.string().min(3, 'Endereço obrigatório'),
  numero: z.string().min(1, 'Número obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(2, 'Bairro obrigatório'),
  cidade: z.string().min(2, 'Cidade obrigatória'),
  estado: z.string().length(2, 'Estado deve ter 2 letras'),
  area_atuacao: z.string().min(2, 'Área de atuação obrigatória'),
  descricao_negocio: z.string().optional(),
  data_fundacao: z.string().optional(),
  numero_funcionarios: z.number().int().positive().optional(),
  estagio_startup: z.enum(['Ideia', 'MVP', 'Tração', 'Escala']).optional(),
  faturamento_anual: z.string().optional(),
  tipo_plano: z.enum(['basico', 'profissional', 'premium', 'enterprise']).default('basico'),

  // Representante
  nome_completo: z.string().min(3, 'Nome completo obrigatório'),
  cpf: z.string().regex(CPF_REGEX, 'CPF inválido — formato: 000.000.000-00'),
  email: z.string().email('Email pessoal inválido'),
  telefone_celular: z.string().regex(TELEFONE_REGEX, 'Celular inválido').optional(),
  cargo: z.string().min(2, 'Cargo obrigatório'),
  senha: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve ter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve ter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve ter pelo menos um caractere especial'),
  confirmar_senha: z.string(),
}).refine((d) => d.senha === d.confirmar_senha, {
  message: 'As senhas não coincidem',
  path: ['confirmar_senha'],
});

export type RegisterDTO = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token obrigatório'),
  senha: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve ter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve ter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve ter pelo menos um caractere especial'),
  confirmar_senha: z.string(),
}).refine((d) => d.senha === d.confirmar_senha, {
  message: 'As senhas não coincidem',
  path: ['confirmar_senha'],
});

export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
