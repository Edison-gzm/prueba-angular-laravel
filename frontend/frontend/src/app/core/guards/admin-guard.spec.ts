import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { adminGuard } from './admin-guard';
import { AuthService } from '../services/auth';

describe('adminGuard', () => {
  let router: Router;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: { navigate: vi.fn() },
        },
      ],
    });
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow activation when user is logged in and is admin', () => {
    localStorage.setItem('token', 'x');
    localStorage.setItem('user_role', 'admin');
    const result = TestBed.runInInjectionContext(() => adminGuard(null as any, null as any));
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /auth when user is not logged in', () => {
    const result = TestBed.runInInjectionContext(() => adminGuard(null as any, null as any));
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });

  it('should redirect to /user when user is logged in but not admin', () => {
    localStorage.setItem('token', 'x');
    localStorage.setItem('user_role', 'user');
    const result = TestBed.runInInjectionContext(() => adminGuard(null as any, null as any));
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/user']);
  });
});
