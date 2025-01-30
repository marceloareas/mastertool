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
    //console.log(this.data.singleProject);
  }

  /**
   * Salva as informações do projeto, criando um novo projeto ou atualizando um existente.
   * @param event Dados do formulário que devem ser salvos.
   */
  save(singleProject: any) {
    if (this.data.mode === 'ADD') {
      this.projectService.post(singleProject).subscribe((response) => {
        if (response.alunos_nao_criados && response.alunos_nao_criados.length > 0) {
          const result = confirm(
            'Existem alunos que não foram cadastrados. Deseja cadastrar?'
          );

          if (result) {
            let data = response.alunos_nao_criados.map(
              (aluno: { matricula: string; nome: string }) => {
                return aluno.matricula + ', ' + aluno.nome;
              }
            );

            data = { turma: data.join('\r\n'), id: response.id_turma };

            this.studentService.post(data).subscribe(() => {
              alert('Cadastrado com sucesso');
              this.dialogRef.close(true);
            });
          }
        } else {
          alert('Cadastrado com sucesso');
        }

        this.dialogRef.close(true);
      });
    } else {
      const dataProject = {
        nome: singleProject.nome || this.data.singleProject.nome,
        periodo: singleProject.periodo || this.data.singleProject.periodo,
        descricao: singleProject.descricao || this.data.singleProject.descricao,
        data_inicio: singleProject.data_inicio || this.data.singleProject.data_inicio,
        data_fim: singleProject.data_fim ,
      };
      this.projectService
        .put(this.data.singleProject.id, dataProject )
        .subscribe(() => {
          alert('Registro atualizado');
          this.dialogRef.close(true);
          console.log("Registro atualizado", dataProject);
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
