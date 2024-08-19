import { Component, Inject, inject, ViewChild } from '@angular/core';
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
export class ModalStudentComponent {
  private studentService = inject(StudentService);
  private dialogRef = inject(DialogRef);
  files!: any;
  student: any;

  @ViewChild(FormStudentComponent) formStudentComponent!: FormStudentComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string; mode: string }
  ) {}

  ngOnInit() {
    if (this.data.id) {
      this.getData();
    }
  }

  save(event: Event) {
    // this.studentService.put(event).subscribe(() => {
    //   this.dialogRef.close(true);
    //   alert('Cadastrado com sucesso');
    // });
  }

  getData() {
    this.studentService.get(this.data.id).subscribe((student) => {
      this.student = student;
      console.log(student)
    });
  }

  onFileChange(event: any) {
    this.files = event.target.files[0];
  }

  upload() {
    const data = new FormData();
    data.append('file', this.files);

    this.studentService.post(data).subscribe((response: any) => {
      alert('Cadastrado com sucesso');
      this.dialogRef.close(true);
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
