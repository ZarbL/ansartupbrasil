import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './HomePage.css';

interface HomePageProps {
  onOpenCadastro: () => void;
  onOpenLogin: () => void;
}

const TEAM = [
  { name: 'Henrique Carneiro',   role: 'Presidente' },
  { name: 'Erika Gadelha',       role: 'Vice-presidente Executiva' },
  { name: 'Gabriel Nojosa',      role: 'Diretor Financeiro' },
  { name: 'Nathalia Finazzi',    role: 'Diretora Administrativa' },
  { name: 'Tony Sechi',          role: 'VP de Relações Institucionais' },
];

const PRINCIPLES = [
  { n: '01', title: 'Desenvolvimento Tecnológico',     text: 'Fomentamos pesquisa, desenvolvimento e implementação de soluções tecnológicas que atendam desafios locais e globais, incentivando o protagonismo brasileiro no cenário internacional.' },
  { n: '02', title: 'Prosperidade e Bem-Estar Social', text: 'Acreditamos que a inovação só é completa quando promove qualidade de vida, saúde, educação e dignidade. Apoiamos empreendedores que criem impacto positivo e ampliem o acesso a serviços essenciais.' },
  { n: '03', title: 'Promoção da Ciência',             text: 'Estreitamos a colaboração entre startups, academia e centros de pesquisa, promovendo a aplicação prática do conhecimento científico em soluções de impacto real.' },
  { n: '04', title: 'Desenvolvimento Socioeconômico',  text: 'Impulsionamos geração de empregos qualificados, inclusão digital e expansão de oportunidades. Trabalhamos para reduzir desigualdades regionais e crescer de forma sustentável.' },
  { n: '05', title: 'Avanços Civilizatórios',          text: 'Atuamos para que as startups desenvolvam soluções que respeitem direitos humanos, promovam diversidade e construam um futuro mais justo — fortalecendo cidadania e democracia.' },
];

type Visual =
  | { type: 'image'; src: string; alt: string }
  | { type: 'svg'; id: 'geo' | 'growth' | 'network' };

const ACTIVITIES: Array<{ n: string; title: string; text: string; visual: Visual }> = [
  {
    n: '01',
    title: 'Articulação e Representação',
    text: 'Representamos startups em fóruns nacionais e internacionais, dialogando com governo, academia e setor privado para defender políticas públicas favoráveis ao ecossistema.',
    visual: { type: 'svg', id: 'geo' },
  },
  {
    n: '02',
    title: 'Fomento ao Empreendedorismo',
    text: 'Organizamos eventos, programas de aceleração, mentorias e capacitações — conectando empreendedores a investidores e parceiros estratégicos.',
    visual: { type: 'svg', id: 'growth' },
  },
  {
    n: '03',
    title: 'Apoio ao Desenvolvimento Sustentável',
    text: 'Incentivamos startups a desenvolverem soluções alinhadas aos ODS da ONU, com foco em impacto social e ambiental positivo de longo prazo.',
    visual: {
      type: 'image',
      src: 'https://picsum.photos/seed/nature/800/500',
      alt: 'Desenvolvimento sustentável',
    },
  },
  {
    n: '04',
    title: 'Criação de Redes de Cooperação',
    text: 'Promovemos integração de startups com grandes empresas, instituições de pesquisa e governos para estimular troca de conhecimento e recursos.',
    visual: { type: 'svg', id: 'network' },
  },
];

/* ─── SVG patterns ─── */

function SvgGeo() {
  return (
    <svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" className="hp-card__svg" aria-hidden="true">
      {/* Background */}
      <rect width="400" height="260" fill="#0D2B1A" />

      {/* Large circle — anchor */}
      <circle cx="200" cy="130" r="90" fill="none" stroke="#1A6B3A" strokeWidth="1.5" opacity="0.5" />
      <circle cx="200" cy="130" r="64" fill="#1A6B3A" opacity="0.18" />
      <circle cx="200" cy="130" r="38" fill="#1A6B3A" opacity="0.35" />

      {/* Orbiting small circles */}
      <circle cx="200" cy="40"  r="8"  fill="#2D9E58" opacity="0.7" />
      <circle cx="290" cy="130" r="6"  fill="#2D9E58" opacity="0.55" />
      <circle cx="200" cy="220" r="10" fill="#2D9E58" opacity="0.5" />
      <circle cx="110" cy="130" r="7"  fill="#2D9E58" opacity="0.6" />

      {/* Diagonal rectangle — rotated */}
      <rect x="160" y="60" width="80" height="12" rx="2" fill="#4DBF7F" opacity="0.25" transform="rotate(35 200 130)" />
      <rect x="160" y="60" width="80" height="12" rx="2" fill="#4DBF7F" opacity="0.15" transform="rotate(-35 200 130)" />

      {/* Corner triangles */}
      <polygon points="20,20 70,20 20,60"  fill="#1A6B3A" opacity="0.4" />
      <polygon points="380,240 330,240 380,200" fill="#1A6B3A" opacity="0.3" />

      {/* Top-right small square */}
      <rect x="330" y="24" width="32" height="32" rx="4" fill="none" stroke="#2D9E58" strokeWidth="1.5" opacity="0.4" />
      <rect x="338" y="32" width="16" height="16" rx="2" fill="#2D9E58" opacity="0.3" />

      {/* Bottom-left arc */}
      <path d="M 30 230 A 60 60 0 0 1 90 170" fill="none" stroke="#1A6B3A" strokeWidth="2" opacity="0.4" strokeLinecap="round" />

      {/* Thin cross lines through center */}
      <line x1="200" y1="10"  x2="200" y2="250" stroke="#1A6B3A" strokeWidth="0.75" opacity="0.2" strokeDasharray="4 8" />
      <line x1="10"  y1="130" x2="390" y2="130" stroke="#1A6B3A" strokeWidth="0.75" opacity="0.2" strokeDasharray="4 8" />

      {/* Dot grid — bottom right */}
      {[0,1,2,3].map((row) =>
        [0,1,2,3].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={295 + col * 22}
            cy={170 + row * 22}
            r="2"
            fill="#2D9E58"
            opacity="0.35"
          />
        ))
      )}
    </svg>
  );
}

function SvgGrowth() {
  return (
    <svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" className="hp-card__svg" aria-hidden="true">
      <rect width="400" height="260" fill="#E8F2EC" />
      {/* Bars */}
      <rect x="48"  y="196" width="40" height="56"  fill="#1A6B3A" opacity="0.12" rx="2" />
      <rect x="106" y="158" width="40" height="94"  fill="#1A6B3A" opacity="0.2"  rx="2" />
      <rect x="164" y="116" width="40" height="136" fill="#1A6B3A" opacity="0.3"  rx="2" />
      <rect x="222" y="74"  width="40" height="178" fill="#1A6B3A" opacity="0.45" rx="2" />
      <rect x="280" y="38"  width="40" height="214" fill="#1A6B3A" opacity="0.65" rx="2" />
      {/* Trend line */}
      <polyline
        points="68,196 126,158 184,116 242,74 300,38"
        fill="none"
        stroke="#1A6B3A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      {/* Dots on line */}
      {[
        [68,  196],
        [126, 158],
        [184, 116],
        [242, 74],
        [300, 38],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 4 ? 7 : 5} fill="#1A6B3A" opacity={0.5 + i * 0.1} />
      ))}
      {/* Decorative grid lines */}
      {[60, 120, 180, 240].map((y) => (
        <line key={y} x1="30" y1={y} x2="370" y2={y} stroke="#1A6B3A" strokeWidth="0.5" opacity="0.1" strokeDasharray="4 6" />
      ))}
    </svg>
  );
}

function SvgNetwork() {
  const nodes = [
    { cx: 200, cy: 130, r: 18, op: 0.7 },
    { cx: 100, cy: 72,  r: 12, op: 0.4 },
    { cx: 310, cy: 68,  r: 10, op: 0.38 },
    { cx: 78,  cy: 196, r: 10, op: 0.38 },
    { cx: 322, cy: 202, r: 12, op: 0.42 },
    { cx: 200, cy: 28,  r: 8,  op: 0.28 },
    { cx: 48,  cy: 128, r: 6,  op: 0.2 },
    { cx: 352, cy: 134, r: 6,  op: 0.2 },
  ];

  const edges = [
    [200, 130, 100,  72],
    [200, 130, 310,  68],
    [200, 130, 78,  196],
    [200, 130, 322, 202],
    [200, 130, 200,  28],
    [100,  72, 200,  28],
    [310,  68, 200,  28],
    [78,  196, 48,  128],
    [322, 202, 352, 134],
    [78,  196, 322, 202],
  ];

  return (
    <svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" className="hp-card__svg" aria-hidden="true">
      <rect width="400" height="260" fill="#F0EDE8" />
      {edges.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1A6B3A" strokeWidth="1.5" opacity="0.2" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.cx} cy={n.cy} r={n.r} fill="#1A6B3A" opacity={n.op} />
      ))}
    </svg>
  );
}

function CardVisual({ visual }: { visual: Visual }) {
  if (visual.type === 'image') {
    return (
      <div className="hp-card__visual">
        <img src={visual.src} alt={visual.alt} className="hp-card__img" loading="lazy" />
      </div>
    );
  }
  return (
    <div className="hp-card__visual hp-card__visual--svg">
      {visual.id === 'geo'    ? <SvgGeo />    :
       visual.id === 'growth' ? <SvgGrowth /> : <SvgNetwork />}
    </div>
  );
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('');
}

const HomePage: React.FC<HomePageProps> = ({ onOpenCadastro, onOpenLogin }) => {
  const { isAuthenticated, usuario } = useAuth();

  return (
    <main className="main-content">

      {/* ─── Hero ─── */}
      <section className="hp-hero">

        {/* Elementos decorativos verdes */}
        <div className="hp-hero__deco" aria-hidden="true">
          <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            {/* Arcos concêntricos — canto superior direito */}
            <circle cx="1150" cy="-20" r="420" fill="none" stroke="#1A6B3A" strokeWidth="1.2" opacity="0.2" />
            <circle cx="1150" cy="-20" r="300" fill="none" stroke="#1A6B3A" strokeWidth="1"   opacity="0.14" />
            <circle cx="1150" cy="-20" r="180" fill="#1A6B3A" opacity="0.055" />

            {/* Triângulo — canto superior esquerdo */}
            <polygon points="0,0 140,0 0,140" fill="#1A6B3A" opacity="0.07" />

            {/* Círculos flutuantes — esquerda baixo */}
            <circle cx="70"  cy="560" r="55"  fill="#1A6B3A" opacity="0.07" />
            <circle cx="145" cy="510" r="22"  fill="#1A6B3A" opacity="0.1"  />
            <circle cx="42"  cy="495" r="9"   fill="#1A6B3A" opacity="0.18" />

            {/* Grid de pontos — canto inferior direito */}
            {[0,1,2,3,4,5].flatMap((row) =>
              [0,1,2,3,4].map((col) => (
                <circle
                  key={`d-${row}-${col}`}
                  cx={910 + col * 28}
                  cy={490 + row * 28}
                  r="2.5"
                  fill="#1A6B3A"
                  opacity="0.22"
                />
              ))
            )}

            {/* Linha horizontal + dot — rodapé esquerdo */}
            <line x1="0" y1="672" x2="320" y2="672" stroke="#1A6B3A" strokeWidth="2" opacity="0.28" />
            <circle cx="328" cy="672" r="5" fill="#1A6B3A" opacity="0.45" />

            {/* Quadrado com borda — centro-topo */}
            <rect x="540" y="28" width="44" height="44" rx="5" fill="none" stroke="#1A6B3A" strokeWidth="1.5" opacity="0.18" />
            <rect x="552" y="40" width="20" height="20" rx="3" fill="#1A6B3A" opacity="0.12" />

            {/* Linha diagonal tênue */}
            <line x1="0" y1="700" x2="420" y2="0" stroke="#1A6B3A" strokeWidth="0.75" opacity="0.07" strokeDasharray="6 10" />
          </svg>
        </div>

        <div className="container hp-hero__container">
          <div className="hp-hero__left">
            <span className="hp-eyebrow">
              <span className="hp-eyebrow__dot" aria-hidden="true" />
              Federação Nacional de Startups — Brasil
            </span>
            <h1 className="hp-hero__title">
              Inovação<br />que<br /><mark className="hp-hero__mark">transforma.</mark>
            </h1>
          </div>
          <div className="hp-hero__right">
            <p className="hp-hero__desc">
              Unindo startups, empreendedores e líderes de inovação para posicionar
              o Brasil como referência global em tecnologia e desenvolvimento sustentável.
            </p>
            <div className="hp-hero__actions">
              <button className="hp-btn hp-btn--dark" onClick={onOpenCadastro}>Associe-se</button>
              <button className="hp-btn hp-btn--outline" onClick={onOpenLogin}>Entrar</button>
            </div>
          </div>
        </div>
        <div className="hp-hero__rule" />
      </section>


      {/* ─── O que fazemos ─── */}
      <section id="o-que-fazemos" className="hp-section">
        <div className="container">
          <span className="hp-eyebrow">O que fazemos</span>
          <div className="hp-cards">
            {ACTIVITIES.map((a) => (
              <div key={a.n} className="hp-card">
                <CardVisual visual={a.visual} />
                <div className="hp-card__body">
                  <div className="hp-card__number">{a.n}</div>
                  <h3 className="hp-card__title">{a.title}</h3>
                  <p className="hp-card__text">{a.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="hp-rule" />

      {/* ─── Princípios ─── */}
      <section id="principios" className="hp-section">
        <div className="container">
          <div className="hp-principles__header">
            <span className="hp-eyebrow">Princípios & Diretrizes</span>
            <h2 className="hp-section__title hp-section__title--wide">
              5 diretrizes que guiam nossa atuação.
            </h2>
          </div>
          <div className="hp-principles">
            {PRINCIPLES.map((p) => (
              <div key={p.n} className="hp-principle">
                <div className="hp-principle__num">{p.n}</div>
                <div className="hp-principle__body">
                  <h3 className="hp-principle__title">{p.title}</h3>
                  <p className="hp-principle__text">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Missão & Valores ─── */}
      <section className="hp-section hp-mv">
        <div className="container hp-mv__grid">
          <div className="hp-mv-card">
            <span className="hp-eyebrow">Nossa Missão</span>
            <p className="hp-mv-card__text">
              Ser o principal catalisador do desenvolvimento tecnológico, científico e
              socioeconômico do Brasil — promovendo prosperidade, bem-estar social e
              os avanços civilizatórios da sociedade brasileira.
            </p>
          </div>
          <div className="hp-mv-card">
            <span className="hp-eyebrow">Nossos Valores</span>
            <p className="hp-mv-card__text">
              Acreditamos na <strong>colaboração</strong>, na <strong>inclusão</strong> e
              na <strong>inovação</strong> como pilares para transformar o futuro.
              Valorizamos a <strong>diversidade</strong>, a <strong>sustentabilidade</strong> e
              o <strong>impacto positivo</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Visão ─── */}
      <section id="visao" className="hp-vision">
        <div className="container">
          <span className="hp-eyebrow hp-eyebrow--light">Nossa Visão</span>
          <blockquote className="hp-vision__quote">
            "Ser reconhecida como a principal plataforma de fortalecimento do ecossistema
            de inovação do Brasil, contribuindo para transformar o país em uma potência
            tecnológica, sustentável e socialmente justa."
          </blockquote>
        </div>
      </section>

      {/* ─── Equipe ─── */}
      <section id="equipe" className="hp-section">
        <div className="container">
          <span className="hp-eyebrow">Direção Executiva</span>
          <div className="hp-team">
            {TEAM.map((m) => (
              <div key={m.name} className="hp-team-card">
                <div className="hp-team-card__initials">{getInitials(m.name)}</div>
                <h3 className="hp-team-card__name">{m.name}</h3>
                <p className="hp-team-card__role">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="hp-cta">
        <div className="container hp-cta__inner">
          <div className="hp-cta__left">
            <span className="hp-eyebrow hp-eyebrow--light">Faça parte</span>
            <h2 className="hp-cta__title">Seja parte<br />da transformação.</h2>
          </div>
          <div className="hp-cta__right">
            <p className="hp-cta__desc">
              A FNStartup convida você a construir um futuro onde a inovação tecnológica
              seja a força motriz de um Brasil mais próspero e inclusivo.
            </p>
            <div className="hp-cta__actions">
              <button className="hp-btn hp-btn--white" onClick={onOpenCadastro}>Associe-se Agora</button>
              <button className="hp-btn hp-btn--ghost-light" onClick={onOpenLogin}>
                {isAuthenticated && usuario ? 'Minha Conta' : 'Fazer Login'}
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default HomePage;
