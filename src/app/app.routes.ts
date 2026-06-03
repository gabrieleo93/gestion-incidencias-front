import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ListadoIncidenciasComponent } from './features/incidencias/listado-incidencias/listado-incidencias.component';
import { CrearIncidenciaComponent } from './features/incidencias/crear-incidencia/crear-incidencia.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'incidencias',
    component: ListadoIncidenciasComponent
  },
  {
    path: 'incidencia/nueva',
    component: CrearIncidenciaComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
