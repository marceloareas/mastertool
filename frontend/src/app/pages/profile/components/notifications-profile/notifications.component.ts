import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    DatePipe,
    MatButtonModule
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  @Input() notifications: any[] = [];
  @Output() markAsRead = new EventEmitter<any>();

  onNotificationClick(notification: any): void {
    if (!notification.read) {
      this.markAsRead.emit(notification.projectId);
    }
  }
}