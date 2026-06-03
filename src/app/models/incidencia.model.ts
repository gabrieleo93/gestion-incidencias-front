export interface Incidencia {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'ABIERTA' | 'EN_PROCESO' | 'RESUELTA' | 'CERRADA';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  fechaCreacion: string;
  fechaActualizacion: string | null;
  fechaCierre: string | null;
  usuarioCreadorId: number;
  nombreUsuarioCreador: string;
}
