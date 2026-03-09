import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: { navigate: vi.fn() },
        },
      ],
    });
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow activation when token exists', () => {
    localStorage.setItem('token', 'valid-token');
    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /auth and deny when token does not exist', () => {
    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });
});
