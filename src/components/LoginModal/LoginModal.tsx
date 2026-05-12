import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validation';
import { FormField, PasswordInput, Spinner } from '../shared';
import './LoginModal.css';

const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').refine(validateEmail, 'Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToCadastro: () => void;
  onForgotPassword: () => void;
}

function resolveErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Erro ao fazer login. Tente novamente.';

  const err = error as { code?: string; response?: { status?: number; data?: { codigo?: string; erro?: string } }; message?: string };

  const codigo = err.code ?? err.response?.data?.codigo;

  if (codigo === 'CREDENCIAIS_INVALIDAS' || err.response?.status === 401) {
    return 'Email ou senha incorretos.';
  }
  if (codigo === 'EMAIL_NAO_VERIFICADO') {
    return 'Confirme seu email antes de entrar. Verifique sua caixa de entrada.';
  }
  if (codigo === 'CONTA_BLOQUEADA' || err.response?.status === 429) {
    return err.response?.data?.erro ?? 'Conta bloqueada por excesso de tentativas. Aguarde e tente novamente.';
  }
  if (codigo === 'CONTA_INATIVA' || err.response?.status === 403) {
    return 'Conta desativada. Entre em contato com o suporte.';
  }
  if (!navigator.onLine) return 'Sem conexão com a internet. Verifique sua rede.';

  return err.response?.data?.erro ?? err.message ?? 'Erro ao fazer login. Tente novamente.';
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToCadastro,
  onForgotPassword,
}) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      await login(data.email, data.senha);
      reset();
      onClose();
    } catch (error: unknown) {
      setErrorMessage(resolveErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose} role="dialog" aria-modal="true" aria-label="Login">
      <div className="modal-content login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose} aria-label="Fechar">✕</button>

        <div className="modal-header">
          <h2>Bem-vindo de Volta!</h2>
          <p>Entre com suas credenciais para acessar sua conta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
          {errorMessage && (
            <div className="error-message" role="alert">
              <span aria-hidden="true">⚠️</span> {errorMessage}
            </div>
          )}

          <FormField label="Email" htmlFor="login-email" required error={errors.email?.message}>
            <input
              id="login-email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              className={errors.email ? 'input-error' : ''}
              disabled={isLoading}
              autoComplete="email"
            />
          </FormField>

          <FormField label="Senha" htmlFor="login-senha" required error={errors.senha?.message}>
            <PasswordInput
              id="login-senha"
              placeholder="••••••••"
              hasError={!!errors.senha}
              disabled={isLoading}
              autoComplete="current-password"
              {...register('senha')}
            />
          </FormField>

          <div className="form-options">
            <span />
            <button
              type="button"
              className="link-button"
              onClick={onForgotPassword}
              disabled={isLoading}
            >
              Esqueci minha senha
            </button>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" label="Entrando" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>

          <div className="form-footer">
            <p>
              Não tem uma conta?{' '}
              <button
                type="button"
                className="link-button"
                onClick={onSwitchToCadastro}
                disabled={isLoading}
              >
                Cadastre-se aqui
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
