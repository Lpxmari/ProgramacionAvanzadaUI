import { Routes } from '@angular/router';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/layout').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home').then(m => m.HomeComponent)  
      },
      {
        path: 'solicitudes',
        loadComponent: () =>
          import('./pages/solicitudes/solicitudes').then(m => m.SolicitudesComponent),
          canActivate: [roleGuard],
          data: {
            role: 'ROLE_ADMIN'
          }
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./pages/historial/historial').then(m => m.HistorialComponent)
      },
      {
        path: 'solicitudes-responsable',
        loadComponent: () =>
          import('./pages/responsable/responsable').then(m => m.ResponsableComponent),
          canActivate: [roleGuard],
          data: {
            role: 'ROLE_RESPONSABLE'
          }
      },
      {
        path: 'mis-solicitudes',
        loadComponent: () =>
          import('./pages/estudiante/estudiante').then(m => m.EstudianteComponent),
          canActivate: [roleGuard],
          data: {
            role: 'ROLE_ESTUDIANTE'
          }
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
  
];