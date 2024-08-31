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
  styleUrls: ['./single-class.component.scss'],
})
export class SingleClassComponent implements OnInit {
  private classService = inject(ClassService);

  @Output() closeClassEvent: EventEmitter<any> = new EventEmitter();
  @Output() closeModalEvent: EventEmitter<any> = new EventEmitter();
  @Input() class!: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['nome', 'editar'];
  notaColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;

  mode: string = 'VIEW';

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.initializeColumns();
    this.refreshTable();
  }

  getClass() {
    this.classService.get(this.class.id).subscribe((data) => {
      this.class = data;
      console.log(this.class)
      this.refreshTable();
    });
  }

  refreshTable() {
    this.class.alunos.forEach((aluno: { notas: never[]; }) => {
      aluno.notas = aluno.notas || [];
    });
    this.dataSource = new MatTableDataSource(this.class.alunos);
    this.dataSource.paginator = this.paginator;
  }

  initializeColumns() {
    if (this.class && this.class.alunos && this.class.alunos.length > 0) {
      const numNotas = this.class.alunos[0]?.notas?.length || 0;
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
    const mediaIndex = this.displayedColumns.indexOf('media');
    this.displayedColumns.splice(mediaIndex, 0, newColumn);
    this.class.alunos.forEach((aluno: { notas: number[]; }) => aluno.notas.push(0));
    this.refreshTable();
  }

  removeColumn(index: number) {
    console.log('Removendo coluna de índice:', index);

    // Remove a coluna da lista de colunas exibidas
    this.notaColumns.splice(index, 1);
    console.log('Nota Columns após remoção:', this.notaColumns);

    this.displayedColumns = this.displayedColumns.filter(col => !col.startsWith('nota') || this.notaColumns.includes(col));
    console.log('Displayed Columns após remoção:', this.displayedColumns);

    // Remove a nota correspondente de cada aluno
    this.dataSource.data.forEach((element: any) => {
      if (element.notas && index < element.notas.length) {
        element.notas.splice(index, 1);
      }
    });
    console.log('DataSource após remoção:', this.dataSource.data);

    // Atualiza a tabela com os dados modificados
    this.dataSource._updateChangeSubscription();

    // Envia os dados atualizados para o serviço
    this.classService.postNota(this.class.id, this.dataSource.data).subscribe(() => {
      alert('Coluna removida com sucesso!');
      this.closeModal();
      this.getClass(); // Atualiza a classe com os dados mais recentes
    });
  }

  getNota(element: any, index: number): number {
    return (element.notas && element.notas[index] !== undefined) ? element.notas[index] : 0;
  }

  setNota(element: any, index: number, value: string) {
    if (!element.notas) {
      element.notas = [];
    }
    element.notas[index] = +value;
  }

  notaColIndex(notaCol: string): number {
    const index = parseInt(notaCol.replace('nota ', ''), 10) - 1;
    return index;
  }

  handleNotaChange(event: Event, element: any, index: number) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const value = Number(inputElement.value); // Converta o valor para número se necessário
      element.notas[index] = value;
    }
  }

  delete(matricula: any) {
    const data = { removerMatricula: matricula };
    this.classService.put(this.class.id, data).subscribe(() => {
      alert('Registro deletado');
      this.getClass();
      this.closeModal();
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
        this.getClass();
        this.closeModal();
      });
  }

  openModalStudent() {
    this.dialog
      .open(StudentClassModalComponent, {
        data: { class: this.class.id },
      })
      .afterClosed()
      .subscribe(() => {
        this.getClass();
        this.closeModal();
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
    const arraySemNulls = element.notas?.filter((elemento: null) => elemento !== null);
    const soma = arraySemNulls?.reduce((acumulador: any, elemento: any) => acumulador + elemento, 0) || 0;
    const media = arraySemNulls?.length ? soma / arraySemNulls.length : 0;

    return media.toFixed(1);
  }
}
