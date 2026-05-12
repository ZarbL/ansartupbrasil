import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import authService from '../../services/authService';
import { FormField, PasswordInput, Spinner } from '../../components/shared';
import '../VerificarEmailPage/VerificarEmailPage.css';

const schema = z
  .object({
    senha: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Deve ter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Deve ter pelo menos um número')
      .regex(/[^A-Za-z0-9]/, 'Deve ter pelo menos um caractere especial'),
    confirmar_senha: z.string().min(1, 'Confirmação obrigatória'),
  })
  .refine((d) => d.senha === d.confirmar_senha, {
    message: 'As senhas não coincidem',
    path: ['confirmar_senha'],
  });

type FormData = z.infer<typeof schema>;

const RedefinirSenhaPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get('token') ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setErrorMsg('Token inválido. Solicite um novo link de recuperação.');
      return;
    }
    try {
      setIsLoading(true);
      setErrorMsg('');
      await authService.resetPassword({ token, senha: data.senha, confirmar_senha: data.confirmar_senha });
      setIsSuccess(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { erro?: string } } };
      setErrorMsg(e?.response?.data?.erro ?? 'Token inválido ou expirado. Solicite um novo link.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <Link to="/" className="auth-logo">ANSTARTUP Brasil</Link>
          <div className="auth-card__body auth-card__body--center">
            <div className="auth-icon" aria-hidden="true">⚠️</div>
            <h1>Link inválido</h1>
            <p>Este link de redefinição é inválido. Solicite um novo na tela de login.</p>
            <Link to="/" className="auth-btn">Voltar ao início</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">ANSTARTUP Brasil</Link>

        {isSuccess ? (
          <div className="auth-card__body auth-card__body--center">
            <div className="auth-icon" aria-hidden="true">🔐</div>
            <h1>Senha redefinida!</h1>
            <p>Sua senha foi alterada com sucesso. Faça login com a nova senha.</p>
            <button
              className="auth-btn"
              onClick={() => navigate('/', { state: { openLogin: true } })}
            >
              Fazer login
            </button>
          </div>
        ) : (
          <div className="auth-card__body">
            <h1 style={{ marginBottom: '20px', fontSize: '1.375rem' }}>Nova senha</h1>

            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {errorMsg && (
                <div className="error-message" role="alert" style={{ marginBottom: '16px' }}>
                  <span aria-hidden="true">⚠️</span> {errorMsg}
                </div>
              )}

              <FormField label="Nova senha" htmlFor="nova-senha" required error={errors.senha?.message}>
                <PasswordInput
                  id="nova-senha"
                  placeholder="Mínimo 8 caracteres"
                  hasError={!!errors.senha}
                  disabled={isLoading}
                  autoComplete="new-password"
                  {...register('senha')}
                />
              </FormField>

              <FormField label="Confirmar senha" htmlFor="confirmar-senha" required error={errors.confirmar_senha?.message}>
                <PasswordInput
                  id="confirmar-senha"
                  placeholder="Repita a senha"
                  hasError={!!errors.confirmar_senha}
                  disabled={isLoading}
                  autoComplete="new-password"
                  {...register('confirmar_senha')}
                />
              </FormField>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
                style={{ marginTop: '8px' }}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" label="Salvando" />
                    Salvando...
                  </>
                ) : (
                  'Salvar nova senha'
                )}
              </button>
            </form>

            <div className="form-footer" style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <Link to="/" className="link-button">Voltar ao início</Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedefinirSenhaPage;
