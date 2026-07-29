import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  const incidenciasUrl = `${environment.apiUrl}/incidencias`;
  const loginUrl = `${environment.apiUrl}/auth/login`;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['obtenerToken', 'logout']
    );

    routerMock = jasmine.createSpyObj<Router>(
      'Router',
      ['navigate']
    );

    routerMock.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([authInterceptor])
        ),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should add the authorization header when a token exists', () => {
    authServiceMock.obtenerToken.and.returnValue('token-de-prueba');

    httpClient.get(incidenciasUrl).subscribe();

    const request = httpTesting.expectOne(incidenciasUrl);

    expect(request.request.headers.get('Authorization'))
      .toBe('Bearer token-de-prueba');

    request.flush([]);
  });

  it('should not add the authorization header without a token', () => {
    authServiceMock.obtenerToken.and.returnValue(null);

    httpClient.get(incidenciasUrl).subscribe();

    const request = httpTesting.expectOne(incidenciasUrl);

    expect(request.request.headers.has('Authorization'))
      .toBeFalse();

    request.flush([]);
  });

  it('should logout and redirect to login after a protected 401', () => {
    authServiceMock.obtenerToken.and.returnValue('token-expirado');

    let receivedError: HttpErrorResponse | undefined;

    httpClient.get(incidenciasUrl).subscribe({
      error: (error: HttpErrorResponse) => {
        receivedError = error;
      }
    });

    const request = httpTesting.expectOne(incidenciasUrl);

    request.flush(
      { message: 'Unauthorized' },
      {
        status: 401,
        statusText: 'Unauthorized'
      }
    );

    expect(authServiceMock.logout).toHaveBeenCalledTimes(1);
    expect(routerMock.navigate)
      .toHaveBeenCalledOnceWith(['/login']);
    expect(receivedError?.status).toBe(401);
  });

  it('should not logout or redirect when login returns 401', () => {
    authServiceMock.obtenerToken.and.returnValue(null);

    let receivedError: HttpErrorResponse | undefined;

    httpClient.post(loginUrl, {}).subscribe({
      error: (error: HttpErrorResponse) => {
        receivedError = error;
      }
    });

    const request = httpTesting.expectOne(loginUrl);

    request.flush(
      { message: 'Invalid credentials' },
      {
        status: 401,
        statusText: 'Unauthorized'
      }
    );

    expect(authServiceMock.logout).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(receivedError?.status).toBe(401);
  });

  it('should keep the session and redirect after a 403', () => {
    authServiceMock.obtenerToken.and.returnValue('token-valido');

    let receivedError: HttpErrorResponse | undefined;

    httpClient.get(incidenciasUrl).subscribe({
      error: (error: HttpErrorResponse) => {
        receivedError = error;
      }
    });

    const request = httpTesting.expectOne(incidenciasUrl);

    request.flush(
      { message: 'Forbidden' },
      {
        status: 403,
        statusText: 'Forbidden'
      }
    );

    expect(authServiceMock.logout).not.toHaveBeenCalled();
    expect(routerMock.navigate)
      .toHaveBeenCalledOnceWith(['/acceso-denegado']);
    expect(receivedError?.status).toBe(403);
  });

  it('should propagate other errors without changing the session', () => {
    authServiceMock.obtenerToken.and.returnValue('token-valido');

    let receivedError: HttpErrorResponse | undefined;

    httpClient.get(incidenciasUrl).subscribe({
      error: (error: HttpErrorResponse) => {
        receivedError = error;
      }
    });

    const request = httpTesting.expectOne(incidenciasUrl);

    request.flush(
      { message: 'Internal server error' },
      {
        status: 500,
        statusText: 'Internal Server Error'
      }
    );

    expect(authServiceMock.logout).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(receivedError?.status).toBe(500);
  });
});
