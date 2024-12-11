import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalProjectComponent } from './components/modal-project/modal-project.component';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SingleProjectComponent } from './components/single-project/single-project.component';  
import { ProjectService } from '../../services/project/project.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from '../../services/student/student.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    ModalProjectComponent,  // Pode ser substituído por ModalProjectComponent, se houver
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatIcon,
    MatButtonModule,
    SingleProjectComponent,  // Pode ser substituído por SingleProjectComponent, se houver
    CommonModule,
    MatMenuModule,
  ],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  private projectService = inject(ProjectService);

  projectIsOpen = false;
  projects!: any;
  singleProject!: any;

  constructor(public dialog: MatDialog) {
    this.getProjects();
  }

  /**
   * Obtém a lista de projects do serviço `ProjectService` e armazena em `projects`.
   */
  getProjects() {
    this.projectService.get().subscribe((data) => {
      this.projects = data;
    });
  }

  /**
   * Abre o modal para adicionar ou editar um project.
   * @param data Dados do project a serem editados (opcional).
   * @param mode Modo de operação, pode ser 'ADD' ou 'EDIT'. O padrão é 'ADD'.
   */
  openModal(data?: any, mode = 'ADD') {
    this.dialog
      .open(ModalProjectComponent, {  // Pode ser substituído por ModalProjectComponent, se houver
        data: { data, mode },
        width: '600px',
      })
      .afterClosed()
      .subscribe(() => {
        this.getProjects();
      });
  }

  /**
   * Alterna a visibilidade dos detalhes de um project específico.
   * @param project Nome ou identificador do project (opcional).
   */
  openProject(project = '') {
    this.projectIsOpen = !this.projectIsOpen;
    this.singleProject = project;
  }

  /**
   * Gera um acrônimo a partir do nome do project.
   * @param name Nome do project.
   * @returns Acrônimo gerado a partir do nome do project.
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
   * Exclui um project com base no ID fornecido.
   * @param id Identificador do project a ser excluído.
   */
  delete(id: string) {
    this.projectService.delete(id).subscribe(() => {
      alert('Project excluído');
      this.getProjects();
    });
  }
}
