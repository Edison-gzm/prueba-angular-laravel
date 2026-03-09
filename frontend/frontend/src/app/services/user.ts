import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/users';

  // Obtener todos los usuarios
  getUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Cambiar rol
      updateUserRole(id:number, role:string){

        return this.http.patch(
          `http://localhost:8000/api/users/${id}/role`,
          { role: role }
        );

      }

      createUser(user:any){

          return this.http.post(
            'http://localhost:8000/api/users',
            user
          );

        }

        updateUser(id:number,user:any){

      return this.http.put(
        `http://localhost:8000/api/users/${id}`,
        user
      );

    }

  // Eliminar usuario
  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}