import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router,RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  get nombreUsuario(): string{
    return this.authService.obtenerNombre() ?? 'Usuario';
  }

  get rolUsuario(): string{
    return this.authService.obtenerRol() ?? '';

  }

  puedeCrearIncidencia(): boolean {
  return this.authService.esAdmin() || this.authService.esUsuario();
}
  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


}
