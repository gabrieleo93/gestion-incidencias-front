import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { IncidenciaService } from './incidencia.service';
import { EstadoIncidencia } from '../../models/estado-incidencia.model';
import { Incidencia } from '../../models/incidencia.model';
import { environment } from '../../../environments/environment';

describe('IncidenciaService', () => {
  let service: IncidenciaService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(IncidenciaService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should update an incident state with the backend contract', () => {
    const expectedResponse = crearIncidencia(
      EstadoIncidencia.EnProceso
    );

    service
      .actualizarEstado(1, EstadoIncidencia.EnProceso)
      .subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });

    const request = httpTesting.expectOne(req =>
      req.url === `${environment.apiUrl}/incidencias/1/estado` &&
      req.params.get('estado') === EstadoIncidencia.EnProceso
    );

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toBeNull();

    request.flush(expectedResponse);
  });

  function crearIncidencia(estado: EstadoIncidencia): Incidencia {
    return {
      id: 1,
      titulo: 'Error de acceso',
      descripcion: 'No es posible acceder al sistema',
      estado,
      prioridad: 'ALTA',
      fechaCreacion: '2026-07-29T10:00:00',
      fechaActualizacion: '2026-07-29T11:00:00',
      fechaCierre: null,
      usuarioCreadorId: 2,
      nombreUsuarioCreador: 'Usuario'
    };
  }
});
