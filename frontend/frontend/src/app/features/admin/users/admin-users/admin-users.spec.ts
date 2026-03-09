import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { AdminUsersComponent } from './admin-users';
import { UserService } from '../../../../services/user';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AdminUsersComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    // Flush initial GET triggered by ngOnInit so no "open requests" in tests that don't consume it
    const initReq = httpMock.match('http://localhost:8000/api/users');
    if (initReq.length) initReq[0].flush([]);
  });

  afterEach(() => {
    httpMock?.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    // Initial GET was already flushed in beforeEach with []
    expect(component.users).toEqual([]);
    expect(component.allUsers).toEqual([]);
    expect(component.loading).toBe(false);
  });

  it('searchUser should filter by name', () => {
    component.allUsers = [
      { id: 1, name: 'Alice', email: 'a@a.com' },
      { id: 2, name: 'Bob', email: 'b@b.com' },
    ];
    component.users = component.allUsers;
    component.searchTerm = 'alice';
    component.searchUser();
    expect(component.users.length).toBe(1);
    expect(component.users[0].name).toBe('Alice');
  });

  it('searchUser should filter by email', () => {
    component.allUsers = [
      { id: 1, name: 'Alice', email: 'alice@test.com' },
      { id: 2, name: 'Bob', email: 'bob@test.com' },
    ];
    component.users = component.allUsers;
    component.searchTerm = 'bob@';
    component.searchUser();
    expect(component.users.length).toBe(1);
    expect(component.users[0].email).toBe('bob@test.com');
  });

  it('searchUser should show all when term is empty', () => {
    component.allUsers = [{ id: 1, name: 'A', email: 'a@a.com' }];
    component.users = [];
    component.searchTerm = '';
    component.searchUser();
    expect(component.users).toEqual(component.allUsers);
  });

  it('showCreateForm should set creatingUser to true', () => {
    component.showCreateForm();
    expect(component.creatingUser).toBe(true);
  });

  it('createUser should POST and reload users', () => {
    vi.spyOn(window, 'alert');
    component.newUser = { name: 'New', email: 'n@n.com', password: 'Pass1!', role: 'user' };
    component.creatingUser = true;
    component.createUser();

    const createReq = httpMock.expectOne('http://localhost:8000/api/users');
    expect(createReq.request.method).toBe('POST');
    expect(createReq.request.body.name).toBe('New');
    createReq.flush({});

    const listReq = httpMock.expectOne('http://localhost:8000/api/users');
    listReq.flush([]);

    expect(component.creatingUser).toBe(false);
    expect(component.newUser.name).toBe('');
    expect(window.alert).toHaveBeenCalledWith('Usuario creado');
  });

  it('editUser should set editData', () => {
    const user = { id: 2, name: 'U', email: 'u@u.com', password: '', role: 'user' };
    component.editUser(user);
    expect(component.editingUser).toBe(true);
    expect(component.editData.id).toBe(2);
    expect(component.editData.name).toBe('U');
  });

  it('updateUser should PUT and reload', () => {
    vi.spyOn(window, 'alert');
    component.editData = { id: 3, name: 'Updated', email: 'u@u.com', password: '', role: 'user' };
    component.editingUser = true;
    component.updateUser();

    const updateReq = httpMock.expectOne('http://localhost:8000/api/users/3');
    expect(updateReq.request.method).toBe('PUT');
    updateReq.flush({});

    const listReq = httpMock.expectOne('http://localhost:8000/api/users');
    listReq.flush([]);

    expect(component.editingUser).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('Usuario actualizado');
  });

  it('deleteUser should DELETE and reload when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteUser(5);

    const delReq = httpMock.expectOne('http://localhost:8000/api/users/5');
    expect(delReq.request.method).toBe('DELETE');
    delReq.flush(null);

    const listReq = httpMock.expectOne('http://localhost:8000/api/users');
    listReq.flush([]);
  });

  it('deleteUser should not call API when confirm is false', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.deleteUser(5);
    httpMock.expectNone('http://localhost:8000/api/users/5');
  });
});
