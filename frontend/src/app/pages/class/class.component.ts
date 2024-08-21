import { Component, inject } from '@angular/core';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalClassComponent } from './components/modal-class/modal-class.component';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SingleClassComponent } from './components/single-class/single-class.component';
import { ClassService } from '../../services/class/class.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

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
    SingleClassComponent,
    CommonModule,
    MatMenuModule,
  ],
  templateUrl: './class.component.html',
  styleUrl: './class.component.scss',
})
export class ClassComponent {
  private classService = inject(ClassService);
  classes!: any;
  isOpen = false;
  dataClass!: any;

  constructor(public dialog: MatDialog) {
    this.getClass();
  }

  getClass() {
    this.classService.get().subscribe((data) => {
      this.classes = data;
    });
  }

  openModal() {
    this.dialog
      .open(ModalClassComponent, {
        width: '600px',
      })
      .afterClosed()
      .subscribe(() => {
        this.getClass();
      });
  }

  openClass(turma = '') {
    this.isOpen = !this.isOpen;
    this.dataClass = turma;
  }

  teste(name: string) {
    const arrayName = name.split(' ');
    if (arrayName.length === 1) {
      return (
        arrayName[0].charAt(0).toUpperCase() +
        arrayName[0].charAt(1).toUpperCase()
      );
    } else {
      return (
        arrayName[0].charAt(0).toUpperCase() +
        arrayName[1].charAt(0).toUpperCase()
      );
    }
  }

  delete(id: string) {
    this.classService.delete(id).subscribe(() => {
      alert('Turma excluída');
      this.getClass();
    });
  }
}
