import { Component } from '@angular/core';
import{ RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './acceso-denegado.component.html',
  styleUrl: './acceso-denegado.component.css'
})
export class AccesoDenegadoComponent {

  constructor(private authService: AuthService) {}

  get rolUsuario(): string{
    return this.authService.obtenerRol() ?? 'Desconocido';
  }

}
