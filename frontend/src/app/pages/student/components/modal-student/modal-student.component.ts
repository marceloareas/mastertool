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
  files!: any;
  student: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string; mode: string }
  ) {}

  ngOnInit() {
    if (this.data.id) {
      this.getData();
    }
  }

  save(event?: any, mode = this.data.mode) {
    if (mode == 'ADD') {
      const data = event.matricula
        ? { turma: event.matricula + ', ' + event.nome }
        : { turma: this.files };
        console.log(event)

      this.studentService.post(data).subscribe((response: any) => {
        alert('Cadastrado com sucesso');
        this.dialogRef.close(true);
      });
    } else {
      console.log({ ...this.student, ...event });
      this.studentService
        .put(this.data.id, { ...this.student, ...event })
        .subscribe(() => {
          alert('Registro atualizado');
          this.dialogRef.close(true);
        });
    }
  }

  getData() {
    this.studentService.get(this.data.id).subscribe((student) => {
      this.student = student;
      console.log(this.student);
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.files = reader.result as string; // Converte o conteúdo para string e armazena
      };
      reader.readAsText(file); // Lê o arquivo como texto
    }
  }
  closeModal() {
    this.dialogRef.close();
  }
}
