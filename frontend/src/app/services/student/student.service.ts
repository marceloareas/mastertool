import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  constructor() {}

  post = (dados: any) => {
    return this.http.post<any>(
      'http://127.0.0.1:8000/cadastrar-alunos/',
      dados
    );
  };

  get = (id: string = '') => {
    if (id) {
      console.log('entrei no aluno')
      return this.http.get<any>('http://127.0.0.1:8000/aluno-unico/' + id);
    } else {
      console.log('entrei nos alunos')

      return this.http.get<any>('http://127.0.0.1:8000/alunos/');
    }
  };

  delete = (id: string) => {
    return this.http.delete<any>('http://127.0.0.1:8000/excluir-aluno/' + id);
  };
}
