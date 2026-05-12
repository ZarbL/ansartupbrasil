import { z } from 'zod';
import { validateCPF, validateCNPJ, validateEmail } from '../../utils/validation';

export const cadastroSchema = z.object({
  // Etapa 1
  razao_social: z.string().min(3, 'Razão social é obrigatória'),
  nome_fantasia: z.string().min(2, 'Nome fantasia é obrigatório'),
  cnpj: z.string().refine(validateCNPJ, 'CNPJ inválido'),
  email_corporativo: z.string().refine(validateEmail, 'Email inválido'),
  telefone: z.string().min(14, 'Telefone inválido'),
  site_url: z.string().url('URL inválida').optional().or(z.literal('')),
  // Etapa 2
  cep: z.string().min(9, 'CEP é obrigatório'),
  estado: z.string().min(2, 'Estado é obrigatório'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  bairro: z.string().optional(),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  // Etapa 3
  area_atuacao: z.string().min(1, 'Área de atuação é obrigatória'),
  descricao_negocio: z.string().min(20, 'Descreva seu negócio (mínimo 20 caracteres)'),
  data_fundacao: z.string().optional(),
  numero_funcionarios: z.string().optional(),
  estagio_startup: z.string().min(1, 'Estágio da startup é obrigatório'),
  faturamento_anual: z.string().optional(),
  tipo_plano: z.enum(['basico', 'profissional', 'premium', 'enterprise'], {
    message: 'Selecione um plano',
  }),
  // Etapa 4
  nome_completo: z.string().min(3, 'Nome completo é obrigatório'),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  email: z.string().refine(validateEmail, 'Email inválido'),
  telefone_celular: z.string().min(14, 'Telefone inválido'),
  cargo: z.string().min(2, 'Cargo é obrigatório'),
  // Etapa 5
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmar_senha: z.string(),
  aceite_termos: z.boolean().refine((v) => v === true, 'Você deve aceitar os termos'),
  aceite_privacidade: z.boolean().refine((v) => v === true, 'Você deve aceitar a política de privacidade'),
}).refine((d) => d.senha === d.confirmar_senha, {
  message: 'As senhas não coincidem',
  path: ['confirmar_senha'],
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;

export const STEP_FIELDS: Record<number, (keyof CadastroFormData)[]> = {
  1: ['razao_social', 'nome_fantasia', 'cnpj', 'email_corporativo', 'telefone'],
  2: ['cep', 'estado', 'cidade'],
  3: ['area_atuacao', 'descricao_negocio', 'estagio_startup', 'tipo_plano'],
  4: ['nome_completo', 'cpf', 'email', 'telefone_celular', 'cargo'],
  5: ['senha', 'confirmar_senha', 'aceite_termos', 'aceite_privacidade'],
};

export const STEP_LABELS = [
  'Dados da Startup',
  'Endereço',
  'Informações do Negócio',
  'Representante Legal',
  'Senha',
];
