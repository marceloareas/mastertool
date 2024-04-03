import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  pages = [
    {
      title: 'Turmas',
      icon: 'school',
      route: 'class',
    },
    {
      title: 'Projetos',
      icon: 'library_books',
      route: 'project',
    },
    {
      title: 'Alunos',
      icon: 'person',
      route: 'student',
    },
  ];
}
