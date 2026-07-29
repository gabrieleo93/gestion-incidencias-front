import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { DetalleIncidenciaComponent } from './detalle-incidencia.component';
import { IncidenciaService } from '../../../core/services/incidencia.service';
import { AuthService } from '../../../core/services/auth.service';
import { EstadoIncidencia } from '../../../models/estado-incidencia.model';
import { Incidencia } from '../../../models/incidencia.model';

describe('DetalleIncidenciaComponent', () => {
  let component: DetalleIncidenciaComponent;
  let fixture: ComponentFixture<DetalleIncidenciaComponent>;
  let incidenciaServiceMock: jasmine.SpyObj<IncidenciaService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    incidenciaServiceMock = jasmine.createSpyObj<IncidenciaService>(
      'IncidenciaService',
      [
        'obtenerIncidenciaPorId',
        'obtenerMiIncidenciaPorId',
        'actualizarEstado'
      ]
    );

    authServiceMock = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['esUsuario', 'esAdmin', 'esTecnico']
    );

    authServiceMock.esUsuario.and.returnValue(false);
    authServiceMock.esAdmin.and.returnValue(false);
    authServiceMock.esTecnico.and.returnValue(true);
    incidenciaServiceMock.obtenerIncidenciaPorId.and.returnValue(
      of(crearIncidencia(EstadoIncidencia.Abierta))
    );

    await TestBed.configureTestingModule({
      imports: [DetalleIncidenciaComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        },
        {
          provide: IncidenciaService,
          useValue: incidenciaServiceMock
        },
        {
          provide: AuthService,
          useValue: authServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleIncidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show the next action to a technician', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const actionButton = compiled.querySelector(
      'button.estado-btn'
    );

    expect(actionButton?.textContent?.trim()).toBe('Iniciar trabajo');
  });

  it('should not allow a regular user to manage the state', () => {
    authServiceMock.esTecnico.and.returnValue(false);
    authServiceMock.esUsuario.and.returnValue(true);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.estado-actions')).toBeNull();
  });

  it('should advance an open incident to en proceso', () => {
    const updatedIncident = crearIncidencia(
      EstadoIncidencia.EnProceso
    );
    incidenciaServiceMock.actualizarEstado.and.returnValue(
      of(updatedIncident)
    );

    component.actualizarEstado();
    fixture.detectChanges();

    expect(incidenciaServiceMock.actualizarEstado)
      .toHaveBeenCalledOnceWith(1, EstadoIncidencia.EnProceso);
    expect(component.incidencia).toEqual(updatedIncident);
    expect(component.mensajeExito)
      .toBe('Estado actualizado correctamente');
    expect(component.textoAccionEstado())
      .toBe('Marcar como resuelta');
  });

  it('should follow the complete state sequence', () => {
    component.incidencia = crearIncidencia(
      EstadoIncidencia.Abierta
    );
    expect(component.siguienteEstado())
      .toBe(EstadoIncidencia.EnProceso);

    component.incidencia = crearIncidencia(
      EstadoIncidencia.EnProceso
    );
    expect(component.siguienteEstado())
      .toBe(EstadoIncidencia.Resuelta);

    component.incidencia = crearIncidencia(
      EstadoIncidencia.Resuelta
    );
    expect(component.siguienteEstado())
      .toBe(EstadoIncidencia.Cerrada);

    component.incidencia = crearIncidencia(
      EstadoIncidencia.Cerrada
    );
    expect(component.siguienteEstado()).toBeNull();
  });

  it('should not allow a closed incident to be reopened', () => {
    component.incidencia = crearIncidencia(
      EstadoIncidencia.Cerrada,
      '2026-07-29T12:00:00'
    );

    component.actualizarEstado();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(component.puedeGestionarEstado()).toBeFalse();
    expect(incidenciaServiceMock.actualizarEstado)
      .not.toHaveBeenCalled();
    expect(compiled.querySelector('.estado-actions')).toBeNull();
    expect(compiled.querySelector('.closed-notice')?.textContent)
      .toContain('no puede reabrirse');
  });

  it('should close a resolved incident and display its closing date', () => {
    component.incidencia = crearIncidencia(
      EstadoIncidencia.Resuelta
    );
    const closedIncident = crearIncidencia(
      EstadoIncidencia.Cerrada,
      '2026-07-29T12:00:00'
    );
    incidenciaServiceMock.actualizarEstado.and.returnValue(
      of(closedIncident)
    );

    component.actualizarEstado();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(incidenciaServiceMock.actualizarEstado)
      .toHaveBeenCalledOnceWith(1, EstadoIncidencia.Cerrada);
    expect(component.mensajeExito)
      .toBe('Incidencia cerrada correctamente');
    expect(compiled.textContent).toContain('Fecha de cierre:');
    expect(component.puedeGestionarEstado()).toBeFalse();
  });

  function crearIncidencia(
    estado: EstadoIncidencia,
    fechaCierre: string | null = null
  ): Incidencia {
    return {
      id: 1,
      titulo: 'Error de acceso',
      descripcion: 'No es posible acceder al sistema',
      estado,
      prioridad: 'ALTA',
      fechaCreacion: '2026-07-29T10:00:00',
      fechaActualizacion: '2026-07-29T11:00:00',
      fechaCierre,
      usuarioCreadorId: 2,
      nombreUsuarioCreador: 'Usuario'
    };
  }
});
