import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { FormField, Spinner } from '../../shared';
import { useCEP } from '../../../hooks/useCEP';
import type { CadastroFormData } from '../types';

const Step2Endereco: React.FC = () => {
  const { register, control, setValue, formState: { errors } } = useFormContext<CadastroFormData>();
  const { isLoading: isBuscandoCEP, buscar } = useCEP();

  const handleBuscarCEP = async (cep: string) => {
    const resultado = await buscar(cep);
    if (resultado) {
      setValue('endereco', resultado.logradouro);
      setValue('bairro', resultado.bairro);
      setValue('cidade', resultado.localidade);
      setValue('estado', resultado.uf);
    }
  };

  return (
    <div className="form-step">
      <FormField
        label="CEP"
        htmlFor="cep"
        required
        error={errors.cep?.message}
        hint="O endereço será preenchido automaticamente"
      >
        <div className="input-with-addon">
          <Controller
            name="cep"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <IMaskInput
                {...field}
                mask="00000-000"
                id="cep"
                type="text"
                placeholder="00000-000"
                className={errors.cep ? 'input-error' : ''}
                onAccept={(value) => field.onChange(value)}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  handleBuscarCEP(e.target.value);
                  field.onBlur();
                }}
              />
            )}
          />
          {isBuscandoCEP && <Spinner size="sm" label="Buscando CEP" />}
        </div>
      </FormField>

      <div className="form-row">
        <FormField label="Estado" htmlFor="estado" required error={errors.estado?.message}>
          <input
            id="estado"
            type="text"
            placeholder="SP"
            maxLength={2}
            {...register('estado')}
            className={errors.estado ? 'input-error' : ''}
          />
        </FormField>

        <FormField label="Cidade" htmlFor="cidade" required error={errors.cidade?.message}>
          <input
            id="cidade"
            type="text"
            placeholder="São Paulo"
            {...register('cidade')}
            className={errors.cidade ? 'input-error' : ''}
          />
        </FormField>
      </div>

      <FormField label="Bairro" htmlFor="bairro" error={errors.bairro?.message}>
        <input id="bairro" type="text" placeholder="Centro" {...register('bairro')} />
      </FormField>

      <div className="form-row">
        <FormField label="Endereço" htmlFor="endereco" error={errors.endereco?.message}>
          <input id="endereco" type="text" placeholder="Rua, Avenida..." {...register('endereco')} />
        </FormField>

        <FormField label="Número" htmlFor="numero" error={errors.numero?.message}>
          <input
            id="numero"
            type="text"
            placeholder="123"
            {...register('numero')}
            style={{ maxWidth: 100 }}
          />
        </FormField>
      </div>

      <FormField label="Complemento" htmlFor="complemento" error={errors.complemento?.message}>
        <input id="complemento" type="text" placeholder="Sala, Andar..." {...register('complemento')} />
      </FormField>
    </div>
  );
};

export default Step2Endereco;
