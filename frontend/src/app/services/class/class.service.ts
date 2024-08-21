import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private http = inject(HttpClient);

  post = (dados: any) => {
    return this.http.post<any>(
      'http://127.0.0.1:8000/turmas/cadastrar/',
      dados
    );
  };

  get = () => {
    return this.http.get<any>('http://127.0.0.1:8000/turmas/');
  };

  delete = (id: string) => {
    return this.http.delete<any>('http://127.0.0.1:8000/turmas/excluir/' + id);
  };

  put = (id: string, dados: any) => {
    return this.http.put<any>(
      'http://127.0.0.1:8000/turmas/editar/' + id,
      dados
    );
  };
}
