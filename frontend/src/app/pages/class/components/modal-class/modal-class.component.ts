import { FormClassComponent } from './../form-class/form-class.component';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, ViewChild, inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

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
    FormClassComponent
  ],
  templateUrl: './modal-class.component.html',
  styleUrl: './modal-class.component.scss',
})
export class ModalClassComponent {
  private dialogRef = inject(DialogRef);
  @ViewChild(FormClassComponent) formClassComponent! : FormClassComponent;

  save(event: Event){
    console.log(event);
  }

  closeModal(){
    this.dialogRef.close()
  }
}
