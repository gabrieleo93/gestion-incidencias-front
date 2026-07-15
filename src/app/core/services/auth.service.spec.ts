import { TestBed } from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {AuthResponse} from '../../models/auth-response.model';

import { AuthService } from './auth.service';
import {AuthRequest} from '../../models/auth-request.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save the session in localStorage', () => {
  const response: AuthResponse = {
    token: 'token-de-prueba',
    tipo: 'Bearer',
    usuarioId: 10,
    nombre: 'Gabriel',
    email: 'gabriel@example.com',
    rol: 'ADMIN'
  };
service.guardarSesion(response);

  expect(localStorage.getItem('token')).toBe('token-de-prueba');
  expect(localStorage.getItem('usuarioId')).toBe('10');
  expect(localStorage.getItem('nombre')).toBe('Gabriel');
  expect(localStorage.getItem('email')).toBe('gabriel@example.com');
  expect(localStorage.getItem('rol')).toBe('ADMIN');
});

it('should remove the session on logout', () => {
  localStorage.setItem('token', 'token-de-prueba');
  localStorage.setItem('usuarioId', '10');
  localStorage.setItem('nombre', 'Gabriel');
  localStorage.setItem('email', 'gabriel@example.com');
  localStorage.setItem('rol', 'ADMIN');

  service.logout();

  expect(localStorage.getItem('token')).toBeNull();
  expect(localStorage.getItem('usuarioId')).toBeNull();
  expect(localStorage.getItem('nombre')).toBeNull();
  expect(localStorage.getItem('email')).toBeNull();
  expect(localStorage.getItem('rol')).toBeNull();
});
it('should send a POST request when logging in', () => {
  const credentials: AuthRequest = {
    email: 'gabriel@example.com',
    password: '123456'
  };

  const expectedResponse: AuthResponse = {
    token: 'token-de-prueba',
    tipo: 'Bearer',
    usuarioId: 10,
    nombre: 'Gabriel',
    email: 'gabriel@example.com',
    rol: 'ADMIN'
  };

  service.login(credentials).subscribe(response => {
    expect(response).toEqual(expectedResponse);
  });

  const request = httpTesting.expectOne(
    'http://localhost:8082/api/auth/login'
  );

  expect(request.request.method).toBe('POST');
  expect(request.request.body).toEqual(credentials);

  request.flush(expectedResponse);
});
});
