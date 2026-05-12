export interface JWTPayload {
  usuario_id: string;
  startup_id: string;
  tipo_usuario: string;
  exp: number;
  iat: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  usuario: import('./Usuario').Usuario;
  startup: import('./Startup').Startup;
}
