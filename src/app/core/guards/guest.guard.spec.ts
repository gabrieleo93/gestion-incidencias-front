import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { guestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';

describe('guestGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let redirectTree: UrlTree;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      guestGuard(...guardParameters)
    );

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['estaAutenticado']
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

  it('should allow access to login when the user is not authenticated', () => {
    authServiceMock.estaAutenticado.and.returnValue(false);

    const result = executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(result).toBeTrue();
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect authenticated users to incidencias', () => {
    authServiceMock.estaAutenticado.and.returnValue(true);

    const result = executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(result).toBe(redirectTree);
    expect(routerMock.createUrlTree)
      .toHaveBeenCalledOnceWith(['/incidencias']);
  });
});
