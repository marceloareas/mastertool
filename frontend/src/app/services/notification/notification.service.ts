import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // importe o HttpClient aqui
import { ProjectService } from '../project/project.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  unreadCount = 0;

  // Injete HttpClient junto com ProjectService
  constructor(
    private projectService: ProjectService,
    private http: HttpClient
  ) {}

  loadNotifications(): void {
    this.http
      .get<any[]>('http://127.0.0.1:8000/notificacoes/')
      .subscribe((notificacoes) => {
        this.notificationsSubject.next(notificacoes);
        this.unreadCount = notificacoes.filter((n) => !n.read).length;
      });
  }

  markAsRead(notificationId: any): void {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    this.http
      .post(
        'http://127.0.0.1:8000/notificacoes/marcar-lida/',
        { id: notificationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .subscribe(() => {
        const updated = this.notificationsSubject.value.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        this.notificationsSubject.next(updated);
        this.unreadCount = updated.filter((n) => !n.read).length;
      });
  }

  getUnreadCount(): number {
    return this.unreadCount;
  }
}
