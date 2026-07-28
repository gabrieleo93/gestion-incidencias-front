import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

import { RoleRouteData } from '../../models/role-route-data.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

const routeData = route.data as Partial<RoleRouteData>;
const rolesPermitidos = routeData.roles;
const rolActual = authService.obtenerRol();

 if (!rolActual) {
  authService.logout();
  return router.createUrlTree(['/login']);
}
if (!rolesPermitidos?.length) {
  return router.createUrlTree(['/acceso-denegado']);
}

if (rolesPermitidos.includes(rolActual)) {
  return true;
}

return router.createUrlTree(['/acceso-denegado']);
};
