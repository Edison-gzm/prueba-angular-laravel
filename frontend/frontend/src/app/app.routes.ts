import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard], // PROTEGIDO
    loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'user',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/catalogo/catalogo.component').then(m => m.CatalogoComponent)

  },

    {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
   },
  
  
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' },

  
  
];