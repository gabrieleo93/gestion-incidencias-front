import { EstadoIncidencia } from './estado-incidencia.model';

export interface Incidencia {
  id: number;
  titulo: string;
  descripcion: string;
  estado: EstadoIncidencia;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  fechaCreacion: string;
  fechaActualizacion: string | null;
  fechaCierre: string | null;
  usuarioCreadorId: number;
  nombreUsuarioCreador: string;
}
