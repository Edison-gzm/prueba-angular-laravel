import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock?.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('passwordMissingRequirements', () => {
    it('should return empty when password is strong', () => {
      component.password = 'Abcdef1!';
      expect(component.passwordMissingRequirements).toEqual([]);
    });

    it('should list missing min length', () => {
      component.password = 'Abc1!';
      expect(component.passwordMissingRequirements).toContain('Mínimo 8 caracteres.');
    });

    it('should list missing uppercase', () => {
      component.password = 'abcdef1!';
      expect(component.passwordMissingRequirements).toContain('Al menos una letra mayúscula.');
    });

    it('should list missing lowercase', () => {
      component.password = 'ABCDEF1!';
      expect(component.passwordMissingRequirements).toContain('Al menos una letra minúscula.');
    });

    it('should list missing number', () => {
      component.password = 'Abcdefg!';
      expect(component.passwordMissingRequirements).toContain('Al menos un número.');
    });

    it('should list missing special char', () => {
      component.password = 'Abcdefg1';
      expect(component.passwordMissingRequirements).toContain('Al menos un carácter especial (ej. @, #, !).');
    });
  });

  describe('passwordStrength', () => {
    it('should return level 0 for empty password', () => {
      component.password = '';
      const s = component.passwordStrength;
      expect(s.level).toBe(0);
      expect(s.percent).toBe(0);
    });

    it('should return level 5 for strong password', () => {
      component.password = 'Abcdef1!';
      const s = component.passwordStrength;
      expect(s.level).toBe(5);
      expect(s.percent).toBe(100);
      expect(s.label).toBe('Muy segura');
    });

    it('should return intermediate levels', () => {
      component.password = 'Abcdefgh'; // length + upper + lower, no number/special
      const s = component.passwordStrength;
      expect(s.level).toBe(3);
      expect(s.percent).toBe(60);
    });
  });

  describe('register', () => {
    it('should not call API when password is weak', () => {
      component.name = 'User';
      component.email = 'u@u.com';
      component.password = 'weak';
      component.register();
      expect(component.registerError).toBeTruthy();
      expect(component.registerError!.length).toBeGreaterThan(0);
      httpMock.expectNone('http://localhost:8000/api/auth/register');
    });

    it('should call register then login and navigate on success', () => {
      component.name = 'User';
      component.email = 'u@u.com';
      component.password = 'Abcdef1!';
      component.register();

      const registerReq = httpMock.expectOne('http://localhost:8000/api/auth/register');
      expect(registerReq.request.method).toBe('POST');
      registerReq.flush({});

      const loginReq = httpMock.expectOne('http://localhost:8000/api/auth/login');
      expect(loginReq.request.method).toBe('POST');
      loginReq.flush({ token: 'jwt' });

      expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/user']);
    });
  });
});
