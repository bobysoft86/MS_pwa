import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';

export const backofficeRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./backoffice.component').then(m => m.BackofficeComponent),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./main-page-backoffice/main-page-backoffice.component').then(m => m.MainPageBackofficeComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users-list/users-list.component').then(m => m.UsersListComponent)
      },
      {
        path: 'users/create',
        loadComponent: () =>
          import('./users-list/create-user/create-user.component').then(m => m.CreateUserComponent)
      },

        {
        path: 'users/detail/:id',
        loadComponent: () =>
          import('./users-list/detail-user/detail-user.component').then(m => m.DetailUserComponent)
      },
      {
        path: 'exercices',
        loadComponent: () =>
          import('./exercises-mainpage/exercises-mainpage.component').then(m => m.ExercisesMainpageComponent)
      },
      {path: 'exercices/create',
        loadComponent: () =>
          import('./exercises-mainpage/create-edit-detail-exercice/create-edit-detail-exercice.component').then(m => m.CreateEditDetailExerciceComponent)
      },
      {path: 'exercices/detail/:id',
        loadComponent: () =>
          import('./exercises-mainpage/create-edit-detail-exercice/create-edit-detail-exercice.component').then(m => m.CreateEditDetailExerciceComponent)
      },
      {path: 'exercices/type/create',
        loadComponent: () =>
          import('./exercises-mainpage/create-new-type-exercise/create-new-type-exercise.component').then(m => m.CreateNewTypeExerciseComponent)
      },
      {path: 'exercices/types/:id',
        loadComponent: () =>
          import('./exercises-mainpage/create-new-type-exercise/create-new-type-exercise.component').then(m => m.CreateNewTypeExerciseComponent)  
      },
      {
        path: 'sessions',
        loadComponent: () =>
          import('./sessions/main-page-sessions/main-page-sessions.component').then(m => m.MainPageSessionsComponent)
      },
      {
        path: 'sessions/create',
        loadComponent: () =>
          import('./sessions/sessions-create-edit-view/sessions-create-edit-view.component').then(m => m.SessionsCreateEditViewComponent)
      },
        {
        path: 'sessions/:id',
        loadComponent: () =>
          import('./sessions/sessions-create-edit-view/sessions-create-edit-view.component').then(m => m.SessionsCreateEditViewComponent)
      },
      {path: 'sessions/types/create',
        loadComponent: () =>
          import('./sessions/sessions-type-create-edit-view/sessions-type-create-edit-view.component').then(m => m.SessionsTypeCreateEditViewComponent)
      },
          {path: 'sessions/types/:id',
        loadComponent: () =>
          import('./sessions/sessions-type-create-edit-view/sessions-type-create-edit-view.component').then(m => m.SessionsTypeCreateEditViewComponent)
      },



      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];