import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
private http = inject(HttpClient);
  constructor() { }

  post = (dados: any) => {
    return this.http.post<any>('http://127.0.0.1:8000/cadastrar-usuario/', dados);
  }
}
