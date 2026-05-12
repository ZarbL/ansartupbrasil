import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '../shared';
import authService from '../../services/authService';
import Step1DadosStartup from './steps/Step1DadosStartup';
import Step2Endereco from './steps/Step2Endereco';
import Step3Negocio from './steps/Step3Negocio';
import Step4Representante from './steps/Step4Representante';
import Step5Senha from './steps/Step5Senha';
import { cadastroSchema, STEP_FIELDS, STEP_LABELS, type CadastroFormData } from './types';
import './CadastroModal.css';

interface CadastroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

const TOTAL_STEPS = 5;

const STEP_COMPONENTS = [
  Step1DadosStartup,
  Step2Endereco,
  Step3Negocio,
  Step4Representante,
  Step5Senha,
];

function resolveRegisterError(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Erro ao realizar cadastro. Tente novamente.';

  const err = error as { response?: { status?: number; data?: { codigo?: string; erro?: string } } };
  const codigo = err.response?.data?.codigo;

  if (err.response?.status === 409) {
    if (codigo === 'CNPJ_DUPLICADO') return 'Este CNPJ já está cadastrado.';
    if (codigo === 'EMAIL_CORP_DUPLICADO') return 'Este email corporativo já está cadastrado.';
    if (codigo === 'EMAIL_DUPLICADO') return 'Este email pessoal já está cadastrado.';
    return 'CNPJ, CPF ou email já cadastrados. Verifique os dados informados.';
  }
  if (err.response?.status === 422) return 'Dados inválidos. Revise as informações e tente novamente.';
  if (!navigator.onLine) return 'Sem conexão com a internet. Verifique sua rede.';

  return err.response?.data?.erro ?? 'Erro ao realizar cadastro. Tente novamente em instantes.';
}

const CadastroModal: React.FC<CadastroModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cadastroEmail, setCadastroEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const methods = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    mode: 'onChange',
  });

  const { handleSubmit, trigger, reset, getValues } = methods;

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[currentStep]);
    if (valid) {
      setCurrentStep((s) => s + 1);
      setErrorMessage('');
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => s - 1);
    setErrorMessage('');
  };

  const handleClose = () => {
    if (isSuccess) {
      onSuccess?.();
    }
    reset();
    setCurrentStep(1);
    setErrorMessage('');
    setIsSuccess(false);
    setCadastroEmail('');
    onClose();
  };

  const onSubmit = async (data: CadastroFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      // Limpar campos que o backend não espera e converter tipos
      const { aceite_termos, aceite_privacidade, numero_funcionarios, ...rest } = data;
      void aceite_termos; void aceite_privacidade;

      await authService.register({
        ...rest,
        numero_funcionarios: numero_funcionarios
          ? parseInt(numero_funcionarios, 10)
          : undefined,
      } as Parameters<typeof authService.register>[0]);

      setCadastroEmail(getValues('email'));
      setIsSuccess(true);
    } catch (error: unknown) {
      setErrorMessage(resolveRegisterError(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Tela de sucesso pós-cadastro
  if (isSuccess) {
    return (
      <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Cadastro realizado">
        <div className="modal-content cadastro-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={handleClose} aria-label="Fechar">✕</button>
          <div className="cadastro-success">
            <div className="cadastro-success__icon" aria-hidden="true">✉️</div>
            <h2>Cadastro realizado!</h2>
            <p>
              Enviamos um email de confirmação para <strong>{cadastroEmail}</strong>.
            </p>
            <p className="cadastro-success__hint">
              Verifique sua caixa de entrada e clique no link para ativar sua conta.
              O link expira em <strong>24 horas</strong>.
            </p>
            <p className="cadastro-success__spam">
              Não encontrou o email? Verifique a pasta de spam.
            </p>
            <button className="submit-button" onClick={handleClose}>
              Entendi, ir para login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const StepComponent = STEP_COMPONENTS[currentStep - 1];

  return (
    <div className="modal-overlay" onClick={handleClose} role="dialog" aria-modal="true" aria-label="Formulário de cadastro">
      <div className="modal-content cadastro-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose} aria-label="Fechar formulário de cadastro">
          ✕
        </button>

        <nav className="progress-bar" aria-label="Etapas do cadastro">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`progress-step ${i + 1 <= currentStep ? 'active' : ''} ${i + 1 < currentStep ? 'completed' : ''}`}
              aria-current={i + 1 === currentStep ? 'step' : undefined}
            >
              <div className="step-number">{i + 1}</div>
            </div>
          ))}
        </nav>

        <div className="modal-header">
          <h2>Associe-se à ANSTARTUP Brasil</h2>
          <p>Etapa {currentStep}: {STEP_LABELS[currentStep - 1]}</p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="cadastro-form" noValidate>
            {errorMessage && (
              <div className="error-message" role="alert">
                <span aria-hidden="true">⚠️</span> {errorMessage}
              </div>
            )}

            <StepComponent />

            <div className="form-actions">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  ← Voltar
                </button>
              )}

              {currentStep < TOTAL_STEPS ? (
                <button type="button" className="btn-primary" onClick={handleNext}>
                  Próximo →
                </button>
              ) : (
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner size="sm" label="Cadastrando" />
                      Cadastrando...
                    </>
                  ) : (
                    'Finalizar Cadastro'
                  )}
                </button>
              )}
            </div>

            <div className="form-footer">
              <p>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  className="link-button"
                  onClick={onSwitchToLogin}
                  disabled={isLoading}
                >
                  Fazer login
                </button>
              </p>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default CadastroModal;
