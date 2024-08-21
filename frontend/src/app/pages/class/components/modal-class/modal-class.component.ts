import { FormClassComponent } from './../form-class/form-class.component';
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
  styleUrl: './modal-class.component.scss',
})
export class ModalClassComponent {
  private dialogRef = inject(DialogRef);
  private classService = inject(ClassService);

  @ViewChild(FormClassComponent) formClassComponent!: FormClassComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: any; mode: string }
  ) {
    console.log(this.data);
  }

  save(event: any) {
    if (this.data.mode == 'ADD') {
      this.classService.post(event).subscribe(() => {
        this.dialogRef.close(true);
        alert('Cadastrado com sucesso');
      });
    } else {
      console.log({ ...this.data.data, ...event });
      this.classService
        .put(this.data.data.id, { ...this.data, ...event })
        .subscribe(() => {
          alert('Registro atualizado');
          this.dialogRef.close(true);
        });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
