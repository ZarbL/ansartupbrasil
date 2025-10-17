import React, { useState, useEffect } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Verificar se há preferência salva no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    const theme = newTheme ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <img 
            src={isDarkMode ? "/logodark.jpeg" : "/logowhite.jpeg"} 
            alt="ANSTARTUP Brasil - Transformando o Ecossistema de Startups" 
            className="logo"
          />
        </div>
        
        <nav className="navigation">
          <a href="#quem-somos" className="nav-link">Quem Somos</a>
          <a href="#missao-valores" className="nav-link">Missão & Valores</a>
          <a href="#principios" className="nav-link">Princípios</a>
          <a href="#o-que-fazemos" className="nav-link">O Que Fazemos</a>
          <a href="#visao" className="nav-link">Visão</a>
          <a href="#equipe" className="nav-link">Equipe</a>
        </nav>
        
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Alternar para modo ${isDarkMode ? 'claro' : 'escuro'}`}
        >
          <div className="toggle-track">
            <div className="toggle-thumb">
              {isDarkMode ? '🌙' : '☀️'}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;