import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IncidenciaService } from '../../../core/services/incidencia.service';
import { IncidenciaRequest } from '../../../models/incidencia-request.model';

@Component({
  selector: 'app-crear-incidencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-incidencia.component.html',
  styleUrl: './crear-incidencia.component.css'
})
export class CrearIncidenciaComponent {

  incidenciaForm: FormGroup;
  mensajeError: string = '';

  prioridades = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];

  constructor(
    private fb: FormBuilder,
    private incidenciaService: IncidenciaService,
    private router: Router
  ) {
    this.incidenciaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(120)]],
      descripcion: ['', [Validators.required]],
      prioridad: ['MEDIA', [Validators.required]]
    });
  }

  crearIncidencia(): void {
    if (this.incidenciaForm.invalid) {
      this.incidenciaForm.markAllAsTouched();
      return;
    }

    const usuarioId = Number(localStorage.getItem('usuarioId'));

    const request: IncidenciaRequest = {
      titulo: this.incidenciaForm.value.titulo,
      descripcion: this.incidenciaForm.value.descripcion,
      prioridad: this.incidenciaForm.value.prioridad,
      usuarioCreadorId: usuarioId
    };

    this.incidenciaService.crearIncidencia(request).subscribe({
      next: () => {
        this.router.navigate(['/incidencias']);
      },
      error: (error) => {
        console.log('Error al crear incidencia', error);
        this.mensajeError = 'No se pudo crear la incidencia';
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/incidencias']);
  }
}
