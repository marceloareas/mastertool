import { response } from 'express';
import { FormProjectComponent } from '../form-project/form-project.component';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, ViewChild, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../../../../services/project/project.service';
import { StudentService } from '../../../../services/student/student.service';

@Component({
  selector: 'app-modal-project',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormProjectComponent,
  ],
  templateUrl: './modal-project.component.html',
  styleUrl: './modal-project.component.scss',
})
export class ModalProjectComponent {
  private dialogRef = inject(DialogRef);
  private studentService = inject(StudentService);
  private projectService = inject(ProjectService);

  @ViewChild(FormProjectComponent) formProjectComponent!: FormProjectComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { singleProject: any; mode: string }
  ) {}

  ngOnInit() {
    console.log(this.data.singleProject);
  }
  /**
   * Salva as informações da classe, criando uma nova classe ou atualizando uma existente.
   * @param event Dados do formulário que devem ser salvos.
   */
  save() {
    // Obtém os dados do formulário filho
    const projectData = this.formProjectComponent.project.value;
  
    if (this.data.mode === 'ADD') {
      // Envia os dados para a API
      this.projectService.post(projectData).subscribe({
        next: (response: any) => {
          console.log('Resposta do servidor:', response);
          alert(response.mensagem || 'Projeto criado com sucesso!');
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erro ao cadastrar projeto:', error);
          alert('Erro ao cadastrar o projeto.');
        },
      });
    }
  }
  

  /**
   * Fecha o modal sem salvar as alterações.
   */
  closeModal() {
    this.dialogRef.close();
  }
}
