import { Component, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { StudentClassFormComponent } from '../student-class-form/student-class-form.component';
import { ClassService } from '../../../../services/class/class.service';

@Component({
  selector: 'app-student-class-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    StudentClassFormComponent,
  ],
  templateUrl: './student-class-modal.component.html',
  styleUrl: './student-class-modal.component.scss',
})
export class StudentClassModalComponent{
  private dialogRef = inject(DialogRef);
  private classService= inject(ClassService);

  @ViewChild(StudentClassFormComponent)
  studentClassForm!: StudentClassFormComponent;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { class: any }) {}

  save(singleClass: any) {
    this.classService.put(this.data.class.id,singleClass).subscribe(() => {
      alert('Cadastrado com sucesso');
      this.dialogRef.close(true);
    });
  }

  /**
   * Fecha o modal sem salvar as alterações.
   */
  closeModal() {
    this.dialogRef.close();
  }
}
