import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__accent" />
      <div className="container footer__inner">

        <div className="footer__brand">
          <span className="footer__logo">FNStartup</span>
          <p className="footer__tagline">Federação Nacional de Startups do Brasil</p>
          <div className="footer__social">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="footer__social-link"
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="footer__social-link"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Navegação</h4>
          <nav className="footer__nav">
            <a href="#quem-somos"    className="footer__link">Quem Somos</a>
            <a href="#o-que-fazemos" className="footer__link">O Que Fazemos</a>
            <a href="#principios"    className="footer__link">Princípios</a>
            <a href="#visao"         className="footer__link">Visão</a>
            <a href="#equipe"        className="footer__link">Equipe</a>
          </nav>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Institucional</h4>
          <nav className="footer__nav">
            <a href="#" className="footer__link">Política de Privacidade</a>
            <a href="#" className="footer__link">Termos de Uso</a>
            <a href="#" className="footer__link">Contato</a>
          </nav>
        </div>

      </div>

      <div className="footer__bottom">
        <div className="container">
          <p className="footer__copy">
            © {year} FNStartup — Federação Nacional de Startups. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
