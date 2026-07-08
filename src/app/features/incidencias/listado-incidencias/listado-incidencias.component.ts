import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Incidencia } from '../../../models/incidencia.model';
import { IncidenciaService } from '../../../core/services/incidencia.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-listado-incidencias',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listado-incidencias.component.html',
  styleUrl: './listado-incidencias.component.css'
})
export class ListadoIncidenciasComponent implements OnInit {

  incidencias: Incidencia[] = [];
  mensajeError: string = '';

  constructor(private incidenciaService: IncidenciaService, private authService: AuthService) { }

  ngOnInit(): void {
    this.cargarIncidencias();
  }

  cargarIncidencias(): void {
    // Cambio funcional: USER consulta sus incidencias propias; ADMIN/TECNICO consultan el listado general.
    const incidencias$ = this.authService.esUsuario()
      ? this.incidenciaService.listarMisIncidencias()
      : this.incidenciaService.listarIncidencias();

    incidencias$.subscribe({
      next: (data) => {
        this.incidencias = data;
      },
      error: (error) => {
        console.log('Error al cargar incidencias', error);
        this.mensajeError = this.authService.esUsuario()
          ? 'No se pudieron cargar tus incidencias'
          : 'No se pudieron cargar las incidencias';
      }
    });
  }

  puedeCrearIncidencia(): boolean {
    return this.authService.esAdmin() || this.authService.esUsuario();
  }

  // Cambio visual: clases para mostrar estado y prioridad como badges de color.
  getEstadoClass(estado: Incidencia['estado']): string {
    return `badge--estado-${estado.toLowerCase().replace('_', '-')}`;
  }

  getPrioridadClass(prioridad: Incidencia['prioridad']): string {
    return `badge--prioridad-${prioridad.toLowerCase()}`;
  }
}
