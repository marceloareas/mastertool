import { Component, OnInit, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatLabel } from '@angular/material/form-field';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from './components/modal-profile/modal.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationsComponent } from './components/notifications-profile/notifications.component';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterOutlet,
    MatLabel,
    CommonModule,
    RouterLinkActive,
    NotificationsComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userEmail: string = '';
  isEditing: boolean = false;
  notifications: any[] = [];

  public notificationService = inject(NotificationService);

  constructor(
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadNotifications();
    
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  loadUserData(): void {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userEmail = payload.username;
    }
  }

  loadNotifications(): void {
    this.notificationService.loadNotifications();
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
      data: { email: this.userEmail }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.snackBar.open('Senha alterada com sucesso!', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  onMarkAsRead(notificationId: any): void {
    this.notificationService.markAsRead(notificationId);
  }
}