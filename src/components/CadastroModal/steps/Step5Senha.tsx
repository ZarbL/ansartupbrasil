import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, PasswordInput } from '../../shared';
import { validatePassword } from '../../../utils/validation';
import type { CadastroFormData } from '../types';

const Step5Senha: React.FC = () => {
  const { register, watch, formState: { errors } } = useFormContext<CadastroFormData>();
  const senha = watch('senha') ?? '';
  const forcaSenha = senha ? validatePassword(senha).strength : null;

  return (
    <div className="form-step">
      <FormField
        label="Senha"
        htmlFor="senha"
        required
        error={errors.senha?.message}
        hint="Mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo"
      >
        <PasswordInput
          id="senha"
          placeholder="••••••••"
          hasError={!!errors.senha}
          {...register('senha')}
        />
        {senha && forcaSenha && (
          <div className={`password-strength strength-${forcaSenha}`}>
            <div className="strength-bar" />
            <span className="strength-text">
              Força:{' '}
              {forcaSenha === 'weak' && '⚠️ Fraca'}
              {forcaSenha === 'medium' && '✓ Média'}
              {forcaSenha === 'strong' && '✓✓ Forte'}
            </span>
          </div>
        )}
      </FormField>

      <FormField label="Confirmar Senha" htmlFor="confirmar_senha" required error={errors.confirmar_senha?.message}>
        <PasswordInput
          id="confirmar_senha"
          placeholder="••••••••"
          hasError={!!errors.confirmar_senha}
          {...register('confirmar_senha')}
        />
      </FormField>

      <div className="form-field">
        <label className="checkbox-label">
          <input type="checkbox" {...register('aceite_termos')} />
          <span>
            Li e aceito os{' '}
            <a href="#termos" target="_blank" rel="noreferrer">Termos de Uso</a> *
          </span>
        </label>
        {errors.aceite_termos && (
          <span className="form-field__error" role="alert">{errors.aceite_termos.message}</span>
        )}
      </div>

      <div className="form-field">
        <label className="checkbox-label">
          <input type="checkbox" {...register('aceite_privacidade')} />
          <span>
            Li e aceito a{' '}
            <a href="#privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a> *
          </span>
        </label>
        {errors.aceite_privacidade && (
          <span className="form-field__error" role="alert">{errors.aceite_privacidade.message}</span>
        )}
      </div>
    </div>
  );
};

export default Step5Senha;
