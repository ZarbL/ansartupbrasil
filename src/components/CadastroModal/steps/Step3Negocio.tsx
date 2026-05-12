import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '../../shared';
import type { CadastroFormData } from '../types';
import type { TipoPlano } from '../../../models';

const PLANOS: { id: TipoPlano; icon: string; titulo: string; tag?: string; descricao: string; beneficios: string[] }[] = [
  {
    id: 'basico',
    icon: '🌱',
    titulo: 'Básico',
    descricao: 'Entrada',
    beneficios: ['Acesso a eventos', 'Networking com startups', 'Newsletter mensal', 'Listagem no diretório'],
  },
  {
    id: 'profissional',
    icon: '💼',
    titulo: 'Profissional',
    descricao: 'Crescimento',
    beneficios: ['Tudo do Básico +', 'Mentoria mensal', 'Workshops especializados', 'Desconto em ferramentas', 'Grupos exclusivos'],
  },
  {
    id: 'premium',
    icon: '⭐',
    titulo: 'Premium',
    tag: 'POPULAR',
    descricao: 'Recomendado',
    beneficios: ['Tudo do Profissional +', 'Consultoria trimestral', 'Conexão com investidores', 'Suporte prioritário', 'Eventos VIP', 'Análise de pitch deck'],
  },
  {
    id: 'enterprise',
    icon: '🏆',
    titulo: 'Enterprise',
    descricao: 'Completo',
    beneficios: ['Tudo do Premium +', 'Suporte dedicado 24/7', 'Consultoria mensal', 'Assessoria jurídica', 'Corporate ventures', 'Eventos internacionais'],
  },
];

const Step3Negocio: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext<CadastroFormData>();
  const planoSelecionado = watch('tipo_plano');

  return (
    <div className="form-step">
      <FormField label="Área de Atuação" htmlFor="area_atuacao" required error={errors.area_atuacao?.message}>
        <select id="area_atuacao" {...register('area_atuacao')} className={errors.area_atuacao ? 'input-error' : ''}>
          <option value="">Selecione...</option>
          {['Fintech','Healthtech','Edtech','Agritech','Logtech','Retailtech','Proptech','Legaltech','Martech','HRtech','Insurtech','Cleantech','SaaS','Marketplace','Outra'].map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Descrição do Negócio" htmlFor="descricao_negocio" required error={errors.descricao_negocio?.message}>
        <textarea
          id="descricao_negocio"
          rows={4}
          placeholder="Conte-nos o que sua startup faz, qual problema resolve e qual o seu diferencial..."
          {...register('descricao_negocio')}
          className={errors.descricao_negocio ? 'input-error' : ''}
        />
      </FormField>

      <div className="form-row">
        <FormField label="Data de Fundação" htmlFor="data_fundacao" error={errors.data_fundacao?.message}>
          <input id="data_fundacao" type="date" {...register('data_fundacao')} />
        </FormField>

        <FormField label="Número de Funcionários" htmlFor="numero_funcionarios" error={errors.numero_funcionarios?.message}>
          <select id="numero_funcionarios" {...register('numero_funcionarios')}>
            <option value="">Selecione...</option>
            {['1-5','6-10','11-50','51-200','201+'].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Estágio da Startup" htmlFor="estagio_startup" required error={errors.estagio_startup?.message}>
        <select id="estagio_startup" {...register('estagio_startup')} className={errors.estagio_startup ? 'input-error' : ''}>
          <option value="">Selecione...</option>
          <option value="Ideia">Ideia</option>
          <option value="MVP">MVP (Produto Mínimo Viável)</option>
          <option value="Tração">Tração (Primeiros Clientes)</option>
          <option value="Escala">Escala (Crescimento Acelerado)</option>
          <option value="Consolidada">Consolidada</option>
        </select>
      </FormField>

      <FormField label="Faturamento Anual" htmlFor="faturamento_anual" error={errors.faturamento_anual?.message}>
        <select id="faturamento_anual" {...register('faturamento_anual')}>
          <option value="">Selecione...</option>
          {[['Até 100K','Até R$ 100 mil'],['100K-500K','R$ 100 mil a R$ 500 mil'],['500K-1M','R$ 500 mil a R$ 1 milhão'],['1M-5M','R$ 1 milhão a R$ 5 milhões'],['5M-10M','R$ 5 milhões a R$ 10 milhões'],['10M+','Acima de R$ 10 milhões']].map(([v,l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Plano de Associação"
        htmlFor="tipo_plano"
        required
        error={errors.tipo_plano?.message}
        hint="Você pode fazer upgrade a qualquer momento."
      >
        <div className="planos-grid">
          {PLANOS.map((plano) => (
            <button
              key={plano.id}
              type="button"
              className={`plano-card${plano.id === 'premium' ? ' plano-destaque' : ''}${planoSelecionado === plano.id ? ' selected' : ''}`}
              onClick={() => setValue('tipo_plano', plano.id, { shouldValidate: true })}
              aria-pressed={planoSelecionado === plano.id}
            >
              {plano.tag && <div className="plano-badge">{plano.tag}</div>}
              <div className="plano-icon" aria-hidden="true">{plano.icon}</div>
              <h3 className="plano-titulo">{plano.titulo}</h3>
              <div className="plano-preco">{plano.descricao}</div>
              <ul className="plano-beneficios">
                {plano.beneficios.map((b) => <li key={b}>✓ {b}</li>)}
              </ul>
            </button>
          ))}
        </div>
      </FormField>
    </div>
  );
};

export default Step3Negocio;
