import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuemSomosPage.css';

const QuemSomosPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="qs-page">
      <div className="qs-content">
        <button className="qs-back" onClick={() => navigate('/')}>
          ← Voltar
        </button>
        <span className="qs-tag">Quem somos</span>
        <h1 className="qs-title">
          A federação que representa o ecossistema de inovação do Brasil.
        </h1>
        <p className="qs-desc">
          A FNStartup reúne startups, empreendedores digitais, líderes e agentes de inovação
          de todo o país com o objetivo de promover um ecossistema vibrante, inclusivo e
          competitivo — impulsionando o Brasil como referência global em tecnologia,
          inovação e desenvolvimento sustentável.
        </p>
        <div className="qs-stats">
          <div className="qs-stat">
            <span className="qs-stat__num">5</span>
            <span className="qs-stat__label">Pilares de atuação</span>
          </div>
          <div className="qs-stat">
            <span className="qs-stat__num">4</span>
            <span className="qs-stat__label">Frentes de trabalho</span>
          </div>
        </div>
        <div className="qs-wip">
          <span className="qs-wip__badge">Em construção</span>
          <p className="qs-wip__text">Esta página está sendo desenvolvida.</p>
        </div>
      </div>
    </div>
  );
};

export default QuemSomosPage;
