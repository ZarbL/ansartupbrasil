import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';
import type { Usuario } from '../models/Usuario';
import type { Startup } from '../models/Startup';
import type { JWTPayload } from '../models/Sessao';

const STORAGE_TOKEN = '@anstartup:accessToken';
const STORAGE_USUARIO = '@anstartup:usuario';
const STORAGE_STARTUP = '@anstartup:startup';

interface AuthContextData {
  usuario: Usuario | null;
  startup: Startup | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUsuario: (usuario: Usuario) => void;
  updateStartup: (startup: Startup) => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function isTokenValid(token: string): boolean {
  try {
    const { exp } = jwtDecode<JWTPayload>(token);
    return exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

function clearStorage() {
  sessionStorage.removeItem(STORAGE_TOKEN);
  localStorage.removeItem(STORAGE_USUARIO);
  localStorage.removeItem(STORAGE_STARTUP);
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [startup, setStartup] = useState<Startup | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hidratação inicial a partir do storage
  useEffect(() => {
    const token = sessionStorage.getItem(STORAGE_TOKEN);
    const storedUsuario = localStorage.getItem(STORAGE_USUARIO);
    const storedStartup = localStorage.getItem(STORAGE_STARTUP);

    if (token && storedUsuario && isTokenValid(token)) {
      setAccessToken(token);
      setUsuario(JSON.parse(storedUsuario));
      if (storedStartup) setStartup(JSON.parse(storedStartup));
    } else {
      clearStorage();
    }

    setIsLoading(false);
  }, []);

  // Escuta evento de logout forçado (ex: refresh token expirado)
  useEffect(() => {
    const handleForcedLogout = () => logout();
    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const response = await authService.login({ email, senha });

    sessionStorage.setItem(STORAGE_TOKEN, response.accessToken);
    localStorage.setItem(STORAGE_USUARIO, JSON.stringify(response.usuario));
    localStorage.setItem(STORAGE_STARTUP, JSON.stringify(response.startup));

    setAccessToken(response.accessToken);
    setUsuario(response.usuario);
    setStartup(response.startup);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Limpa localmente mesmo se a API falhar
    } finally {
      clearStorage();
      setAccessToken(null);
      setUsuario(null);
      setStartup(null);
    }
  }, []);

  const updateUsuario = useCallback((novoUsuario: Usuario) => {
    setUsuario(novoUsuario);
    localStorage.setItem(STORAGE_USUARIO, JSON.stringify(novoUsuario));
  }, []);

  const updateStartup = useCallback((novaStartup: Startup) => {
    setStartup(novaStartup);
    localStorage.setItem(STORAGE_STARTUP, JSON.stringify(novaStartup));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        startup,
        accessToken,
        isAuthenticated: !!accessToken && !!usuario,
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
