import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'public',
    loadChildren: () => import('./pages/public/public.routes').then((m) => m.publicRoutes),
  },

  {
    path: 'private',
    loadChildren: () => import('./pages/private/private.routes').then((m) => m.privateRoutes),
  },

  {
    path: '',
    redirectTo: 'public/login',
    pathMatch: 'full',
  },
];
