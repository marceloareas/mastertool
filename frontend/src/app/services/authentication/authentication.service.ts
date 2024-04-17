import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient);
  isLogged = signal(false);

  constructor() {
    const authToken = this.getToken();
    if (authToken) {
      this.isLogged.set(true);
    }
  }

  post = (dados: any) => {
    return this.http.post<any>(
      'http://127.0.0.1:8000/cadastrar-usuario/',
      dados
    );
  };

  login = (dados: any) => {
    return this.http.post<any>('http://127.0.0.1:8000/login/', dados).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token.access);
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
    return localStorage.getItem('authToken')
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isLogged.set(false);
  }
}

