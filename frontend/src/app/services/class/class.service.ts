import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private http = inject(HttpClient)

  url = 'http://127.0.0.1:8000/cadastrar-turma/'

  post = (dados: any) => {
    return this.http.post<any>(this.url, dados);
  }
}
