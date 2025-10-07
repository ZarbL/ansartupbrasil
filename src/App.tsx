import Header from './components/Header';
import './App.css';
// componentes e estilos
// --- IGNORE -
function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="container">
          <section className="hero-section">
            <h1>Bem-vindo ao ANSTARTUP Brasil</h1>
            <p className="hero-description">
              Esta é a página inicial do projeto ANSTARTUP Brasil. 
              Use o botão no canto superior direito para alternar entre os modos claro e escuro.
            </p>
          </section>

          <section id="sobre" className="content-section">
            <h2>Sobre nós</h2>
            <p>
              ANSTARTUP Brasil é uma iniciativa dedicada ao desenvolvimento 
              e crescimento do ecossistema de startups no Brasil. Nascemos 
              com a missão de conectar empreendedores, investidores e 
              mentores em uma plataforma colaborativa.
            </p>
            <p>
              Nossa equipe é composta por profissionais experientes em 
              tecnologia, negócios e inovação, que acreditam no potencial 
              transformador das startups brasileiras. Trabalhamos para 
              democratizar o acesso a recursos, conhecimento e networking 
              no ecossistema empreendedor nacional.
            </p>
            <div className="features-grid">
              <div className="feature-card">
                <h3>🚀 Aceleração</h3>
                <p>Programas de aceleração para startups em diferentes estágios</p>
              </div>
              <div className="feature-card">
                <h3>💡 Mentoria</h3>
                <p>Conectamos empreendedores com mentores experientes</p>
              </div>
              <div className="feature-card">
                <h3>💰 Investimento</h3>
                <p>Facilitamos o acesso a investidores e capital</p>
              </div>
            </div>
          </section>

          <section id="objetivos" className="content-section">
            <h2>Objetivos</h2>
            <p>
              Nossos objetivos são claros e focados no fortalecimento 
              do ecossistema de inovação brasileiro:
            </p>
            <div className="objectives-list">
              <div className="objective-item">
                <div className="objective-number">01</div>
                <div className="objective-content">
                  <h3>Fomentar a Inovação</h3>
                  <p>
                    Promover uma cultura de inovação e empreendedorismo 
                    em todo o território nacional, incentivando a criação 
                    de soluções tecnológicas disruptivas.
                  </p>
                </div>
              </div>
              
              <div className="objective-item">
                <div className="objective-number">02</div>
                <div className="objective-content">
                  <h3>Conectar Pessoas</h3>
                  <p>
                    Criar uma rede robusta de conexões entre empreendedores, 
                    investidores, mentores e instituições, facilitando 
                    parcerias estratégicas.
                  </p>
                </div>
              </div>
              
              <div className="objective-item">
                <div className="objective-number">03</div>
                <div className="objective-content">
                  <h3>Democratizar o Acesso</h3>
                  <p>
                    Tornar recursos, conhecimento e oportunidades acessíveis 
                    a empreendedores de todas as regiões do Brasil, 
                    independente de sua localização ou background.
                  </p>
                </div>
              </div>
              
              <div className="objective-item">
                <div className="objective-number">04</div>
                <div className="objective-content">
                  <h3>Gerar Impacto Social</h3>
                  <p>
                    Apoiar startups que desenvolvem soluções para problemas 
                    sociais e ambientais, contribuindo para um Brasil 
                    mais sustentável e inclusivo.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;