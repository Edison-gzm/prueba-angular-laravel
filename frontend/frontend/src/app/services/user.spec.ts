import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8000/api/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUsers should GET users list', () => {
    const mock = [{ id: 1, name: 'U', email: 'u@u.com', role: 'user' }];
    service.getUsers().subscribe((data) => expect(data).toEqual(mock));
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('createUser should POST user', () => {
    const user = { name: 'N', email: 'n@n.com', password: 'Pass1!', role: 'user' };
    service.createUser(user).subscribe();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);
    req.flush({});
  });

  it('updateUser should PUT user by id', () => {
    const user = { name: 'U2', email: 'u2@u.com', role: 'admin' };
    service.updateUser(1, user).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(user);
    req.flush({});
  });

  it('updateUserRole should PATCH role', () => {
    service.updateUserRole(2, 'admin').subscribe();
    const req = httpMock.expectOne('http://localhost:8000/api/users/2/role');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ role: 'admin' });
    req.flush({});
  });

  it('deleteUser should DELETE user by id', () => {
    service.deleteUser(3).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
