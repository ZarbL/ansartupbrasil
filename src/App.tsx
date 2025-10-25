import { useState } from 'react';
import Header from './components/Header';
import LoginModal from './components/LoginModal'; 
import { useAuth } from './contexts/AuthContext';
import './App.css';

function App() {
  const { isAuthenticated, usuario } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const handleOpenCadastro = () => {
    setIsLoginModalOpen(false);
    setIsCadastroModalOpen(true);
  };

  const handleOpenLogin = () => {
    setIsCadastroModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleOpenForgotPassword = () => {
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(true);
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="container">
          {/* Hero Section - Apresentação */}
          <section className="hero-section">
            <h1>ANSTARTUP BRASIL</h1>
            <p className="hero-subtitle">Associação Nacional de Startups do Brasil</p>
            <p className="hero-description">
              Unindo startups, empreendedores digitais, líderes e agentes de inovação 
              para impulsionar o Brasil como referência global em tecnologia, 
              inovação e desenvolvimento sustentável.
            </p>
          </section>

          {/* Quem Somos */}
          <section id="quem-somos" className="content-section">
            <h2>Quem Somos?</h2>
            <p className="section-intro">
              A Associação Nacional de Startups do Brasil (ANStartup Brasil) é uma organização 
              que reúne startups, empreendedores digitais, líderes e agentes de inovação de todo 
              o país com o objetivo de promover um ecossistema vibrante, inclusivo e competitivo, 
              impulsionando o Brasil como referência global em tecnologia, inovação e desenvolvimento sustentável.
            </p>
          </section>

          {/* Missão e Valores */}
          <section id="missao-valores" className="content-section mission-values-section">
            <div className="mission-values-grid">
              <div className="mission-card">
                <div className="card-icon">🎯</div>
                <h2>Nossa Missão</h2>
                <p>
                  Ser o principal catalisador do desenvolvimento tecnológico, científico e 
                  socioeconômico do Brasil, promovendo a prosperidade, o bem-estar social e 
                  os avanços civilizatórios da sociedade brasileira.
                </p>
              </div>
              
              <div className="values-card">
                <div className="card-icon">💎</div>
                <h2>Nossos Valores</h2>
                <p>
                  Na ANStartup Brasil, acreditamos na <strong>colaboração</strong>, na <strong>inclusão</strong> e 
                  na <strong>inovação</strong> como pilares para transformar o futuro. Valorizamos a <strong>diversidade</strong>, 
                  a <strong>sustentabilidade</strong> e o <strong>impacto positivo</strong>, impulsionando o Brasil rumo 
                  à excelência global.
                </p>
              </div>
            </div>
          </section>

          {/* Princípios e Diretrizes */}
          <section id="principios" className="content-section">
            <h2>Princípios e Diretrizes</h2>
            <div className="principles-list">
              <div className="principle-item">
                <div className="principle-number">01</div>
                <div className="principle-content">
                  <h3>Desenvolvimento Tecnológico</h3>
                  <p>
                    A ANStartup Brasil acredita que a tecnologia é o principal motor da transformação 
                    social e econômica. Trabalhamos para fomentar a pesquisa, o desenvolvimento e a 
                    implementação de soluções tecnológicas que atendam aos desafios locais e globais, 
                    incentivando o protagonismo brasileiro no cenário internacional.
                  </p>
                </div>
              </div>
              
              <div className="principle-item">
                <div className="principle-number">02</div>
                <div className="principle-content">
                  <h3>Prosperidade e Bem-Estar Social</h3>
                  <p>
                    Acreditamos que a inovação só é completa quando promove qualidade de vida, saúde, 
                    educação e dignidade para as pessoas. Nossa associação está comprometida em apoiar 
                    empreendedores que criem impacto positivo e ampliem o acesso a bens e serviços essenciais.
                  </p>
                </div>
              </div>
              
              <div className="principle-item">
                <div className="principle-number">03</div>
                <div className="principle-content">
                  <h3>Promoção da Ciência</h3>
                  <p>
                    A ciência é a base para o progresso sustentável e a inovação de impacto. Nosso 
                    compromisso é estreitar a colaboração entre startups, instituições acadêmicas e de 
                    pesquisa, promovendo a aplicação prática do conhecimento científico em soluções inovadoras.
                  </p>
                </div>
              </div>
              
              <div className="principle-item">
                <div className="principle-number">04</div>
                <div className="principle-content">
                  <h3>Desenvolvimento Socioeconômico</h3>
                  <p>
                    Buscamos impulsionar a geração de empregos qualificados, fomentar a inclusão digital 
                    e expandir oportunidades econômicas. A ANStartup Brasil se dedica a reduzir desigualdades 
                    regionais e promover o crescimento econômico sustentável, beneficiando toda a sociedade.
                  </p>
                </div>
              </div>
              
              <div className="principle-item">
                <div className="principle-number">05</div>
                <div className="principle-content">
                  <h3>Avanços Civilizatórios</h3>
                  <p>
                    A inovação deve ser orientada para fortalecer os pilares da cidadania, democracia e 
                    inclusão. Atuamos para que as startups desenvolvam soluções que respeitem os direitos 
                    humanos, promovam a diversidade e construam um futuro mais justo para todos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* O Que Fazemos */}
          <section id="o-que-fazemos" className="content-section">
            <h2>O Que Fazemos</h2>
            <div className="activities-grid">
              <div className="activity-card">
                <div className="activity-number">01</div>
                <h3>Articulação e Representação</h3>
                <p>
                  Representamos startups em fóruns nacionais e internacionais, dialogando com o governo, 
                  a academia e o setor privado para defender políticas públicas favoráveis ao setor.
                </p>
              </div>
              
              <div className="activity-card">
                <div className="activity-number">02</div>
                <h3>Fomento ao Empreendedorismo e Inovação</h3>
                <p>
                  Organizamos eventos, programas de aceleração, mentorias e capacitações, fortalecendo 
                  o ecossistema e conectando empreendedores a investidores e parceiros estratégicos.
                </p>
              </div>
              
              <div className="activity-card">
                <div className="activity-number">03</div>
                <h3>Apoio ao Desenvolvimento Sustentável</h3>
                <p>
                  Incentivamos startups a desenvolverem soluções alinhadas aos Objetivos de Desenvolvimento 
                  Sustentável (ODS) da ONU, com foco em impacto social e ambiental positivo.
                </p>
              </div>
              
              <div className="activity-card">
                <div className="activity-number">04</div>
                <h3>Criação de Redes de Cooperação</h3>
                <p>
                  Promovemos a integração de startups com grandes empresas, instituições de pesquisa e 
                  governos para estimular a troca de conhecimentos, experiências e recursos.
                </p>
              </div>
            </div>
          </section>

          {/* Nossa Visão */}
          <section id="visao" className="content-section vision-section">
            <div className="vision-content">
              <div className="vision-icon">🚀</div>
              <h2>Nossa Visão</h2>
              <p className="vision-text">
                Ser reconhecida como a principal plataforma de fortalecimento do ecossistema de 
                inovação do Brasil, contribuindo para transformar o país em uma potência tecnológica, 
                sustentável e socialmente justa.
              </p>
            </div>
          </section>

          {/* Equipe Diretiva */}
          <section id="equipe" className="content-section">
            <h2>Direção Executiva</h2>
            <div className="team-grid">
              <div className="team-card">
                <div className="team-icon">👔</div>
                <h3>Henrique Carneiro</h3>
                <p className="team-role">Presidente</p>
              </div>
              
              <div className="team-card">
                <div className="team-icon">👔</div>
                <h3>Erika Gadelha</h3>
                <p className="team-role">Vice-presidente Executiva</p>
              </div>
              
              <div className="team-card">
                <div className="team-icon">👔</div>
                <h3>Gabriel Nojosa</h3>
                <p className="team-role">Diretor Financeiro</p>
              </div>
              
              <div className="team-card">
                <div className="team-icon">👔</div>
                <h3>Nathalia Finazzi</h3>
                <p className="team-role">Diretora Administrativa</p>
              </div>
              
              <div className="team-card">
                <div className="team-icon">👔</div>
                <h3>Tony Sechi</h3>
                <p className="team-role">Vice-presidente de Relações Institucionais e Governamentais</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="cta-section">
            <div className="cta-content">
              <h2>Seja Parte Dessa Transformação!</h2>
              <p>
                A ANStartup Brasil convida você a fazer parte desse movimento para construir 
                um futuro onde a inovação tecnológica seja a força motriz de um Brasil mais 
                próspero e inclusivo. Juntos, podemos transformar ideias em impacto e 
                potencial em progresso.
              </p>
              <div className="cta-buttons">
                <button 
                  className="cta-button primary" 
                  onClick={() => setIsCadastroModalOpen(true)}
                >
                  Associe-se Agora
                </button>
                <button 
                  className="cta-button secondary"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  {isAuthenticated && usuario ? 'Minha Conta' : 'Fazer Login'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Modais */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToCadastro={handleOpenCadastro}
        onForgotPassword={handleOpenForgotPassword}
      />

      {/* TODO: Implementar CadastroModal */}
      {isCadastroModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCadastroModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsCadastroModalOpen(false)}>✕</button>
            <div className="modal-header">
              <h2>Cadastro</h2>
              <p>Em desenvolvimento... 🚧</p>
              <button 
                style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
                onClick={handleOpenLogin}
              >
                Já tem conta? Fazer Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TODO: Implementar ForgotPasswordModal */}
      {isForgotPasswordModalOpen && (
        <div className="modal-overlay" onClick={() => setIsForgotPasswordModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsForgotPasswordModalOpen(false)}>✕</button>
            <div className="modal-header">
              <h2>Recuperar Senha</h2>
              <p>Em desenvolvimento... 🚧</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;