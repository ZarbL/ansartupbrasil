import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface HomePageProps {
  onOpenCadastro: () => void;
  onOpenLogin: () => void;
}

const TEAM = [
  { name: 'Henrique Carneiro', role: 'Presidente' },
  { name: 'Erika Gadelha', role: 'Vice-presidente Executiva' },
  { name: 'Gabriel Nojosa', role: 'Diretor Financeiro' },
  { name: 'Nathalia Finazzi', role: 'Diretora Administrativa' },
  { name: 'Tony Sechi', role: 'Vice-presidente de Relações Institucionais e Governamentais' },
];

const PRINCIPLES = [
  {
    n: '01',
    title: 'Desenvolvimento Tecnológico',
    text: 'A ANStartup Brasil acredita que a tecnologia é o principal motor da transformação social e econômica. Trabalhamos para fomentar a pesquisa, o desenvolvimento e a implementação de soluções tecnológicas que atendam aos desafios locais e globais, incentivando o protagonismo brasileiro no cenário internacional.',
  },
  {
    n: '02',
    title: 'Prosperidade e Bem-Estar Social',
    text: 'Acreditamos que a inovação só é completa quando promove qualidade de vida, saúde, educação e dignidade para as pessoas. Nossa associação está comprometida em apoiar empreendedores que criem impacto positivo e ampliem o acesso a bens e serviços essenciais.',
  },
  {
    n: '03',
    title: 'Promoção da Ciência',
    text: 'A ciência é a base para o progresso sustentável e a inovação de impacto. Nosso compromisso é estreitar a colaboração entre startups, instituições acadêmicas e de pesquisa, promovendo a aplicação prática do conhecimento científico em soluções inovadoras.',
  },
  {
    n: '04',
    title: 'Desenvolvimento Socioeconômico',
    text: 'Buscamos impulsionar a geração de empregos qualificados, fomentar a inclusão digital e expandir oportunidades econômicas. A ANStartup Brasil se dedica a reduzir desigualdades regionais e promover o crescimento econômico sustentável, beneficiando toda a sociedade.',
  },
  {
    n: '05',
    title: 'Avanços Civilizatórios',
    text: 'A inovação deve ser orientada para fortalecer os pilares da cidadania, democracia e inclusão. Atuamos para que as startups desenvolvam soluções que respeitem os direitos humanos, promovam a diversidade e construam um futuro mais justo para todos.',
  },
];

const ACTIVITIES = [
  { n: '01', title: 'Articulação e Representação', text: 'Representamos startups em fóruns nacionais e internacionais, dialogando com o governo, a academia e o setor privado para defender políticas públicas favoráveis ao setor.' },
  { n: '02', title: 'Fomento ao Empreendedorismo e Inovação', text: 'Organizamos eventos, programas de aceleração, mentorias e capacitações, fortalecendo o ecossistema e conectando empreendedores a investidores e parceiros estratégicos.' },
  { n: '03', title: 'Apoio ao Desenvolvimento Sustentável', text: 'Incentivamos startups a desenvolverem soluções alinhadas aos Objetivos de Desenvolvimento Sustentável (ODS) da ONU, com foco em impacto social e ambiental positivo.' },
  { n: '04', title: 'Criação de Redes de Cooperação', text: 'Promovemos a integração de startups com grandes empresas, instituições de pesquisa e governos para estimular a troca de conhecimentos, experiências e recursos.' },
];

const HomePage: React.FC<HomePageProps> = ({ onOpenCadastro, onOpenLogin }) => {
  const { isAuthenticated, usuario } = useAuth();

  return (
    <main className="main-content">
      <div className="container">
        <section className="hero-section">
          <h1>ANSTARTUP BRASIL</h1>
          <p className="hero-subtitle">Associação Nacional de Startups do Brasil</p>
          <p className="hero-description">
            Unindo startups, empreendedores digitais, líderes e agentes de inovação
            para impulsionar o Brasil como referência global em tecnologia,
            inovação e desenvolvimento sustentável.
          </p>
        </section>

        <section id="quem-somos" className="content-section">
          <h2>Quem Somos?</h2>
          <p className="section-intro">
            A Associação Nacional de Startups do Brasil (ANStartup Brasil) é uma organização
            que reúne startups, empreendedores digitais, líderes e agentes de inovação de todo
            o país com o objetivo de promover um ecossistema vibrante, inclusivo e competitivo,
            impulsionando o Brasil como referência global em tecnologia, inovação e desenvolvimento sustentável.
          </p>
        </section>

        <section id="missao-valores" className="content-section mission-values-section">
          <div className="mission-values-grid">
            <div className="mission-card">
              <div className="card-icon" aria-hidden="true">🎯</div>
              <h2>Nossa Missão</h2>
              <p>
                Ser o principal catalisador do desenvolvimento tecnológico, científico e
                socioeconômico do Brasil, promovendo a prosperidade, o bem-estar social e
                os avanços civilizatórios da sociedade brasileira.
              </p>
            </div>
            <div className="values-card">
              <div className="card-icon" aria-hidden="true">💎</div>
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

        <section id="principios" className="content-section">
          <h2>Princípios e Diretrizes</h2>
          <div className="principles-list">
            {PRINCIPLES.map((p) => (
              <div key={p.n} className="principle-item">
                <div className="principle-number" aria-hidden="true">{p.n}</div>
                <div className="principle-content">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="o-que-fazemos" className="content-section">
          <h2>O Que Fazemos</h2>
          <div className="activities-grid">
            {ACTIVITIES.map((a) => (
              <div key={a.n} className="activity-card">
                <div className="activity-number" aria-hidden="true">{a.n}</div>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="visao" className="content-section vision-section">
          <div className="vision-content">
            <div className="vision-icon" aria-hidden="true">🚀</div>
            <h2>Nossa Visão</h2>
            <p className="vision-text">
              Ser reconhecida como a principal plataforma de fortalecimento do ecossistema de
              inovação do Brasil, contribuindo para transformar o país em uma potência tecnológica,
              sustentável e socialmente justa.
            </p>
          </div>
        </section>

        <section id="equipe" className="content-section">
          <h2>Direção Executiva</h2>
          <div className="team-grid">
            {TEAM.map((member) => (
              <div key={member.name} className="team-card">
                <div className="team-icon" aria-hidden="true">👔</div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

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
              <button className="cta-button primary" onClick={onOpenCadastro}>
                Associe-se Agora
              </button>
              <button className="cta-button secondary" onClick={onOpenLogin}>
                {isAuthenticated && usuario ? 'Minha Conta' : 'Fazer Login'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
