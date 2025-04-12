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
import { ClassService } from '../../../../services/class/class.service';
import { StudentService } from '../../../../services/student/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormClassComponent } from './../form-class/form-class.component';

@Component({
  selector: 'app-modal-class',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormClassComponent,
  ],
  templateUrl: './modal-class.component.html',
  styleUrls: ['./modal-class.component.scss'],
})
export class ModalClassComponent {
  private dialogRef = inject(DialogRef);
  private studentService = inject(StudentService);
  private classService = inject(ClassService);
  private snackbar = inject(MatSnackBar);

  @ViewChild(FormClassComponent) formClassComponent!: FormClassComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { singleClass: any; mode: string }
  ) {}

  ngOnInit() {
    console.log(this.data.singleClass);
  }

  /**
   * Salva as informações da classe, criando uma nova classe ou atualizando uma existente.
   * @param event Dados do formulário que devem ser salvos.
   */
  save(singleClass: any) {
    if (this.data.mode == 'ADD') {
      this.classService.post(singleClass).subscribe((response) => {
        if (response.alunos_nao_criados.length > 0) {
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
              this.snackbar.open('Cadastrado com sucesso!', 'Fechar', {
                duration: 3000,
                panelClass: ['snackbar-success'],
              });
              this.dialogRef.close(true);
            });
          }
        } else {
          this.snackbar.open('Cadastrado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          this.dialogRef.close(true);
        }
      });
    } else {
      const dataClass = {
        nome: this.data.singleClass.id,
        periodo: this.data.singleClass.periodo,
      };
      this.classService
        .put(this.data.singleClass.id, { ...dataClass, ...singleClass })
        .subscribe(() => {
          this.snackbar.open('Registro atualizado!', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          this.dialogRef.close(true);
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
