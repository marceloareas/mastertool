import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClassService } from '../../../../services/class/class.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalClassComponent } from '../modal-class/modal-class.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-single-class',
  standalone: true,
  imports: [
    MatIcon,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
  ],
  templateUrl: './single-class.component.html',
  styleUrl: './single-class.component.scss',
})
export class SingleClassComponent {
  @Input() class!: any;
  @Output() closeClassEvent: EventEmitter<any> = new EventEmitter();
  @Output() closeModalEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['nome', 'editar'];
  dataSource!: MatTableDataSource<MatPaginator>;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.getClass();
  }

  /**
   * Carrega os alunos da turma no `dataSource` da tabela e associa o paginador.
   */
  getClass() {
    this.dataSource = new MatTableDataSource(this.class.alunos);
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Emite o evento para fechar a visualização da turma.
   */
  closeClass() {
    this.closeClassEvent.emit();
  }

  /**
   * Abre o modal para adicionar ou editar uma turma.
   * @param data Dados da turma a serem editados (opcional).
   * @param mode Modo de operação, pode ser 'ADD' ou 'EDIT'. O padrão é 'ADD'.
   */
  openModal(singleClass?: any, mode = 'ADD') {
    this.dialog
      .open(ModalClassComponent, {
        data: { singleClass, mode },
        width: '600px',
      })
      .afterClosed()
      .subscribe(() => {
        this.closeModal();
      });
  }

  /**
   * Emite o evento para fechar o modal.
   */
  closeModal() {
    this.closeModalEvent.emit();
  }
}
