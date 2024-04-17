import { Component, inject } from '@angular/core';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalClassComponent } from './components/modal-class/modal-class.component';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SingleClassComponent } from './components/single-class/single-class.component';
import { Class } from './class.interface';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [
    TopBarComponent,
    ModalClassComponent,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatIcon,
    MatButtonModule,
    SingleClassComponent
  ],
  templateUrl: './class.component.html',
  styleUrl: './class.component.scss',
})
export class ClassComponent {
  constructor(public dialog: MatDialog) {}
  classes!: any;
  isOpen= false
  dataClass!: any;

  openModal() {
    this.dialog.open(ModalClassComponent, {
      width: '600px',
    });
  }

  openClass(turma = ''){
    this.isOpen = !this.isOpen;
    this.dataClass = turma
  }
}
