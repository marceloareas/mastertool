import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Student } from '../../interface/student.interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  constructor() {}

  post = (dados: any) => {
    return this.http.post<any>(
      'http://localhost:8000/alunos/cadastrar/',
      dados
    );
  };

  get = (id: string = '') => {
    return this.http.get<any>('http://localhost:8000/alunos/' + id);
  };

  put = (id: string, dados: any) => {
    return this.http.put<any>(
      'http://localhost:8000/alunos/editar/' + id,
      dados
    );
  };

  delete = (id: string) => {
    return this.http.delete<any>('http://localhost:8000/alunos/excluir/' + id);
  };  
}
