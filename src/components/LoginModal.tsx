import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail } from '../utils/validation';
import './LoginModal.css';

// Schema de validação com Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .refine(validateEmail, 'Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
  lembrarMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToCadastro: () => void;
  onForgotPassword: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToCadastro,
  onForgotPassword,
}) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      await login(data.email, data.senha);

      // Sucesso - resetar form e fechar modal
      reset();
      onClose();
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Tratar erros específicos
      if (error.response?.status === 401) {
        setErrorMessage('Email ou senha incorretos');
      } else if (error.response?.status === 403) {
        setErrorMessage('Por favor, verifique seu email antes de fazer login');
      } else if (error.response?.status === 423) {
        setErrorMessage('Sua conta está temporariamente bloqueada. Tente novamente mais tarde.');
      } else {
        setErrorMessage('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setErrorMessage('');
    setShowPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose} aria-label="Fechar">
          ✕
        </button>

        <div className="modal-header">
          <h2>Bem-vindo de Volta!</h2>
          <p>Entre com suas credenciais para acessar sua conta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {errorMessage && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {errorMessage}
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              className={errors.email ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>

          {/* Senha */}
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <div className="password-input-wrapper">
              <input
                id="senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('senha')}
                className={errors.senha ? 'input-error' : ''}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.senha && (
              <span className="field-error">{errors.senha.message}</span>
            )}
          </div>

          {/* Lembrar-me e Esqueci senha */}
          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" {...register('lembrarMe')} disabled={isLoading} />
              <span>Lembrar-me</span>
            </label>
            <button
              type="button"
              className="link-button"
              onClick={onForgotPassword}
              disabled={isLoading}
            >
              Esqueci minha senha
            </button>
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>

          {/* Link para Cadastro */}
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
