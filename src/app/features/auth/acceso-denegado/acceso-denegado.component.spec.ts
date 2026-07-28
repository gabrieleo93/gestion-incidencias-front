import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AccesoDenegadoComponent } from './acceso-denegado.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../models/user-role.model';

describe('AccesoDenegadoComponent', () => {
  let component: AccesoDenegadoComponent;
  let fixture: ComponentFixture<AccesoDenegadoComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['obtenerRol']
    );

    authServiceMock.obtenerRol.and.returnValue(UserRole.Tecnico);

    await TestBed.configureTestingModule({
      imports: [AccesoDenegadoComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccesoDenegadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the access denied title and current role', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');
    const description = compiled.querySelector(
      '.access-denied-description'
    );

    expect(title?.textContent?.trim()).toBe('Acceso denegado');
    expect(description?.textContent).toContain(UserRole.Tecnico);
  });

  it('should provide a link to return to the incident list', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector(
      'a.back-link'
    ) as HTMLAnchorElement | null;

    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe('/incidencias');
  });

  it('should display desconocido when there is no valid role', () => {
    authServiceMock.obtenerRol.and.returnValue(null);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const role = compiled.querySelector(
      '.access-denied-description strong'
    );

    expect(role?.textContent?.trim()).toBe('Desconocido');
  });
});
