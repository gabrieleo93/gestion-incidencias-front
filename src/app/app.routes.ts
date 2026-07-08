import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ListadoIncidenciasComponent } from './features/incidencias/listado-incidencias/listado-incidencias.component';
import { CrearIncidenciaComponent } from './features/incidencias/crear-incidencia/crear-incidencia.component';
import { DetalleIncidenciaComponent } from './features/incidencias/detalle-incidencia/detalle-incidencia.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'incidencias',
    component: ListadoIncidenciasComponent,
    canActivate: [authGuard]
  },
  {
    path: 'incidencias/nueva',
    component: CrearIncidenciaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'incidencias/:id',
    component: DetalleIncidenciaComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
