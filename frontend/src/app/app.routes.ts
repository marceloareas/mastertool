import { Routes } from '@angular/router';
import path from 'path';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/user/user.component').then((c) => c.UserComponent),
    children: [
      {
        path: 'class',
        loadComponent: () =>
          import('./pages/class/class.component').then(
            (c) => c.ClassComponent
          ),
      },
      {
        path: 'project',
        loadComponent: () =>
          import('./pages/project/project.component').then(
            (c) => c.ProjectComponent
          ),
      },
    ],
  },
];
