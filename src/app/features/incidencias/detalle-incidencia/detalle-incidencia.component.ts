import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { Incidencia } from '../../../models/incidencia.model';
import { IncidenciaService } from '../../../core/services/incidencia.service';
import { AuthService } from '../../../core/services/auth.service';
import { EstadoIncidencia } from '../../../models/estado-incidencia.model';

@Component({
  selector: 'app-detalle-incidencia',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-incidencia.component.html',
  styleUrl: './detalle-incidencia.component.css'
})
export class DetalleIncidenciaComponent implements OnInit {
  incidencia: Incidencia | undefined;
  mensajeError: string | undefined;
  mensajeExito: string | undefined;
  actualizandoEstado = false;

  constructor(
    private route: ActivatedRoute,
    private incidenciaService: IncidenciaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.mensajeError = 'ID de incidencia no válido';
      return;
    }
    this.cargarIncidencia(id);
  }

  cargarIncidencia(id: number): void {
    // Cambio funcional: USER consulta el detalle desde el endpoint limitado a incidencias propias.
    const incidencia$ = this.authService.esUsuario()
      ? this.incidenciaService.obtenerMiIncidenciaPorId(id)
      : this.incidenciaService.obtenerIncidenciaPorId(id);

    incidencia$.subscribe({
      next: (data) => {
        this.incidencia = data;
        this.mensajeError = undefined;
      },
      error: (error) => {
        console.log('Error al cargar la incidencia', error);
        this.mensajeError = 'No se pudo cargar el detalle de la incidencia';
      }
    });
  }

  puedeGestionarEstado(): boolean {
    return (
      (this.authService.esAdmin() || this.authService.esTecnico()) &&
      !this.estaCerrada()
    );
  }

  estaCerrada(): boolean {
    return this.incidencia?.estado === EstadoIncidencia.Cerrada;
  }

  siguienteEstado(): EstadoIncidencia | null {
    switch (this.incidencia?.estado) {
      case EstadoIncidencia.Abierta:
        return EstadoIncidencia.EnProceso;
      case EstadoIncidencia.EnProceso:
        return EstadoIncidencia.Resuelta;
      case EstadoIncidencia.Resuelta:
        return EstadoIncidencia.Cerrada;
      default:
        return null;
    }
  }

  textoAccionEstado(): string {
    switch (this.siguienteEstado()) {
      case EstadoIncidencia.EnProceso:
        return 'Iniciar trabajo';
      case EstadoIncidencia.Resuelta:
        return 'Marcar como resuelta';
      case EstadoIncidencia.Cerrada:
        return 'Cerrar incidencia';
      default:
        return 'Sin acciones disponibles';
    }
  }

  actualizarEstado(): void {
    const incidencia = this.incidencia;
    const nuevoEstado = this.siguienteEstado();

    if (!incidencia || !nuevoEstado || !this.puedeGestionarEstado()) {
      return;
    }

    this.actualizandoEstado = true;
    this.mensajeError = undefined;
    this.mensajeExito = undefined;

    this.incidenciaService
      .actualizarEstado(incidencia.id, nuevoEstado)
      .pipe(
        finalize(() => {
          this.actualizandoEstado = false;
        })
      )
      .subscribe({
        next: (incidenciaActualizada) => {
          this.incidencia = incidenciaActualizada;
          this.mensajeExito =
            nuevoEstado === EstadoIncidencia.Cerrada
              ? 'Incidencia cerrada correctamente'
              : 'Estado actualizado correctamente';
        },
        error: (error: HttpErrorResponse) => {
          this.mensajeError =
            error.error?.message ??
            'No se pudo actualizar el estado de la incidencia';
        }
      });
  }
}
