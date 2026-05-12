import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { validateEmail } from '../../utils/validation';
import { FormField, Spinner } from '../shared';
import authService from '../../services/authService';
import './EsqueciSenhaModal.css';

const schema = z.object({
  email: z.string().min(1, 'Email é obrigatório').refine(validateEmail, 'Email inválido'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const EsqueciSenhaModal: React.FC<Props> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sentTo, setSentTo] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await authService.forgotPassword({ email: data.email });
      setSentTo(data.email);
    } catch {
      // Resposta genérica — não vazar se email existe ou não
      setSentTo(data.email);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSentTo('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose} role="dialog" aria-modal="true" aria-label="Recuperar senha">
      <div className="modal-content esqueci-senha-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose} aria-label="Fechar">✕</button>

        {sentTo ? (
          <div className="esqueci-success">
            <div className="esqueci-success__icon" aria-hidden="true">📬</div>
            <h2>Email enviado!</h2>
            <p>
              Se <strong>{sentTo}</strong> estiver cadastrado, você receberá as instruções de recuperação em breve.
            </p>
            <p className="esqueci-success__hint">Verifique também a pasta de spam.</p>
            <button className="submit-button" onClick={handleClose}>
              Voltar ao login
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>Recuperar Senha</h2>
              <p>Informe seu email e enviaremos um link para criar uma nova senha.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
              <FormField label="Email" htmlFor="forgot-email" required error={errors.email?.message}>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className={errors.email ? 'input-error' : ''}
                  disabled={isLoading}
                  autoComplete="email"
                  autoFocus
                />
              </FormField>

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner size="sm" label="Enviando" />
                    Enviando...
                  </>
                ) : (
                  'Enviar link de recuperação'
                )}
              </button>

              <div className="form-footer">
                <p>
                  Lembrou sua senha?{' '}
                  <button type="button" className="link-button" onClick={onSwitchToLogin} disabled={isLoading}>
                    Voltar ao login
                  </button>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EsqueciSenhaModal;
