export interface RegisterDTO {
  nombre: string;
  correo: string;
  password: string;
}

export interface LoginDTO {
  correo: string;
  password: string;
}

export interface UsuarioProfile {
  id_usuario: string;
  nombre: string;
  correo: string;
  fecha_registro: string;
}