import { ModalStudentComponent } from './../../../student/components/modal-student/modal-student.component';
import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalClassComponent } from '../modal-class/modal-class.component';
import { MatMenuModule } from '@angular/material/menu';
import { StudentService } from '../../../../services/student/student.service';
import { StudentClassModalComponent } from '../student-class-modal/student-class-modal.component';
import { ClassService } from '../../../../services/class/class.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-class',
  standalone: true,
  imports: [
    MatIcon,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './single-class.component.html',
  styleUrl: './single-class.component.scss',
})
export class SingleClassComponent implements OnInit {
  private classService = inject(ClassService);

  @Output() closeClassEvent: EventEmitter<any> = new EventEmitter();
  @Output() closeModalEvent: EventEmitter<any> = new EventEmitter();
  @Input() class!: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['nome', 'editar']; // Inicialmente apenas 'nome' e 'editar'
  dataSource!: MatTableDataSource<any>;
  mode: string = 'VIEW';
  notaColumns: string[] = []; // Colunas dinâmicas para notas

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.refreshTable();
    this.initializeColumns();
  }

  initializeColumns() {
    if (this.class && this.class.alunos && this.class.alunos?.length > 0) {
      const numNotas = this.class.alunos[0]?.notas?.length;
      this.notaColumns = Array.from(
        { length: numNotas },
        (_, i) => `nota ${i + 1}`
      );
      this.displayedColumns = ['nome', ...this.notaColumns, 'media', 'editar'];
    }
  }

  addNewColumn() {
    const newColumn = `nota ${this.notaColumns.length + 1}`;
    this.notaColumns.push(newColumn);

    // Encontrar o índice da coluna 'media'
    const mediaIndex = this.displayedColumns.indexOf('media');
    this.displayedColumns.splice(mediaIndex, 0, newColumn); // Adiciona antes da coluna 'editar'
    this.class.alunos.forEach((aluno: { notas: number[] }) =>
      aluno.notas.push(0)
    );

    this.refreshTable();
  }

  removeColumn(i: any) {
    this.notaColumns.splice(i, 1);
    // Atualizar o array displayedColumns removendo o identificador correspondente
    this.displayedColumns = this.displayedColumns.filter(
      (col) => col !== `nota${i + 1}`
    );
    // Remover a nota correspondente de cada item no dataSource
    this.dataSource.data.forEach((element: any) => {
      element.notas.splice(i, 1);
    });
    // Atualizar a tabela para refletir as mudanças
    this.dataSource._updateChangeSubscription();
    this.classService
      .postNota(this.class.id, this.dataSource.data)
      .subscribe(() => {
        alert('Coluna removida');
        this.getClass();
      });
  }

  notaColIndex(notaCol: string): number {
    const index = parseInt(notaCol.replace('nota', ''), 10) - 1;
    return index;
  }

  refreshTable() {
    this.dataSource = new MatTableDataSource(this.class.alunos);
    this.dataSource.paginator = this.paginator;
  }

  delete(matricula: any) {
    const data = { removerMatricula: matricula };
    this.classService.put(this.class.id, data).subscribe(() => {
      alert('Registro deletado');
      this.getClass();
      this.refreshTable();
    });
  }

  getClass() {
    this.classService.get().subscribe((data) => {
      this.class = data;
    });
  }

  closeClass() {
    this.closeClassEvent.emit();
  }

  openModal(singleClass?: any, mode = 'ADD') {
    this.dialog
      .open(ModalClassComponent, {
        data: { singleClass, mode },
        width: '600px',
      })
      .afterClosed()
      .subscribe(() => {
        this.closeModal();
        this.getClass();
      });
  }

  openModalStudent() {
    this.dialog
      .open(StudentClassModalComponent, {
        data: { class: this.class.id },
      })
      .afterClosed()
      .subscribe((result) => {
        this.closeModal();
        this.getClass();
      });
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  save() {
    console.log(this.dataSource.data);
    this.mode = 'VIEW';
    this.classService
      .postNota(this.class.id, this.dataSource.data)
      .subscribe(() => {
        alert('Notas atualizadas com sucesso!');
      });
  }

  teste() {
    this.mode = 'EDIT';
  }

  media(element: any) {
    const arraySemNulls = element.notas.filter(
      (elemento: null) => elemento !== null
    );
    const soma = arraySemNulls.reduce(
      (acumulador: any, elemento: any) => acumulador + elemento,
      0
    );
    const media = soma / arraySemNulls.length;

    return media.toFixed(1);
  }
}

