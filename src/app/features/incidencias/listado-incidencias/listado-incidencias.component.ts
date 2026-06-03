import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Incidencia } from '../../../models/incidencia.model';
import { IncidenciaService } from '../../../core/services/incidencia.service';

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

  constructor(private incidenciaService: IncidenciaService) { }

  ngOnInit(): void {
    this.cargarIncidencias();
  }

  cargarIncidencias(): void {
    this.incidenciaService.listarIncidencias().subscribe({
      next: (data) => {
        this.incidencias = data;
      },
      error: (error) => {
        console.log('Error al cargar incidencias', error);
        this.mensajeError = 'No se pudieron cargar las incidencias';
      }
    });
  }
}
