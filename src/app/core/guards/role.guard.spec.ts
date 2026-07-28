
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../models/user-role.model';

describe('roleGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let redirectTree: UrlTree;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => roleGuard(...guardParameters));

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['obtenerRol', 'logout']
    );

    routerMock = jasmine.createSpyObj<Router>(
      'Router',
      ['createUrlTree']
    );

    redirectTree = {} as UrlTree;

    routerMock.createUrlTree.and.returnValue(redirectTree);

    TestBed.configureTestingModule({
      providers: [
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
  });

  it('should allow access for ADMIN', () => {
    authServiceMock.obtenerRol.and.returnValue(UserRole.Admin);

    const route = {
      data: {
        roles: [UserRole.Admin, UserRole.User]
      }
    } as unknown as ActivatedRouteSnapshot;

    const state = {} as RouterStateSnapshot;

    const result = executeGuard(route, state);

    expect(result).toBeTrue();
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should allow access for USER', () => {
    authServiceMock.obtenerRol.and.returnValue(UserRole.User);

    const route = {
      data: {
        roles: [UserRole.Admin, UserRole.User]
      }
    } as unknown as ActivatedRouteSnapshot;

    const state = {} as RouterStateSnapshot;

    const result = executeGuard(route, state);

    expect(result).toBeTrue();
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect TECNICO to acceso denegado', () => {
    authServiceMock.obtenerRol.and.returnValue(UserRole.Tecnico);

    const route = {
      data: {
        roles: [UserRole.Admin, UserRole.User]
      }
    } as unknown as ActivatedRouteSnapshot;

    const state = {} as RouterStateSnapshot;

    const result = executeGuard(route, state);

    expect(result).toBe(redirectTree);
    expect(routerMock.createUrlTree)
      .toHaveBeenCalledOnceWith(['/acceso-denegado']);
    expect(authServiceMock.logout).not.toHaveBeenCalled();
  });
  it('should logout and redirect to login when there is no valid role', () => {
  authServiceMock.obtenerRol.and.returnValue(null);

  const route = {
    data: {
      roles: [UserRole.Admin, UserRole.User]
    }
  } as unknown as ActivatedRouteSnapshot;

  const state = {} as RouterStateSnapshot;

  const result = executeGuard(route, state);

  expect(result).toBe(redirectTree);
  expect(authServiceMock.logout).toHaveBeenCalledTimes(1);
  expect(routerMock.createUrlTree)
    .toHaveBeenCalledOnceWith(['/login']);
});
it('should deny access when the route has no roles configured', () => {
  authServiceMock.obtenerRol.and.returnValue(UserRole.Admin);

  const route = {
    data: {}
  } as unknown as ActivatedRouteSnapshot;

  const state = {} as RouterStateSnapshot;

  const result = executeGuard(route, state);

  expect(result).toBe(redirectTree);
  expect(authServiceMock.logout).not.toHaveBeenCalled();
  expect(routerMock.createUrlTree)
    .toHaveBeenCalledOnceWith(['/acceso-denegado']);
});
it('should deny access when the allowed roles list is empty', () => {
  authServiceMock.obtenerRol.and.returnValue(UserRole.Admin);

  const route = {
    data: {
      roles: []
    }
  } as unknown as ActivatedRouteSnapshot;

  const state = {} as RouterStateSnapshot;

  const result = executeGuard(route, state);

  expect(result).toBe(redirectTree);
  expect(authServiceMock.logout).not.toHaveBeenCalled();
  expect(routerMock.createUrlTree)
    .toHaveBeenCalledOnceWith(['/acceso-denegado']);
});
});
