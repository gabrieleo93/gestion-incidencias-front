export interface IncidenciaRequest {
  titulo: string;
  descripcion: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  usuarioCreadorId: number;
}
