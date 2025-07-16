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
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

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
    NotificationsComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userEmail: string = '';
  userUsername: string = '';
  firstName: string = '';
  lastName: string = '';
  isEditing: boolean = false;
  notifications: any[] = [];
  activeSection: 'perfil' | 'notificacoes' = 'perfil';

  public notificationService = inject(NotificationService);

  constructor(
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    this.loadNotifications();

    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
    });
  }

  loadUserData(): void {
    this.authService.getProfile().subscribe((data) => {
      this.userEmail = data.email;
      this.userUsername = data.username;
      this.firstName = data.first_name;
      this.lastName = data.last_name;
    });
  }

  loadNotifications(): void {
    this.notificationService.loadNotifications();
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
      data: { email: this.userEmail }
    });

    dialogRef.afterClosed().subscribe((result) => {
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

  enableEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadUserData();
  }

  updateProfile(): void {
    const updatedData = {
      email: this.userEmail,
      username: this.userUsername,
      first_name: this.firstName,
      last_name: this.lastName
    };

    this.authService.updateProfile(updatedData).subscribe({
      next: () => {
        this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
          duration: 3000
        });
        this.isEditing = false;
      },
      error: (error) => {
        const errorMessage = error.error?.error || 
                             error.error?.message || 
                             error.message || 
                             'Erro ao atualizar perfil';

        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getInitials(): string {
    const first = this.firstName?.charAt(0) || '';
    const last = this.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }
}
