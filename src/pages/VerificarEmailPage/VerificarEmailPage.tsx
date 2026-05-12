import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { Spinner } from '../../components/shared';
import './VerificarEmailPage.css';

type Status = 'loading' | 'success' | 'error';

const VerificarEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setErrorMsg('Link de verificação inválido. Solicite um novo email de verificação.');
      setStatus('error');
      return;
    }

    authService
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err: unknown) => {
        const e = err as { response?: { data?: { erro?: string } } };
        setErrorMsg(e?.response?.data?.erro ?? 'Link inválido ou expirado. Solicite um novo email de verificação.');
        setStatus('error');
      });
  }, [searchParams]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo" aria-label="Voltar para a página inicial">
          ANSTARTUP Brasil
        </Link>

        {status === 'loading' && (
          <div className="auth-card__body auth-card__body--center">
            <Spinner size="md" label="Verificando email" />
            <p>Verificando seu email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="auth-card__body auth-card__body--center">
            <div className="auth-icon" aria-hidden="true">✅</div>
            <h1>Email verificado!</h1>
            <p>Sua conta está ativa. Agora você pode fazer login.</p>
            <Link to="/?login=1" className="auth-btn">
              Fazer login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="auth-card__body auth-card__body--center">
            <div className="auth-icon" aria-hidden="true">⚠️</div>
            <h1>Ops, algo deu errado</h1>
            <p>{errorMsg}</p>
            <Link to="/" className="auth-btn auth-btn--secondary">
              Voltar ao início
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificarEmailPage;
