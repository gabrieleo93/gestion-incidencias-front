import { Injectable } from '@angular/core';
import { AuthRequest } from '../../models/auth-request.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../models/auth-response.model';
import { environment } from '../../../environments/environment';
import { isUserRole, UserRole } from '../../models/user-role.model';
import {JwtPayload} from "../../models/jwt-payload.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;

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

  obtenerUsuarioId(): number | null {
    const usuarioId = localStorage.getItem('usuarioId');

    if (usuarioId === null) {
      return null;
    }

    const usuarioIdNumerico = Number(usuarioId);
    return Number.isInteger(usuarioIdNumerico) && usuarioIdNumerico > 0
      ? usuarioIdNumerico
      : null;
  }
  obtenerNombre(): string | null {
    return localStorage.getItem('nombre');
  }
  obtenerEmail(): string | null {
    return localStorage.getItem('email');
  }

  esAdmin(): boolean {
    return this.obtenerRol() === UserRole.Admin;
  }
  esTecnico(): boolean {
    return this.obtenerRol() === UserRole.Tecnico;
  }
  esUsuario(): boolean {
    return this.obtenerRol() === UserRole.User;
  }
  obtenerRol(): UserRole | null {
    const rol = localStorage.getItem('rol');
    return isUserRole(rol) ? rol : null;
  }
 private decodificarPayloadToken(token: string): JwtPayload | null {
  try {
    const partesToken = token.split('.');
    if (partesToken.length !== 3) {
      return null;
    }
    const payloadBase64Url = partesToken[1];
    const payloadBase64 = payloadBase64Url
    .replace(/-/g, '+')
    .replace(/_/g, '/');
    const payloadConPadding = payloadBase64.padEnd(Math.ceil(payloadBase64.length / 4) * 4, '=');
    const payloadJson = atob(payloadConPadding);
    return JSON.parse(payloadJson) as JwtPayload;
  } catch  {

    return null;
  }
}

  estaAutenticado(): boolean {
    const token = this.obtenerToken();
    if (!token) {
      return false;
    }
    const payload = this.decodificarPayloadToken(token);
    if (!payload || typeof payload.exp !== 'number'||!Number.isFinite(payload.exp)) {
      this.logout();
      return false;
    }
     const fechaExpiracion = payload.exp * 1000;
  const tokenExpirado = fechaExpiracion <= Date.now();

  if (tokenExpirado) {
    this.logout();
    return false;
  }

  return true;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('nombre');
    localStorage.removeItem('email');
    localStorage.removeItem('rol');
  }
}
