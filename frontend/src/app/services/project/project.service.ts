import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);

  post = (dados: any) => {
    return this.http.post<any>(
      'http://localhost:8000/projetos/cadastrar/',
      dados
    );
  };

  get = (id: string = '') => {

    this.http.post('http://localhost:8000/notificacoes/gerar/', {}).subscribe();
    return this.http.get<any>('http://localhost:8000/projetos/' + id);
   
  };

  delete = (id: string) => {
    return this.http.delete<any>('http://localhost:8000/projetos/excluir/' + id);
  };

  put = (id: string, dados: any) => {
    return this.http.put<any>(
      'http://localhost:8000/projetos/editar/' + id,
      dados
    );
  };

  getAll(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/projetos/');
  }

}
