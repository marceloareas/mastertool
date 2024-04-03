import { FormProjectComponent } from './../form-project/form-project.component';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, ViewChild, inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [
    FormProjectComponent,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogTitle,
  ],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss',
})
export class ProjectModalComponent {
  private dialogRef = inject(DialogRef);

  @ViewChild(FormProjectComponent) formProjectComponent!: FormProjectComponent;

  save(event: Event){
    console.log(event)
  }

  closeModal(){
    this.dialogRef.close();
  }
}
