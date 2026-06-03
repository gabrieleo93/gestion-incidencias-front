export interface AuthResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  nombre: string;
  email: string;
  rol: 'USER' | 'ADMIN' | 'TECNICO';
}
