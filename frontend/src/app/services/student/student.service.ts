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
      'http://127.0.0.1:8000/alunos/cadastrar/',
      dados
    );
  };

  get = (id: string = '') => {
    if (id) {
      return this.http.get<any>('http://127.0.0.1:8000/alunos/aluno/' + id);
    } else {
      return this.http.get<any>('http://127.0.0.1:8000/alunos/');
    }
  };

  put = (id: string, dados: any) => {
    return this.http.put<any>('http://127.0.0.1:8000/alunos/editar-aluno/'+id, dados);
  };



  delete = (id: string) => {
    return this.http.delete<any>('http://127.0.0.1:8000/alunos/excluir-aluno/' + id);
  };
}
