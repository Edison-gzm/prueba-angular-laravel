import { TestBed } from '@angular/core/testing';
import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let originalLocation: Location;

  beforeEach(() => {
    localStorage.clear();
    originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  afterEach(() => {
    (window as any).location = originalLocation;
    localStorage.clear();
  });

  it('should add Authorization header when token exists', () => {
    localStorage.setItem('token', 'my-token');
    const req = new HttpRequest('GET', '/api/test');
    let capturedReq: HttpRequest<unknown> | null = null;
    const nextCapture: HttpHandlerFn = (r) => {
      capturedReq = r;
      return of(new HttpResponse({ body: {} }));
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextCapture).subscribe();
    });

    expect(capturedReq).toBeTruthy();
    expect(capturedReq!.headers.get('Authorization')).toBe('Bearer my-token');
  });

  it('should not add Authorization header when token is missing', () => {
    const req = new HttpRequest('GET', '/api/test');
    let capturedReq: HttpRequest<unknown> | null = null;
    const nextCapture: HttpHandlerFn = (r) => {
      capturedReq = r;
      return of(new HttpResponse({ body: {} }));
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextCapture).subscribe();
    });

    expect(capturedReq).toBe(req);
    expect(capturedReq!.headers.has('Authorization')).toBe(false);
  });

  it('should clear token and redirect to /auth on 401', () => {
    localStorage.setItem('token', 'expired');
    const req = new HttpRequest('GET', '/api/test');
    const next401: HttpHandlerFn = () => throwError(() => ({ status: 401 }));

    let errorThrown = false;
    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next401).subscribe({
        error: () => {
          errorThrown = true;
        },
      });
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect((window as any).location.href).toBe('/auth');
    expect(errorThrown).toBe(true);
  });

  it('should rethrow non-401 errors', () => {
    const req = new HttpRequest('GET', '/api/test');
    const err = { status: 500 };
    const next500: HttpHandlerFn = () => throwError(() => err);

    let receivedError: any;
    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next500).subscribe({
        error: (e) => (receivedError = e),
      });
    });

    expect(receivedError).toBe(err);
    expect((window as any).location.href).toBe('');
  });
});
