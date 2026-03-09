import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'auth',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },

  {
    path: 'admin/products',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/products/admin-products/admin-products').then(m => m.AdminProductsComponent)
  },

  {
    path: 'admin/users',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/users/admin-users/admin-users').then(m => m.AdminUsersComponent)
  },
  {
    path: 'user',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/catalogo/catalogo.component').then(m => m.CatalogoComponent)

  },

    {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
   },
  
  
  { path: '**', redirectTo: '' }

  
  
];