import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () =>
      import('./organisms/layout/layout').then(m => m.LayoutComponent),
    children: [
      {
        path: 'home-admin',
        loadComponent: () =>
          import('./pages/home/home').then(m => m.HomeComponent)
      },
      {
        path: 'solicitudes',
        loadComponent: () =>
          import('./pages/solicitudes/solicitudes').then(m => m.SolicitudesComponent)
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./pages/historial/historial').then(m => m.HistorialComponent)
      },
      {
        path: 'home-responsable',
        loadComponent: () =>
          import('./pages/responsable/responsable').then(m => m.ResponsableComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];