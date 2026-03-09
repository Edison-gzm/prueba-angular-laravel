import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock?.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should call POST /api/auth/login and store token and role on success', () => {
      const mockResponse = { token: 'jwt-123', user: { role: 'admin' } };
      service.login({ email: 'test@test.com', password: 'Pass1!' }).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:8000/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'test@test.com', password: 'Pass1!' });
      req.flush(mockResponse);

      expect(localStorage.getItem('token')).toBe('jwt-123');
      expect(localStorage.getItem('user_role')).toBe('admin');
    });
  });

  describe('logout', () => {
    it('should call POST /api/auth/logout and clear session', () => {
      localStorage.setItem('token', 'old-token');
      localStorage.setItem('user_role', 'user');

      service.logout().subscribe();

      const req = httpMock.expectOne('http://localhost:8000/api/auth/logout');
      expect(req.request.method).toBe('POST');
      req.flush({});

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user_role')).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'any');
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true when user_role is admin', () => {
      localStorage.setItem('user_role', 'admin');
      expect(service.isAdmin()).toBe(true);
    });

    it('should return false when user_role is user or missing', () => {
      localStorage.setItem('user_role', 'user');
      expect(service.isAdmin()).toBe(false);
      localStorage.removeItem('user_role');
      expect(service.isAdmin()).toBe(false);
    });
  });

  describe('clearSession', () => {
    it('should remove token and user_role from localStorage', () => {
      localStorage.setItem('token', 'x');
      localStorage.setItem('user_role', 'admin');
      service.clearSession();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user_role')).toBeNull();
    });
  });
});
