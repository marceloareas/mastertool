import { Injectable } from '@angular/core';
import { ProjectService } from '../project/project.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  unreadCount = 0;

  constructor(private projectService: ProjectService) {}

  loadNotifications(): void {
    this.projectService.getAll().subscribe((projects: any[]) => {
      const today = new Date();
      const thresholdDays = 7; 
      
      
      const endDateNotifications = projects
        .filter(project => project.data_fim)
        .map(project => {
          const endDate = new Date(project.data_fim);
          endDate.setDate(endDate.getDate() + 1);
          const daysLeft = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          return {
            projectId: project.id,
            title: `Prazo final do projeto "${project.nome}" se aproximando`,
            message: `O projeto "${project.nome}" termina em ${daysLeft} dias.`,
            date: endDate,
            daysLeft: daysLeft,
            type: 'end_date',
            read: false
          };
        })
        .filter(notification => notification.daysLeft <= thresholdDays && notification.daysLeft >= 0);

      
      const startDateNotifications = projects
        .filter(project => project.data_inicio)
        .map(project => {
          const startDate = new Date(project.data_inicio);
          startDate.setDate(startDate.getDate() + 1);
          const daysLeft = Math.floor((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          return {
            projectId: project.id,
            title: `Início do projeto "${project.nome}" se aproximando`,
            message: `O projeto "${project.nome}" começa em ${daysLeft} dias.`,
            date: startDate,
            daysLeft: daysLeft,
            type: 'start_date',
            read: false
          };
        })
        .filter(notification => notification.daysLeft <= thresholdDays && notification.daysLeft >= 0);

      
      const allNotifications = [...endDateNotifications, ...startDateNotifications]
        .sort((a, b) => a.daysLeft - b.daysLeft);

      this.notificationsSubject.next(allNotifications);
      this.unreadCount = allNotifications.filter(n => !n.read).length;
    });
  }

  markAsRead(notificationId: any): void {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(notification => {
      if (notification.projectId === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });

    this.notificationsSubject.next(updatedNotifications);
    this.unreadCount = updatedNotifications.filter(n => !n.read).length;
  }

  getUnreadCount(): number {
    return this.unreadCount;
  }
}