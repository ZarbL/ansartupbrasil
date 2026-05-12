import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const PLANO_LABELS: Record<string, string> = {
  basico: '🌱 Básico',
  profissional: '💼 Profissional',
  premium: '⭐ Premium',
  enterprise: '🏆 Enterprise',
};

interface HeaderProps {
  onOpenLogin?: () => void;
  onOpenCadastro?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenLogin, onOpenCadastro }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isAuthenticated, usuario, startup, logout } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setIsDarkMode(theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <img
            src={isDarkMode ? '/logodark.jpeg' : '/logowhite.jpeg'}
            alt="ANSTARTUP Brasil"
            className="logo"
          />
        </div>

        {/* Botão hamburguer — mobile */}
        <button
          className={`hamburger${isMenuOpen ? ' hamburger--open' : ''}`}
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navigation${isMenuOpen ? ' navigation--open' : ''}`} aria-label="Menu principal">
          {[
            ['#quem-somos', 'Quem Somos'],
            ['#missao-valores', 'Missão & Valores'],
            ['#principios', 'Princípios'],
            ['#o-que-fazemos', 'O Que Fazemos'],
            ['#visao', 'Visão'],
            ['#equipe', 'Equipe'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="nav-link" onClick={closeMenu}>
              {label}
            </a>
          ))}
        </nav>

        <div className="auth-buttons">
          {isAuthenticated && usuario ? (
            <>
              <div className="user-info">
                <span className="user-name">👤 {usuario.nome_completo}</span>
                {startup && (
                  <span className="startup-info">
                    {startup.nome_fantasia} · {PLANO_LABELS[startup.tipo_plano]}
                  </span>
                )}
              </div>
              <button className="btn-logout" onClick={() => setShowLogoutConfirm(true)}>
                Sair
              </button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={onOpenLogin}>Login</button>
              <button className="btn-cadastro" onClick={onOpenCadastro}>Cadastrar</button>
            </>
          )}
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Alternar para modo ${isDarkMode ? 'claro' : 'escuro'}`}
        >
          <div className="toggle-track">
            <div className="toggle-thumb">{isDarkMode ? '🌙' : '☀️'}</div>
          </div>
        </button>
      </div>

      {/* Overlay de confirmação de logout — sem window.confirm */}
      {showLogoutConfirm && (
        <div className="logout-confirm-overlay" role="dialog" aria-modal="true" aria-label="Confirmar saída">
          <div className="logout-confirm">
            <p>Deseja realmente sair?</p>
            <div className="logout-confirm__actions">
              <button className="btn-secondary" onClick={() => setShowLogoutConfirm(false)}>Cancelar</button>
              <button className="btn-logout" onClick={handleLogout}>Sair</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
