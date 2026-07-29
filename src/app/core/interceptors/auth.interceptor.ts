import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.obtenerToken();
  let requestAutenticada = req;
  if (token) {
    requestAutenticada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

 return next(requestAutenticada).pipe(
    catchError((error: HttpErrorResponse) => {
      const esPeticionLogin =
        req.url === `${environment.apiUrl}/auth/login`;

      if (error.status === 401 && !esPeticionLogin) {
        authService.logout();
        void router.navigate(['/login']);
      }

      if (error.status === 403) {
        void router.navigate(['/acceso-denegado']);
      }

      return throwError(() => error);
    })
  );
};
