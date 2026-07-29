import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ListadoIncidenciasComponent } from './features/incidencias/listado-incidencias/listado-incidencias.component';
import { CrearIncidenciaComponent } from './features/incidencias/crear-incidencia/crear-incidencia.component';
import { DetalleIncidenciaComponent } from './features/incidencias/detalle-incidencia/detalle-incidencia.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';
import { UserRole } from './models/user-role.model';
import { RoleRouteData } from './models/role-route-data.model';
import { AccesoDenegadoComponent } from './features/auth/acceso-denegado/acceso-denegado.component';
import { NoEncontradoComponent } from './features/errors/no-encontrado/no-encontrado.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  },
  {
    path: 'incidencias',
    component: ListadoIncidenciasComponent,
    canActivate: [authGuard]
  },
  {
    path: 'incidencias/nueva',
    component: CrearIncidenciaComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [UserRole.Admin, UserRole.User]
    } satisfies RoleRouteData
  },
  {
    path: 'incidencias/:id',
    component: DetalleIncidenciaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'acceso-denegado',
    component: AccesoDenegadoComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
  path: '**',
  component: NoEncontradoComponent
}
];
