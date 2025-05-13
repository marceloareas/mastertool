import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatLabel } from '@angular/material/form-field';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { NotificationService } from '../../services/notification/notification.service';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterOutlet,
    MatLabel,
    CommonModule,
    MatBadgeModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthenticationService);
  private notificationService= inject(NotificationService)
  
  unreadNotifications = 0;

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
      icon: 'recent_actors',
      route: 'student',
    },
    {
      title: 'Perfil',
      icon: 'person',
      route: 'profile',
    },
  ];

  ngOnInit() {
    this.notificationService.notifications$.subscribe(() => {
      this.unreadNotifications = this.notificationService.getUnreadCount();
    });
    this.notificationService.loadNotifications();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['']);
  }
}