import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
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
import { EventEmitter } from 'stream';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { StudentService } from '../../../../services/student/student.service';
import { FormStudentComponent } from '../form-student/form-student.component';
import { FormClassComponent } from '../../../class/components/form-class/form-class.component';
import { finalize } from 'rxjs';

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
  ],
  templateUrl: './modal-student.component.html',
  styleUrl: './modal-student.component.scss',
})
export class ModalStudentComponent implements OnInit {
  private studentService = inject(StudentService);
  private dialogRef = inject(DialogRef);

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

  /**
   * Salva os dados do estudante.
   * Se o modo for 'ADD', cadastra estudante(é possivel cadastrar vários estudantes através de um arquivo txt,
   * ou cadastrar somente um aluno pelo form); caso contrário, atualiza o registro existente.
   * @param event Dados do evento do formulário.
   * @param mode Modo de operação, pode ser 'ADD' ou outro para atualização.
   */
  save(student?: any, mode = this.data.mode) {
    if (mode == 'ADD') {
      const data = student.matricula
        ? { turma: student.matricula + ', ' + student.nome }
        : { turma: this.file };

      this.studentService.post(data).subscribe(() => {
        alert('Cadastrado com sucesso');
        this.dialogRef.close(true);
      });
    } else {
      this.studentService
        .put(this.data.matricula, { ...this.student, ...student })
        .subscribe(() => {
          alert('Registro atualizado');
          this.dialogRef.close(true);
        });
    }
  }

  /**
   * Obtém os dados do estudante com base na matrícula fornecido.
   */
  getData() {
    this.studentService.get(this.data.matricula).subscribe((data) => {
      this.student = data;
    });
  }

  /**
   * Manipula a mudança de arquivo, lê o arquivo e armazena seu conteúdo.
   * @param event Evento que contém o arquivo selecionado.
   */
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

  /**
   * Fecha o modal de estudante.
   */
  closeModal() {
    this.dialogRef.close();
  }
}
