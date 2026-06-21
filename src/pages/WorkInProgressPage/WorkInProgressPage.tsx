import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './WorkInProgressPage.css';

const WorkInProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  return (
    <div className="wip-page">
      <div className="wip-content">
        <span className="wip-tag">Em construção</span>
        <h1 className="wip-title">
          Em<br />breve.
        </h1>
        <p className="wip-desc">
          {usuario
            ? `Olá, ${usuario.nome_completo.split(' ')[0]}. Sua área de membro está sendo preparada.`
            : 'Sua área de membro está sendo preparada.'}
          {' '}Estamos trabalhando para entregar uma experiência completa em breve.
        </p>
        <button className="wip-btn" onClick={() => navigate('/')}>
          Voltar ao início
        </button>
      </div>
      <div className="wip-decoration" aria-hidden="true">
        <span>FSartup</span>
      </div>
    </div>
  );
};

export default WorkInProgressPage;
