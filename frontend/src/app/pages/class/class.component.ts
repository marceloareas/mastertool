import { Component, inject } from '@angular/core';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalClassComponent } from './components/modal-class/modal-class.component';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [TopBarComponent, ModalClassComponent, ReactiveFormsModule, MatDialogModule],
  templateUrl: './class.component.html',
  styleUrl: './class.component.scss',
})
export class ClassComponent {
  constructor(public dialog: MatDialog) {}

  openModal() {
    this.dialog.open(ModalClassComponent,{
      width:'600px',
    });
  }
}
