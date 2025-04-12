import { Component, inject, Inject, ViewChild } from '@angular/core';
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
import { StudentProjectFormComponent } from '../student-project-form/student-project-form.component';
import { ProjectService } from '../../../../services/project/project.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-student-project-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    StudentProjectFormComponent,
    MatSnackBarModule,
  ],
  templateUrl: './student-project-modal.component.html',
  styleUrls: ['./student-project-modal.component.scss'],
})
export class StudentProjectModalComponent {
  private dialogRef = inject(DialogRef);
  private projectService = inject(ProjectService);
  private snackBar = inject(MatSnackBar);

  @ViewChild(StudentProjectFormComponent)
  studentProjectForm!: StudentProjectFormComponent;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { project: any }) {}

  save(singleProject: any) {
    this.projectService.put(this.data.project.id, singleProject).subscribe(() => {
      this.snackBar.open('Cadastrado com sucesso', 'Fechar', {
        duration: 5000,
      });
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
