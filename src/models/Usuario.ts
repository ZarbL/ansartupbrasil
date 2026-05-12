export type TipoUsuario = 'admin' | 'representante' | 'membro';

export interface Usuario {
  id: string;
  nome_completo: string;
  email: string;
  cargo: string;
  tipo_usuario: TipoUsuario;
  startup_id: string;
}

export interface UsuarioUpdateDTO {
  nome_completo?: string;
  cargo?: string;
}
