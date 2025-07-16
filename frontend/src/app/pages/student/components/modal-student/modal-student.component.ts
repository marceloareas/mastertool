import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ClassService } from '../../../../services/class/class.service';
import { DialogRef } from '@angular/cdk/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { StudentService } from '../../../../services/student/student.service';
import { FormStudentComponent } from '../form-student/form-student.component';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-student',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormStudentComponent,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './modal-student.component.html',
  styleUrl: './modal-student.component.scss',
})
export class ModalStudentComponent implements OnInit {
  showInfo = false;
  private studentService = inject(StudentService);
  private dialogRef = inject(DialogRef);
  private snackBar = inject(MatSnackBar);

  @ViewChild(FormStudentComponent) formStudentComponent!: FormStudentComponent;
  file!: any;
  student: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { matricula: string; mode: string }
  ) {}

  ngOnInit() {
    if (this.data.matricula) {
      this.getData();
    }
  }

  async save(student?: any, mode = this.data.mode) {
    const isFileMode = !student?.matricula;
    const matricula = student?.matricula;

    if (isFileMode && !this.file) {
      this.snackBar.open('Nenhum arquivo foi fornecido para cadastro.', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    if (!isFileMode && !matricula) {
      this.snackBar.open('Matrícula é obrigatória.', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    if (mode === 'ADD') {
      if (!isFileMode) {
        const existe = await this.verificaMatricula(matricula);
        if (existe) {
          this.snackBar.open('Aluno com esta matrícula já existe no sistema.', 'Fechar', {
            duration: 3000,
          });
          return;
        }

        const data = { turma: matricula + ', ' + student.nome };
        this.studentService.post(data).subscribe(() => {
          this.snackBar.open('Cadastrado com sucesso', 'Fechar', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        });
      } else {
        const data = { turma: this.file };
        this.studentService.post(data).subscribe(() => {
          this.snackBar.open('Cadastrado com sucesso via arquivo.', 'Fechar', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        });
      }
    } else {
      this.studentService
        .put(this.data.matricula, { ...this.student, ...student })
        .subscribe(() => {
          this.snackBar.open('Registro atualizado', 'Fechar', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        });
    }
  }

  async verificaMatricula(matricula: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.studentService.get(matricula));
      return !!response;
    } catch (error) {
      console.error('Erro ao verificar matrícula:', error);
      return false;
    }
  }

  getData() {
    this.studentService.get(this.data.matricula).subscribe((data) => {
      this.student = data;
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.file = reader.result as string;
      };
      reader.readAsText(file);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
