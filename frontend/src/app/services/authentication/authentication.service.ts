import { Inject, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  isLogged = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const authToken = this.getToken();
      if (authToken) {
        this.isLogged.set(true);
      }
    }
  }

  post = (dados: any) => {
    return this.http.post<any>(
      'http://backend:8000/cadastrar-usuario/',
      dados
    );
  };

  login = (dados: any) => {
    return this.http.post<any>('http://backend:8000/login/', dados).pipe(
      tap((response) => {
        if (response.token) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('authToken', response.token.access);
          }
          this.isLogged.set(true);
        } else {
          this.isLogged.set(false);
        }
      }),
      catchError((error) => {
        console.error('Erro ao fazer login:', error);
        return throwError('Erro ao fazer login. Por favor, tente novamente.');
      })
    );
  };

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
    this.isLogged.set(false);
  }

  getProfile() {
    return this.http.get<any>('http://backend:8000/profile/');
  }

  changePassword(data: { currentPassword: string, newPassword: string, confirmPassword: string }) {
    return this.http.post<any>('http://backend:8000/change-password/', data);
  }

  updateProfile(data: any) {
  return this.http.post<any>('http://backend:8000/update-profile/', data).pipe(
    catchError(error => {
      // Aqui garantimos que o erro seja repassado com a estrutura correta
      return throwError(() => ({
        error: error.error,
        status: error.status,
        message: error.message
      }));
    })
  );
}
}
