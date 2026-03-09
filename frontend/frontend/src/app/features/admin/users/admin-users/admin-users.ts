import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user';


@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html'
})
export class AdminUsersComponent {

  // LISTAS
  users:any[] = [];
  allUsers:any[] = [];

  loading = false;

  // BUSCADOR
  searchTerm:string = "";

  // CREAR USUARIO
  creatingUser = false;

  newUser = {
    name:"",
    email:"",
    password:"",
    role:"user"
  };

  // EDITAR USUARIO
  editingUser = false;

  editData:any = {
    id:null,
    name:"",
    email:"",
    password:"",
    role:"user"
  };

  constructor(private userService:UserService){}

  ngOnInit(){
    this.loadUsers();
  }

  // CARGAR USUARIOS
  loadUsers(){

    this.loading = true;

    this.userService.getUsers()
    .subscribe({
      next: (data:any) => {
        this.users = data;
        this.allUsers = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

  }

  // BUSCAR USUARIO
  searchUser(){

    const term = this.searchTerm.toLowerCase().trim();

    if(term === ""){
      this.users = this.allUsers;
      return;
    }

    this.users = this.allUsers.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );

  }

  // MOSTRAR FORMULARIO CREAR
  showCreateForm(){
    this.creatingUser = true;
  }

  // CREAR USUARIO
  createUser(){

    this.userService.createUser(this.newUser)
    .subscribe({

      next:()=>{

        alert("Usuario creado");

        this.creatingUser = false;

        this.newUser = {
          name:"",
          email:"",
          password:"",
          role:"user"
        };

        this.loadUsers();

      },

      error:(err)=>{
        console.error(err);
      }

    });

  }

  // EDITAR USUARIO
  editUser(user:any){

    this.editingUser = true;

    this.editData = {
      id:user.id,
      name:user.name,
      email:user.email,
      password:"",
      role:user.role
    };

  }

  // GUARDAR CAMBIOS
  updateUser(){

    this.userService.updateUser(this.editData.id,this.editData)
    .subscribe({

      next:()=>{

        alert("Usuario actualizado");

        this.editingUser = false;

        this.loadUsers();

      },

      error:(err)=>{
        console.error(err);
      }

    });

  }

  // CAMBIAR ROL
  confirmEdit(user:any){

    this.userService.updateUserRole(user.id,user.role)
    .subscribe(()=>{

      user.editing = false;

    });

  } 

  startEdit(user:any){
    user.editing = true;
  }

  confirmEditRol(user:any){

    this.userService.updateUserRole(user.id, user.role)
    .subscribe({

      next:()=>{
        user.editing = false;
        alert("Rol actualizado");
      },

      error:(err)=>{
        console.error(err);
        alert("Error actualizando rol");
      }

    });

  
  }





  // ELIMINAR USUARIO
  deleteUser(id:number){

    if(confirm("¿Eliminar usuario?")){

      this.userService.deleteUser(id)
      .subscribe(()=>{

        this.loadUsers();

      });

    }

  }

}