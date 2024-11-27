import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalProjectComponent } from './components/modal-project/modal-project.component';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SingleProjectComponent } from './components/single-project/single-project.component';  
import { ProjetoService } from '../../services/projeto/projeto.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from '../../services/student/student.service';

@Component({
  selector: 'app-projeto',
  standalone: true,
  imports: [
    ModalProjectComponent,  // Pode ser substituído por ModalProjetoComponent, se houver
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatIcon,
    MatButtonModule,
    SingleProjectComponent,  // Pode ser substituído por SingleProjetoComponent, se houver
    CommonModule,
    MatMenuModule,
  ],
  templateUrl: './projeto.component.html',
  styleUrls: ['./projeto.component.scss'],
})
export project ProjetoComponent {
  private projetoService = inject(ProjetoService);

  projetoIsOpen = false;
  projetos!: any;
  singleProjeto!: any;

  constructor(public dialog: MatDialog) {
    this.getProjetos();
  }

  /**
   * Obtém a lista de projetos do serviço `ProjetoService` e armazena em `projetos`.
   */
  getProjetos() {
    this.projetoService.get().subscribe((data) => {
      this.projetos = data;
    });
  }

  /**
   * Abre o modal para adicionar ou editar um projeto.
   * @param data Dados do projeto a serem editados (opcional).
   * @param mode Modo de operação, pode ser 'ADD' ou 'EDIT'. O padrão é 'ADD'.
   */
  openModal(data?: any, mode = 'ADD') {
    this.dialog
      .open(ModalProjectComponent, {  // Pode ser substituído por ModalProjetoComponent, se houver
        data: { data, mode },
        width: '600px',
      })
      .afterClosed()
      .subscribe(() => {
        this.getProjetos();
      });
  }

  /**
   * Alterna a visibilidade dos detalhes de um projeto específico.
   * @param projeto Nome ou identificador do projeto (opcional).
   */
  openProjeto(projeto = '') {
    this.projetoIsOpen = !this.projetoIsOpen;
    this.singleProjeto = projeto;
  }

  /**
   * Gera um acrônimo a partir do nome do projeto.
   * @param name Nome do projeto.
   * @returns Acrônimo gerado a partir do nome do projeto.
   */
  generateInitials(name: string) {
    const arrayName = name.split(' ');
    if (arrayName.length === 1) {
      return arrayName[0].slice(0, 2).toUpperCase();  // Retorna as duas primeiras letras do único nome
    }
    return (
      arrayName[0].charAt(0).toUpperCase() +
      arrayName[1].charAt(0).toUpperCase()
    );
  }

  /**
   * Exclui um projeto com base no ID fornecido.
   * @param id Identificador do projeto a ser excluído.
   */
  delete(id: string) {
    this.projetoService.delete(id).subscribe(() => {
      alert('Projeto excluído');
      this.getProjetos();
    });
  }
}
