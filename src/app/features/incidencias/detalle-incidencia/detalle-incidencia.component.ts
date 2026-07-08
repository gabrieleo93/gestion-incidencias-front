import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Incidencia } from '../../../models/incidencia.model';
import { IncidenciaService } from '../../../core/services/incidencia.service';
import { AuthService } from '../../../core/services/auth.service';

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
      },
      error: (error) => {
        console.log('Error al cargar la incidencia', error);
        this.mensajeError = 'No se pudo cargar el detalle de la incidencia';
      }
    });
  }
}
