import { Injectable } from '@angular/core';
import { AuthRequest } from '../../models/auth-request.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8082/api/auth';

  constructor(private http: HttpClient) { }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  guardarSesion(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('usuarioId', response.usuarioId.toString());
    localStorage.setItem('nombre', response.nombre);
    localStorage.setItem('email', response.email);
    localStorage.setItem('rol', response.rol);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerUsuarioId(): String | null {
    return localStorage.getItem('usuarioId');
  }
  obtenerNombre(): string | null {
    return localStorage.getItem('nombre');
  }
  obtenerEmail(): string | null {
    return localStorage.getItem('email');
  }

  esAdmin(): boolean {
    return this.obtenerRol() === 'ADMIN';
  }
  esTecnico(): boolean {
    return this.obtenerRol() === 'TECNICO';
  }
  esUsuario(): boolean {
    return this.obtenerRol() === 'USER';
  }
  obtenerRol(): string | null {
    return localStorage.getItem('rol');
  }


  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('nombre');
    localStorage.removeItem('email');
    localStorage.removeItem('rol');
  }
}
