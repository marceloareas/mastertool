import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { ClassService } from '../../../../services/class/class.service';
import { DialogRef } from '@angular/cdk/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EventEmitter } from 'stream';

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
    ReactiveFormsModule
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
      const data = new FormData();
      data.append('file', this.files);

      this.classService.post(data).subscribe((response: any) => {
        this.dialogRef.close(true)
      });
    }

    closeModal(){
      this.dialogRef.close();
    }
  }

