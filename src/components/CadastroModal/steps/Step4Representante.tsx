import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { FormField } from '../../shared';
import type { CadastroFormData } from '../types';

const Step4Representante: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext<CadastroFormData>();

  return (
    <div className="form-step">
      <FormField label="Nome Completo" htmlFor="nome_completo" required error={errors.nome_completo?.message}>
        <input
          id="nome_completo"
          type="text"
          placeholder="Seu nome completo"
          {...register('nome_completo')}
          className={errors.nome_completo ? 'input-error' : ''}
        />
      </FormField>

      <FormField label="CPF" htmlFor="cpf" required error={errors.cpf?.message}>
        <Controller
          name="cpf"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <IMaskInput
              {...field}
              mask="000.000.000-00"
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              className={errors.cpf ? 'input-error' : ''}
              onAccept={(value) => field.onChange(value)}
            />
          )}
        />
      </FormField>

      <FormField label="Email Pessoal" htmlFor="email" required error={errors.email?.message}>
        <input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
          className={errors.email ? 'input-error' : ''}
        />
      </FormField>

      <FormField label="Telefone Celular" htmlFor="telefone_celular" required error={errors.telefone_celular?.message}>
        <Controller
          name="telefone_celular"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <IMaskInput
              {...field}
              mask="(00) 00000-0000"
              id="telefone_celular"
              type="tel"
              placeholder="(00) 00000-0000"
              className={errors.telefone_celular ? 'input-error' : ''}
              onAccept={(value) => field.onChange(value)}
            />
          )}
        />
      </FormField>

      <FormField label="Cargo na Empresa" htmlFor="cargo" required error={errors.cargo?.message}>
        <input
          id="cargo"
          type="text"
          placeholder="Ex: CEO, CTO, Fundador"
          {...register('cargo')}
          className={errors.cargo ? 'input-error' : ''}
        />
      </FormField>
    </div>
  );
};

export default Step4Representante;
