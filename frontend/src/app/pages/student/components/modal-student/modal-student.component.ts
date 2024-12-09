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
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';

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
  ) { }

  ngOnInit() {
    if (this.data.matricula) {
      this.getData();
    }
  }

  /**
   * Salva os dados do estudante.
   * Se o modo for 'ADD', cadastra estudante(é possivel cadastrar vários estudantes através de um arquivo txt,
   * ou cadastrar somente um aluno pelo form); caso contrário, atualiza o registro existente.
   * @param student Dados do estudante.
   * @param mode Modo de operação, pode ser 'ADD' ou outro para atualização.
   */
  async save(student?: any, mode = this.data.mode) {

    const isFileMode = !student?.matricula;
    const matricula = student?.matricula;
  
    if (isFileMode && !this.file) {
      alert('Nenhum arquivo foi fornecido para cadastro.');
      return;
    }
  
    if (!isFileMode && !matricula) {
      alert('Matrícula é obrigatória.');
      return;
    }
  
    if (mode === 'ADD') {
      if (!isFileMode) {
        // Verificação para cadastro com matrícula e nome
        const existe = await this.verificaMatricula(matricula);
        if (existe) {
          alert('Aluno com esta matrícula já existe no sistema.');
          return;
        }
  
        const data = { turma: matricula + ', ' + student.nome };
        this.studentService.post(data).subscribe(() => {
          alert('Cadastrado com sucesso');
          this.dialogRef.close(true);
        });
      } else {
        // Cadastro usando arquivo (file)
        const data = { turma: this.file };
        this.studentService.post(data).subscribe(() => {
          alert('Cadastrado com sucesso via arquivo.');
          this.dialogRef.close(true);
        });
      }
    } else {
      // Atualiza o registro existente
      this.studentService
        .put(this.data.matricula, { ...this.student, ...student })
        .subscribe(() => {
          alert('Registro atualizado');
          this.dialogRef.close(true);
        });
    }
  }
  

/**
 * Verifica se a matrícula existe no sistema.
 * @param matricula Matrícula do estudante.
 * @returns Promise<boolean> indicando se a matrícula existe.
 */
async verificaMatricula(matricula: string): Promise<boolean> {
  try {
    const response = await firstValueFrom(this.studentService.get(matricula));
    return !!response; 
  } catch (error) {
    console.error('Erro ao verificar matrícula:', error);
    return false;
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
