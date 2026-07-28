import { UserRole } from './user-role.model';

export interface AuthResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  nombre: string;
  email: string;
  rol: UserRole;
}
