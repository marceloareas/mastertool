import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatLabel } from '@angular/material/form-field';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterOutlet,
    MatLabel
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  private router = inject(Router);
  private auth = inject(AuthenticationService);

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

  logout(){
    this.auth.logout();
    this.router.navigate(['']);
  }
}
