import { api } from './api';
import type { LoginResponseDTO } from '../models';
import type { CadastroStartupDTO } from '../models';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  senha: string;
  confirmar_senha: string;
}

const authService = {
  async login(payload: LoginPayload): Promise<LoginResponseDTO> {
    const { data } = await api.post<LoginResponseDTO>('/auth/login', payload);
    return data;
  },

  async register(payload: CadastroStartupDTO): Promise<void> {
    await api.post('/auth/register', payload);
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async refreshToken(): Promise<{ accessToken: string }> {
    const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
    return data;
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await api.post('/auth/forgot-password', payload);
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await api.post('/auth/reset-password', payload);
  },

  async verifyEmail(token: string): Promise<void> {
    await api.get(`/auth/verify-email/${token}`);
  },
};

export default authService;
