import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// Tipos
export interface Usuario {
  id: string;
  nome_completo: string;
  email: string;
  cargo: string;
  tipo_usuario: 'admin' | 'representante' | 'membro';
  startup_id: string;
}

export interface Startup {
  id: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  email_corporativo: string;
  area_atuacao: string;
  status_associacao: 'pendente' | 'ativa' | 'suspensa' | 'cancelada';
  tipo_plano: 'basico' | 'profissional' | 'premium' | 'enterprise';
}

interface AuthContextData {
  usuario: Usuario | null;
  startup: Startup | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  updateUsuario: (usuario: Usuario) => void;
  updateStartup: (startup: Startup) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface JWTPayload {
  usuario_id: string;
  startup_id: string;
  tipo_usuario: string;
  exp: number;
}

// Criar o contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [startup, setStartup] = useState<Startup | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar token ao carregar
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedToken = localStorage.getItem('@anstartup:accessToken');
        const storedUsuario = localStorage.getItem('@anstartup:usuario');
        const storedStartup = localStorage.getItem('@anstartup:startup');

        if (storedToken && storedUsuario) {
          // Verificar se o token não expirou
          const decoded = jwtDecode<JWTPayload>(storedToken);
          const currentTime = Date.now() / 1000;

          if (decoded.exp > currentTime) {
            setAccessToken(storedToken);
            setUsuario(JSON.parse(storedUsuario));
            
            if (storedStartup) {
              setStartup(JSON.parse(storedStartup));
            }
          } else {
            // Token expirado, limpar storage
            localStorage.removeItem('@anstartup:accessToken');
            localStorage.removeItem('@anstartup:usuario');
            localStorage.removeItem('@anstartup:startup');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar autenticação:', error);
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Login
  const login = async (email: string, senha: string) => {
    try {
      // TODO: Substituir por chamada real à API
      // const response = await axios.post('/api/auth/login', { email, senha });
      
      // Simulação temporária (remover quando API estiver pronta)
      console.log('Login:', { email, senha });
      
      // Simulação de resposta da API
      const mockResponse = {
        accessToken: 'mock_access_token_here',
        refreshToken: 'mock_refresh_token_here',
        usuario: {
          id: '660e8400-e29b-41d4-a716-446655440001',
          nome_completo: 'Usuário Teste',
          email: email,
          cargo: 'CEO',
          tipo_usuario: 'admin' as const,
          startup_id: '550e8400-e29b-41d4-a716-446655440001',
        },
        startup: {
          id: '550e8400-e29b-41d4-a716-446655440001',
          nome_fantasia: 'Startup Teste',
          razao_social: 'Startup Teste LTDA',
          cnpj: '12.345.678/0001-90',
          email_corporativo: 'contato@startupteste.com',
          area_atuacao: 'Fintech',
          status_associacao: 'ativa' as const,
          tipo_plano: 'premium' as const,
        },
      };

      // Armazenar no localStorage
      localStorage.setItem('@anstartup:accessToken', mockResponse.accessToken);
      localStorage.setItem('@anstartup:usuario', JSON.stringify(mockResponse.usuario));
      localStorage.setItem('@anstartup:startup', JSON.stringify(mockResponse.startup));

      // Atualizar estado
      setAccessToken(mockResponse.accessToken);
      setUsuario(mockResponse.usuario);
      setStartup(mockResponse.startup);

      // TODO: Armazenar refresh token em httpOnly cookie via API
      
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    // TODO: Chamar API para invalidar sessão
    // await axios.post('/api/auth/logout', { refresh_token });
    
    // Limpar storage
    localStorage.removeItem('@anstartup:accessToken');
    localStorage.removeItem('@anstartup:usuario');
    localStorage.removeItem('@anstartup:startup');

    // Limpar estado
    setAccessToken(null);
    setUsuario(null);
    setStartup(null);
  };

  // Atualizar usuário
  const updateUsuario = (novoUsuario: Usuario) => {
    setUsuario(novoUsuario);
    localStorage.setItem('@anstartup:usuario', JSON.stringify(novoUsuario));
  };

  // Atualizar startup
  const updateStartup = (novaStartup: Startup) => {
    setStartup(novaStartup);
    localStorage.setItem('@anstartup:startup', JSON.stringify(novaStartup));
  };

  const isAuthenticated = !!accessToken && !!usuario;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        startup,
        accessToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUsuario,
        updateStartup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
