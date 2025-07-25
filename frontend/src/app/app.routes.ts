import { Routes } from '@angular/router';
import path from 'path';
import { authGuard } from './components/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/cadastro/cadastro.component').then(
        (c) => c.CadastroComponent
      ),
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/user/user.component').then((c) => c.UserComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'class',
        pathMatch: 'full',
      },
      {
        path: 'class',
        loadComponent: () =>
          import('./pages/class/class.component').then((c) => c.ClassComponent),
      },
      {
        path: 'project',
        loadComponent: () =>
          import('./pages/project/project.component').then(
            (c) => c.ProjectComponent
          ),
      },
      {
        path: 'student',
        loadComponent: () =>
          import('./pages/student/student.component').then(
            (c) => c.StudentComponent
          ),
      },
       {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
    ],
  },
];
