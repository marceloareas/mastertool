import { Component, inject } from '@angular/core';
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
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from '../../services/student/student.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [
    ModalClassComponent,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatIcon,
    MatButtonModule,
    SingleClassComponent,
    CommonModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  templateUrl: './class.component.html',
  styleUrl: './class.component.scss',
})
export class ClassComponent {
  private classService = inject(ClassService);
  private snackbar = inject(MatSnackBar);

  classIsOpen = false;
  classes!: any;
  singleClass!: any;

  constructor(public dialog: MatDialog) {
    this.getClass();
  }

  /**
   * Obtém a lista de turmas do serviço `ClassService` e armazena em `classes`.
   */
  getClass() {
    this.classService.get().subscribe((data) => {
      this.classes = data;
    });
  }

  /**
   * Abre o modal para adicionar ou editar uma turma.
   * @param data Dados da turma a serem editados (opcional).
   * @param mode Modo de operação, pode ser 'ADD' ou 'EDIT'. O padrão é 'ADD'.
   */
  openModal(data?: any, mode = 'ADD') {
    this.dialog
      .open(ModalClassComponent, {
        data: { data, mode },
        width: '600px',
      })
      .afterClosed()
      .subscribe(() => {
        this.getClass();
      });
  }

  /**
   * Alterna a visibilidade dos detalhes de uma turma específica.
   * @param turma Nome ou identificador da turma (opcional).
   */
  openClass(turma = '') {
    this.classIsOpen = !this.classIsOpen;
    this.singleClass = turma;
  }

  /**
   * Gera um acrônimo a partir do nome da turma.
   * @param name Nome da turma.
   * @returns Acrônimo gerado a partir do nome da turma.
   */
  generateInitials(name: string) {
    const arrayName = name.split(' ');
    if (arrayName.length === 1) {
      return arrayName[0].slice(0, 2).toUpperCase(); // Retorna as duas primeiras letras do único nome
    }
    return (
      arrayName[0].charAt(0).toUpperCase() +
      arrayName[1].charAt(0).toUpperCase()
    );
  }

  /**
   * Exclui uma turma com base no ID fornecido.
   * @param id Identificador da turma a ser excluída.
   */
  delete(id: string) {
    this.classService.delete(id).subscribe(() => {
      this.snackbar.open('Turma excluída com sucesso!', 'Fechar', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });
      this.getClass();
    });
  }  
}
