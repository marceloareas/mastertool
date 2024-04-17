import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient);
  isLogged = signal(false);
  constructor() {}

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
        // Aqui você pode tratar o erro da maneira que preferir
        console.error('Erro ao fazer login:', error);
        // Retorna um observable de erro para que o fluxo não seja interrompido
        return throwError('Erro ao fazer login. Por favor, tente novamente.');
      })
    );
  };

  logout(): void {
    // Limpar credenciais de autenticação ou informações de sessão
    // Por exemplo, se você estiver usando JWT, pode limpar o token armazenado no localStorage
    localStorage.removeItem('authToken');
    // Atualizar o estado de autenticação para não autenticado
    this.isLogged.set(false);
  }
}
