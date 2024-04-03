import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { ClassService } from '../../../../services/class/class.service';
import { DialogRef } from '@angular/cdk/dialog';

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
  ],
  templateUrl: './modal-student.component.html',
  styleUrl: './modal-student.component.scss',
})
export class ModalStudentComponent {
  private classService = inject(ClassService);
  private dialogRef = inject(DialogRef);
  files!: any;

  onFileChange(event: any) {
    this.files = event.target.files[0];
    }

    upload() {
      this.classService.post(this.files).subscribe((response: any) => {
        console.log('Arquivo enviado com sucesso!', response);
      });
    }

    closeModal(){
      this.dialogRef.close();
    }
  }

