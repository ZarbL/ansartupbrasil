import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginButton from '../LoginButton/LoginButton';
import './Header.css';

interface HeaderProps {
  onOpenLogin?: () => void;
  onOpenCadastro?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenLogin, onOpenCadastro }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isAuthenticated, usuario, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha menu ao redimensionar para desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleMobileLogin = () => { closeMenu(); onOpenLogin?.(); };
  const handleMobileCadastro = () => { closeMenu(); onOpenCadastro?.(); };

  return (
    <header className={`header${isScrolled ? ' header--scrolled' : ''}`}>
      <div className="header-container">

        <a href="/" className="header-logo" aria-label="FNStartup — Página inicial">
          FNStartup
        </a>

        {/* Nav links — desktop only */}
        <nav className="navigation" aria-label="Menu principal">
          {[
            ['/quem-somos',     'Quem Somos'],
            ['/#o-que-fazemos', 'O Que Fazemos'],
            ['/#principios',    'Princípios'],
            ['/#equipe',        'Equipe'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="nav-link">
              {label}
            </a>
          ))}
        </nav>

        {/* Auth buttons — desktop only */}
        <div className="auth-buttons">
          {isAuthenticated && usuario ? (
            <>
              <span className="user-name">{usuario.nome_completo.split(' ')[0]}</span>
              <button className="btn-logout" onClick={() => setShowLogoutConfirm(true)}>Sair</button>
            </>
          ) : (
            <>
              <LoginButton onClick={onOpenLogin} />
              <button className="btn-cadastro" onClick={onOpenCadastro}>Associar-se</button>
            </>
          )}
        </div>

        {/* Hamburger — mobile only */}
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
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="mobile-menu" role="dialog" aria-label="Menu de navegação">
          <nav className="mobile-nav" aria-label="Menu principal mobile">
            {[
              ['/quem-somos',     'Quem Somos'],
              ['/#o-que-fazemos', 'O Que Fazemos'],
              ['/#principios',    'Princípios'],
              ['/#equipe',        'Equipe'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="mobile-nav__link" onClick={closeMenu}>
                {label}
              </a>
            ))}
          </nav>

          <div className="mobile-auth">
            {isAuthenticated && usuario ? (
              <button className="mobile-auth__logout" onClick={() => { closeMenu(); setShowLogoutConfirm(true); }}>
                Sair
              </button>
            ) : (
              <>
                <button className="mobile-auth__login" onClick={handleMobileLogin}>
                  Entrar
                </button>
                <button className="mobile-auth__cadastro" onClick={handleMobileCadastro}>
                  Associar-se
                </button>
              </>
            )}
          </div>
        </div>
      )}

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
