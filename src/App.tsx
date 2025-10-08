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
            <h1>🚀 Transformando o Futuro do Empreendedorismo Brasileiro</h1>
            <p className="hero-description">
              Bem-vindo ao ANSTARTUP Brasil, onde inovação encontra oportunidade. 
              Somos o catalisador que conecta startups disruptivas, investidores visionários 
              e mentores experientes em um ecossistema colaborativo único no país.
            </p>
          </section>

          <section id="sobre" className="content-section">
            <h2>Quem Somos</h2>
            <p>
              ANSTARTUP Brasil é mais que uma plataforma - somos um movimento revolucionário 
              que está redefinindo o panorama empreendedor nacional. Nascemos da visão audaciosa 
              de democratizar o acesso ao ecossistema de inovação, conectando talentos emergentes 
              com recursos transformadores.
            </p>
            <p>
              Nossa equipe é formada por empreendedores seriais, investidores-anjo e especialistas 
              em inovação que acreditam no poder disruptivo das startups brasileiras. Combinamos 
              experiência de mercado com paixão por transformação social, criando pontes entre 
              ideias brilhantes e o sucesso sustentável.
            </p>
            <div className="features-grid">
              <div className="feature-card">
                <h3 data-emoji="🚀">Aceleração Inteligente</h3>
                <p>Programas personalizados que aceleram startups do MVP ao scale-up, com metodologias comprovadas e mentores especialistas</p>
              </div>
              <div className="feature-card">
                <h3 data-emoji="💡">Mentoria Estratégica</h3>
                <p>Conectamos você com líderes da indústria que já trilharam o caminho do sucesso e podem acelerar sua jornada</p>
              </div>
              <div className="feature-card">
                <h3 data-emoji="💰">Capital Inteligente</h3>
                <p>Facilitamos conexões com investidores alinhados com sua visão, desde seed até séries avançadas</p>
              </div>
            </div>
          </section>

          <section id="objetivos" className="content-section">
            <h2>Nossa Missão Transformadora</h2>
            <p>
              Impulsionamos o Brasil como potência global em inovação através 
              de um ecossistema integrado que acelera o sucesso de startups 
              e maximiza o impacto social positivo:
            </p>
            <div className="objectives-list">
              <div className="objective-item">
                <div className="objective-number">01</div>
                <div className="objective-content">
                  <h3>Fomentar Inovação Disruptiva</h3>
                  <p>
                    Cultivamos uma cultura de pensamento exponencial e criatividade 
                    sem limites, incentivando soluções tecnológicas que quebram paradigmas 
                    e resolvem os grandes desafios da sociedade contemporânea.
                  </p>
                </div>
              </div>
              
              <div className="objective-item">
                <div className="objective-number">02</div>
                <div className="objective-content">
                  <h3>Conectar Ecossistemas</h3>
                  <p>
                    Construímos a maior rede colaborativa de empreendedores, investidores-anjo, 
                    VCs e mentores do país, criando sinergias poderosas que aceleram 
                    o crescimento e multiplicam oportunidades de negócio.
                  </p>
                </div>
              </div>
              
              <div className="objective-item">
                <div className="objective-number">03</div>
                <div className="objective-content">
                  <h3>Democratizar Oportunidades</h3>
                  <p>
                    Eliminamos barreiras geográficas e socioeconômicas, tornando recursos 
                    de classe mundial acessíveis a talentos de todo o Brasil, 
                    independentemente de origem ou localização.
                  </p>
                </div>
              </div>
              
              <div className="objective-item">
                <div className="objective-number">04</div>
                <div className="objective-content">
                  <h3>Impacto Social Exponencial</h3>
                  <p>
                    Priorizamos startups que endereçam problemas reais da sociedade brasileira, 
                    promovendo sustentabilidade, inclusão e prosperidade compartilhada 
                    através da inovação tecnológica responsável.
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