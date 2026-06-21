import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import LoginModal from './components/LoginModal/LoginModal';
import CadastroModal from './components/CadastroModal/CadastroModal';
import EsqueciSenhaModal from './components/EsqueciSenhaModal/EsqueciSenhaModal';
import HomePage from './pages/HomePage/HomePage';
import VerificarEmailPage from './pages/VerificarEmailPage/VerificarEmailPage';
import RedefinirSenhaPage from './pages/RedefinirSenhaPage/RedefinirSenhaPage';
import WorkInProgressPage from './pages/WorkInProgressPage/WorkInProgressPage';
import QuemSomosPage from './pages/QuemSomosPage/QuemSomosPage';
import './App.css';

type ModalState = 'none' | 'login' | 'cadastro' | 'forgotPassword';

function MainLayout() {
  const [modal, setModal] = useState<ModalState>('none');
  const location = useLocation();

  useEffect(() => {
    if ((location.state as { openLogin?: boolean })?.openLogin) {
      setModal('login');
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location.state, location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('login') === '1') {
      setModal('login');
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location.search, location.pathname]);

  const openLogin = () => setModal('login');
  const openCadastro = () => setModal('cadastro');
  const openForgotPassword = () => setModal('forgotPassword');
  const closeModal = () => setModal('none');

  return (
    <div className="App">
      <Header onOpenLogin={openLogin} onOpenCadastro={openCadastro} />

      <HomePage onOpenCadastro={openCadastro} onOpenLogin={openLogin} />

      <Footer />

      <LoginModal
        isOpen={modal === 'login'}
        onClose={closeModal}
        onSwitchToCadastro={openCadastro}
        onForgotPassword={openForgotPassword}
      />

      <CadastroModal
        isOpen={modal === 'cadastro'}
        onClose={closeModal}
        onSwitchToLogin={openLogin}
        onSuccess={openLogin}
      />

      <EsqueciSenhaModal
        isOpen={modal === 'forgotPassword'}
        onClose={closeModal}
        onSwitchToLogin={openLogin}
      />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/dashboard" element={<WorkInProgressPage />} />
      <Route path="/quem-somos" element={<QuemSomosPage />} />
      <Route path="/verificar-email" element={<VerificarEmailPage />} />
      <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
    </Routes>
  );
}

export default App;
