import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';

export const privateRoutes: Routes = [
  {
    path: 'backoffice',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./backoffice/backoffice.routes').then(m => m.backofficeRoutes)
  },
 {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent)
  },


  { path: '', redirectTo: 'home', pathMatch: 'full' }
];