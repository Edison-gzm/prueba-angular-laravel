import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock?.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have loginForm with email and password', () => {
    expect(component.loginForm.contains('email')).toBe(true);
    expect(component.loginForm.contains('password')).toBe(true);
  });

  it('should be invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const email = component.loginForm.get('email');
    email!.setValue('invalid');
    expect(email!.errors?.['email']).toBeTruthy();
    email!.setValue('valid@test.com');
    expect(email!.errors?.['email']).toBeFalsy();
  });

  it('should not submit when form invalid', () => {
    const authService = TestBed.inject(AuthService);
    vi.spyOn(authService, 'login');
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate to /user on success', () => {
    component.loginForm.patchValue({ email: 'u@u.com', password: 'Pass1!' });
    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:8000/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'jwt', user: { role: 'user' } });

    expect(router.navigate).toHaveBeenCalledWith(['/user']);
  });

  it('should set loading and show error on login failure', () => {
    vi.spyOn(window, 'alert');
    component.loginForm.patchValue({ email: 'u@u.com', password: 'wrong' });
    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:8000/api/auth/login');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(component.loading).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('Credenciales incorrectas');
  });
});
