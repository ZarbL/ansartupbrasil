import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { FormField } from '../../shared';
import type { CadastroFormData } from '../types';

const Step1DadosStartup: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext<CadastroFormData>();

  return (
    <div className="form-step">
      <FormField label="Razão Social" htmlFor="razao_social" required error={errors.razao_social?.message}>
        <input
          id="razao_social"
          type="text"
          placeholder="Nome completo da empresa"
          {...register('razao_social')}
          className={errors.razao_social ? 'input-error' : ''}
        />
      </FormField>

      <FormField label="Nome Fantasia" htmlFor="nome_fantasia" required error={errors.nome_fantasia?.message}>
        <input
          id="nome_fantasia"
          type="text"
          placeholder="Como sua startup é conhecida"
          {...register('nome_fantasia')}
          className={errors.nome_fantasia ? 'input-error' : ''}
        />
      </FormField>

      <FormField label="CNPJ" htmlFor="cnpj" required error={errors.cnpj?.message}>
        <Controller
          name="cnpj"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <IMaskInput
              {...field}
              mask="00.000.000/0000-00"
              id="cnpj"
              type="text"
              placeholder="00.000.000/0000-00"
              className={errors.cnpj ? 'input-error' : ''}
              onAccept={(value) => field.onChange(value)}
            />
          )}
        />
      </FormField>

      <FormField label="Email Corporativo" htmlFor="email_corporativo" required error={errors.email_corporativo?.message}>
        <input
          id="email_corporativo"
          type="email"
          placeholder="contato@suastartup.com"
          {...register('email_corporativo')}
          className={errors.email_corporativo ? 'input-error' : ''}
        />
      </FormField>

      <FormField label="Telefone" htmlFor="telefone" required error={errors.telefone?.message}>
        <Controller
          name="telefone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <IMaskInput
              {...field}
              mask="(00) 00000-0000"
              id="telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              className={errors.telefone ? 'input-error' : ''}
              onAccept={(value) => field.onChange(value)}
            />
          )}
        />
      </FormField>

      <FormField label="Site/URL" htmlFor="site_url" error={errors.site_url?.message}>
        <input
          id="site_url"
          type="url"
          placeholder="https://suastartup.com"
          {...register('site_url')}
          className={errors.site_url ? 'input-error' : ''}
        />
      </FormField>
    </div>
  );
};

export default Step1DadosStartup;
